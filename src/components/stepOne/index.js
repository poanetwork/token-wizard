import React from 'react'
import '../../assets/stylesheets/application.css';
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { Link } from 'react-router-dom';
import { setFlatFileContentToState } from '../../utils/utils';
import { StepNavigation } from '../Common/StepNavigation';
import { NAVIGATION_STEPS, CONTRACT_TYPES } from '../../utils/constants';
import { inject, observer } from 'mobx-react';
const { CROWDSALE_CONTRACT } = NAVIGATION_STEPS;


@inject('contractStore', 'web3Store') @observer
export class stepOne extends React.Component {

  getStandardCrowdsaleAssets() {
    this.getCrowdsaleAsset("CrowdsaleStandard", "crowdsale")
    this.getCrowdsaleAsset("CrowdsaleStandardToken", "token")
  }

  getWhiteListWithCapCrowdsaleAssets () {
    this.getCrowdsaleAsset("SafeMathLibExt", "safeMathLib")
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCap", "crowdsale")
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapToken", "token")
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapPricingStrategy", "pricingStrategy")
    this.getCrowdsaleAsset("CrowdsaleWhiteListWithCapPricingStrategy", "pricingStrategy")
    this.getCrowdsaleAsset("FinalizeAgent", "finalizeAgent")
    this.getCrowdsaleAsset("NullFinalizeAgent", "nullFinalizeAgent")
  }

  getCrowdsaleAsset(contractName, stateProp) {
    const src = setFlatFileContentToState(`./contracts/${contractName}_flat.sol`)
    const bin = setFlatFileContentToState(`./contracts/${contractName}_flat.bin`)
    const abi = setFlatFileContentToState(`./contracts/${contractName}_flat.abi`)

    Promise.all([src, bin, abi])
      .then(result => this.addContractsToState(...result, stateProp))
      .catch(console.error)
  }

  addContractsToState(src, bin, abi, contract) {
    this.props.contractStore.setContract(contract, {
      src,
      bin,
      abi: JSON.parse(abi),
      addr: (contract==="crowdsale" || contract==="pricingStrategy" || contract==="finalizeAgent")?[]:"",
      abiConstructor: (contract==="crowdsale" || contract==="pricingStrategy" || contract==="finalizeAgent")?[]:""
    });
  }

  contractTypeSelected(e) {
    this.props.contractStore.setContractType(e.currentTarget.id);
    this.getWhiteListWithCapCrowdsaleAssets();
  }

  componentDidMount() {
    checkWeb3(this.props.web3Store.web3);

    switch (this.props.contractStore.contractType) {
      case CONTRACT_TYPES.standard:
        this.getStandardCrowdsaleAssets();
        break;
      case CONTRACT_TYPES.whitelistwithcap:
        this.getWhiteListWithCapCrowdsaleAssets();
        break;
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
            <label className="radio">
              <input
                type="radio"
                checked={this.props.contractStore.contractType === CONTRACT_TYPES.whitelistwithcap}
                name="contract-type"
                id={CONTRACT_TYPES.whitelistwithcap}
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
          <Link to='/2'>
            <span className="button button_fill">Continue</span>
          </Link>
        </div>
      </section>
    )
  }
}
