import React from 'react'
import '../../assets/stylesheets/application.css';
import { checkWeb3, getWeb3, getNetworkVersion } from '../../utils/blockchainHelpers'
import { Link } from 'react-router-dom'
import { defaultState } from '../../utils/constants'
import { setFlatFileContentToState } from '../../utils/utils';
import { getOldState } from '../../utils/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { noDeploymentOnMainnetAlert } from '../../utils/alerts'
const { CROWDSALE_CONTRACT } = NAVIGATION_STEPS

export class stepOne extends React.Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
  }

  getWhiteListWithCapCrowdsaleAssets (state) {
    this.getCrowdsaleAsset("SafeMathLibExt", "safeMathLib", state)
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCap", "crowdsale", state)
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapToken", "token", state)
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapPricingStrategy", "pricingStrategy", state)
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapPricingStrategy", "pricingStrategy", state)
    this.getCrowdsaleAsset("FinalizeAgent", "finalizeAgent", state)
    this.getCrowdsaleAsset("NullFinalizeAgent", "nullFinalizeAgent", state)
  }

  getCrowdsaleAsset(contractName, stateProp, state) {
    let src, bin, abi;
    let assetsCount = 3;
    let assetsIterator = 0;

    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", (_content) => {
      src = _content;
      assetsIterator++;

      if (assetsIterator === assetsCount) {
        this.addContractsToState(src, bin, abi, stateProp, state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", (_bin) => {
      bin = _bin;
      assetsIterator++;

      if (assetsIterator === assetsCount) {
        this.addContractsToState(src, bin, abi, stateProp, state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", (_abi) => {
      abi = _abi;
      assetsIterator++;

      if (assetsIterator === assetsCount) {
        this.addContractsToState(src, bin, abi, stateProp, state);
      }
    });
  }

  addContractsToState (src, bin, abi, contract, state) {
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
    this.getWhiteListWithCapCrowdsaleAssets(newState);
  }

  componentDidMount() {
    checkWeb3(this.state.web3);

    let newState = { ...this.state }

    newState.contractType = this.state.contractTypes.whitelistwithcap
    this.getWhiteListWithCapCrowdsaleAssets(newState);
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
          <Link to={{ pathname: '/2', query: { state: this.state } }}><span className="button button_fill">Continue</span></Link>
        </div>
      </section>
    )}
}
