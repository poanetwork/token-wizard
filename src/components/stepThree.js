import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3 } from './web3'

export class stepThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = props?props.location?props.location.query?props.location.query.state?props.location.query.state:{}:{}:{}:{};
    this.changeState = props?props.location?props.location.query?props.location.query.changeState?this.props.location.query.changeState:{}:{}:{}:{};
    if (this.changeState.bind) this.changeState = this.changeState.bind(this);

    this.state.crowdsale = {};
    this.state.crowdsale.startBlock = 4500000;
    this.state.crowdsale.endBlock = 8000000;
    this.state.crowdsale.rate = 1;
  }

  componentWillMount () {
    var $this = this;
    getWeb3(function(web3, isOraclesNetwork) {
      console.log(web3.eth.defaultAccount);
      var state = $this.state;
      state.crowdsale.walletAddress = web3.eth.defaultAccount;
      $this.setState(state);
    });
  }

  render() {
    return (
      <section className="steps steps_crowdsale-contract" ref="three">
        <div className="steps-navigation">
          <div className="container">
            <div className="step-navigation">Crowdsale Contract</div>
            <div className="step-navigation">Token Setup</div>
            <div className="step-navigation step-navigation_active">Crowdsale Setup</div>
            <div className="step-navigation">Publish</div>
            <div className="step-navigation">Crowdsale Page</div>
          </div>
        </div>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-setup"></div>
            <p className="title">Crowdsale setup</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <div className="left">
              <label for="" className="label">Start block</label>
              <input type="text" className="input" value={this.state.crowdsale.startBlock} onChange={(e) => this.changeState(e, "crowdsale", "startBlock", "three")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label for="" className="label">End block</label>
              <input type="text" className="input" value={this.state.crowdsale.endBlock} onChange={(e) => this.changeState(e, "crowdsale", "endBlock", "three")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="left">
              <label for="" className="label">Wallet address</label>
              <input type="text" className="input" value={this.state.crowdsale.walletAddress} onChange={(e) => this.changeState(e, "crowdsale", "walletAddress", "three")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label for="" className="label">Supply</label>
              <input type="text" className="input" value={this.state.crowdsale.supply} onChange={(e) => this.changeState(e, "crowdsale", "supply")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="left">
              <label for="" className="label">Rate</label>
              <input type="text" className="input" value={this.state.crowdsale.rate} onChange={(e) => this.changeState(e, "crowdsale", "rate")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
          </div>
        </div>
        <div className="button-container">
          <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a href="#" className="button button_fill">Continue</a></Link>
        </div>
      </section>
    )}
}