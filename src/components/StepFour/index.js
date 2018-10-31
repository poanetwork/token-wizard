import React, { Component } from 'react'
import {
  buildDeploymentSteps,
  getOptimizationFlagByStore,
  getVersionFlagByStore,
  scrollToBottom,
  updateCrowdsaleContractInfo
} from './utils'
import {
  deployHasEnded,
  noContractDataAlert,
  skippingTransaction,
  successfulDeployment,
  transactionLost
} from '../../utils/alerts'
import {
  CROWDSALE_STRATEGIES_DISPLAYNAMES,
  DESCRIPTION,
  NAVIGATION_STEPS,
  PUBLISH_DESCRIPTION,
  TEXT_FIELDS,
  TOAST
} from '../../utils/constants'
import {
  convertDateToUTCTimezoneToDisplay,
  getContractBySourceType,
  getSourceTypeTitle,
  getNetworkID,
  toast,
  updateProxyContractInfo
} from '../../utils/utils'
import PropTypes from 'prop-types'
import cancelDeploy from '../../utils/cancelDeploy'
import downloadCrowdsaleInfo from '../../utils/downloadCrowdsaleInfo'
import executeSequentially from '../../utils/executeSequentially'
import logdown from 'logdown'
import { ButtonContinue } from '../Common/ButtonContinue'
import { ButtonDownload } from '../Common/ButtonDownload'
import { CrowdsaleConfig } from '../Common/config'
import { DisplayField } from '../Common/DisplayField'
import { DisplayTextArea } from '../Common/DisplayTextArea'
import { ModalContainer } from '../Common/ModalContainer'
import { PreventRefresh } from '../Common/PreventRefresh'
import { StepNavigation } from '../Common/StepNavigation'
import { StepInfo } from '../Common/StepInfo'
import { TxProgressStatus } from '../Common/TxProgressStatus'
import { checkNetWorkByID, sendTXResponse } from '../../utils/blockchainHelpers'
import { inject, observer } from 'mobx-react'

const logger = logdown('TW:stepFour')

const { PUBLISH, CROWDSALE_STRATEGY, TOKEN_SETUP, CROWDSALE_SETUP } = NAVIGATION_STEPS
const {
  NAME,
  TICKER,
  DECIMALS,
  SUPPLY_SHORT,
  WALLET_ADDRESS,
  GLOBAL_MIN_CAP,
  RATE,
  MIN_RATE,
  MAX_RATE,
  CROWDSALE_START_TIME,
  CROWDSALE_END_TIME,
  START_TIME,
  END_TIME,
  ALLOW_MODIFYING,
  ENABLE_WHITELISTING,
  MAX_CAP,
  BURN_EXCESS,
  COMPILER_VERSION,
  CONTRACT_NAME,
  COMPILING_OPTIMIZATION
} = TEXT_FIELDS
const {
  MINTED_CAPPED_CROWDSALE: MINTED_CAPPED_CROWDSALE_DN,
  DUTCH_AUCTION: DUTCH_AUCTION_DN
} = CROWDSALE_STRATEGIES_DISPLAYNAMES

@inject(
  'contractStore',
  'reservedTokenStore',
  'tierStore',
  'tokenStore',
  'web3Store',
  'deploymentStore',
  'generalStore',
  'crowdsaleStore'
)
@observer
export class StepFour extends Component {
  state = {
    contractDownloaded: false,
    modal: false,
    preventRefresh: true,
    transactionFailed: false,
    allowRetry: false
  }

  constructor(props, context) {
    super(props)

    const { deploymentStore } = props

    logger.log(`Deployment progress`, deploymentStore.deployInProgress)
    logger.log(`Deployment has ended`, deploymentStore.hasEnded)
    if (!deploymentStore.deployInProgress && !deploymentStore.hasEnded) {
      deploymentStore.setDeploymentStep(0)
      deploymentStore.setDeployerAccount(context.selectedAccount)
    }
  }

  static contextTypes = {
    web3: PropTypes.object,
    selectedAccount: PropTypes.string
  }

