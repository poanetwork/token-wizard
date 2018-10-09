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
import { DOWNLOAD_TYPE } from './constants'
import { getNetworkID, toast, convertDateToUTCTimezoneToDisplay } from '../../utils/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { DisplayField } from '../Common/DisplayField'
import { TxProgressStatus } from '../Common/TxProgressStatus'
import { ModalContainer } from '../Common/ModalContainer'
import { copy } from '../../utils/copy'
import { inject, observer } from 'mobx-react'
import { isObservableArray } from 'mobx'
import JSZip from 'jszip'
import executeSequentially from '../../utils/executeSequentially'
import { PreventRefresh } from '../Common/PreventRefresh'
import cancelDeploy from '../../utils/cancelDeploy'
import PropTypes from 'prop-types'
import logdown from 'logdown'
import { checkNetWorkByID } from '../../utils/blockchainHelpers'
import { CrowdsaleConfig } from '../Common/config'
import { ButtonContinue } from '../Common/ButtonContinue'
import classNames from 'classnames'
import { DisplayTextArea } from '../Common/DisplayTextArea'

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

    scrollToBottom()
    copy('copy')
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

  renderContractSource = sourceType => {
    const sourceTypeName = {
      abi: 'ABI',
      bin: 'Creation Code',
      src: 'Source Code'
    }

    const label = `Crowdsale Proxy Contract ${sourceTypeName[sourceType]}`
    const value = this.getContractBySourceType(sourceType)

    return <DisplayTextArea label={label} value={value} description={label} />
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
      <div>
        <DisplayField side="left" title={COMPILER_VERSION} value={versionFlag} description={PD_COMPILER_VERSION} />
        <DisplayField
          side="right"
          title={CONTRACT_NAME}
          value={crowdsaleStore.proxyName}
          description={PD_CONTRACT_NAME}
        />
        <DisplayField
          side="left"
          title={COMPILING_OPTIMIZATION}
          value={optimizationFlag}
          description={PD_COMPILING_OPTIMIZATION}
        />
      </div>
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
        <div>
          <div>
            <DisplayField side="left" title={NAME} value={tokenNameStr} description={PD_TOKEN_NAME} />
            <DisplayField side="right" title={TICKER} value={ticker ? ticker : ''} description={D_TOKEN_TICKER} />
          </div>
          <div>
            <DisplayField side="left" title={DECIMALS} value={tokenDecimalsStr} description={PD_TOKEN_DECIMALS} />
            <DisplayField
              side="right"
              title={SUPPLY_SHORT}
              value={tokenSupplyStr}
              description={PD_TOKEN_TOTAL_SUPPLY}
            />
          </div>
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
      return (
        <div>
          <div>
            <DisplayField side="left" title={WALLET_ADDRESS} value={walletAddress} description={PD_WALLET_ADDRESS} />
            {isDutchAuction ? (
              <DisplayField side="right" title={BURN_EXCESS} value={burnExcess} description={DESCRIPTION.BURN_EXCESS} />
            ) : null}
          </div>
          <div>
            <DisplayField
              side="left"
              title={CROWDSALE_START_TIME}
              value={startTimeWithUTC}
              description={PD_CROWDSALE_START_TIME}
            />
            <DisplayField
              side="right"
              title={CROWDSALE_END_TIME}
              value={endTimeWithUTC}
              description={PD_CROWDSALE_END_TIME}
            />
          </div>
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
      const mintedCappedCrowdsaleRateBlock = (
        <DisplayField side="left" title={RATE} value={tierRateStr} description={D_RATE} />
      )
      const dutchAuctionCrowdsaleRateBlock = (
        <div>
          <DisplayField side="left" title={MIN_RATE} value={tierMinRateStr} description={D_RATE} />
          <DisplayField side="right" title={MAX_RATE} value={tierMaxRateStr} description={D_RATE} />
        </div>
      )
      const tierStartTimeStr = convertDateToUTCTimezoneToDisplay(startTime)
      const tierEndTimeStr = convertDateToUTCTimezoneToDisplay(endTime)
      const tierIsUpdatable = isDutchAuction ? 'on' : updatable ? updatable : 'off'
      const tierIsWhitelisted = whitelistEnabled ? whitelistEnabled : 'off'
      const tierSupplyStr = supply ? supply : ''
      const allowModifyingBlock = isMintedCappedCrowdsale ? (
        <DisplayField side="right" title={ALLOW_MODIFYING} value={tierIsUpdatable} description={D_ALLOW_MODIFYING} />
      ) : null
      return (
        <div key={index.toString()}>
          <div className="publish-title-container">
            <p className="publish-title" data-step="3">
              {tierName} Setup
            </p>
          </div>
          <div>
            <div>
              <DisplayField side="left" title={START_TIME} value={tierStartTimeStr} description={PD_TIER_START_TIME} />
              <DisplayField side="right" title={END_TIME} value={tierEndTimeStr} description={PD_TIER_END_TIME} />
            </div>
            <div>
              {isMintedCappedCrowdsale
                ? mintedCappedCrowdsaleRateBlock
                : isDutchAuction
                  ? dutchAuctionCrowdsaleRateBlock
                  : null}
              {allowModifyingBlock}
            </div>
            <div>
              <DisplayField side="left" title={MAX_CAP} value={tierSupplyStr} description={PD_HARD_CAP} />
              <DisplayField
                side="right"
                title={ENABLE_WHITELISTING}
                value={tierIsWhitelisted}
                description={PD_ENABLE_WHITELISTING}
              />
            </div>
            <div>
              <DisplayField side="left" title={GLOBAL_MIN_CAP} value={minCap} description={PD_GLOBAL_MIN_CAP} />
            </div>
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
      />
    )

    const submitButtonClass = classNames('button', 'button_fill_secondary', 'button_no_border', {
      button_disabled: !deploymentStore.hasEnded
    })

    const strategyName = isMintedCappedCrowdsale ? MINTED_CAPPED_CROWDSALE_DN : isDutchAuction ? DUTCH_AUCTION_DN : ''

    const { abiEncoded } = contractStore[crowdsaleStore.proxyName]
    const ABIEncodedParameters = abiEncoded ? (
      <DisplayTextArea
        label="Crowdsale Proxy Contract ABI-encoded parameters"
        value={abiEncoded}
        description="Encoded ABI Parameters"
      />
    ) : null

    return (
      <section className="steps steps_publish">
        <StepNavigation activeStep={PUBLISH} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_publish" />
            <p className="title">{PUBLISH}</p>
            <p className="description">
              On this step we provide you artifacts about your token and crowdsale contracts.
            </p>
          </div>
          <div>
            <div className="item">
              <div className="publish-title-container">
                <p className="publish-title" data-step="1">
                  {CROWDSALE_STRATEGY}
                </p>
              </div>
              <p className="label">{strategyName}</p>
              <p className="description">{CROWDSALE_STRATEGY}</p>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="2">
                {TOKEN_SETUP}
              </p>
            </div>
            {tokenSetupBlock()}
            <div className="publish-title-container">
              <p className="publish-title" data-step="3">
                {CROWDSALE_SETUP}
              </p>
            </div>
            {crowdsaleSetupBlock()}
            {tiersSetupBlock}
            {this.configurationBlock()}
            {this.renderContractSource('src')}
            {ABIEncodedParameters}
          </div>
        </div>
        <div className="button-container">
          <button
            onClick={this.downloadContractButton}
            disabled={!deploymentStore.hasEnded}
            className={submitButtonClass}
          >
            Download File
          </button>
          <ButtonContinue onClick={this.goToCrowdsalePage} status={deploymentStore.hasEnded} />
        </div>
        <ModalContainer title={'Tx Status'} showModal={this.state.modal}>
          {modalContent}
        </ModalContainer>
        {this.state.preventRefresh ? <PreventRefresh /> : null}
      </section>
    )
  }
}