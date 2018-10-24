import React, { Component } from 'react'
import {
  buildDeploymentSteps,
  download,
  getDownloadName,
  handleConstantForFile,
  handleContractsForFile,
  handlerForFile,
  scrollToBottom,
  summaryFileContents,
  getOptimizationFlagByStore,
  getVersionFlagByStore
} from './utils'
import { noContractDataAlert, successfulDeployment, skippingTransaction, deployHasEnded } from '../../utils/alerts'
import {
  DESCRIPTION,
  NAVIGATION_STEPS,
  TOAST,
  CROWDSALE_STRATEGIES_DISPLAYNAMES,
  TEXT_FIELDS,
  PUBLISH_DESCRIPTION,
  CROWDSALE_STRATEGIES
} from '../../utils/constants'
import JSZip from 'jszip'
import PropTypes from 'prop-types'
import cancelDeploy from '../../utils/cancelDeploy'
import executeSequentially from '../../utils/executeSequentially'
import logdown from 'logdown'
import { ButtonContinue } from '../Common/ButtonContinue'
import { ButtonDownload } from '../Common/ButtonDownload'
import { CrowdsaleConfig } from '../Common/config'
import { DOWNLOAD_TYPE } from './constants'
import { DisplayField } from '../Common/DisplayField'
import { DisplayTextArea } from '../Common/DisplayTextArea'
import { ModalContainer } from '../Common/ModalContainer'
import { PreventRefresh } from '../Common/PreventRefresh'
import { StepNavigation } from '../Common/StepNavigation'
import { TxProgressStatus } from '../Common/TxProgressStatus'
import { checkNetWorkByID } from '../../utils/blockchainHelpers'
import { getNetworkID, toast, convertDateToUTCTimezoneToDisplay } from '../../utils/utils'
import { inject, observer } from 'mobx-react'
import { isObservableArray } from 'mobx'

