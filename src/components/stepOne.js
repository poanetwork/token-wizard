import React from 'react'
import '../assets/stylesheets/application.css';
import { checkWeb3 } from '../utils/web3'
import { Link } from 'react-router-dom'
import { defaultState } from '../utils/constants'
import { setFlatFileContentToState } from '../utils/utils';
import { getOldState } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'
const { CROWDSALE_CONTRACT } = NAVIGATION_STEPS

export class stepOne extends React.Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
  }

  getStandardCrowdsaleAssets (state) {
    this.getCrowdsaleAsset("CrowdsaleStandard", "crowdsale", state)
    this.getCrowdsaleAsset("CrowdsaleStandardToken", "token", state)
  }

  getWhiteListWithCapCrowdsaleAssets (state) {
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCap", "crowdsale", state)
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapToken", "token", state)
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapPricingStrategy", "pricingStrategy", state)
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapPricingStrategy", "pricingStrategy", state)
    //this.getCrowdsaleAsset("TokenTransferProxy", "tokenTransferProxy", state)
    //this.getCrowdsaleAsset("MultiSig", "multisig", state)
    this.getCrowdsaleAsset("FinalizeAgent", "finalizeAgent", state)
    this.getCrowdsaleAsset("NullFinalizeAgent", "nullFinalizeAgent", state)  
  }

  getCrowdsaleAsset(contractName, stateProp, state) {
    console.log(contractName, stateProp, state);
    let src, bin, abi;
    let assetsCount = 3;
    let assetsIterator = 0;
    let $this = this;

    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", function(_content) {
      console.log(assetsIterator +"=="+ assetsCount);
      src = _content;
      assetsIterator++;

      if (assetsIterator === assetsCount) {
        $this.addContractsToState(src, bin, abi, stateProp, state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", function(_bin) {
      console.log(assetsIterator +"=="+ assetsCount);
      bin = _bin;
      assetsIterator++;

      if (assetsIterator === assetsCount) {
        $this.addContractsToState(src, bin, abi, stateProp, state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", function(_abi) {
      console.log(assetsIterator +"=="+ assetsCount);
      abi = _abi;
      assetsIterator++;

      if (assetsIterator === assetsCount) {
        $this.addContractsToState(src, bin, abi, stateProp, state);
      }
    });
  }

  addContractsToState (src, bin, abi, contract, state) {
    //let newState = Object.assign({}, state)
    console.log('state', state)
    state.contracts[contract] = {
      src,
      bin,
      abi: JSON.parse(abi),
      addr: (contract==="crowdsale" || contract==="pricingStrategy" || contract==="finalizeAgent")?[]:"",
      abiConstructor: (contract==="crowdsale" || contract==="pricingStrategy" || contract==="finalizeAgent")?[]:""
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

  componentDidMount() {
    checkWeb3(this.state.web3);
    
    let newState = { ...this.state }

    newState.contractType = this.state.contractTypes.whitelistwithcap
    switch (newState.contractType) {
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
              Select a strategy for your crowdsale contract. 
            </p>
          </div>
          <div className="radios">
            {/*<label className="radio">
              <input 
                type="radio" 
                checked={this.state.contractType === this.state.contractTypes.standard}            
                name="contract-type"
                id={this.state.contractTypes.standard}
                onChange={(e) => this.contractTypeSelected(e)}
              />
              <span className="title">Standard</span>
              <span className="description">
                Basic crowdsale strategy with one tier. Good for educational use. 
              </span>
            </label>*/}
            <label className="radio">
              <input 
                type="radio" 
                checked={this.state.contractType === this.state.contractTypes.whitelistwithcap}    
                name="contract-type"
                id={this.state.contractTypes.whitelistwithcap}
                onChange={(e) => this.contractTypeSelected(e)}
              />
              <span className="title">Whitelist with Cap</span>
              <span className="description">
                Modern crowdsale strategy with multiple tiers, whitelists, and limits. Recommended for every crowdsale. 
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
