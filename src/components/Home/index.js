import React, { Component } from 'react';
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { defaultState } from '../../utils/constants'

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState
  }

  render() {
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
                <Link to={{ pathname: '/1', query: { state: this.state } }}><a className="button button_fill">New crowdsale</a></Link>
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
        </section>
      </div>
    );
  }
}