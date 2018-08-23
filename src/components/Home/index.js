import React, { Component } from 'react'
import '../../assets/stylesheets/application.css'
import CrowdsalesList from '../Common/CrowdsalesList'
import { Loader } from '../Common/Loader'
import { loadRegistryAddresses } from '../../utils/blockchainHelpers'
import { ModalContainer } from '../Common/ModalContainer'
import { toast } from '../../utils/utils'
import { TOAST, NAVIGATION_STEPS, DOWNLOAD_STATUS } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { checkWeb3, getNetworkVersion } from '../../utils/blockchainHelpers'
import { getCrowdsaleAssets } from '../../stores/utils'
import logdown from 'logdown'
import storage from 'store2'

const logger = logdown('TW:home')

const { CROWDSALE_STRATEGY, TOKEN_SETUP, CROWDSALE_SETUP, PUBLISH, CROWDSALE_PAGE } = NAVIGATION_STEPS

@inject(
  'web3Store',
  'generalStore',
  'contractStore',
  'crowdsaleStore',
  'gasPriceStore',
  'deploymentStore',
  'reservedTokenStore',
  'stepTwoValidationStore',
  'tierStore',
  'tokenStore'
)
@observer
export class Home extends Component {
  state = {
    showModal: false,
    loading: false
  }

  constructor(props) {
    super(props)

    let { contractStore } = this.props
    contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.PENDING)
  }

  async componentDidMount() {
    let { web3Store } = this.props
    await checkWeb3(web3Store.web3)
  }

  chooseContract = async () => {
    this.setState({
      loading: true
    })

    try {
      await loadRegistryAddresses()
      this.setState({
        loading: false,
        showModal: true
      })
    } catch (e) {
      logger.error('There was a problem loading the crowdsale addresses from the registry', e)
      this.setState({
        loading: false
      })
    }
  }

  goNextStep = async () => {
    // Clear local storage if there is no incomplete deployment, and reload
    if (storage.has('DeploymentStore') && storage.get('DeploymentStore').deploymentStep) {
      this.props.history.push('/')
    } else {
      this.clearStorage()
      await this.reloadStorage()
      this.props.history.push('1')
    }
  }

  async reloadStorage() {
    let { generalStore, contractStore } = this.props

    try {
      // General store, check network
      let networkID = await getNetworkVersion()
      generalStore.setProperty('networkID', networkID)

      // Contract store, get contract and abi
      await getCrowdsaleAssets(networkID)
      contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.SUCCESS)
    } catch (e) {
      logger.error('Error downloading contracts', e)
      toast.showToaster({
        type: TOAST.TYPE.ERROR,
        message:
          'The contracts could not be downloaded.Please try to refresh the page. If the problem persists, try again later.'
      })
      contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.FAILURE)
    }
  }

  clearStorage() {
    // Generate of stores to clear
    const toArray = ({
      generalStore,
      contractStore,
      crowdsaleStore,
      gasPriceStore,
      deploymentStore,
      reservedTokenStore,
      stepTwoValidationStore,
      tierStore,
      tokenStore
    }) => {
      return [
        generalStore,
        contractStore,
        crowdsaleStore,
        gasPriceStore,
        deploymentStore,
        reservedTokenStore,
        stepTwoValidationStore,
        tierStore,
        tokenStore
      ]
    }

    const storesToClear = toArray(this.props)
    for (let storeToClear of storesToClear) {
      if (typeof storeToClear.reset === 'function') {
        logger.log('Store to be cleared:', storeToClear.constructor.name)
        storeToClear.reset()
      }
    }
  }

  onClick = crowdsaleAddress => {
    this.props.history.push(`manage/${crowdsaleAddress}`)
  }

  hideModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Welcome to Token Wizard</h1>
              <p className="description">
                Token Wizard is a client side tool to create ERC20 token and crowdsale in five steps. It helps you to
                publish contracts on the Ethereum network, create a crowdsale page with stats. For participants, the
                wizard creates a page to contribute into the campaign.
                <br />Token Wizard is powered by <a href="https://github.com/auth-os/beta">Auth-os</a>.
              </p>
              <div className="buttons">
                <button onClick={() => this.goNextStep()} className="button button_fill button_no_border">
                  New crowdsale
                </button>
                <div onClick={() => this.chooseContract()} className="button button_outline">
                  Choose Crowdsale
                </div>
              </div>
            </div>
          </div>
          <div className="process">
            <div className="container">
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-contract" />
                <p className="title">{CROWDSALE_STRATEGY}</p>
                <p className="description">Select a strategy for crowdsale strategy</p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_token-setup" />
                <p className="title">{TOKEN_SETUP}</p>
                <p className="description">Setup token and reserved distribution</p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-setup" />
                <p className="title">{CROWDSALE_SETUP}</p>
                <p className="description">Setup tiers and crowdsale parameters</p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_publish" />
                <p className="title">{PUBLISH}</p>
                <p className="description">Get artifacts to interact with Auth-os framework</p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-page" />
                <p className="title">{CROWDSALE_PAGE}</p>
                <p className="description">Bookmark this page for the campaign statistics</p>
              </div>
            </div>
          </div>
          <ModalContainer
            title={'Crowdsale List'}
            description={`The list of your updatable crowdsales. Choose crowdsale address, click Continue and you'll be
           able to update the parameters of crowdsale.`}
            hideModal={this.hideModal}
            showModal={this.state.showModal}
          >
            <CrowdsalesList onClick={this.onClick} />
          </ModalContainer>
          <Loader show={this.state.loading} />
        </section>
      </div>
    )
  }
}
