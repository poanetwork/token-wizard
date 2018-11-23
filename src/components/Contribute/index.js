import React from 'react'
import {
  attachToSpecificCrowdsaleContract,
  attachToSpecificCrowdsaleContractByAddr,
  calculateGasLimit,
  checkNetWorkByID,
  checkTxMined,
  checkWeb3,
  getCrowdsaleStrategy,
  getCrowdsaleStrategyByName,
  getCurrentAccount,
  getExecBuyCallData,
  methodToExec,
  sendTXToContract
} from '../../utils/blockchainHelpers'
import {
  getAddr,
  getCrowdsaleData,
  getCrowdsaleTargetDates,
  getCurrentTierInfoCustom,
  getExecID,
  getTokenData,
  getUserBalance,
  getUserBalanceByStore,
  getUserMaxContribution,
  getUserMaxLimits,
  getUserMinLimits,
  initializeAccumulativeData,
  isCrowdSaleFull,
  isEnded,
  isFinalized,
  isSoldOut,
  isStarted,
  isTierSoldOut
} from '../Crowdsale/utils'
import {
  countDecimalPlaces,
  getNetworkID,
  isAddressValid,
  isExecIDValid,
  toBigNumber,
  toast,
  truncateStringInTheMiddle
} from '../../utils/utils'
import { getCrowdsaleAssets } from '../../stores/utils'
import {
  MetaMaskIsLockedAlert,
  contributionDisabledAlertInTime,
  invalidCrowdsaleExecIDAlert,
  invalidCrowdsaleProxyAlert,
  invalidNetworkIDAlert,
  noGasPriceAvailable,
  noMoreTokensAvailable,
  notAllowedContributor,
  successfulContributionAlert
} from '../../utils/alerts'
import CountdownTimer from './CountdownTimer'
import QRPaymentProcess from './QRPaymentProcess'
import logdown from 'logdown'
import moment from 'moment'
import { BalanceTokens } from './BalanceTokens'
import { BigNumber } from 'bignumber.js'
import { CONTRIBUTION_OPTIONS, TOAST, NAVIGATION_STEPS } from '../../utils/constants'
import { ContributeDataColumns } from './ContributeDataColumns'
import { ContributeDataList } from './ContributeDataList'
import { ContributeDescription } from './ContributeDescription'
import { ContributeForm } from './ContributeForm'
import { CrowdsaleConfig } from '../Common/config'
import { DEPLOYMENT_VALUES } from '../../utils/constants'
import { Form } from 'react-final-form'
import { Loader } from '../Common/Loader'
import { SectionInfo } from '../Common/SectionInfo'
import { StepNavigation } from '../Common/StepNavigation'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'

const { CONTRIBUTE_PAGE } = NAVIGATION_STEPS
const logger = logdown('TW:contribute')
const TWO_SECONDS = 2000

let promiseRetry = require('promise-retry')

