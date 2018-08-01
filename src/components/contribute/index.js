import React from 'react'
import {
  getCurrentAccount,
  checkNetWorkByID,
  checkTxMined,
  sendTXToContract,
  calculateGasLimit,
  attachToSpecificCrowdsaleContract,
  attachToSpecificCrowdsaleContractByAddr,
  methodToExec,
  getCrowdsaleStrategy,
  getCrowdsaleStrategyByName,
  checkWeb3,
  getExecBuyCallData
} from '../../utils/blockchainHelpers'
import {
  getTokenData,
  getCrowdsaleData,
  getCrowdsaleTargetDates,
  initializeAccumulativeData,
  isFinalized,
  isEnded,
  isSoldOut,
  isTierSoldOut,
  getUserMaxLimits,
  getUserMinLimits,
  getUserMaxContribution,
  isCrowdSaleFull,
  getUserBalanceByStore,
  getUserBalance,
  getCurrentTierInfoCustom
} from '../crowdsale/utils'
import {
  countDecimalPlaces,
  getExecID,
  getAddr,
  getNetworkID,
  toast,
  toBigNumber,
  truncateStringInTheMiddle
} from '../../utils/utils'
import { getCrowdsaleAssets } from '../../stores/utils'
import {
  contributionDisabledAlertInTime,
  noGasPriceAvailable,
  MetaMaskIsLockedAlert,
  successfulContributionAlert,
  noMoreTokensAvailable,
  notAllowedContributor,
  invalidCrowdsaleExecIDAlert,
  invalidNetworkIDAlert
} from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { CrowdsaleConfig } from '../Common/config'
import { CONTRIBUTION_OPTIONS, TOAST } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import QRPaymentProcess from './QRPaymentProcess'
import CountdownTimer from './CountdownTimer'
import classNames from 'classnames'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'
import { Form } from 'react-final-form'
import { ContributeForm } from './ContributeForm'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'
import logdown from 'logdown'
import { DEPLOYMENT_VALUES } from '../../utils/constants'
let promiseRetry = require('promise-retry')

const logger = logdown('TW:contribute')

@inject(
  'contractStore',
  'crowdsalePageStore',
  'web3Store',
  'tierStore',
  'tokenStore',
  'generalStore',
  'contributeStore',
  'gasPriceStore',
  'crowdsaleStore'
)
@observer
export class Contribute extends React.Component {
  constructor(props) {
    super(props)
    window.scrollTo(0, 0)

    this.state = {
      loading: true,
      pristineTokenInput: true,
      web3Available: false,
      contributeThrough: CONTRIBUTION_OPTIONS.QR,
      toNextTick: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      nextTick: {},
      msToNextTick: 0,
      displaySeconds: false,
      isFinalized: false,
      isEnded: false,
      isSoldOut: false,
      isTierSoldOut: false,
      clockAltMessage: ''
    }
  }

  componentDidMount() {
    this.preparePage()
  }

  preparePage = async () => {
    const { gasPriceStore, generalStore, crowdsaleStore, contractStore } = this.props
    const crowdsaleExecID = CrowdsaleConfig.crowdsaleContractURL || getExecID()
    contractStore.setContractProperty('crowdsale', 'execID', crowdsaleExecID)
    const crowdsaleAddr = CrowdsaleConfig.crowdsaleContractURL || getAddr()
    try {
      await this.validateEnvironment(crowdsaleExecID, crowdsaleAddr)
      await getCrowdsaleAssets(generalStore.networkID)

      let strategy
      if (crowdsaleExecID) {
        strategy = await getCrowdsaleStrategy(crowdsaleExecID)
      } else {
        //note: we can use contractStore.MintedCappedProxy.abi for both strategies, because app_exec_id property exists in both strategies
        const proxyContract = await attachToSpecificCrowdsaleContractByAddr(
          crowdsaleAddr,
          contractStore.MintedCappedProxy.abi
        )
        const appName = await proxyContract.methods.app_name().call()
        strategy = await getCrowdsaleStrategyByName(appName)
      }
      crowdsaleStore.setProperty('strategy', strategy)
      contractStore.setContractProperty(crowdsaleStore.proxyName, 'addr', crowdsaleAddr)

      await this.extractContractsData()

      if (this.state.isTierSoldOut) {
        if (this.state.isSoldOut) {
          this.resetTimers()
        } else {
          this.setState({ clockAltMessage: 'Tier sold out' })
        }
      }

      await gasPriceStore
        .updateValues()
        .then(() => generalStore.setGasPrice(gasPriceStore.slow.price), () => noGasPriceAvailable())

      this.setState({ loading: false })
    } catch (err) {
      logger.error(err)
    }
  }

