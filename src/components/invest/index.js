import React from 'react'
import {
  getCurrentAccount,
  checkNetWorkByID,
  checkTxMined,
  sendTXToContract,
  calculateGasLimit,
  attachToSpecificCrowdsaleContract,
  methodToExec,
  getCrowdsaleStrategy
} from '../../utils/blockchainHelpers'
import {
  getTokenData,
  getCrowdsaleData,
  getCrowdsaleTargetDates,
  initializeAccumulativeData,
  isFinalized,
  toBigNumber
} from '../crowdsale/utils'
import { countDecimalPlaces, getQueryVariable, toast } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import {
  invalidCrowdsaleAddrAlert,
  investmentDisabledAlertInTime, noGasPriceAvailable,
  noMetaMaskAlert,
  successfulInvestmentAlert
} from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { CrowdsaleConfig } from '../Common/config'
import { INVESTMENT_OPTIONS, TOAST, CROWDSALE_STRATEGIES } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import QRPaymentProcess from './QRPaymentProcess'
import CountdownTimer from './CountdownTimer'
import classNames from 'classnames'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'
import { Form } from 'react-final-form'
import { InvestForm } from './InvestForm'
import { generateContext } from '../stepFour/utils'

@inject(
  'contractStore',
  'crowdsalePageStore',
  'web3Store',
  'tierStore',
  'tokenStore',
  'generalStore',
  'investStore',
  'gasPriceStore',
  'crowdsaleStore'
)
@observer
export class Invest extends React.Component {
  constructor(props) {
    super(props)
    window.scrollTo(0, 0)

    this.state = {
      loading: true,
      pristineTokenInput: true,
      web3Available: false,
      investThrough: INVESTMENT_OPTIONS.QR,
      crowdsaleExecID: CrowdsaleConfig.crowdsaleContractURL || getQueryVariable('exec-id'),
      toNextTick: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      nextTick: {},
      msToNextTick: 0,
      displaySeconds: false,
      isFinalized: false
    }
  }

  componentDidMount () {
    const { web3Store, gasPriceStore, generalStore, contractStore, crowdsaleStore } = this.props
    const { web3 } = web3Store

    if (!web3) {
      this.setState({ loading: false })
      return
    }

    const networkID = CrowdsaleConfig.networkID ? CrowdsaleConfig.networkID : getQueryVariable('networkID')
    checkNetWorkByID(networkID)

    this.setState({
      web3Available: true,
      investThrough: INVESTMENT_OPTIONS.METAMASK
    })

    getWhiteListWithCapCrowdsaleAssets(networkID)
      .then(_newState => {
        this.setState(_newState)
      })
      .then(() => getCrowdsaleStrategy(this.state.crowdsaleExecID))
      .then((strategy) => crowdsaleStore.setProperty('strategy', strategy))
      //.then((strategy) => crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE)) //to do
      .then(() => {
        this.extractContractsData()
        gasPriceStore.updateValues()
          .then(() => generalStore.setGasPrice(gasPriceStore.slow.price))
          .catch(() => noGasPriceAvailable())
      })
  }

  componentWillUnmount () {
    this.clearTimeInterval()
  }

