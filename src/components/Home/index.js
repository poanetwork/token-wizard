import React, { Component } from 'react';
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import CrowdsalesList from '../Common/CrowdsalesList'
import { Loader } from '../Common/Loader'
import { loadRegistryAddresses } from '../../utils/blockchainHelpers'

export class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false,
      loading: false
    }
  }

  chooseContract = () => {
    this.setState({
      loading: true
    })

    loadRegistryAddresses()
      .then(() => {
        this.setState({
          loading: false,
          showModal: true
        })
      }, (e) => {
        console.error('There was a problem loading the crowdsale addresses from the registry', e)
        this.setState({
          loading: false
        })
      })
  }

  onClick = crowdsaleAddress => {
    this.props.history.push('/manage/' + crowdsaleAddress)
  }

  renderModal = () => {
    return (
      <div className="crowdsale-modal loading-container">
        <div className='modal'>
          <p className='title'>Crowdsales List</p>
          <p className='description'>The list of your updatable crowdsales. Choose crowdsale address, click Continue and
            you'll be able to update the parameters of crowdsale.</p>
          <CrowdsalesList onClick={this.onClick}/>
          <div className='close-button' onClick={() => this.hideModal()}><i className="icon"/></div>
        </div>
      </div>
    )
  }

  hideModal = () => {
    this.setState({ showModal: false })
  }

  render () {
    const chooseContractModal = this.state.showModal
      ? this.renderModal()
      : null

    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Welcome to ICO Wizard</h1>
              <p className="description">
              ICO Wizard is a client side tool to create token and crowdsale contracts in five steps. It helps you to publish contracts on the Ethereum network, verify them in Etherscan, create a crowdsale page with stats. For participants, the wizard creates a page to invest into the campaign.
              <br/>Smart contracts based on <a href="https://github.com/TokenMarketNet/ico">TokenMarket</a> contracts.
              </p>
              <div className="buttons">
                <Link to='/1'><span className="button button_fill">New crowdsale</span></Link>
                <div onClick={() => this.chooseContract()} className="button button_outline">Choose Contract</div>
              </div>
            </div>
          </div>
          <div className="process">
            <div className="container">
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-contract"></div>
                <p className="title">Crowdsale Contract</p>
                <p className="description">
                  Select a strategy for crowdsale contract
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_token-setup"></div>
                <p className="title">Token Setup</p>
                <p className="description">
                  Setup token and reserved distribution
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-setup"></div>
                <p className="title">Crowdsale Setup</p>
                <p className="description">
                  Setup tiers and crowdsale parameters
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_publish"></div>
                <p className="title">Publish</p>
                <p className="description">
                  Get generated code and artifacts for verification in Etherscan
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-page"></div>
                <p className="title">Crowdsale Page</p>
                <p className="description">
                  Bookmark this page for the campaign statistics
                </p>
              </div>
            </div>
          </div>
          {chooseContractModal}
          <Loader show={this.state.loading}></Loader>
        </section>
      </div>
    );
  }
}
