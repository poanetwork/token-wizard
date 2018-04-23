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
  setupContractDeployment
} from './utils'
import { noContractDataAlert, successfulDeployment, skippingTransaction } from '../../utils/alerts'
import {
  DESCRIPTION,
  DOWNLOAD_TYPE,
  FILE_CONTENTS,
  NAVIGATION_STEPS,
  TOAST
} from '../../utils/constants'
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

const { PUBLISH } = NAVIGATION_STEPS

@inject('contractStore', 'reservedTokenStore', 'tierStore', 'tokenStore', 'web3Store', 'deploymentStore')
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
      case 'tierStore':
        index = 'walletAddress' === content.field ? 0 : index
        return handlerForFile(content, this.props[parent].tiers[index])
      case 'tokenStore':
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
    const zip = new JSZip()
    const { files } = FILE_CONTENTS
    //const tiersCount = isObservableArray(this.props.tierStore.tiers) ? this.props.tierStore.tiers.length : 1
    const contractsKeys = files.order;
    const orderNumber = order => order.toString().padStart(3, '0');
    let prefix = 1

    contractsKeys.forEach(key => {
      if (this.props.contractStore.hasOwnProperty(key)) {
        console.log(files[key])
        console.log(this.props.contractStore[key])
        const { txt, name } = files[key]
        const { abiConstructor } = this.props.contractStore[key]
        let tiersCountPerContract = isObservableArray(abiConstructor) ? abiConstructor.length : 1

        for (let tier = 0; tier < tiersCountPerContract; tier++) {
          const suffix = tiersCountPerContract > 1 ? `_${tier + 1}` : ''
          const txtFilename = `${orderNumber(prefix++)}_${name}${suffix}`
          const tierNumber = tier
          const commonHeader = FILE_CONTENTS.common.map(content => this.handleContentByParent(content, tierNumber))

          zip.file(
            `${txtFilename}.txt`,
            commonHeader.concat(txt.map(content => this.handleContentByParent(content, tierNumber))).join('\n\n')
          )
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
    const { tierStore, tokenStore, deploymentStore } = this.props
    const crowdsaleSetups = tierStore.tiers.map((tier, index) => {
      return (
        <div key={index.toString()}>
          <div className="publish-title-container">
            <p className="publish-title" data-step={3 + index}>Crowdsale Setup {tier.tier}</p>
          </div>
          <div className="hidden">
            <div className="hidden">
              <DisplayField
                side='left'
                title={'Start time'}
                value={tier.startTime ? tier.startTime.split('T').join(' ') : ''}
                description="Date and time when the tier starts."
              />
              <DisplayField
                side='right'
                title={'End time'}
                value={tier.endTime ? tier.endTime.split('T').join(' ') : ''}
                description="Date and time when the tier ends."
              />
            </div>
            <div className="hidden">
              <DisplayField
                side='left'
                title={'Wallet address'}
                value={tierStore.tiers[0].walletAddress}
                description="Where the money goes after investors transactions."
              />
              <DisplayField
                side='right'
                title={'RATE'}
                value={tier.rate ? tier.rate : 0 + ' ETH'}
                description={DESCRIPTION.RATE}
              />
            </div>
            <DisplayField
              side='left'
              title={'Max cap'}
              value={tier.supply ? tier.supply : ''}
              description="How many tokens will be sold on this tier."
            />
            <DisplayField
              side='right'
              title={'Allow modifying'}
              value={tier.updatable ? tier.updatable : 'off'}
              description={DESCRIPTION.ALLOW_MODIFYING}
            />
          </div>
        </div>
      )
    })
    /*const ABIEncodedOutputsCrowdsale = tierStore.tiers.map((tier, index) => {
      return (
        <DisplayTextArea
          key={index.toString()}
          label={'Constructor Arguments for ' + (tier.tier ? tier.tier : 'contract') + ' (ABI-encoded and appended to the ByteCode above)'}
          value={contractStore ? contractStore.crowdsale ? contractStore.crowdsale.abiConstructor ? contractStore.crowdsale.abiConstructor[index] : '' : '' : ''}
          description="Encoded ABI"
        />
      )
    })*/
    const globalLimitsBlock = (
      <div>
        <div className="publish-title-container">
          <p className="publish-title" data-step={2 + tierStore.tiers.length + 2}>Global Limits</p>
        </div>
        <div className="hidden">
          <DisplayField
            side='left'
            title='Min Cap'
            value={tierStore.globalMinCap}
            description="Min Cap for all investors"
          />
        </div>
      </div>
    )
    /*const tokenBlock = (
      <div>
        <DisplayTextArea
          label={'Token Contract Source Code'}
          value={contractStore ? contractStore.token ? contractStore.token.src : '' : ''}
          description="Token Contract Source Code"
        />
        <DisplayTextArea
          label={'Token Contract ABI'}
          value={contractStore ? contractStore.token ? JSON.stringify(contractStore.token.abi) : '' : ''}
          description="Token Contract ABI"
        />
        <DisplayTextArea
          label={'Token Constructor Arguments (ABI-encoded and appended to the ByteCode above)'}
          value={contractStore ? contractStore.token ? contractStore.token.abiConstructor ? contractStore.token.abiConstructor : '' : '' : ''}
          description="Token Constructor Arguments"
        />
      </div>
    )*/

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

    return (
      <section className="steps steps_publish">
        <StepNavigation activeStep={PUBLISH} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_publish"/>
            <p className="title">Publish</p>
            <p className="description">
              On this step we provide you artifacts about your token and crowdsale contracts.
            </p>
          </div>
          <div className="hidden">
            <div className="item">
              <div className="publish-title-container">
                <p className="publish-title" data-step="1">Crowdsale Contract</p>
              </div>
              <p className="label">Whitelist with cap</p>
              <p className="description">Crowdsale Contract</p>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="2">Token Setup</p>
            </div>
            <div className="hidden">
              <div className="hidden">
                <DisplayField
                  side='left'
                  title='Name'
                  value={tokenStore.name ? tokenStore.name : ""}
                  description="The name of your token. Will be used by Etherscan and other token browsers."
                />
                <DisplayField
                  side='right'
                  title='Ticker'
                  value={tokenStore.ticker ? tokenStore.ticker : ""}
                  description={DESCRIPTION.TOKEN_TICKER}
                />
              </div>
              <div className="hidden">
                <DisplayField
                  side='left'
                  title='DECIMALS'
                  value={tokenStore.decimals ? tokenStore.decimals.toString() : ""}
                  description="The decimals of your token."
                />
              </div>
            </div>
            {crowdsaleSetups}
            {/*<div className="publish-title-container">
              <p className="publish-title" data-step={2 + tierStore.tiers.length + 1}>Crowdsale Setup</p>
            </div>
            <div className="hidden">
              <DisplayField
                side='left'
                title='Compiler Version'
                value={'0.4.11'}
                description="Compiler Version"
              />
              <DisplayField
                side='right'
                title='Contract name'
                value={'MintedTokenCappedCrowdsaleExt'}
                description="Crowdsale contract name"
              />
              <DisplayField
                side='left'
                title='Optimized'
                value={true.toString()}
                description="Optimization in compiling"
              />
            </div>*/}
            {tierStore.tiers[0].whitelistEnabled !== "yes"
              ? globalLimitsBlock
              : null
            }
            {/*{tokenBlock}
            <DisplayTextArea
              label={"Crowdsale Contract Source Code"}
              value={contractStore ? contractStore.crowdsale ? contractStore.crowdsale.src : "" : ""}
              description="Crowdsale Contract Source Code"
            />
            <DisplayTextArea
              label={"Crowdsale Contract ABI"}
              value={contractStore ? contractStore.crowdsale ? JSON.stringify(contractStore.crowdsale.abi) : "" : ""}
              description="Crowdsale Contract ABI"
            />
            {ABIEncodedOutputsCrowdsale}*/}
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
