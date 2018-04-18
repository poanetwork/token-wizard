import React from 'react'
import '../../assets/stylesheets/application.css';
import { checkWeb3, getNetworkVersion, } from '../../utils/blockchainHelpers'
import { Link } from 'react-router-dom';
import { setFlatFileContentToState } from '../../utils/utils';
import { StepNavigation } from '../Common/StepNavigation';
import { NAVIGATION_STEPS } from '../../utils/constants';
const { CROWDSALE_CONTRACT } = NAVIGATION_STEPS;

//to do: downloadStatus is not used
const ContinueButton = ({downloadStatus}) => {
  return (
    <Link to="/2">
      <span className="button button_fill">Continue</span>
    </Link>
  );
};

export class stepOne extends React.Component {

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
                defaultChecked={true}
                name="contract-type"
                id="white-list-with-cap"
              />
              <span className="title">Whitelist with Cap</span>
              <span className="description">
                Modern crowdsale strategy with multiple tiers, whitelists, and limits. Recommended for every crowdsale.
              </span>
            </label>
          </div>
        </div>
        <div className="button-container">
          <ContinueButton />
        </div>
      </section>
    )
  }
}
