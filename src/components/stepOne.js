import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { defaultState } from '../utils/constants'
import { setFlatFileContentToState } from '../utils/utils';
import { getOldState } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'
const { CROWDSALE_CONTRACT, TOKEN_SETUP, CROWDSALE_SETUP, PUBLISH, CROWDSALE_PAGE } = NAVIGATION_STEPS

export class stepOne extends React.Component {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
  }

  getStandardCrowdsaleAssets (state) {
    const contractName = "CrowdsaleStandard";
    let srcC, binC
    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", (content) => srcC = content);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", (_bin) => binC = _bin);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", (_abi) => this.addContractsToState(srcC, binC, _abi, "crowdsale", state));

    const tokenName = "CrowdsaleStandardToken";
    let srcT, binT
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.sol", (content) => srcT = content);
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.bin", (_bin) => binT = _bin);
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.abi", (_abi) => this.addContractsToState(srcT, binT, _abi, "token", state));
  }

  getWhiteListWithCapCrowdsaleAssets (state) {
    const contractName = "CrowdsaleWhiteListWithCap";
    let srcC, binC
    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", (content) => srcC = content);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", (_bin) => binC = _bin);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", (_abi) => this.addContractsToState(srcC, binC, _abi, "crowdsale", state));

    const tokenName = "CrowdsaleWhiteListWithCapToken";
    let srcT, binT
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.sol", (content) => srcT = content);
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.bin", (_bin) => binT = _bin);
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.abi", (_abi) => this.addContractsToState(srcT, binT, _abi, "token", state));
    
    const pricingStrategyName = "CrowdsaleWhiteListWithCapPricingStrategy";
    let srcP, binP
    setFlatFileContentToState("./contracts/" + pricingStrategyName + "_flat.sol", (content) => srcP = content);
    setFlatFileContentToState("./contracts/" + pricingStrategyName + "_flat.bin", (_bin) => binP = _bin);
    setFlatFileContentToState("./contracts/" + pricingStrategyName + "_flat.abi", (_abi) => this.addContractsToState(srcP, binP, _abi, "pricingStrategy", state));
  
    const tokenTransferProxyName = "TokenTransferProxy";
    let srcTTP, binTTP
    setFlatFileContentToState("./contracts/" + tokenTransferProxyName + "_flat.sol", (content) => srcTTP = content);
    setFlatFileContentToState("./contracts/" + tokenTransferProxyName + "_flat.bin", (_bin) => binTTP = _bin);
    setFlatFileContentToState("./contracts/" + tokenTransferProxyName + "_flat.abi", (_abi) => this.addContractsToState(srcTTP, binTTP, _abi, "tokenTransferProxy", state));

    const multiSigName = "MultiSig";
    let srcM, binM
    setFlatFileContentToState("./contracts/" + multiSigName + "_flat.sol", (content) => srcM = content);
    setFlatFileContentToState("./contracts/" + multiSigName + "_flat.bin", (_bin) => binM = _bin);
    setFlatFileContentToState("./contracts/" + multiSigName + "_flat.abi", (_abi) => this.addContractsToState(srcM, binM, _abi, "multisig", state));

    const finalizeAgentName = "FinalizeAgent";
    let srcF, binF
    setFlatFileContentToState("./contracts/" + finalizeAgentName + "_flat.sol", (content) => srcF = content);
    setFlatFileContentToState("./contracts/" + finalizeAgentName + "_flat.bin", (_bin) => binF = _bin);
    setFlatFileContentToState("./contracts/" + finalizeAgentName + "_flat.abi", (_abi) => this.addContractsToState(srcF, binF, _abi, "finalizeAgent", state));
  }

  componentDidMount() {
    let newState = { ...this.state }
    newState.contractType = this.state.contractTypes.standard
    this.getStandardCrowdsaleAssets(newState);
  }

  addContractsToState (src, bin, abi, contract, state) {
    //let newState = Object.assign({}, state)
    console.log('state', state)
    state.contracts[contract] = {
      src,
      bin,
      abi: JSON.parse(abi),
      addr: (contract=="crowdsale" || contract=="pricingStrategy" || contract=="finalizeAgent")?[]:"",
      abiConstructor: (contract=="crowdsale" || contract=="pricingStrategy" || contract=="finalizeAgent")?[]:""
    }
    this.setState(state)
  }

  contractTypeSelected(e) {
    let newState = { ...this.state }
    newState.contractType = e.currentTarget.id;
    console.log(e.currentTarget.id);
    switch (e.currentTarget.id) {
      case this.state.contractTypes.standard: {
        this.getStandardCrowdsaleAssets(newState);
      } break;
      case this.state.contractTypes.whitelistwithcap: {
        this.getWhiteListWithCapCrowdsaleAssets(newState);
      } break;
      default:
        break;
    }
  }

  render() {
    return (
    	 <section className="steps steps_crowdsale-contract">
       <StepNavigation activeStep={CROWDSALE_CONTRACT}/>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-contract"></div>
            <p className="title">Crowdsale Contract</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="radios">
            <label className="radio">
              <input 
                type="radio" 
                checked={this.state.contractType === this.state.contractTypes.standard}            
                name="contract-type"
                id={this.state.contractTypes.standard}
                onChange={(e) => this.contractTypeSelected(e)}
              />
              <span className="title">Standard</span>
              <span className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </span>
            </label>
            <label className="radio">
              <input 
                type="radio" 
                checked={this.state.contractType === this.state.contractTypes.whitelistwithcap}    
                name="contract-type"
                id={this.state.contractTypes.whitelistwithcap}
                onChange={(e) => this.contractTypeSelected(e)}
              />
              <span className="title title_soon">Whitelist with Cap</span>
              <span className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </span>
            </label>
            <label className="radio">
              <input 
                type="radio" 
                disabled 
                checked={this.state.contractType === this.state.contractTypes.capped}    
                name="contract-type"
                id={this.state.contractTypes.whitelistwithcap}
                onChange={(e) => this.contractTypeSelected(e)}
              />
              <span className="title title_soon">Capped</span>
              <span className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </span>
            </label>
          </div>
        </div>
        <div className="button-container">
          <Link to={{ pathname: '/2', query: { state: this.state } }}><a className="button button_fill">Continue</a></Link>
        </div>
      </section>
    )}
}
