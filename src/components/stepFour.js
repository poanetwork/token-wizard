import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router';
import { deployContract, getWeb3 } from './web3'

export class stepFour extends React.Component {
  constructor(props) {
    super(props);
    this.state = props?props.location?props.location.query?props.location.query.state?props.location.query.state:{}:{}:{}:{};
    this.changeState = props?props.location?props.location.query?props.location.query.changeState?this.props.location.query.changeState:{}:{}:{}:{};
    if (this.changeState.bind)
      this.changeState = this.changeState.bind(this);
    if (this.deployCrowdsale.bind)
      this.deployCrowdsale = this.deployCrowdsale.bind(this);
  }

  deployCrowdsale() {
    var $this = this;
    getWeb3(function(web3, isOraclesNetwork) {
      console.log(web3);
      console.log(isOraclesNetwork);
      var source = $this.state.contracts?$this.state.contracts.crowdsale?$this.state.contracts.crowdsale.src:"":"";
      var bin = $this.state.contracts?$this.state.contracts.crowdsale?$this.state.contracts.crowdsale.bin:"":"";
      var abi = $this.state.contracts?$this.state.contracts.crowdsale?JSON.parse($this.state.contracts.crowdsale.abi):[]:[];
      deployContract(web3, abi, bin, function(err, addr) {
        if (err) console.log(err);
        var state = $this.state;
        state.contracts.crowdsale.addr = addr;
        state.redirect = true;
        $this.setState(state);
      });
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={{ pathname: '/5', query: { state: this.state, changeState: this.changeState } }} />;
    }
    return (
  	  <section className="steps steps_publish">
        <div className="steps-navigation">
          <div className="container">
            <div className="step-navigation">Crowdsale Contract</div>
            <div className="step-navigation">Token Setup</div>
            <div className="step-navigation">Crowdsale Setup</div>
            <div className="step-navigation step-navigation_active">Publish</div>
            <div className="step-navigation">Crowdsale Page</div>
          </div>
        </div>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_publish"></div>
            <p className="title">Publish</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <div className="item">
              <div className="publish-title-container">
                <p className="publish-title" data-step="1">Crowdsale Contract</p>
              </div>
              <p className="label">Standard</p>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="2">Token Setup</p>
            </div>
            <div className="hidden">
              <div className="left">
                <p className="label">Name</p>
                <p className="value">{this.state.name?this.state.name:"Token Name"}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">Ticker</p>
                <p className="value">{this.state.ticker?this.state.ticker:"Ticker"}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="left">
                <p className="label">SUPPLY</p>
                <p className="value">{this.state.supply?this.state.supply:100}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">DECIMALS</p>
                <p className="value">{this.state.decimals?this.state.decimals:485}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="3">Crowdsale Setup</p>
            </div>
            <div className="hidden">
              <div className="left">
                <p className="label">Start block</p>
                <p className="value">{this.state.startBlock?this.state.startBlock:4500000}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">End block</p>
                <p className="value">{this.state.endBlock?this.state.endBlock:8000000}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="left">
                <p className="label">Wallet address</p>
                <p className="value">{this.state.walletAddress?this.state.walletAddress:"0xc1253365dADE090649147Db89EE781d10f2b972f"}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">RATE</p>
                <p className="value">{this.state.rate?this.state.rate:1} ETH</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="4">Crowdsale Setup</p>
            </div>
            <div className="item">
              <p className="label">Compiler Version</p>
              <p className="value">0.4.14</p>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Contract Source Code</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.src:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Contract ABI</p>
              <pre>
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.abi:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Constructor Arguments (ABI-encoded and appended to the ByteCode above)</p>
              <pre>
    {`[{"constant":true,"inputs":[],"name":"endBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},
    {"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,
    "inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],
    "name":"startBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":
    "wallet","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary",
    "type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"hasEnded",
    "outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":`}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
        <div className="button-container">
          {/*<Link to='/5' onClick={this.deployCrowdsale}><a href="#" className="button button_fill">Continue</a></Link>*/}
          <a href="#" onClick={this.deployCrowdsale} className="button button_fill">Continue</a>
        </div>
      </section>
    )}
}