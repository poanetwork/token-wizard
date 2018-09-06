import React, { Component } from 'react'
import CrowdsalesList from '../Common/CrowdsalesList'
import { Loader } from '../Common/Loader'
import { ModalContainer } from '../Common/ModalContainer'
import { clearStorage, toast } from '../../utils/utils'
import { DOWNLOAD_STATUS, TOAST } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { checkWeb3, getNetworkVersion, loadRegistryAddresses } from '../../utils/blockchainHelpers'
import { getCrowdsaleAssets } from '../../stores/utils'
import logdown from 'logdown'
import storage from 'store2'
import { LogoPrimary } from '../LogoPrimary/index'

const logger = logdown('TW:home')

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

    const { contractStore } = this.props
    contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.PENDING)
  }

  async componentDidMount() {
    const { web3Store } = this.props
    await checkWeb3(web3Store.web3)
  }

  chooseContract = async () => {
    this.setState({
      loading: true
    })

    try {
      clearStorage(this.props)
      await this.reloadStorage()
      await loadRegistryAddresses()
      this.setState({
        showModal: true
      })
    } catch (e) {
      logger.error('There was a problem loading the crowdsale addresses from the registry', e)
    }

    this.setState({
      loading: false
    })
  }

  navigateTo = (location, params = '') => {
    const path =
      {
        home: '/',
        stepOne: '1',
        manage: 'manage'
      }[location] || null

    if (path === null) {
      throw new Error(`invalid location specified: ${location}`)
    }

    this.props.history.push(`${path}${params}`)
  }

  goNextStep = async () => {
    // Clear local storage if there is no incomplete deployment, and reload
    if (storage.has('DeploymentStore') && storage.get('DeploymentStore').deploymentStep) {
      this.navigateTo('home')
    } else {
      clearStorage(this.props)
      await this.reloadStorage()
      this.navigateTo('stepOne')
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

  onClick = crowdsaleAddress => {
    this.props.history.push('/manage/' + crowdsaleAddress)
  }

  hideModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    return (
      <div>
        <section className={`hm-Home ${this.state.showModal ? 'background-blur' : ''}`}>
          <div className="hm-Home_Scroll">
            <div className="hm-Home_Top">
              <LogoPrimary />
            </div>
            <div className="hm-Home_MainInfoContainer">
              <div className="hm-Home_MainInfo">
                <div className="hm-Home_MainInfoTextContainer">
                  <h1 className="hm-Home_MainInfoTitle">Welcome to Token Wizard</h1>
                  <p className="hm-Home_MainInfoDescription">
                    Token Wizard is a client side tool to create ERC20 token and crowdsale in five steps. It helps you
                    to publish contracts on the Ethereum network, create a crowdsale page with stats. For participants,
                    the wizard creates a page to contribute into the campaign.
                  </p>
                  <p className="hm-Home_MainInfoPoweredBy">
                    Token Wizard is powered by <a href="https://github.com/auth-os/beta">Auth-os</a>.
                  </p>
                </div>
                <div className="hm-Home_MainInfoButtonContainer">
                  <button onClick={() => this.goNextStep()} className="hm-Home_BtnNew">
                    New crowdsale
                  </button>
                  <div onClick={() => this.chooseContract()} className="hm-Home_BtnChoose">
                    Choose Crowdsale
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ModalContainer
          title={'Crowdsale List'}
          description={`The list of your updatable crowdsales. Choose crowdsale address, click Continue and you'll be
        able to update the parameters of crowdsale.`}
          hideModal={this.hideModal}
          showModal={this.state.showModal}
          title={'Crowdsale List'}
        >
          <CrowdsalesList onClick={this.onClick} />
        </ModalContainer>
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
