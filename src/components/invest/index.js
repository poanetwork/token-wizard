import React from 'react'
import { attachToContract, checkNetWorkByID, checkTxMined, sendTXToContract } from '../../utils/blockchainHelpers'
import {
  findCurrentContractRecursively,
  getAccumulativeCrowdsaleData,
  getContractStoreProperty,
  getCrowdsaleData,
  getCrowdsaleTargetDates,
  getCurrentRate,
  getJoinedTiers,
  initializeAccumulativeData,
  toBigNumber
} from '../crowdsale/utils'
import { countDecimalPlaces, getQueryVariable, toast } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import {
  invalidCrowdsaleAddrAlert,
  investmentDisabledAlertInTime, noGasPriceAvailable,
  noMetaMaskAlert,
  MetaMaskIsLockedAlert,
  successfulInvestmentAlert
} from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { CrowdsaleConfig } from '../Common/config'
import { INVESTMENT_OPTIONS, TOAST } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import QRPaymentProcess from './QRPaymentProcess'
import CountdownTimer from './CountdownTimer'
import classNames from 'classnames'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'
import { Form } from 'react-final-form'
import { InvestForm } from './InvestForm'

@inject('contractStore', 'crowdsalePageStore', 'web3Store', 'tierStore', 'tokenStore', 'generalStore', 'investStore', 'gasPriceStore', 'generalStore')
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
      crowdsaleAddress: CrowdsaleConfig.crowdsaleContractURL || getQueryVariable('addr'),
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
    const { web3Store, gasPriceStore, generalStore } = this.props
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

    getWhiteListWithCapCrowdsaleAssets()
      .then(_newState => {
        this.setState(_newState)
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
    const { contractStore, web3Store } = this.props
    const { web3 } = web3Store

    const crowdsaleAddr = CrowdsaleConfig.crowdsaleContractURL ? CrowdsaleConfig.crowdsaleContractURL : getQueryVariable('addr')

    if (!web3.utils.isAddress(crowdsaleAddr)) {
      this.setState({ loading: false })
      return invalidCrowdsaleAddrAlert()
    }

    getJoinedTiers(contractStore.crowdsale.abi, crowdsaleAddr, [], joinedCrowdsales => {
      console.log('joinedCrowdsales:', joinedCrowdsales)

      const crowdsaleAddrs = typeof joinedCrowdsales === 'string' ? [joinedCrowdsales] : joinedCrowdsales
      contractStore.setContractProperty('crowdsale', 'addr', crowdsaleAddrs)

      web3.eth.getAccounts()
        .then((accounts) => {
          if (accounts.length === 0) {
            this.setState({ loading: false })
          }

          this.setState({
            curAddr: accounts[0],
            web3
          })
        })
        .then(() => {
          if (!contractStore.crowdsale.addr) {
            this.setState({ loading: false })
            return
          }

          findCurrentContractRecursively(0, null, crowdsaleContract => {
            if (!crowdsaleContract) {
              this.setState({ loading: false })
              return
            }

            initializeAccumulativeData()
              .then(() => getCrowdsaleData(crowdsaleContract))
              .then(() => getAccumulativeCrowdsaleData())
              .then(() => getCrowdsaleTargetDates())
              .then(() => this.checkIsFinalized())
              .then(() => this.setTimers())
              .catch(err => console.log(err))
              .then(() => this.setState({ loading: false }))
          })
        })
    })
  }

  checkIsFinalized() {
    return this.isFinalized()
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
      return MetaMaskIsLockedAlert()
    }

    this.investToTokensForWhitelistedCrowdsale()
  }

  investToTokensForWhitelistedCrowdsale() {
    const { crowdsalePageStore, web3Store } = this.props
    const { web3 } = web3Store

    if (crowdsalePageStore.startDate > (new Date()).getTime()) {
      this.setState({ loading: false })
      return investmentDisabledAlertInTime(crowdsalePageStore.startDate)
    }

    findCurrentContractRecursively(0, null, (crowdsaleContract, tierNum) => {
      if (!crowdsaleContract) {
        this.setState({ loading: false })
        return
      }

      getCurrentRate(crowdsaleContract)
        .then(() => web3.eth.getAccounts())
        .then((accounts) => this.investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, accounts))
        .catch(console.log)
    })
  }

  investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, accounts) {
    const { contractStore, tokenStore, crowdsalePageStore, investStore, generalStore } = this.props

    let nextTiers = []
    for (let i = tierNum + 1; i < contractStore.crowdsale.addr.length; i++) {
      nextTiers.push(contractStore.crowdsale.addr[i])
    }
    console.log('nextTiers:', nextTiers)
    console.log(nextTiers.length)

    const decimals = new BigNumber(tokenStore.decimals)
    console.log('decimals:', decimals.toFixed())

    const rate = new BigNumber(crowdsalePageStore.rate) //it is from contract. It is already in wei. How much 1 token costs in wei.
    console.log('rate:', rate.toFixed())

    const tokensToInvest = new BigNumber(investStore.tokensToInvest)
    console.log('tokensToInvest:', tokensToInvest.toFixed())

    const weiToSend = tokensToInvest.multipliedBy(rate)
    console.log('weiToSend:', weiToSend.toFixed())

    const opts = {
      from: accounts[0],
      value: weiToSend.integerValue(BigNumber.ROUND_CEIL),
      gasPrice: generalStore.gasPrice
    }
    console.log(opts)

    crowdsaleContract.methods.buy().estimateGas(opts)
      .then(estimatedGas => {
        const estimatedGasMax = 4016260
        opts.gasLimit = !estimatedGas || estimatedGas > estimatedGasMax ? estimatedGasMax : estimatedGas + 100000

        return sendTXToContract(crowdsaleContract.methods.buy().send(opts))
      })
      .then(() => successfulInvestmentAlert(investStore.tokensToInvest))
      .catch(err => toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED }))
      .then(() => this.setState({ loading: false }))
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

  isFinalized() {
    const { contractStore } = this.props
    const lastCrowdsaleAddress = contractStore.crowdsale.addr.slice(-1)[0]

    return attachToContract(contractStore.crowdsale.abi, lastCrowdsaleAddress)
      .then(crowdsaleContract => {
        return crowdsaleContract.methods.finalized().call()
      })
  }

  render () {
    const { crowdsalePageStore, tokenStore, contractStore } = this.props
    const { tokenAmountOf } = crowdsalePageStore
    const { crowdsale } = contractStore

    const { curAddr, investThrough, crowdsaleAddress, web3Available, toNextTick, nextTick } = this.state
    const { days, hours, minutes, seconds } = toNextTick

    const { decimals, ticker, name } = tokenStore

    const tokenDecimals = !isNaN(decimals) ? decimals : 0
    const tokenTicker = ticker ? ticker.toString() : ''
    const tokenName = name ? name.toString() : ''
    const maximumSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
    const maxCapBeforeDecimals = toBigNumber(maximumSellableTokens).div(`1e${tokenDecimals}`)
    const tokenAddress = getContractStoreProperty('token', 'addr')

    //balance
    const investorBalance = tokenAmountOf ? toBigNumber(tokenAmountOf).div(`1e${tokenDecimals}`).toFixed() : '0'

    //total supply
    const totalSupply = maxCapBeforeDecimals.toFixed()

    const QRPaymentProcessElement = investThrough === INVESTMENT_OPTIONS.QR ?
      <QRPaymentProcess crowdsaleAddress={crowdsaleAddress} /> :
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
              <p className="hashes-title">{tokenAddress}</p>
              <p className="hashes-description">Token Address</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{crowdsale && crowdsale.addr && crowdsale.addr[0]}</p>
              <p className="hashes-description">Crowdsale Contract Address</p>
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
            {'Here you can invest in the crowdsale campaign. At the moment, you need Metamask client to invest into the crowdsale. If you don\'t have Metamask, you can send ethers to the crowdsale address with a MethodID: 0xa6f2ae3a. Sample '}
            <a href="https://kovan.etherscan.io/tx/0x42073576a160206e61b4d9b70b436359b8d220f8b88c7c272c77023513c62c3d">transaction</a> on Kovan network.
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
