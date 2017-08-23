import React from 'react'
import '../assets/stylesheets/application.css';
import { deployContract, getWeb3, getNetworkVersion } from '../utils/web3'
import { noMetaMaskAlert } from '../utils/alerts'
import { defaultState } from '../utils/constants'
import { getOldState } from '../utils/utils'
import { getEncodedABI } from '../utils/microservices'
import { stepTwo } from './stepTwo'
import { StepNavigation } from './Common/StepNavigation'
import { DisplayField } from './Common/DisplayField'
import { NAVIGATION_STEPS } from '../utils/constants'
const { PUBLISH } = NAVIGATION_STEPS

export class stepFour extends stepTwo {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
    console.log('oldState oldState oldState', oldState)
  }

  componentDidMount() {
    let abiToken = this.state.contracts && this.state.contracts.token && this.state.contracts.token.abi || []
    let abiPricingStrategy = this.state.contracts && this.state.contracts.pricingStrategy && this.state.contracts.pricingStrategy.abi || []
    
    let $this = this;
    let state = { ...this.state }
    setTimeout(function() {
       getWeb3((web3) => {
        state.web3 = web3;
        $this.setState(state);
        getEncodedABI(abiToken, "token", state, $this);
        getEncodedABI(abiPricingStrategy, "pricingStrategy", state, $this);

        $this.deployToken();
      });
    });
  }

  handleDeployedToken = (err, tokenAddr) => {
    if (err) return console.log(err);
    let newState = { ...this.state }
    newState.contracts.token.addr = tokenAddr;
    this.deployPricingStrategy();
  }

  handleDeployedPricingStrategy = (err, pricingStrategyAddr) => {
    if (err) return console.log(err);
    let newState = { ...this.state }
    newState.contracts.pricingStrategy.addr = pricingStrategyAddr;
    let abiCrowdsale = this.state.contracts && this.state.contracts.crowdsale && this.state.contracts.crowdsale.abi || []
    getEncodedABI(abiCrowdsale, "crowdsale", newState, this);
  }

  handleDeployedContract = (err, crowdsaleAddr) => {
    if (err) return console.log(err);
    let newState = { ...this.state }
    newState.contracts.crowdsale.addr = crowdsaleAddr;
    this.setState(newState);
    let crowdsalePage = "/crowdsale";
    const {contracts} = this.state
    const isValidContract = contracts && contracts.crowdsale && contracts.crowdsale.addr
    let newHistory = isValidContract ? crowdsalePage + `?addr=` + contracts.crowdsale.addr + `&networkID=` + contracts.crowdsale.networkID : crowdsalePage
    this.props.history.push(newHistory);
  }

  /*getCrowdSaleParams = (web3, crowdsale) => {
    return [
      parseInt(crowdsale.startBlock, 10), 
      parseInt(crowdsale.endBlock, 10), 
      web3.toWei(pricingStrategy.rate, "ether"), 
      crowdsale.walletAddress,
      parseInt(this.state.crowdsale.supply, 10),
      this.state.token.name,
      this.state.token.ticker,
      parseInt(this.state.token.decimals, 10),
      parseInt(this.state.token.supply, 10)
    ]
  }*/

  getTokenParams = (web3, token) => {
    console.log(token);
    return [
      token.name,
      token.ticker,
      parseInt(token.supply, 10),
      parseInt(token.decimals, 10),
      true
    ]
  }

  getPricingStrategyParams = (web3, pricingStrategy) => {
    console.log(pricingStrategy);
    return [
      web3.toWei(pricingStrategy.rate, "ether")
    ]
  }

  //EthTranchePricing
  /*getPricingStrategyParams = (web3, pricingStrategy) => {
    console.log(pricingStrategy);
    return [
      pricingStrategy.tranches
    ]
  }*/

  getCrowdSaleParams = (web3) => {
    return [
      this.state.contracts.token.addr,
      this.state.contracts.pricingStrategy.addr,
      "0xf4c5feeee6482379ad511bcdfb62e287aadc5c48",
      parseInt(Date.parse(this.state.crowdsale.startTime)/1000, 10), 
      parseInt(Date.parse(this.state.crowdsale.endTime)/1000, 10), 
      parseInt(this.state.token.supply, 10)
    ]
  }

  deployCrowdsale = () => {
    console.log("***Deploy crowdsale contract***");
    getWeb3((web3) => {
      getNetworkVersion(web3, (_networkID) => {
        if (web3.eth.accounts.length === 0) {
          return noMetaMaskAlert();
        }
        let newState = { ...this.state }
        newState.contracts.crowdsale.networkID = _networkID;
        this.setState(newState);
        var contracts = this.state.contracts;
        var binCrowdsale = contracts && contracts.crowdsale && contracts.crowdsale.bin || ''
        var abiCrowdsale = contracts && contracts.crowdsale && contracts.crowdsale.abi || []
        var paramsCrowdsale = this.getCrowdSaleParams(web3, this.state)
        console.log(paramsCrowdsale);
        deployContract(web3, abiCrowdsale, binCrowdsale, paramsCrowdsale, this.handleDeployedContract)
       });
    });
  }

  deployToken = () => {
    console.log("***Deploy token contract***");
    getNetworkVersion(this.state.web3, (_networkID) => {
      if (this.state.web3.eth.accounts.length === 0) {
        return noMetaMaskAlert();
      }
      let newState = { ...this.state }
      newState.contracts.crowdsale.networkID = _networkID;
      this.setState(newState);
      var contracts = this.state.contracts;
      var binToken = contracts && contracts.token && contracts.token.bin || ''
      var abiToken = contracts && contracts.token && contracts.token.abi || []
      var token = this.state.token;
      var paramsToken = this.getTokenParams(this.state.web3, token)
      console.log(paramsToken);
      deployContract(this.state.web3, abiToken, binToken, paramsToken, this.handleDeployedToken)
     });
  }

  deployPricingStrategy = () => {
    console.log("***Deploy pricing strategy contract***");
    getNetworkVersion(this.state.web3, (_networkID) => {
      if (this.state.web3.eth.accounts.length === 0) {
        return noMetaMaskAlert();
      }
      let newState = { ...this.state }
      newState.contracts.crowdsale.networkID = _networkID;
      this.setState(newState);
      var contracts = this.state.contracts;
      var binPricingStrategy = contracts && contracts.pricingStrategy && contracts.pricingStrategy.bin || ''
      var abiPricingStrategy = contracts && contracts.pricingStrategy && contracts.pricingStrategy.abi || []
      var pricingStrategy = this.state.pricingStrategy;
      var paramsPricingStrategy = this.getPricingStrategyParams(this.state.web3, pricingStrategy)
      console.log(paramsPricingStrategy);
      deployContract(this.state.web3, abiPricingStrategy, binPricingStrategy, paramsPricingStrategy, this.handleDeployedPricingStrategy)
     });
  }

  render() {
    return (
      <section className="steps steps_publish">
        <StepNavigation activeStep={PUBLISH} />
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
              <DisplayField side='left' title={'Name'} value={this.state.token.name?this.state.token.name:"Token Name"}/>
              <DisplayField side='right' title={'Ticker'} value={this.state.token.ticker?this.state.token.ticker:"Ticker"}/>
              <DisplayField side='left' title={'SUPPLY'} value={this.state.token.supply?this.state.token.supply:100}/>
              <DisplayField side='right' title={'DECIMALS'} value={this.state.token.decimals?this.state.token.decimals:485}/>
            </div>
            <div className="publish-title-container">
              <p className="publish-title" data-step="3">Crowdsale Setup</p>
            </div>
            <div className="hidden">
              <DisplayField side='left' title={'Start time'} value={this.state.crowdsale.startTime?this.state.crowdsale.startTime.split("T").join(" "):""}/>
              <DisplayField side='right' title={'End time'} value={this.state.crowdsale.endTime?this.state.crowdsale.endTime.split("T").join(" "):""}/>
              <DisplayField side='left' title={'Wallet address'} value={this.state.crowdsale.walletAddress?this.state.crowdsale.walletAddress:"0xc1253365dADE090649147Db89EE781d10f2b972f"}/>
              <DisplayField side='right' title={'RATE'} value={this.state.pricingStrategy.rate?this.state.pricingStrategy.rate:1 + " ETH"}/>
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
                {this.state.contracts?this.state.contracts.crowdsale?this.state.contracts.crowdsale.abiConstructor:"":""}
              </pre>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
        <div className="button-container">
          {/*<Link to='/5' onClick={this.deployCrowdsale}><a href="#" className="button button_fill">Continue</a></Link>*/}
          <a onClick={this.deployCrowdsale} className="button button_fill">Continue</a>
        </div>
      </section>
    )}
}