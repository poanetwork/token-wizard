import React, { Component } from 'react'
import '../../assets/stylesheets/application.css'
import {
  buildDeploymentSteps,
  download,
  getDownloadName,
  handleConstantForFile,
  handleContractsForFile,
  handlerForFile,
  scrollToBottom,
  SUMMARY_FILE_CONTENTS
} from './utils'
import { noContractDataAlert, successfulDeployment, skippingTransaction, networkChanged } from '../../utils/alerts'
import {
  DESCRIPTION,
  NAVIGATION_STEPS,
  TOAST,
  CROWDSALE_STRATEGIES_DISPLAYNAMES,
  TEXT_FIELDS,
  PUBLISH_DESCRIPTION
} from '../../utils/constants'
import { DOWNLOAD_TYPE } from './constants'
import { toast } from '../../utils/utils'
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
import { getNetworkVersion } from '../../utils/blockchainHelpers'
let promiseRetry = require('promise-retry')

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
  BURN_EXCESS
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
export class stepFour extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      contractDownloaded: false,
      modal: false,
      preventRefresh: true,
      transactionFailed: false
    }

    const { deploymentStore } = props

    if (!deploymentStore.deployInProgress) {
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
    scrollToBottom()
    copy('copy')
    if (!this.props.deploymentStore.hasEnded) {
      this.showModal()
    }

    // If user reloads with an invalid account, don't start the deploy automatically
    if (!this.props.deploymentStore.invalidAccount) {
      this.deployCrowdsale()
    }

    await promiseRetry(async retry => {
      const networkChangedResult = await this.checkNetworkChanged()
      if (networkChangedResult) {
        this.hideModal()
        await networkChanged()
        this.showModal()
        retry()
      }
    })
  }

  deployCrowdsale = () => {
    this.resumeContractDeployment()
  }

  resumeContractDeployment = () => {
    const { deploymentStore } = this.props
    const { web3 } = this.context
    const startAt = deploymentStore.deploymentStep ? deploymentStore.deploymentStep : 0
    const deploymentSteps = buildDeploymentSteps(web3)

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

  checkNetworkChanged = async () => {
    const { generalStore } = this.props
    const networkIDFromNifty = await getNetworkVersion()
    const networkIDFromStore = generalStore.networkID
    return networkIDFromNifty !== networkIDFromStore
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
          return handlerForFile(content, this.props[parent].tiers[index])
        } else {
          index = content.field === 'walletAddress' ? 0 : index
          return handlerForFile(content, this.props[parent].tiers[index])
        }
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
    const fileContents = SUMMARY_FILE_CONTENTS(contractStore.crowdsale.networkID)
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

  render() {
    const { tierStore, tokenStore, deploymentStore, crowdsaleStore } = this.props
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
        <div className="hidden">
          <div className="hidden">
            <DisplayField side="left" title={NAME} value={tokenNameStr} description={PD_TOKEN_NAME} />
            <DisplayField side="right" title={TICKER} value={ticker ? ticker : ''} description={D_TOKEN_TICKER} />
          </div>
          <div className="hidden">
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
      const crowdsaleStartTimeStr = startTime ? startTime.split('T').join(' ') : ''
      const lasTierInd = tiers.length - 1
      const crowdsaleEndTimeStr = tiers[lasTierInd].endTime ? tiers[lasTierInd].endTime.split('T').join(' ') : ''
      const {
        WALLET_ADDRESS: PD_WALLET_ADDRESS,
        CROWDSALE_START_TIME: PD_CROWDSALE_START_TIME,
        CROWDSALE_END_TIME: PD_CROWDSALE_END_TIME
      } = PUBLISH_DESCRIPTION
      return (
        <div className="hidden">
          <div className="hidden">
            <DisplayField side="left" title={WALLET_ADDRESS} value={walletAddress} description={PD_WALLET_ADDRESS} />
            {isDutchAuction ? (
              <DisplayField side="right" title={BURN_EXCESS} value={burnExcess} description={DESCRIPTION.BURN_EXCESS} />
            ) : null}
          </div>
          <div className="hidden">
            <DisplayField
              side="left"
              title={CROWDSALE_START_TIME}
              value={crowdsaleStartTimeStr}
              description={PD_CROWDSALE_START_TIME}
            />
            <DisplayField
              side="right"
              title={CROWDSALE_END_TIME}
              value={crowdsaleEndTimeStr}
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
        <div className="hidden">
          <DisplayField side="left" title={MIN_RATE} value={tierMinRateStr} description={D_RATE} />
          <DisplayField side="right" title={MAX_RATE} value={tierMaxRateStr} description={D_RATE} />
        </div>
      )
      const tierStartTimeStr = startTime ? startTime.split('T').join(' ') : ''
      const tierEndTimeStr = endTime ? endTime.split('T').join(' ') : ''
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
          <div className="hidden">
            <div className="hidden">
              <DisplayField side="left" title={START_TIME} value={tierStartTimeStr} description={PD_TIER_START_TIME} />
              <DisplayField side="right" title={END_TIME} value={tierEndTimeStr} description={PD_TIER_END_TIME} />
            </div>
            <div className="hidden">
              {isMintedCappedCrowdsale
                ? mintedCappedCrowdsaleRateBlock
                : isDutchAuction
                  ? dutchAuctionCrowdsaleRateBlock
                  : null}
              {allowModifyingBlock}
            </div>
            <div className="hidden">
              <DisplayField side="left" title={MAX_CAP} value={tierSupplyStr} description={PD_HARD_CAP} />
              <DisplayField
                side="right"
                title={ENABLE_WHITELISTING}
                value={tierIsWhitelisted}
                description={PD_ENABLE_WHITELISTING}
              />
            </div>
            <div className="hidden">
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

    const strategyName = isMintedCappedCrowdsale ? MINTED_CAPPED_CROWDSALE_DN : isDutchAuction ? DUTCH_AUCTION_DN : ''

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
          <div className="hidden">
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
          </div>
        </div>
        <div className="button-container">
          <div onClick={this.downloadContractButton} className="button button_fill_secondary">
            Download File
          </div>
          <a onClick={this.goToCrowdsalePage} className="button button_fill">
            Continue
          </a>
        </div>
        <ModalContainer title={'Tx Status'} showModal={this.state.modal}>
          {modalContent}
        </ModalContainer>
        {this.state.preventRefresh ? <PreventRefresh /> : null}
      </section>
    )
  }
}