const logger = logdown('TW:StepFour')
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
    transactionFailed: false
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

    // scrollToBottom()

    if (!deploymentStore.hasEnded) {
      this.showModal()
    }

    // If user reloads with an invalid account, don't start the deploy automatically
    if (!deploymentStore.invalidAccount) {
      this.deployCrowdsale()
    }
  }

  deployCrowdsale = () => {
    this.resumeContractDeployment()
  }

  resumeContractDeployment = () => {
    const { deploymentStore } = this.props
    const { web3 } = this.context
    const startAt = deploymentStore.deploymentStep ? deploymentStore.deploymentStep : 0
    const deploymentSteps = buildDeploymentSteps(web3, deploymentStore)

    executeSequentially(deploymentSteps, startAt, index => {
      deploymentStore.setDeploymentStep(index)
    })
      .then(() => {
        this.hideModal()

        deploymentStore.setHasEnded(true)

        return successfulDeployment()
      })
      .catch(this.handleError)
  }

  handleError = ([err, failedAt]) => {
    const { deploymentStore } = this.props

    this.setState({
      transactionFailed: true
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

          deploymentStore.setDeploymentStep(deploymentStore.deploymentStep + 1)
          this.resumeContractDeployment()
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

  handleContentByParent(content, index = 0) {
    const { parent } = content
    switch (parent) {
      case 'crowdsale':
      case 'MintedCappedProxy':
      case 'DutchProxy':
        return handlerForFile(content, this.props.contractStore[parent])
      case 'crowdsaleStore':
        return handlerForFile(content, this.props[parent])
      case 'tierStore': {
        if (content.field === 'minCap') {
          index = content.field === 'minCap' ? 0 : index
        } else {
          index = content.field === 'walletAddress' ? 0 : index
        }
        logger.log('TierStore index', index)
        return handlerForFile(content, this.props[parent].tiers[index])
      }
      case 'tokenStore':
      case 'reservedTokenStore':
        return handlerForFile(content, this.props[parent])
      case 'contracts':
        return handleContractsForFile(content, index, this.props.contractStore, this.props.tierStore)
      case 'none':
        return handleConstantForFile(content)
      default:
      // do nothing
    }
  }

  downloadCrowdsaleInfo = () => {
    const { contractStore, crowdsaleStore } = this.props
    const zip = new JSZip()
    const fileContents = summaryFileContents(contractStore.crowdsale.networkID)
    let files = fileContents.files
    const tiersCount = isObservableArray(this.props.tierStore.tiers) ? this.props.tierStore.tiers.length : 1
    const contractsKeys = files.order
    const orderNumber = order => order.toString().padStart(3, '0')
    let prefix = 1

    contractsKeys.forEach(key => {
      if (contractStore.hasOwnProperty(key)) {
        logger.log(files[key])
        logger.log(contractStore[key])
        const { txt, name } = files[key]

        const authOS = fileContents.auth_os
        const authOSHeader = authOS.map(content => this.handleContentByParent(content))

        zip.file(`Auth-os_addresses.txt`, authOSHeader.join('\n'))

        const common = fileContents.common
        const commonHeader = common.map(content => this.handleContentByParent(content))

        zip.file(`${name}_data.txt`, commonHeader.join('\n'))

        if (crowdsaleStore.isMintedCappedCrowdsale) {
          for (let tier = 0; tier < tiersCount; tier++) {
            const txtFilename = `${orderNumber(prefix++)}_tier`
            const tierNumber = tier

            zip.file(
              `${txtFilename}.txt`,
              txt.map(content => this.handleContentByParent(content, tierNumber)).join('\n')
            )
          }
        }
      }
    })

    const fileName = crowdsaleStore.isMintedCappedCrowdsale ? 'MintedCappedProxy.sol' : 'DutchProxy.sol'
    zip.file(fileName, this.getContractBySourceType('src'))

    zip.generateAsync({ type: DOWNLOAD_TYPE.blob }).then(content => {
      const downloadName = getDownloadName()
      download({ zip: content, filename: downloadName })
    })
  }

  downloadContractButton = () => {
    this.downloadCrowdsaleInfo()
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
      this.downloadCrowdsaleInfo()
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

  getContractBySourceType = sourceType => {
    const { crowdsaleStore, contractStore } = this.props
    const parseContent = content => (isObservableArray(content) ? JSON.stringify(content.slice()) : content)

    return crowdsaleStore.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE
      ? parseContent(contractStore.MintedCappedProxy[sourceType])
      : parseContent(contractStore.DutchProxy[sourceType])
  }

  getSourceTypeTitle = sourceType => {
    const sourceTypeName = {
      abi: 'ABI',
      bin: 'Creation Code',
      src: 'Source Code'
    }

    return `Crowdsale Proxy Contract ${sourceTypeName[sourceType]}`
  }

  renderContractSource = sourceType => {
    const value = this.getContractBySourceType(sourceType)
    const title = this.getSourceTypeTitle(sourceType)

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
      const extraClass = isMintedCappedCrowdsale
        ? 'sw-BorderedSection_Items-CrowdsaleSetupMintCapped'
        : 'sw-BorderedSection_Items-CrowdsaleSetupDutchAuction'
      return (
        <div className={`sw-BorderedSection_Items sw-BorderedSection_Items-CrowdsaleSetup ${extraClass}`}>
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
        deployCrowdsale={this.deployCrowdsale}
        onSkip={this.state.transactionFailed ? this.skipTransaction : null}
        txMap={deploymentStore.txMap}
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
    const backgroundBlur = this.state.modal ? 'background-blur' : ''

    return (
      <div>
        <section className={`lo-MenuBarAndContent ${backgroundBlur}`} ref="four">
          <StepNavigation activeStep={PUBLISH} />
          <div className="st-StepContent">
            <div className="st-StepContent_Info">
              <div className="st-StepContent_InfoIcon st-StepContent_InfoIcon-step4" />
              <div className="st-StepContentInfo_InfoText">
                <h1 className="st-StepContent_InfoTitle">{PUBLISH}</h1>
                <p className="st-StepContent_InfoDescription">
                  On this step we provide you artifacts about your token and crowdsale contracts.
                </p>
              </div>
            </div>
            <div className="sw-BorderedBlock">
              <div className="sw-BorderedSection" data-step="1">
                <h2 className="sw-BorderedSection_Title">{CROWDSALE_STRATEGY}</h2>
                <p className="sw-BorderedSection_Text">{strategyName}</p>
                <p className="sw-BorderedSection_Text sw-BorderedSection_Text-small">{CROWDSALE_STRATEGY}</p>
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
              <ButtonContinue onClick={this.goToCrowdsalePage} disabled={!deploymentStore.hasEnded} />
            </div>
          </div>
          {this.state.preventRefresh ? <PreventRefresh /> : null}
        </section>
        <ModalContainer title={'Tx Status'} showModal={this.state.modal}>
          {modalContent}
        </ModalContainer>
      </div>
    )
  }
}