  validateEnvironment = async (crowdsaleExecID, crowdsaleAddr) => {
    const { web3Store, generalStore } = this.props

    await checkWeb3()

    if (!web3Store.web3) {
      return Promise.reject('no web3 available')
    }

    this.setState({
      web3Available: true,
      contributeThrough: CONTRIBUTION_OPTIONS.METAMASK
    })

    const networkID = CrowdsaleConfig.networkID || getNetworkID()
    generalStore.setProperty('networkID', networkID)

    const networkInfo = await checkNetWorkByID(networkID)

    if (networkInfo === null || !networkID) {
      invalidNetworkIDAlert()
      return Promise.reject('invalid networkID')
    } else if (String(networkInfo) !== networkID) {
      return Promise.reject('invalid networkID')
    }

    //todo: change to 2 alerts
    if (!crowdsaleExecID && !crowdsaleAddr) {
      invalidCrowdsaleExecIDAlert()
      return Promise.reject('invalid exec-id or addr')
    }
  }

  componentWillUnmount() {
    this.clearTimeInterval()
  }

  extractContractsData = async () => {
    const { contractStore, web3Store, crowdsaleStore } = this.props
    const { web3 } = web3Store
    const account = await getCurrentAccount()

    contractStore.setContractProperty('crowdsale', 'account', account)

    this.setState({
      curAddr: account,
      web3
    })

    let target

    logger.log(`Crowdsale Exec Id`, contractStore.crowdsale.execID)
    if (contractStore.crowdsale.execID) {
      const targetPrefix = 'idx'
      const targetSuffix = crowdsaleStore.contractTargetSuffix
      target = `${targetPrefix}${targetSuffix}`
    } else {
      target = crowdsaleStore.proxyName
    }
    const crowdsaleExecID = contractStore.crowdsale && contractStore.crowdsale.execID
    try {
      const initCrowdsaleContract = await attachToSpecificCrowdsaleContract(target)
      await initializeAccumulativeData()
      await getTokenData(initCrowdsaleContract, crowdsaleExecID, account)
      await getCrowdsaleData()
      await getCrowdsaleTargetDates(initCrowdsaleContract, crowdsaleExecID)
      await this.checkIsFinalized(initCrowdsaleContract, crowdsaleExecID)
      await this.checkIsEnded(initCrowdsaleContract, crowdsaleExecID)
      await this.checkIsSoldOut(initCrowdsaleContract, crowdsaleExecID)
      await this.checkIsTierSoldOut(initCrowdsaleContract, crowdsaleExecID)
      await this.calculateContribution()
      this.setTimers()
    } catch (err) {
      logger.error(err)
    }
  }

  checkIsFinalized = async (initCrowdsaleContract, crowdsaleExecID) => {
    this.setState({ isFinalized: await isFinalized(initCrowdsaleContract, crowdsaleExecID) })
  }

  checkIsEnded = async (initCrowdsaleContract, crowdsaleExecID) => {
    this.setState({ isEnded: await isEnded(initCrowdsaleContract, crowdsaleExecID) })
  }

  checkIsSoldOut = async (initCrowdsaleContract, crowdsaleExecID) => {
    this.setState({ isSoldOut: await isSoldOut(initCrowdsaleContract, crowdsaleExecID) })
  }

  checkIsTierSoldOut = async (initCrowdsaleContract, crowdsaleExecID) => {
    this.setState({ isTierSoldOut: await isTierSoldOut(initCrowdsaleContract, crowdsaleExecID) })
  }

