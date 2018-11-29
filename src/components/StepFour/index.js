import React, { Component } from 'react'
import { buildDeploymentSteps, scrollToBottom, updateCrowdsaleContractInfo } from './utils'
import {
  deployHasEnded,
  noContractDataAlert,
  skippingTransaction,
  successfulDeployment,
  transactionLost
} from '../../utils/alerts'
import { CROWDSALE_STRATEGIES_DISPLAYNAMES, NAVIGATION_STEPS, TOAST } from '../../utils/constants'
import {
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
import { ConfigurationBlock } from './ConfigurationBlock'
import { CrowdsaleConfig } from '../Common/config'
import { CrowdsaleSetupBlockDutchAuction } from './CrowdsaleSetupBlockDutchAuction'
import { CrowdsaleSetupBlockWhitelistWithCap } from './CrowdsaleSetupBlockWhitelistWithCap'
import { DisplayTextArea } from '../Common/DisplayTextArea'
import { ModalContainer } from '../Common/ModalContainer'
import { SectionInfo } from '../Common/SectionInfo'
import { StepNavigation } from '../Common/StepNavigation'
import { TierSetupDutchAuction } from './TierSetupDutchAuction'
import { TierSetupWhitelistWithCap } from './TierSetupWhitelistWithCap'
import { BorderedSection } from './BorderedSection'
import { TokenSetupBlock } from './TokenSetupBlock'
import { TxProgressStatus } from '../Common/TxProgressStatus'
import { checkNetWorkByID, sendTXResponse } from '../../utils/blockchainHelpers'
import { inject, observer } from 'mobx-react'

const logger = logdown('TW:stepFour')
const { PUBLISH, CROWDSALE_STRATEGY, TOKEN_SETUP, CROWDSALE_SETUP } = NAVIGATION_STEPS
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

    logger.log('Component did mount')
    window.addEventListener('beforeunload', this.onUnload)

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

    cancelDeploy().then(
      cancelled => {
        if (!cancelled) {
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
    return <ConfigurationBlock store={this.props} />
  }

  onUnload = e => {
    logger.log('On unload')
    e.returnValue = 'Are you sure you want to leave?'
  }

  componentWillUnmount() {
    logger.log('Component unmount')
    window.removeEventListener('beforeunload', this.onUnload)
  }

  render() {
    const { tierStore, tokenStore, deploymentStore, crowdsaleStore, contractStore } = this.props
    const { isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore

    const tokenSetupBlock = () => {
      return <TokenSetupBlock tokenStore={tokenStore} />
    }

    const crowdsaleSetupBlock = () => {
      return isMintedCappedCrowdsale ? (
        <CrowdsaleSetupBlockWhitelistWithCap tierStore={tierStore} />
      ) : (
        <CrowdsaleSetupBlockDutchAuction tierStore={tierStore} />
      )
    }

    const tiersSetupBlock = () => {
      return tierStore.tiers.map((tier, index) => {
        const { tier: tierName } = tier
        const tiersSetupBlockContents = isMintedCappedCrowdsale ? (
          <TierSetupWhitelistWithCap tier={tier} />
        ) : (
          <TierSetupDutchAuction tier={tier} />
        )

        return (
          <BorderedSection
            contents={tiersSetupBlockContents}
            dataStep="4"
            key={index.toString()}
            title={`${tierName} Setup`}
          />
        )
      })
    }

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
        onRetry={this.state.allowRetry ? this.retryTransaction : null}
        onSkip={this.state.transactionFailed ? this.skipTransaction : null}
        txMap={deploymentStore.txMap}
      />
    )
    const strategyName = isMintedCappedCrowdsale ? MINTED_CAPPED_CROWDSALE_DN : isDutchAuction ? DUTCH_AUCTION_DN : ''
    const { abiEncoded } = contractStore[crowdsaleStore.proxyName]
    const ABIEncodedParameters = abiEncoded ? (
      <DisplayTextArea title="Crowdsale Proxy Contract ABI-encoded parameters" value={abiEncoded} />
    ) : null
    const backgroundBlur = this.state.modal ? 'background-blur' : ''

    return (
      <div>
        <section className={`lo-MenuBarAndContent ${backgroundBlur}`} ref="four">
          <StepNavigation activeStepTitle={PUBLISH} />
          <div className="st-StepContent">
            <SectionInfo
              description="On this step we provide you artifacts about your token and crowdsale contracts."
              stepNumber="4"
              title={PUBLISH}
            />
            <div className="sw-BorderedBlock">
              <BorderedSection dataStep="1" title={CROWDSALE_STRATEGY} text={strategyName} />
              <BorderedSection dataStep="2" title={TOKEN_SETUP} contents={tokenSetupBlock()} />
              <BorderedSection dataStep="3" title={CROWDSALE_SETUP} contents={crowdsaleSetupBlock()} />
              {tiersSetupBlock()}
              <BorderedSection dataStep="5" title="Configuration" contents={this.configurationBlock()} />
              <BorderedSection dataStep="6" contents={this.renderContractSource('src')} />
              {abiEncoded ? <BorderedSection dataStep="7" contents={ABIEncodedParameters} /> : null}
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
        </section>
        <ModalContainer title={'Tx Status'} showModal={this.state.modal}>
          {modalContent}
        </ModalContainer>
      </div>
    )
  }
}