  extractContractsData() {
    const { contractStore, web3Store, crowdsaleStore } = this.props
    const { web3 } = web3Store

    const crowdsaleExecID = CrowdsaleConfig.crowdsaleContractURL ? CrowdsaleConfig.crowdsaleContractURL : getQueryVariable('exec-id')

    //to do
    /*if (!web3.utils.isAddress(crowdsaleAddr)) {
      this.setState({ loading: false })
      return invalidCrowdsaleAddrAlert()
    }*/

    getCurrentAccount()
      .then(account => {
        console.log("crowdsaleExecID:", crowdsaleExecID)
        contractStore.setContractProperty('crowdsale', 'execID', crowdsaleExecID)
        contractStore.setContractProperty('crowdsale', 'account', account)

        this.setState({
          curAddr: account,
          web3
        })

        if (!contractStore.crowdsale.execID) {
          this.setState({ loading: false })
          return
        }

        const targetPrefix = "initCrowdsale"
        const targetSuffix = crowdsaleStore.contractTargetSuffix
        const target = `${targetPrefix}${targetSuffix}`

        attachToSpecificCrowdsaleContract(target)
          .then((initCrowdsaleContract) => {
            initializeAccumulativeData()
            .then(() => {
              let whenTokenData = getTokenData(initCrowdsaleContract, crowdsaleExecID, account)
              let whenCrowdsaleData = getCrowdsaleData(initCrowdsaleContract, crowdsaleExecID, account, crowdsaleStore)
              return Promise.all([whenTokenData, whenCrowdsaleData])
            })
              .then(() => getCrowdsaleTargetDates(initCrowdsaleContract, crowdsaleExecID))
              .then(() => this.checkIsFinalized(initCrowdsaleContract, crowdsaleExecID))
              .then(() => this.setTimers())
              .catch(err => {
                this.setState({ loading: false })
                console.log(err)
              })
              .then(() => this.setState({ loading: false }))
          })
          .catch(err => {
            this.setState({ loading: false })
            console.log(err)
          })
      })
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
      })
  }

  checkIsFinalized(initCrowdsaleContract, crowdsaleExecID) {
    return isFinalized(initCrowdsaleContract, crowdsaleExecID)
      .then(isFinalized => {
        this.setState({ isFinalized })
      })
  }

  setTimers = () => {
    const { crowdsalePageStore } = this.props
    let nextTick = 0
    let millisecondsToNextTick = 0
    let timeInterval

    if (crowdsalePageStore.ticks.length) {
      nextTick = crowdsalePageStore.extractNextTick()
      millisecondsToNextTick = nextTick.time - Date.now()
      const FIVE_MINUTES_BEFORE_TICK = moment(millisecondsToNextTick).subtract(5, 'minutes').valueOf()
      const ONE_DAY = 24 * 3600 * 1000

      if (FIVE_MINUTES_BEFORE_TICK < ONE_DAY) {
        setTimeout(() => {
          this.setState({ displaySeconds: true })
        }, FIVE_MINUTES_BEFORE_TICK)
      }

      timeInterval = setInterval(() => {
        const time = moment.duration(this.state.nextTick.time - Date.now())

        this.setState({
          toNextTick: {
            days: Math.floor(time.asDays()) || 0,
            hours: time.hours() || 0,
            minutes: time.minutes() || 0,
            seconds: time.seconds() || 0
          }
        })
      }, 1000)
    }


    this.setState({
      nextTick,
      msToNextTick: millisecondsToNextTick,
      displaySeconds: false,
      timeInterval
    })
  }

  resetTimers = () => {
    this.clearTimeInterval()
    this.setTimers()
  }

  clearTimeInterval = () => {
    if (this.state.timeInterval) clearInterval(this.state.timeInterval)
  }

  investToTokens = () => {
    const { investStore, crowdsalePageStore, web3Store } = this.props
    const { startDate } = crowdsalePageStore
    const { web3 } = web3Store

    if (!this.isValidToken(investStore.tokensToInvest)) {
      this.setState({ pristineTokenInput: false })
      return
    }

    this.setState({ loading: true })

    if (!startDate) {
      this.setState({ loading: false })
      return
    }

    if (web3.eth.accounts.length === 0) {
      this.setState({ loading: false })
      return noMetaMaskAlert()
    }

    this.investToTokensForWhitelistedCrowdsale()
  }

  investToTokensForWhitelistedCrowdsale() {
    const { crowdsalePageStore } = this.props

    if (crowdsalePageStore.startDate > (new Date()).getTime()) {
      this.setState({ loading: false })
      return investmentDisabledAlertInTime(crowdsalePageStore.startDate)
    }

    getCurrentAccount()
      .then(account => {
        this.investToTokensForWhitelistedCrowdsaleInternal(account)
      })
  }

  getBuyParams = (weiToSend, methodInterface) => {
    const { web3Store } = this.props
    const { web3 } = web3Store
    let context = generateContext(weiToSend);
    let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [context]);
    return encodedParameters;
    //return context;
  }

  investToTokensForWhitelistedCrowdsaleInternal = (account) => {
    const { tokenStore, crowdsalePageStore, investStore, generalStore, crowdsaleStore } = this.props

    const decimals = new BigNumber(tokenStore.decimals)
    console.log('decimals:', decimals.toFixed())

    const rate = new BigNumber(crowdsalePageStore.rate) //it is from contract. It is already in wei. How much 1 token costs in wei.
    console.log('rate:', rate.toFixed())

    const tokensToInvest = new BigNumber(investStore.tokensToInvest)
    console.log('tokensToInvest:', tokensToInvest.toFixed())

    const weiToSend = tokensToInvest.multipliedBy(rate)
    console.log('weiToSend:', weiToSend.toFixed())

    const opts = {
      from: account,
      value: weiToSend.integerValue(BigNumber.ROUND_CEIL),
      gasPrice: generalStore.gasPrice
    }
    console.log(opts)

    let methodInterface = ["bytes"];

    const targetPrefix = "crowdsaleBuyTokens"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    let paramsToExec = [weiToSend, methodInterface]
    const method = methodToExec(`buy(${methodInterface.join(',')})`, target, this.getBuyParams, paramsToExec)

    method.estimateGas(opts)
      .then(estimatedGas => {
        console.log("estimatedGas:",estimatedGas)
        opts.gasLimit = calculateGasLimit(estimatedGas)
        return sendTXToContract(method.send(opts))
      })
      .then(() => successfulInvestmentAlert(investStore.tokensToInvest))
      .catch(err => toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED }))
      .then(() => this.setState({ loading: false }))
      .catch((err) => console.log)
  }

  txMinedCallback(txHash, receipt) {
    const { investStore } = this.props

    if (receipt) {
      if (receipt.blockNumber) {
        this.setState({ loading: false })
        successfulInvestmentAlert(investStore.tokensToInvest)
      }
    } else {
      setTimeout(() => {
        checkTxMined(txHash, receipt => this.txMinedCallback(txHash, receipt))
      }, 500)
    }
  }

  updateInvestThrough = (investThrough) => {
    this.setState({ investThrough })
  }

  isValidToken(token) {
    return +token > 0 && countDecimalPlaces(token) <= this.props.tokenStore.decimals
  }

  render () {
    const { crowdsalePageStore, tokenStore, contractStore } = this.props
    const { tokenAmountOf } = crowdsalePageStore
    const { crowdsale } = contractStore

    const { curAddr, investThrough, crowdsaleExecID, web3Available, toNextTick, nextTick } = this.state
    const { days, hours, minutes, seconds } = toNextTick

    const { decimals, ticker, name } = tokenStore

    const tokenDecimals = !isNaN(decimals) ? decimals : 0
    const tokenTicker = ticker ? ticker.toString() : ''
    const tokenName = name ? name.toString() : ''
    const maximumSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
    const maxCapBeforeDecimals = toBigNumber(maximumSellableTokens).div(`1e${tokenDecimals}`)

    //balance
    const investorBalance = tokenAmountOf ? toBigNumber(tokenAmountOf).div(`1e${tokenDecimals}`).toFixed() : '0'

    //total supply
    const totalSupply = maxCapBeforeDecimals.toFixed()

    const QRPaymentProcessElement = investThrough === INVESTMENT_OPTIONS.QR ?
      <QRPaymentProcess crowdsaleExecID={crowdsaleExecID} /> :
      null

    const rightColumnClasses = classNames('invest-table-cell', 'invest-table-cell_right', {
      'qr-selected': investThrough === INVESTMENT_OPTIONS.QR
    })

    return <div className="invest container">
      <div className="invest-table">
        <div className="invest-table-cell invest-table-cell_left">
          <CountdownTimer
            displaySeconds={this.state.displaySeconds}
            nextTick={nextTick}
            tiersLength={crowdsalePageStore && crowdsalePageStore.tiers.length}
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            msToNextTick={this.state.msToNextTick}
            onComplete={this.resetTimers}
            isFinalized={this.state.isFinalized}
          />
          <div className="hashes">
            <div className="hashes-i">
              <p className="hashes-title">{curAddr}</p>
              <p className="hashes-description">Current Account</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{crowdsale && crowdsale.execID}</p>
              <p className="hashes-description">Crowdsale Execution ID</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{tokenName}</p>
              <p className="hashes-description">Name</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{tokenTicker}</p>
              <p className="hashes-description">Ticker</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{totalSupply} {tokenTicker}</p>
              <p className="hashes-description">Total Supply</p>
            </div>
          </div>
          <p className="invest-title">Invest page</p>
          <p className="invest-description">
            {'Here you can invest in the crowdsale campaign. At the moment, you need Metamask client to invest into the crowdsale.'}
          </p>
        </div>
        <div className={rightColumnClasses}>
          <div className="balance">
            <p className="balance-title">{investorBalance} {tokenTicker}</p>
            <p className="balance-description">Balance</p>
            <p className="description">
              Your balance in tokens.
            </p>
          </div>
          <Form
            onSubmit={this.investToTokens}
            component={InvestForm}
            investThrough={investThrough}
            updateInvestThrough={this.updateInvestThrough}
            web3Available={web3Available}
          />
          {QRPaymentProcessElement}
        </div>
      </div>
      <Loader show={this.state.loading}></Loader>
    </div>
  }
}
