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
    if (!this.state.token) this.state.token = {};
    if (!this.state.crowdsale) this.state.crowdsale = {};
    this.state.redirect = false;
    console.log(this.state);
  }

  deployCrowdsale() {
    var $this = this;
    getWeb3(function(web3, isOraclesNetwork) {
      console.log(web3);
      console.log(isOraclesNetwork);
      var contracts = $this.state.contracts;
      var source = contracts?contracts.crowdsale?contracts.crowdsale.src:"":"";
      var binCrowdsale = contracts?contracts.crowdsale?contracts.crowdsale.bin:"":"";
      var abiCrowdsale = contracts?contracts.crowdsale?contracts.crowdsale.abi:[]:[];
      var binToken = contracts?contracts.token?contracts.token.bin:"":"";
      var abiToken = contracts?contracts.token?contracts.token.abi:[]:[];

      var crowdsale = $this.state.crowdsale;
      var paramsCrowdsale = [
        crowdsale.startBlock, 
        crowdsale.endBlock, 
        web3.toWei(crowdsale.rate, "ether"), 
        crowdsale.walletAddress,
        parseInt($this.state.crowdsale.supply),
        $this.state.token.name,
        $this.state.token.ticker,
        parseInt($this.state.token.decimals),
        parseInt($this.state.token.supply)
      ];
      deployContract(web3, abiCrowdsale, binCrowdsale, paramsCrowdsale, function(err, crowdsaleAddr) {
        console.log(crowdsaleAddr);
        if (err) return console.log(err);

        let state = $this.state;
        state.contracts.crowdsale.addr = crowdsaleAddr;

        var token = $this.state.token;
        var paramsToken = [token.name, token.ticker, token.decimals];

        $this.setState(state);

        if (contracts) {
          if (contracts.crowdsale) {
            if (contracts.crowdsale.addr) $this.props.history.push(`/5?addr=` + contracts.crowdsale.addr);
            else $this.props.history.push(`/5`);
          }
          else $this.props.history.push(`/5`);
        }
        else $this.props.history.push(`/5`);
        
        //state.redirect = true;
        /*deployContract(web3, abiToken, binToken, paramsToken, function(err, tokenAddr) {
          console.log(tokenAddr);
          if (err) return console.log(err);

          let state = $this.state;
          state.contracts.token.addr = tokenAddr;
          state.redirect = true;
          $this.setState(state);
        });*/
      });
    });
  }

  render() {
    /*if (this.state.redirect) {
      {return <Redirect push to={{ pathname: '/5?crowdsale=' + this.state.contracts.crowdsale.addr, query: { state: this.state, changeState: this.changeState } }} />;}
    }*/
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
                <p className="value">{this.state.token.name?this.state.token.name:"Token Name"}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">Ticker</p>
                <p className="value">{this.state.token.ticker?this.state.token.ticker:"Ticker"}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="left">
                <p className="label">SUPPLY</p>
                <p className="value">{this.state.token.supply?this.state.token.supply:100}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">DECIMALS</p>
                <p className="value">{this.state.token.decimals?this.state.token.decimals:485}</p>
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
                <p className="value">{this.state.crowdsale.startBlock?this.state.crowdsale.startBlock:4500000}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">End block</p>
                <p className="value">{this.state.crowdsale.endBlock?this.state.crowdsale.endBlock:8000000}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="left">
                <p className="label">Wallet address</p>
                <p className="value">{this.state.crowdsale.walletAddress?this.state.crowdsale.walletAddress:"0xc1253365dADE090649147Db89EE781d10f2b972f"}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">RATE</p>
                <p className="value">{this.state.crowdsale.rate?this.state.crowdsale.rate:1} ETH</p>
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
                {this.state.contracts?this.state.contracts.crowdsale?JSON.stringify(this.state.contracts.crowdsale.abi):"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="item">
              <p className="label">Constructor Arguments (ABI-encoded and appended to the ByteCode above)</p>
              <pre>
    {`[{"constant":true,"inputs":[],"name":"endBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},
    {"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],
    "name":"startBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":
    "wallet","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"}]`}
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