  setTimers = () => {
    const { crowdsalePageStore } = this.props
    let nextTick = 0
    let millisecondsToNextTick = 0
    let timeInterval

    if (crowdsalePageStore.ticks.length) {
      nextTick = crowdsalePageStore.extractNextTick()
      millisecondsToNextTick = nextTick.time - Date.now()
      const FIVE_MINUTES_BEFORE_TICK = moment(millisecondsToNextTick)
        .subtract(5, 'minutes')
        .valueOf()
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

  contributeToTokens = () => {
    const { contributeStore, crowdsalePageStore, web3Store } = this.props
    const { startDate } = crowdsalePageStore
    const { web3 } = web3Store

    if (!this.isValidToken(contributeStore.tokensToContribute)) {
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

    this.contributeToTokensForWhitelistedCrowdsale()
  }

  contributeToTokensForWhitelistedCrowdsale = () => {
    const { crowdsalePageStore } = this.props

    if (crowdsalePageStore.startDate > new Date().getTime()) {
      this.setState({ loading: false })
      return contributionDisabledAlertInTime(crowdsalePageStore.startDate)
    }

    this.contributeToTokensForWhitelistedCrowdsaleInternal()
  }

  getBuyParams = (weiToSend, methodInterface) => {
    const { web3Store } = this.props
    const { web3 } = web3Store
    let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [])
    return encodedParameters
  }

  calculateWeiToSend = async () => {
    const { crowdsalePageStore, crowdsaleStore, contractStore, contributeStore } = this.props
    const { execID } = this.props.contractStore.crowdsale
    const { addr } = toJS(contractStore.abstractStorage)

    let target
    if (contractStore.crowdsale.execID) {
      const targetPrefix = 'idx'
      const targetSuffix = crowdsaleStore.contractTargetSuffix
      target = `${targetPrefix}${targetSuffix}`
    } else {
      target = crowdsaleStore.proxyName
    }

    let params = []
    if (execID) {
      params.push(addr, execID)
    }

    const initCrowdsaleContract = await attachToSpecificCrowdsaleContract(target)
    const { methods } = initCrowdsaleContract

    if (crowdsaleStore.isMintedCappedCrowdsale) {
      const currentTierInfo = await getCurrentTierInfoCustom(initCrowdsaleContract, execID)
      const tier_price = currentTierInfo.tier_price || currentTierInfo[4]
      logger.log('tier_price:', tier_price)
      crowdsalePageStore.setProperty('rate', tier_price) //should be one token in wei
    } else if (crowdsaleStore.isDutchAuction) {
      const crowdsaleStatus = await methods.getCrowdsaleStatus(...params).call()
      const current_rate = crowdsaleStatus.current_rate || crowdsaleStatus[2]
      logger.log('current_rate:', current_rate)
      crowdsalePageStore.setProperty('rate', current_rate) //should be one token in wei
    }

    // rate is from contract. It is already in wei. How much 1 token costs in wei.
    const rate = toBigNumber(crowdsalePageStore.rate)
    logger.log('rate:', rate.toFixed())

    const tokensToContribute = toBigNumber(contributeStore.tokensToContribute).times(rate)
    logger.log('tokensToContribute:', tokensToContribute.toFixed())

    const userLimits = await getUserMaxLimits()

    logger.log('userLimits:', userLimits.toString())

    return tokensToContribute.gt(userLimits) ? userLimits : tokensToContribute
  }

  calculateContribution = async () => {
    const { crowdsaleStore, contractStore } = this.props
    const { execID, account } = contractStore.crowdsale
    const { addr } = toJS(contractStore.abstractStorage)

    let target
    if (contractStore.crowdsale.execID) {
      const targetPrefix = 'idx'
      const targetSuffix = crowdsaleStore.contractTargetSuffix
      target = `${targetPrefix}${targetSuffix}`
    } else {
      target = crowdsaleStore.proxyName
    }

    const { methods } = await attachToSpecificCrowdsaleContract(target)
    const userMinLimits = await getUserMinLimits()
    const userMaxLimits = await getUserMaxContribution()
    const checkIfCrowdSaleIsfull = await isCrowdSaleFull(addr, execID, methods, account)

    if (checkIfCrowdSaleIsfull) {
      this.setState({
        minimumContribution: -1,
        maximumContribution: -1
      })
    } else {
      this.setState({
        minimumContribution: userMinLimits.toFixed(),
        maximumContribution: userMaxLimits.toFixed()
      })
    }
  }

  contributeToTokensForWhitelistedCrowdsaleInternal = async () => {
    if (this.state.minimumContribution < 0) {
      this.setState({ loading: false })
      return notAllowedContributor()
    }

    const { generalStore, contractStore, tokenStore, crowdsaleStore } = this.props
    const { account, execID } = contractStore.crowdsale
    const weiToSend = await this.calculateWeiToSend()
    logger.log('weiToSend:', weiToSend.toFixed())

    if (weiToSend.eq('0')) {
      this.setState({ loading: false })
      return noMoreTokensAvailable()
    }

    const opts = {
      from: account,
      value: weiToSend.integerValue(BigNumber.ROUND_CEIL),
      gasPrice: generalStore.gasPrice
    }
    logger.log(opts)

    let methodInterface = []

    let paramsToExec = [opts.value, methodInterface]
    const targetContractName = execID ? 'registryExec' : crowdsaleStore.proxyName
    const method = methodToExec(targetContractName, `buy()`, this.getBuyParams, paramsToExec)

    let estimatedGas
    try {
      estimatedGas = await method.estimateGas(opts)
    } catch (e) {
      logger.error(e)
      estimatedGas = DEPLOYMENT_VALUES.GAS_REQUIRED.BUY
    }
    logger.log('estimatedGas:', estimatedGas)

    opts.gasLimit = calculateGasLimit(estimatedGas)

    const { DECIMAL_PLACES } = weiToSend.constructor.config()
    weiToSend.constructor.config({ DECIMAL_PLACES: +tokenStore.decimals })

    weiToSend.constructor.config({ DECIMAL_PLACES })

    const userBalanceBeforeBuy = getUserBalanceByStore()
    logger.log(`User balance before buy`, userBalanceBeforeBuy)

    sendTXToContract(method.send(opts))
      .then(async () => {
        let userBalanceAfterBuy
        await promiseRetry(async retry => {
          userBalanceAfterBuy = await getUserBalance()
          if (userBalanceAfterBuy.eq(toBigNumber(userBalanceBeforeBuy))) {
            retry()
          }
        })

        if (!userBalanceAfterBuy) {
          throw new Error(`Is not a big numnber instance`)
        }

        logger.log(`User balance after buy`, userBalanceAfterBuy.toFixed())

        const tokensContributed = userBalanceAfterBuy.minus(toBigNumber(userBalanceBeforeBuy)).toFixed()
        logger.log(`Tokens to contributed`, tokensContributed)

        successfulContributionAlert(tokensContributed)
      })
      .catch(err => {
        logger.error(err)
        return toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
      })
      .then(() => this.setState({ loading: false }))
  }

  txMinedCallback(txHash, receipt) {
    const { contributeStore } = this.props

    if (receipt) {
      if (receipt.blockNumber) {
        this.setState({ loading: false })
        successfulContributionAlert(contributeStore.tokensToContribute)
      }
    } else {
      setTimeout(() => {
        checkTxMined(txHash, receipt => this.txMinedCallback(txHash, receipt))
      }, 500)
    }
  }

  updateContributeThrough = contributeThrough => {
    this.setState({ contributeThrough })
  }

  isValidToken(token) {
    return +token > 0 && countDecimalPlaces(token) <= this.props.tokenStore.decimals
  }

  render() {
    const { crowdsalePageStore, tokenStore, contractStore, crowdsaleStore } = this.props
    const { tokenAmountOf } = crowdsalePageStore
    const { crowdsale } = contractStore
    const { proxyName } = crowdsaleStore

    const {
      curAddr,
      contributeThrough,
      web3Available,
      toNextTick,
      nextTick,
      minimumContribution,
      maximumContribution
    } = this.state
    const crowdsaleExecID = crowdsale && crowdsale.execID
    const { days, hours, minutes, seconds } = toNextTick

    const { decimals, ticker, name } = tokenStore

    const tokenDecimals = !isNaN(decimals) ? decimals : 0
    const tokenTicker = ticker ? ticker.toString() : ''
    const tokenName = name ? name.toString() : ''
    const maximumSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
    const maxCapBeforeDecimals = toBigNumber(maximumSellableTokens).div(`1e${tokenDecimals}`)

    //balance
    const contributorBalance = tokenAmountOf
      ? toBigNumber(tokenAmountOf)
          .div(`1e${tokenDecimals}`)
          .toFixed()
      : '0'

    //total supply
    const totalSupply = maxCapBeforeDecimals.toFixed()

    const canContribute = !(this.state.isEnded || this.state.isFinalized || this.state.isSoldOut)
    //min contribution
    const minimumContributionDisplay =
      minimumContribution >= 0 && isFinite(minimumContribution) && canContribute
        ? `${minimumContribution} ${tokenTicker}`
        : 'You are not allowed'
    //max contribution
    const maximumContributionDisplay =
      maximumContribution >= 0 && isFinite(maximumContribution) && canContribute
        ? `${maximumContribution} ${tokenTicker}`
        : 'You are not allowed'

    const registryExecAddr =
      contractStore.registryExec && contractStore.registryExec.addr ? contractStore.registryExec.addr : ''

    const crowdsaleProxyAddr = contractStore[proxyName] && contractStore[proxyName].addr
    const QRPaymentProcessElement =
      contributeThrough === CONTRIBUTION_OPTIONS.QR && (crowdsaleExecID || crowdsaleProxyAddr) ? (
        <QRPaymentProcess
          crowdsaleProxyAddr={crowdsaleProxyAddr}
          registryExecAddr={registryExecAddr}
          txData={getExecBuyCallData(crowdsaleExecID)}
        />
      ) : null

    const rightColumnClasses = classNames('contribute-table-cell', 'contribute-table-cell_right', {
      'qr-selected': contributeThrough === CONTRIBUTION_OPTIONS.QR
    })

    const crowdsaleAddress =
      (crowdsale && crowdsale.execID) || (contractStore[proxyName] && contractStore[proxyName].addr)
    const crowdsaleAddressTruncated =
      (crowdsale && truncateStringInTheMiddle(crowdsale.execID)) ||
      (contractStore[proxyName] && contractStore[proxyName].addr)
    const crowdsaleAddressDescription = crowdsale
      ? crowdsale.execID
        ? 'Crowdsale Execution ID'
        : 'Crowdsale Proxy Address'
      : 'Crowdsale ID'
    const crowdsaleAddressTooltip = crowdsale
      ? crowdsale.execID
        ? `Crowdsale execution ID to copy: ${crowdsaleAddress}`
        : `Crowdsale proxy address to copy: ${crowdsaleAddress}`
      : `Crowdsale ID ${crowdsaleAddress}`

    return (
      <div className="contribute container">
        <div className="contribute-table">
          <div className="contribute-table-cell contribute-table-cell_left">
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
              altMessage={this.state.clockAltMessage}
            />
            <div className="hashes">
              <div className="hashes-i">
                <p className="hashes-title">{curAddr}</p>
                <p className="hashes-description">Current Account</p>
              </div>
              <div className="hashes-i">
                <p className="hashes-title">{crowdsaleAddressTruncated}</p>
                <p className="hashes-description_cp_address">
                  {crowdsaleAddressDescription}
                  <CopyToClipboard text={crowdsaleAddress}>
                    <btn data-tip={crowdsaleAddressTooltip} className="copy" />
                  </CopyToClipboard>
                </p>
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
                <p className="hashes-title">
                  {totalSupply} {tokenTicker}
                </p>
                <p className="hashes-description">Total Supply</p>
              </div>
              <div className="hashes-i">
                <p className="hashes-title">{minimumContributionDisplay}</p>
                <p className="hashes-description">Minimum Contribution</p>
              </div>
              <div className="hashes-i">
                <p className="hashes-title">{maximumContributionDisplay}</p>
                <p className="hashes-description">Maximum Contribution</p>
              </div>
            </div>
            <p className="contribute-title">Contribute page</p>
            <p className="contribute-description">
              {
                'Here you can contribute in the crowdsale campaign. At the moment, you need Metamask client to contribute into the crowdsale.'
              }
            </p>
          </div>
          <div className={rightColumnClasses}>
            <div className="balance">
              <p className="balance-title">
                {contributorBalance} {tokenTicker}
              </p>
              <p className="balance-description">Balance</p>
              <p className="description">Your balance in tokens.</p>
            </div>
            <Form
              onSubmit={this.contributeToTokens}
              component={ContributeForm}
              contributeThrough={contributeThrough}
              isFinalized={this.state.isFinalized}
              isEnded={this.state.isEnded}
              isSoldOut={this.state.isSoldOut}
              isTierSoldOut={this.state.isTierSoldOut}
              updateContributeThrough={this.updateContributeThrough}
              web3Available={web3Available}
              minimumContribution={minimumContribution}
            />
            {QRPaymentProcessElement}
          </div>
        </div>
        <ReactTooltip />
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