  contractDownloadSuccess = options => {
    this.setState({ contractDownloaded: true })
    toast.showToaster({ message: TOAST.MESSAGE.CONTRACT_DOWNLOAD_SUCCESS, options })
  }

  async componentDidMount() {
    const { deploymentStore, generalStore } = this.props

    // Check if network has changed
    const networkID = generalStore.networkID || CrowdsaleConfig.networkID || getNetworkID()
    generalStore.setProperty('networkID', networkID)

    logger.log('Check network by id', networkID)
    const networkInfo = await checkNetWorkByID(networkID)

    logger.log('Network id returned', networkInfo)
    if (!networkInfo) {
      return Promise.reject('invalid networkID')
    }
    // Check if deploy has ended
    if (deploymentStore.hasEnded) {
      return await deployHasEnded()
    }

    scrollToBottom()
    if (!deploymentStore.hasEnded) {
      this.showModal()
    }

    // If user reloads with an invalid account, don't start the deploy automatically
    if (!deploymentStore.invalidAccount) {
      this.deployCrowdsale()
    }
  }

  async deployCrowdsale() {
    const { deploymentStore } = this.props
    let startAt = deploymentStore.deploymentStep ? deploymentStore.deploymentStep : 0

    if (deploymentStore.txLost) {
      // temporarily hide modal to display error message
      this.hideModal()
      await transactionLost()
      this.showModal()
      this.retryTransaction()
    } else {
      if (deploymentStore.txRecoverable) {
        const receipt = await this.context.web3.eth.getTransactionReceipt(deploymentStore.txRecoverable.txHash)

        if (receipt && receipt.blockNumber) {
          try {
            // analyze receipt
            await sendTXResponse(receipt)
            const executionOrder = deploymentStore.getStepExecutionOrder(deploymentStore.txRecoverable)
            const stores = {
              web3Store: this.props.web3Store,
              crowdsaleStore: this.props.crowdsaleStore,
              contractStore: this.props.contractStore
            }

            // if is one of the contract deployment steps, call the proper method to update the information
            if (deploymentStore.txRecoverable.name === 'deployProxy') updateProxyContractInfo(receipt, stores)
            if (deploymentStore.txRecoverable.name === 'crowdsaleCreate') updateCrowdsaleContractInfo(receipt, stores)

            deploymentStore.setDeploymentStep(executionOrder)
            deploymentStore.setDeploymentStepStatus({ executionOrder, status: 'mined' })

            // after the step was finished we continue with the deployment process
            setTimeout(() => this.deployCrowdsale(), 100)
          } catch (e) {
            this.handleError([e, deploymentStore.deploymentStep])
          }
        } else {
          // block wasn't mined yet, wait 5s and retry
          setTimeout(() => this.deployCrowdsale(), 5000)
        }
      } else {
        // if it's a tx not lost or not recoverable we assume everything is fine and continue with the deployment process
        const nextStep = deploymentStore.activeSteps[startAt]

        if (!nextStep) {
          this.finalizeCrowdsaleDeployment()
        } else {
          if (nextStep.active && nextStep.mined) {
            startAt++
            deploymentStore.setDeploymentStep(startAt)
          }
          this.resumeContractDeployment(startAt)
        }
      }
    }
  }

  /**
   * cleanup tx lost and restarts deployCrowdsale
   */
  retryTransaction = () => {
    const { deploymentStore } = this.props
    deploymentStore.resetTx(deploymentStore.txLost)
    this.setState({ allowRetry: false, transactionFailed: false })
    setTimeout(() => this.deployCrowdsale(), 100)
  }

  resumeContractDeployment(startAt) {
    const { deploymentStore } = this.props
    const deploymentSteps = buildDeploymentSteps(deploymentStore)

    executeSequentially(
      deploymentSteps,
      startAt,
      executionOrder => {
        deploymentStore.setDeploymentStepStatus({ executionOrder, status: 'active' })
      },
      executionOrder => {
        deploymentStore.setDeploymentStep(executionOrder)
        deploymentStore.setDeploymentStepStatus({ executionOrder, status: 'mined' })
      }
    )
      .then(this.finalizeCrowdsaleDeployment)
      .catch(this.handleError)
  }