@inject(
  'contractStore',
  'crowdsalePageStore',
  'web3Store',
  'tierStore',
  'tokenStore',
  'generalStore',
  'contributeStore',
  'gasPriceStore',
  'crowdsaleStore',
  'tierStore'
)
@observer
export class Contribute extends React.Component {
  constructor(props) {
    super(props)

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
      crowdsaleDurationSeconds: 0,
      crowdsaleSecondsLeft: 0,
      displaySeconds: false,
      isStarted: false,
      isFinalized: false,
      isEnded: false,
      isSoldOut: false,
      isTierSoldOut: false,
      isStartedClock: false,
      clockAltMessage: ''
    }
  }

  async componentDidMount() {
    await this.preparePage()
    setTimeout(this.fetchAccount, TWO_SECONDS)
  }

  fetchAccount = async () => {
    const account = await getCurrentAccount()

    logger.log(`Check for account has changed:`, account !== this.state.curAddr)

    if (account !== this.state.curAddr) {
      await this.extractContractsData()
    }

    // We can't use setInterval, because we dont know what the function takes in time
    setTimeout(this.fetchAccount, TWO_SECONDS)
  }

  preparePage = async () => {
    const { gasPriceStore, generalStore, crowdsaleStore, contractStore } = this.props
    const crowdsaleExecID = getExecID()

    contractStore.setContractProperty('crowdsale', 'execID', crowdsaleExecID)

    try {
      await this.validateEnvironment()

      await getCrowdsaleAssets(generalStore.networkID)
      const crowdsaleAddr = await getAddr()

      await this.validateParams(crowdsaleExecID, crowdsaleAddr)

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
          this.setState({ clockAltMessage: 'Tier sold out' })
        }
      }

      await gasPriceStore
        .updateValues()
        .then(() => generalStore.setGasPrice(gasPriceStore.slow.price), () => noGasPriceAvailable())

      this.setState({ loading: false })
    } catch (err) {
      this.setState({ loading: false })
      logger.error(err)
    }
  }

  validateEnvironment = async () => {
    const { web3Store, generalStore } = this.props

    await checkWeb3(true)

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
  }

  validateParams = async (crowdsaleExecID, crowdsaleAddr) => {
    const { contractStore } = this.props

    if (!isExecIDValid(crowdsaleExecID) && contractStore.crowdsale.execID) {
      invalidCrowdsaleExecIDAlert()
      return Promise.reject('invalid exec-id')
    }

    if (!isAddressValid(crowdsaleAddr) && !contractStore.crowdsale.execID) {
      invalidCrowdsaleProxyAlert()
      return Promise.reject('invalid proxy addr')
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
      await this.checkIsStarted(initCrowdsaleContract, crowdsaleExecID)
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

  checkIsStarted = async (initCrowdsaleContract, crowdsaleExecID) => {
    this.setState({ isStarted: await isStarted(initCrowdsaleContract, crowdsaleExecID) })
  }

  checkIsSoldOut = async (initCrowdsaleContract, crowdsaleExecID) => {
    this.setState({ isSoldOut: await isSoldOut(initCrowdsaleContract, crowdsaleExecID) })
  }

  checkIsTierSoldOut = async (initCrowdsaleContract, crowdsaleExecID) => {
    this.setState({ isTierSoldOut: await isTierSoldOut(initCrowdsaleContract, crowdsaleExecID) })
  }

  getCrowdsaleSecondsLeft = (startDate, endDate) => {
    return Math.trunc((moment(endDate) - moment(Date.now())) / 1000)
  }

  getCrowdsaleSecondsDuration = (startDate, endDate) => {
    return Math.trunc((moment(endDate) - moment(startDate)) / 1000)
  }

  setTimers = () => {
    const { crowdsalePageStore } = this.props

    let nextTick = 0
    let millisecondsToNextTick = 0
    let timeInterval
    let durationSeconds = 0
    let secondsLeft = 0

    logger.log(`Ticks ${JSON.stringify(crowdsalePageStore.ticks)}`)
    if (crowdsalePageStore.ticks.length) {
      nextTick = crowdsalePageStore.extractNextTick()
      const { startDate, endDate } = nextTick
      logger.log(`NextTick ${JSON.stringify(nextTick)}`)
      durationSeconds = this.getCrowdsaleSecondsDuration(startDate, endDate, nextTick)
      secondsLeft = this.getCrowdsaleSecondsLeft(startDate, endDate, nextTick)

      timeInterval = setInterval(() => {
        logger.log(`NextTick ${JSON.stringify(this.state.nextTick)}`)
        if (this.state.nextTick) {
          const { startDate, endDate } = this.state.nextTick
          const time = moment.duration(this.state.nextTick.endDate - Date.now())

          let isStartedClock = false
          if (this.state.nextTick.type === 'start') {
            isStartedClock = moment(endDate) <= moment(Date.now())
          }

          let isEndClock = false
          if (this.state.nextTick.type === 'end') {
            isEndClock = moment(Date.now()) > moment(endDate)
          }
          this.setState({
            toNextTick: {
              days: Math.floor(time.asDays()) || 0,
              hours: time.hours() || 0,
              minutes: time.minutes() || 0,
              seconds: time.seconds() || 0
            },
            isStartedClock: isStartedClock,
            crowdsaleSecondsLeft: this.getCrowdsaleSecondsLeft(startDate, endDate)
          })

          // If started, change to nextTick
          if (isStartedClock && this.state.nextTick.type === 'start') {
            const nextTick = crowdsalePageStore.extractNextTick()
            this.setState({
              nextTick: nextTick
            })
            if (nextTick) {
              this.setState({
                crowdsaleDurationSeconds: this.getCrowdsaleSecondsDuration(nextTick.startDate, nextTick.endDate)
              })
            }
          }

          // If ended, get last undefined tick
          if (isEndClock && this.state.nextTick.type === 'end') {
            const nextTick = crowdsalePageStore.extractNextTick()
            this.setState({
              nextTick: nextTick
            })
            if (nextTick) {
              this.setState({
                crowdsaleDurationSeconds: this.getCrowdsaleSecondsDuration(nextTick.startDate, nextTick.endDate)
              })
            }
          }
        }
      }, 1000)
    }

    this.setState({
      nextTick: nextTick,
      msToNextTick: millisecondsToNextTick,
      crowdsaleDurationSeconds: durationSeconds,
      crowdsaleSecondsLeft: secondsLeft,
      displaySeconds: false,
      timeInterval: timeInterval
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
          throw new Error(`Is not a big number instance`)
        }

        logger.log(`User balance after buy`, userBalanceAfterBuy.toFixed())

        const tokensContributed = userBalanceAfterBuy.minus(toBigNumber(userBalanceBeforeBuy)).toFixed()
        logger.log(`Tokens to contributed`, tokensContributed)

        this.setState({ loading: false })

        successfulContributionAlert(tokensContributed, result => {
          window.location.reload()
        })
      })
      .catch(err => {
        logger.error(err)
        this.setState({ loading: false })
        return toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
      })
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
    const { crowdsalePageStore, tokenStore, contractStore, crowdsaleStore, tierStore } = this.props
    const { tokenAmountOf } = crowdsalePageStore
    const { crowdsale } = contractStore
    const { proxyName } = crowdsaleStore
    const { curAddr, contributeThrough, web3Available, minimumContribution, maximumContribution } = this.state
    const crowdsaleExecID = crowdsale && crowdsale.execID
    const { decimals, ticker, name } = tokenStore
    const tokenDecimals = !isNaN(decimals) ? decimals : 0
    const tokenTicker = ticker ? ticker.toString() : ''
    const tokenName = name ? name.toString() : ''
    const maximumSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
    const maxCapBeforeDecimals = toBigNumber(maximumSellableTokens).div(`1e${tokenDecimals}`)
    const contributorBalance = tokenAmountOf
      ? toBigNumber(tokenAmountOf)
          .div(`1e${tokenDecimals}`)
          .toFixed()
      : '0'
    const totalSupply = maxCapBeforeDecimals.toFixed()
    const canContribute = !(this.state.isEnded || this.state.isFinalized || this.state.isSoldOut)
    const minimumContributionDisplay =
      minimumContribution >= 0 && isFinite(minimumContribution) && canContribute
        ? `${minimumContribution} ${tokenTicker}`
        : 'You are not allowed'
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
    const crowdsaleAddressTruncated =
      (crowdsale && truncateStringInTheMiddle(crowdsale.execID)) ||
      (contractStore[proxyName] && contractStore[proxyName].addr)

    const getContributeDataColumnsObject = () => {
      return [
        {
          description: tokenName,
          title: 'Name'
        },
        {
          description: tokenTicker,
          title: 'Ticker'
        },
        {
          description: `${totalSupply}  ${tokenTicker}`,
          title: 'Total Supply'
        },
        {
          description: minimumContributionDisplay,
          title: 'Minimum Contribution'
        },
        {
          description: maximumContributionDisplay,
          title: 'Maximum Contribution'
        }
      ]
    }

    const getCrowdsaleTimePassedPercentage = () => {
      return 100 - Math.trunc((this.state.crowdsaleSecondsLeft * 100) / this.state.crowdsaleDurationSeconds)
    }

    return (
      <div>
        <section className="lo-MenuBarAndContent">
          <StepNavigation activeStepTitle={CONTRIBUTE_PAGE} />
          <div className="st-StepContent">
            <SectionInfo
              description="Here you can contribute in the crowdsale campaign."
              stepNumber="6"
              title={CONTRIBUTE_PAGE}
            />
            <div className="cnt-Contribute_Contents">
              <div className="cnt-Contribute_ShadowedBlock">
                <CountdownTimer
                  altMessage={this.state.clockAltMessage}
                  crowdsaleTimePassedPercentage={getCrowdsaleTimePassedPercentage()}
                  days={this.state.toNextTick.days}
                  hours={this.state.toNextTick.hours}
                  minutes={this.state.toNextTick.minutes}
                  seconds={this.state.toNextTick.seconds}
                  isFinalized={this.state.isFinalized}
                  isLoading={this.state.loading}
                  nextTick={this.state.nextTick}
                  tiersLength={tierStore && tierStore.tiers.length}
                />
                <ContributeDataList currentAccount={curAddr} crowdsaleAddress={crowdsaleAddressTruncated} />
                <ContributeDataColumns data={getContributeDataColumnsObject()} />
              </div>
              <div className="cnt-Contribute_BalanceBlock">
                <BalanceTokens balance={contributorBalance} ticker={tokenTicker} />
                <Form
                  onSubmit={this.contributeToTokens}
                  component={ContributeForm}
                  contributeThrough={contributeThrough}
                  isFinalized={this.state.isFinalized}
                  isEnded={this.state.isEnded}
                  isStarted={this.state.isStarted}
                  isSoldOut={this.state.isSoldOut}
                  isTierSoldOut={this.state.isTierSoldOut}
                  updateContributeThrough={this.updateContributeThrough}
                  web3Available={web3Available}
                  minimumContribution={minimumContribution}
                />
                {QRPaymentProcessElement}
              </div>
            </div>
            <ContributeDescription />
          </div>
        </section>
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
