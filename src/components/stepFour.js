import React from 'react'
import '../assets/stylesheets/application.css';
import { deployContract, getWeb3, getNetworkVersion } from '../utils/web3'
import { noMetaMaskAlert } from '../utils/alerts'
import { defaultState } from '../utils/constants'
import { getOldState } from '../utils/utils'
import { getEncodedABI } from '../utils/microservices'
import { stepTwo } from './stepTwo'
import { StepNavigation } from './Common/StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'

const { PUBLISH } = NAVIGATION_STEPS

export class stepFour extends stepTwo {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
  }

  componentDidMount() {
    let abiCrowdsale = this.state.contracts && this.state.contracts.crowdsale && this.state.contracts.crowdsale.abi || []
    let $this = this;
    let state = { ...this.state }
    setTimeout(function() {
       getWeb3((web3) => {
         getEncodedABI(abiCrowdsale, state, $this);
      });
    });
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

  getCrowdSaleParams = (web3, crowdsale) => {
    return [
      parseInt(crowdsale.startBlock, 10), 
      parseInt(crowdsale.endBlock, 10), 
      web3.toWei(crowdsale.rate, "ether"), 
      crowdsale.walletAddress,
      parseInt(this.state.crowdsale.supply, 10),
      this.state.token.name,
      this.state.token.ticker,
      parseInt(this.state.token.decimals, 10),
      parseInt(this.state.token.supply, 10)
    ]
  }

  deployCrowdsale = () => {
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
        var crowdsale = this.state.crowdsale;
        var paramsCrowdsale = this.getCrowdSaleParams(web3, crowdsale)
        deployContract(web3, abiCrowdsale, binCrowdsale, paramsCrowdsale, this.handleDeployedContract)
       });
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
                <p className="value">{this.state.crowdsale.startBlock?this.state.crowdsale.startBlock:""}</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="right">
                <p className="label">End block</p>
                <p className="value">{this.state.crowdsale.endBlock?this.state.crowdsale.endBlock:""}</p>
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