  finalizeCrowdsaleDeployment = () => {
    const { deploymentStore } = this.props
    this.hideModal()
    deploymentStore.setHasEnded(true)
    return successfulDeployment()
  }

  handleError = ([err, failedAt]) => {
    const { deploymentStore } = this.props

    this.setState({
      transactionFailed: true,
      allowRetry: err.message && err.message.includes('User denied transaction signature')
    })

    if (!deploymentStore.deploymentHasFinished) {
      toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED, options: { time: 1000 } })
      deploymentStore.setDeploymentStep(failedAt)
    } else {
      this.hideModal()
      toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
    }

    logger.error([failedAt, err])
  }

  skipTransaction = () => {
    const { deploymentStore } = this.props

    this.hideModal() // hide modal, otherwise the warning doesn't show up
    return skippingTransaction()
      .then(result => {
        if (result.value) {
          this.setState({
            transactionFailed: false
          })

          deploymentStore.resetTx(deploymentStore.activeSteps[deploymentStore.deploymentStep])
          deploymentStore.setDeploymentStep(deploymentStore.deploymentStep + 1)
          this.deployCrowdsale()
        }
      })
      .then(
        // finally
        () => this.showModal(),
        () => this.showModal()
      )
  }

  hideModal = () => {
    this.setState({ modal: false })
  }

  showModal = () => {
    this.setState({ modal: true })
  }

  downloadContractButton = () => {
    const { tokenStore, tierStore, reservedTokenStore, contractStore, crowdsaleStore } = this.props
    downloadCrowdsaleInfo({ tokenStore, tierStore, reservedTokenStore, contractStore, crowdsaleStore })
    this.contractDownloadSuccess({ offset: 14 })
  }

  goToCrowdsalePage = () => {
    const { contractStore, crowdsaleStore } = this.props
    const crowdsalePointer = contractStore[crowdsaleStore.proxyName].addr || contractStore.crowdsale.execID
    const queryPointerParam = contractStore[crowdsaleStore.proxyName].addr
      ? 'addr'
      : contractStore.crowdsale.execID
        ? 'exec-id'
        : ''

    if (!crowdsalePointer) {
      return noContractDataAlert()
    }

    const crowdsalePage = '/crowdsale'
    const url = `${crowdsalePage}?${queryPointerParam}=${crowdsalePointer}&networkID=${
      contractStore.crowdsale.networkID
    }`

    if (!this.state.contractDownloaded) {
      const { tokenStore, tierStore, reservedTokenStore, contractStore, crowdsaleStore } = this.props
      downloadCrowdsaleInfo({ tokenStore, tierStore, reservedTokenStore, contractStore, crowdsaleStore })
      this.contractDownloadSuccess()
    }

    const newHistory = crowdsalePointer ? url : crowdsalePage

    this.props.deploymentStore.resetDeploymentStep()

    this.props.history.push(newHistory)
  }

  cancelDeploy = e => {
    e.preventDefault()

    this.hideModal() // hide modal, otherwise the warning doesn't show up

    // avoid the beforeunload alert when user cancels the deploy
    this.setState({
      preventRefresh: false
    })

    cancelDeploy().then(
      cancelled => {
        if (!cancelled) {
          this.setState({
            preventRefresh: true
          })
          this.showModal()
        }
      },
      () => this.showModal()
    )
  }

  renderContractSource = sourceType => {
    const { crowdsaleStore, contractStore } = this.props
    const { isMintedCappedCrowdsale } = crowdsaleStore
    const value = getContractBySourceType(sourceType, isMintedCappedCrowdsale, contractStore)
    const title = getSourceTypeTitle(sourceType)

    return <DisplayTextArea title={title} value={value} />
  }

  configurationBlock = () => {
    const { crowdsaleStore } = this.props
    const {
      COMPILER_VERSION: PD_COMPILER_VERSION,
      CONTRACT_NAME: PD_CONTRACT_NAME,
      COMPILING_OPTIMIZATION: PD_COMPILING_OPTIMIZATION
    } = PUBLISH_DESCRIPTION
    const optimizationFlag = getOptimizationFlagByStore(crowdsaleStore)
    const versionFlag = getVersionFlagByStore(crowdsaleStore)

    return (
      <div className="sw-BorderedSection_Items sw-BorderedSection_Items-ConfigurationBlock">
        <DisplayField title={COMPILER_VERSION} value={versionFlag} description={PD_COMPILER_VERSION} />
        <DisplayField description={PD_CONTRACT_NAME} title={CONTRACT_NAME} value={crowdsaleStore.proxyName} />
        <DisplayField description={PD_COMPILING_OPTIMIZATION} title={COMPILING_OPTIMIZATION} value={optimizationFlag} />
      </div>
    )
  }

  isTierUpdatable = updatable => {
    return (
      {
        on: 'Yes',
        off: 'No'
      }[updatable.toLowerCase()] || 'No'
    )
  }

  isWhitelisted = whitelistEnabled => {
    return (
      {
        yes: 'Yes',
        no: 'No'
      }[whitelistEnabled.toLowerCase()] || 'No'
    )
  }

  getBurnExcess = burnExcess => {
    return (
      {
        yes: 'Yes',
        no: 'No'
      }[burnExcess.toLowerCase()] || 'No'
    )
  }

  render() {
    const { tierStore, tokenStore, deploymentStore, crowdsaleStore, contractStore } = this.props
    const { isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore

    // Publish page: Token setup block
    const tokenSetupBlock = () => {
      const { supply, name, ticker, decimals } = tokenStore
      const tokenSupplyStr = supply ? supply.toString() : '0'
      const tokenNameStr = name ? name : ''
      const tokenDecimalsStr = decimals ? decimals.toString() : ''
      const {
        TOKEN_TOTAL_SUPPLY: PD_TOKEN_TOTAL_SUPPLY,
        TOKEN_NAME: PD_TOKEN_NAME,
        TOKEN_DECIMALS: PD_TOKEN_DECIMALS
      } = PUBLISH_DESCRIPTION
      const { TOKEN_TICKER: D_TOKEN_TICKER } = DESCRIPTION

      return (
        <div className="sw-BorderedSection_Items sw-BorderedSection_Items-TokenSetup">
          <DisplayField title={NAME} value={tokenNameStr} description={PD_TOKEN_NAME} />
          <DisplayField title={TICKER} value={ticker ? ticker : ''} description={D_TOKEN_TICKER} />
          <DisplayField title={DECIMALS} value={tokenDecimalsStr} description={PD_TOKEN_DECIMALS} />
          <DisplayField title={SUPPLY_SHORT} value={tokenSupplyStr} description={PD_TOKEN_TOTAL_SUPPLY} />
        </div>
      )
    }

    // Publish page: Crowdsale setup block
    const crowdsaleSetupBlock = () => {
      const { tiers } = tierStore
      const firstTier = tiers[0]
      const { walletAddress, startTime, burnExcess } = firstTier
      const startTimeWithUTC = convertDateToUTCTimezoneToDisplay(startTime)
      const lasTierInd = tiers.length - 1
      const endTimeWithUTC = convertDateToUTCTimezoneToDisplay(tiers[lasTierInd].endTime)
      const {
        WALLET_ADDRESS: PD_WALLET_ADDRESS,
        CROWDSALE_START_TIME: PD_CROWDSALE_START_TIME,
        CROWDSALE_END_TIME: PD_CROWDSALE_END_TIME
      } = PUBLISH_DESCRIPTION
      const crowdsaleType = isMintedCappedCrowdsale
        ? 'sw-BorderedSection_Items-CrowdsaleSetupMintCapped'
        : 'sw-BorderedSection_Items-CrowdsaleSetupDutchAuction'

      return (
        <div className={`sw-BorderedSection_Items sw-BorderedSection_Items-CrowdsaleSetup ${crowdsaleType}`}>
          <DisplayField
            description={PD_WALLET_ADDRESS}
            extraClass="pb-DisplayField-WalletAddress"
            title={WALLET_ADDRESS}
            value={walletAddress}
          />
          {isDutchAuction ? (
            <DisplayField
              description={DESCRIPTION.BURN_EXCESS}
              extraClass="pb-DisplayField-BurnExcess"
              title={BURN_EXCESS}
              value={this.getBurnExcess(burnExcess)}
            />
          ) : null}
          <DisplayField
            description={PD_CROWDSALE_START_TIME}
            extraClass="pb-DisplayField-CrowdsaleStartTime"
            mobileTextSize="small"
            title={CROWDSALE_START_TIME}
            value={startTimeWithUTC}
          />
          <DisplayField
            description={PD_CROWDSALE_END_TIME}
            extraClass="pb-DisplayField-CrowdsaleEndTime"
            mobileTextSize="small"
            title={CROWDSALE_END_TIME}
            value={endTimeWithUTC}
          />
        </div>
      )
    }

    // Publish page: Tiers setup block
    const tiersSetupBlock = tierStore.tiers.map((tier, index) => {
      const {
        rate,
        minRate,
        maxRate,
        startTime,
        endTime,
        updatable,
        whitelistEnabled,
        supply,
        tier: tierName,
        minCap
      } = tier
      const { RATE: D_RATE, ALLOW_MODIFYING: D_ALLOW_MODIFYING } = DESCRIPTION
      const {
        TIER_START_TIME: PD_TIER_START_TIME,
        TIER_END_TIME: PD_TIER_END_TIME,
        GLOBAL_MIN_CAP: PD_GLOBAL_MIN_CAP,
        HARD_CAP: PD_HARD_CAP,
        ENABLE_WHITELISTING: PD_ENABLE_WHITELISTING
      } = PUBLISH_DESCRIPTION
      const tierRateStr = rate ? rate : 0
      const tierMinRateStr = minRate ? minRate : 0
      const tierMaxRateStr = maxRate ? maxRate : 0
      const mintedCappedCrowdsaleRate = isMintedCappedCrowdsale ? (
        <DisplayField title={RATE} value={tierRateStr} description={D_RATE} />
      ) : null
      const dutchAuctionCrowdsaleMinRate = isDutchAuction ? (
        <DisplayField title={MIN_RATE} value={tierMinRateStr} description={D_RATE} />
      ) : null
      const dutchAuctionCrowdsaleMaxRate = isDutchAuction ? (
        <DisplayField title={MAX_RATE} value={tierMaxRateStr} description={D_RATE} />
      ) : null
      const tierStartTimeStr = convertDateToUTCTimezoneToDisplay(startTime)
      const tierEndTimeStr = convertDateToUTCTimezoneToDisplay(endTime)
      const tierIsUpdatable = this.isTierUpdatable(updatable)
      const tierIsWhitelisted = this.isWhitelisted(whitelistEnabled)
      const tierSupplyStr = supply ? supply : ''
      const allowModifying = isMintedCappedCrowdsale ? (
        <DisplayField title={ALLOW_MODIFYING} value={tierIsUpdatable} description={D_ALLOW_MODIFYING} />
      ) : null

      return (
        <div className="sw-BorderedSection" key={index.toString()} data-step="4">
          <h2 className="sw-BorderedSection_Title">{tierName} Setup</h2>
          <div className="sw-BorderedSection_Items sw-BorderedSection_Items-TierBlock">
            <DisplayField
              description={PD_TIER_START_TIME}
              mobileTextSize="small"
              title={START_TIME}
              value={tierStartTimeStr}
            />
            <DisplayField
              description={PD_TIER_END_TIME}
              mobileTextSize="small"
              title={END_TIME}
              value={tierEndTimeStr}
            />
            <DisplayField title={ENABLE_WHITELISTING} value={tierIsWhitelisted} description={PD_ENABLE_WHITELISTING} />
            {allowModifying}
            <DisplayField title={GLOBAL_MIN_CAP} value={minCap} description={PD_GLOBAL_MIN_CAP} />
            <DisplayField title={MAX_CAP} value={tierSupplyStr} description={PD_HARD_CAP} />
            {mintedCappedCrowdsaleRate}
            {dutchAuctionCrowdsaleMinRate}
            {dutchAuctionCrowdsaleMaxRate}
          </div>
        </div>
      )
    })

    const modalContent = deploymentStore.invalidAccount ? (
      <div>
        This deploy was started with account <b>{deploymentStore.deployerAccount}</b> but the current account is{' '}
        <b>{this.context.selectedAccount}</b>. Please select the original account to continue with the deploy. If you
        don't want to continue with that deploy,{' '}
        <a href="" onClick={this.cancelDeploy}>
          click here
        </a>.
      </div>
    ) : (
      <TxProgressStatus
        txMap={deploymentStore.txMap}
        deployCrowdsale={this.deployCrowdsale}
        onSkip={this.state.transactionFailed ? this.skipTransaction : null}
        onRetry={this.state.allowRetry ? this.retryTransaction : null}
      />
    )
    const strategyName = isMintedCappedCrowdsale ? MINTED_CAPPED_CROWDSALE_DN : isDutchAuction ? DUTCH_AUCTION_DN : ''
    const { abiEncoded } = contractStore[crowdsaleStore.proxyName]
    const ABIEncodedParameters = abiEncoded ? (
      <DisplayTextArea
        description="Encoded ABI Parameters"
        title="Crowdsale Proxy Contract ABI-encoded parameters"
        value={abiEncoded}
      />
    ) : null
    // const backgroundBlur = this.state.modal ? 'background-blur' : ''
    const backgroundBlur = ''

    return (
      <div>
        <section className={`lo-MenuBarAndContent ${backgroundBlur}`} ref="four">
          <StepNavigation activeStep={PUBLISH} />
          <div className="st-StepContent">
            <StepInfo
              description="On this step we provide you artifacts about your token and crowdsale contracts."
              stepNumber="4"
              title={PUBLISH}
            />
            <div className="sw-BorderedBlock">
              <div className="sw-BorderedSection" data-step="1">
                <h2 className="sw-BorderedSection_Title">{CROWDSALE_STRATEGY}</h2>
                <p className="sw-BorderedSection_Text">{strategyName}</p>
              </div>
              <div className="sw-BorderedSection" data-step="2">
                <h2 className="sw-BorderedSection_Title">{TOKEN_SETUP}</h2>
                {tokenSetupBlock()}
              </div>
              <div className="sw-BorderedSection" data-step="3">
                <h2 className="sw-BorderedSection_Title">{CROWDSALE_SETUP}</h2>
                {crowdsaleSetupBlock()}
              </div>
              {tiersSetupBlock}
              <div className="sw-BorderedSection" data-step="5">
                <h2 className="sw-BorderedSection_Title">Configuration</h2>
                {this.configurationBlock()}
              </div>
              <div className="sw-BorderedSection" data-step="6">
                {this.renderContractSource('src')}
              </div>
              {abiEncoded ? (
                <div className="sw-BorderedSection" data-step="7">
                  {ABIEncodedParameters}
                </div>
              ) : null}
              <div className="sw-BorderedBlock_DownloadButtonContainer">
                <ButtonDownload onClick={this.downloadContractButton} disabled={!deploymentStore.hasEnded} />
              </div>
            </div>
            <div className="st-StepContent_Buttons">
              <ButtonContinue
                buttonText="Publish"
                disabled={!deploymentStore.hasEnded}
                onClick={this.goToCrowdsalePage}
              />
            </div>
          </div>
          {this.state.preventRefresh ? <PreventRefresh /> : null}
        </section>
        {/* <ModalContainer title={'Tx Status'} showModal={this.state.modal}>
          {modalContent}
        </ModalContainer> */}
      </div>
    )
  }
}
