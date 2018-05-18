import React from 'react'
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
import { noContractDataAlert, successfulDeployment, skippingTransaction } from '../../utils/alerts'
import {
  DESCRIPTION,
  NAVIGATION_STEPS,
  TOAST,
  CROWDSALE_STRATEGIES,
  CROWDSALE_STRATEGIES_DISPLAYNAMES,
  TEXT_FIELDS,
  PUBLISH_DESCRIPTION
} from '../../utils/constants'
import  {
  DOWNLOAD_TYPE,
} from './constants'
import { toast } from '../../utils/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { DisplayField } from '../Common/DisplayField'
//import { DisplayTextArea } from '../Common/DisplayTextArea'
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

const { PUBLISH, CROWDSALE_STRATEGY, TOKEN_SETUP, CROWDSALE_SETUP } = NAVIGATION_STEPS
const {
  NAME,
  TICKER,
  DECIMALS,
  SUPPLY,
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
  MAX_CAP
} = TEXT_FIELDS

@inject('contractStore', 'reservedTokenStore', 'tierStore', 'tokenStore', 'web3Store', 'deploymentStore', 'crowdsaleStore')
@observer
export class stepFour extends React.Component {
  constructor (props, context) {
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

  componentDidMount () {
    scrollToBottom()
    copy('copy')
    if (!this.props.deploymentStore.hasEnded) {
      this.showModal()
    }

    // If user reloads with an invalid account, don't start the deploy automatically
    if (!this.props.deploymentStore.invalidAccount) {
      this.deployCrowdsale()
    }
  }

  deployCrowdsale = () => {
    const { deploymentStore } = this.props
    const firstRun = deploymentStore.deploymentStep === 0

    this.resumeContractDeployment()
  }

  resumeContractDeployment = () => {
    const { deploymentStore } = this.props
    const { web3 } = this.context
    const startAt = deploymentStore.deploymentStep ? deploymentStore.deploymentStep : 0
    const deploymentSteps = buildDeploymentSteps(web3)

    executeSequentially(deploymentSteps, startAt, (index) => {
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
      toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED, options: {time: 1000} })
      deploymentStore.setDeploymentStep(failedAt)
    } else {
      this.hideModal()
      toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
    }

    console.error([failedAt, err])
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
      .then( // finally
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
        return handlerForFile(content, this.props.contractStore[parent])
      case 'crowdsaleStore':
        return handlerForFile(content, this.props[parent])
      case 'tierStore': {
        if (content.field == 'globalMinCap') {
          return handlerForFile(content, this.props[parent])
        } else {
          index = (content.field === 'walletAddress' || content.field === 'whitelistEnabled') ? 0 : index
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
    const contractsKeys = files.order;
    const orderNumber = order => order.toString().padStart(3, '0');
    let prefix = 1

    contractsKeys.forEach(key => {
      if (contractStore.hasOwnProperty(key)) {
        console.log(files[key])
        console.log(contractStore[key])
        const { txt, name } = files[key]

        const authOS = fileContents.auth_os
        const authOSHeader = authOS.map(content => this.handleContentByParent(content))

        zip.file(
          `Auth_os_addresses.txt`,
          authOSHeader.join('\n')
        )

        const common = fileContents.common
        const commonHeader = common.map(content => this.handleContentByParent(content))

        zip.file(
          `${name}_data.txt`,
          commonHeader.join('\n')
        )

        if (crowdsaleStore.strategy == CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE) {
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

    zip.generateAsync({ type: DOWNLOAD_TYPE.blob })
      .then(content => {
        getDownloadName()
          .then(downloadName => download({ zip: content, filename: downloadName }))
      })
  }

  downloadContractButton = () => {
    this.downloadCrowdsaleInfo();
    this.contractDownloadSuccess({ offset: 14 })
  }

  goToCrowdsalePage = () => {
    const { contractStore } = this.props
    const isValidContract = contractStore.crowdsale.execID

    if (!isValidContract) {
      return noContractDataAlert()
    }

    const crowdsalePage = '/crowdsale'
    const url = `${crowdsalePage}?exec-id=${contractStore.crowdsale.execID}&networkID=${contractStore.crowdsale.networkID}`

    if (!this.state.contractDownloaded) {
      this.downloadCrowdsaleInfo()
      this.contractDownloadSuccess()
    }

    const newHistory = isValidContract ? url : crowdsalePage

    this.props.deploymentStore.resetDeploymentStep()

    this.props.history.push(newHistory)
  }

  cancelDeploy = (e) => {
    e.preventDefault();

    this.hideModal(); // hide modal, otherwise the warning doesn't show up

    // avoid the beforeunload alert when user cancels the deploy
    this.setState({
      preventRefresh: false
    })

    cancelDeploy()
      .then(
        (cancelled) => {
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
    const tokenSupplyStr = tokenStore.supply ? tokenStore.supply.toString() : 0
    const tokenNameStr = tokenStore.name ? tokenStore.name : ''
    const tokenDecimalsStr = tokenStore.decimals ? tokenStore.decimals.toString() : ''
    const tokenSupplyBlock = (
      <DisplayField side='right' title={SUPPLY} value={tokenSupplyStr} description={PUBLISH_DESCRIPTION.TOKEN_TOTAL_SUPPLY} />
    )
    const tokenSetup = (
      <div className='hidden'>
        <div className='hidden'>
          <DisplayField side='left' title={NAME} value={tokenNameStr} description={PUBLISH_DESCRIPTION.TOKEN_NAME} />
          <DisplayField side='right' title={TICKER} value={tokenStore.ticker ? tokenStore.ticker : ''} description={DESCRIPTION.TOKEN_TICKER} />
        </div>
        <div className='hidden'>
          <DisplayField side='left' title={DECIMALS} value={tokenDecimalsStr} description={PUBLISH_DESCRIPTION.TOKEN_DECIMALS} />
          {tokenSupplyBlock}
        </div>
      </div>)

    const globalLimitsBlock = (
      <DisplayField side='right' title={GLOBAL_MIN_CAP} value={tierStore.globalMinCap} description={PUBLISH_DESCRIPTION.GLOBAL_MIN_CAP} />
    )
    const walletAddressStr = tierStore.tiers[0].walletAddress
    const crowdsaleStartTimeStr = tierStore.tiers[0].startTime ? tierStore.tiers[0].startTime.split('T').join(' ') : ''
    const crowdsaleEndTimeStr = tierStore.tiers[tierStore.tiers.length - 1].endTime ? tierStore.tiers[tierStore.tiers.length - 1].endTime.split('T').join(' ') : ''
    const crowdsaleSetup = (
      <div className='hidden'>
        <div className='hidden'>
          <DisplayField side='left' title={WALLET_ADDRESS} value={walletAddressStr} description={PUBLISH_DESCRIPTION.WALLET_ADDRESS} />
          {globalLimitsBlock}
        </div>
        <div className='hidden'>
          <DisplayField side='left' title={CROWDSALE_START_TIME} value={crowdsaleStartTimeStr} description={PUBLISH_DESCRIPTION.CROWDSALE_START_TIME} />
          <DisplayField side='right' title={CROWDSALE_END_TIME} value={crowdsaleEndTimeStr} description={PUBLISH_DESCRIPTION.CROWDSALE_END_TIME} />
        </div>
      </div>
    )
    const tiersSetup = tierStore.tiers.map((tier, index) => {
      const tierRateStr = tier.rate ? tier.rate : 0 + ' ETH'
      const tierMinRateStr = tier.minRate ? tier.minRate : 0 + ' ETH'
      const tierMaxRateStr = tier.maxRate ? tier.maxRate : 0 + ' ETH'
      const mintedCappedCrowdsaleRateBlock = (
        <DisplayField side='left' title={RATE} value={tierRateStr} description={DESCRIPTION.RATE} />
      )
      const dutchAuctionCrowdsaleRateBlock = (
        <div className='hidden'>
          <DisplayField side='left' title={MIN_RATE} value={tierMinRateStr} description={DESCRIPTION.RATE} />
          <DisplayField side='right' title={MAX_RATE} value={tierMaxRateStr} description={DESCRIPTION.RATE} />
        </div>
      )
      const tierStartTimeStr = tier.startTime ? tier.startTime.split('T').join(' ') : ''
      const tierEndTimeStr = tier.endTime ? tier.endTime.split('T').join(' ') : ''
      const tierIsUpdatable = crowdsaleStore.isDutchAuction ? 'on' : tier.updatable ? tier.updatable : 'off'
      const tierIsWhitelisted = tier.whitelistEnabled ? tier.whitelistEnabled : 'off'
      const tierSupplyStr = tier.supply ? tier.supply : ''
      const hardCapSide = crowdsaleStore.isMintedCappedCrowdsale ? 'right' : crowdsaleStore.isDutchAuction ? 'left' : null
      return (
        <div key={index.toString()}>
          <div className="publish-title-container">
            <p className="publish-title" data-step="3">{tier.tier} Setup</p>
          </div>
          <div className='hidden'>
            <div className='hidden'>
              <DisplayField side='left' title={START_TIME} value={tierStartTimeStr} description={PUBLISH_DESCRIPTION.TIER_START_TIME} />
              <DisplayField side='right' title={END_TIME} value={tierEndTimeStr} description={PUBLISH_DESCRIPTION.TIER_END_TIME} />
            </div>
            <div className='hidden'>
              <DisplayField side='left' title={ENABLE_WHITELISTING} value={tierIsWhitelisted} description={PUBLISH_DESCRIPTION.ENABLE_WHITELISTING} />
              <DisplayField side='right' title={ALLOW_MODIFYING} value={tierIsUpdatable} description={DESCRIPTION.ALLOW_MODIFYING} />
            </div>
            {crowdsaleStore.isMintedCappedCrowdsale ? mintedCappedCrowdsaleRateBlock : crowdsaleStore.isDutchAuction ? dutchAuctionCrowdsaleRateBlock : null}
            <DisplayField side={hardCapSide} title={MAX_CAP} value={tierSupplyStr} description={PUBLISH_DESCRIPTION.HARD_CAP} />
          </div>
        </div>
      )
    })

    const modalContent = deploymentStore.invalidAccount ? (
      <div>
        This deploy was started with account <b>{deploymentStore.deployerAccount}</b> but the current account is <b>{this.context.selectedAccount}</b>.
        Please select the original account to continue with the deploy.
        If you don't want to continue with that deploy, <a href="#" onClick={this.cancelDeploy}>click here</a>.
      </div>
    ) : (
      <TxProgressStatus
        txMap={deploymentStore.txMap}
        deployCrowdsale={this.deployCrowdsale}
        onSkip={this.state.transactionFailed ? this.skipTransaction : null}
      />
    )

    let strategyName
    strategyName = crowdsaleStore.isMintedCappedCrowdsale ? CROWDSALE_STRATEGIES_DISPLAYNAMES.MINTED_CAPPED_CROWDSALE : crowdsaleStore.isDutchAuction ? CROWDSALE_STRATEGIES_DISPLAYNAMES.DUTCH_AUCTION : ""

    return (
      <section className="steps steps_publish">
        <StepNavigation activeStep={PUBLISH} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_publish"/>
            <p className="title">{PUBLISH}</p>
            <p className="description">
              On this step we provide you artifacts about your token and crowdsale contracts.
            </p>
          </div>
          <div className="hidden">
            <div className="item">
              <div className="publish-title-container">
                <p className="publish-title" data-step="1">{CROWDSALE_STRATEGY}</p>
              </div>
              <p className="label">{strategyName}</p>
              <p className="description">{CROWDSALE_STRATEGY}</p>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="2">{TOKEN_SETUP}</p>
            </div>
            {tokenSetup}
            <div className="publish-title-container">
              <p className="publish-title" data-step="3">{CROWDSALE_SETUP}</p>
            </div>
            {crowdsaleSetup}
            {tiersSetup}
          </div>
        </div>
        <div className="button-container">
          <div onClick={this.downloadContractButton} className="button button_fill_secondary">Download File</div>
          <a onClick={this.goToCrowdsalePage} className="button button_fill">Continue</a>
        </div>
        <ModalContainer
          title={'Tx Status'}
          showModal={this.state.modal}
        >
          { modalContent }
        </ModalContainer>
        { this.state.preventRefresh ? <PreventRefresh /> : null }
      </section>
    )}
}
