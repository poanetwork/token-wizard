import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
import { LogoPrimary } from '../LogoPrimary/index'

const logger = logdown('TW:home')

const { CROWDSALE_STRATEGY, TOKEN_SETUP, CROWDSALE_SETUP, PUBLISH, CROWDSALE_PAGE } = NAVIGATION_STEPS

@inject('web3Store', 'generalStore', 'contractStore')
@observer
export class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      loading: false
    }

    let { contractStore } = this.props
    contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.PENDING)
  }

  componentDidMount() {
    let { generalStore, web3Store, contractStore } = this.props
    checkWeb3(web3Store.web3)

    getNetworkVersion()
      .then(networkID => {
        generalStore.setProperty('networkID', networkID)
        getCrowdsaleAssets(networkID)
      })
      .then(
        () => {
          contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.SUCCESS)
        },
        e => {
          logger.error('Error downloading contracts', e)
          toast.showToaster({
            type: TOAST.TYPE.ERROR,
            message:
              'The contracts could not be downloaded.Please try to refresh the page. If the problem persists, try again later.'
          })

          contractStore.setProperty('downloadStatus', DOWNLOAD_STATUS.FAILURE)
        }
      )
  }

  chooseContract = () => {
    this.setState({
      loading: true
    })

    loadRegistryAddresses().then(
      () => {
        this.setState({
          loading: false,
          showModal: true
        })
      },
      e => {
        logger.error('There was a problem loading the crowdsale addresses from the registry', e)
        this.setState({
          loading: false
        })
      }
    )
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
        <section className="hm-Home">
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
                  <Link className="hm-Home_BtnNew" to="/1">
                    New crowdsale
                  </Link>
                  <div onClick={() => this.chooseContract()} className="hm-Home_BtnChoose">
                    Choose Crowdsale
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <ModalContainer
          title={'Crowdsale List'}
          description={`The list of your updatable crowdsales. Choose crowdsale address, click Continue and you'll be
        able to update the parameters of crowdsale.`}
          // hideModal={this.hideModal}
          // showModal={this.state.showModal}
          showModal={true}
        >
          <CrowdsalesList onClick={this.onClick} />
        </ModalContainer> */}
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
