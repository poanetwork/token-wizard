import React from 'react'
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom';
import { StepNavigation } from '../Common/StepNavigation';
import { NAVIGATION_STEPS, CROWDSALE_STRATEGIES } from '../../utils/constants';
import { inject, observer } from 'mobx-react'
const { CROWDSALE_CONTRACT } = NAVIGATION_STEPS;

//to do: downloadStatus is not used
const ContinueButton = ({downloadStatus}) => {
  return (
    <Link to="/2">
      <span className="button button_fill">Continue</span>
    </Link>
  );
};

@inject('crowdsaleStore')
@observer
export class stepOne extends React.Component {

  constructor (props) {
    super(props)

    this.setStrategy(null, CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE);
  }

  setStrategy = (event, strategy) => {
    if (!strategy) {
      strategy = event.target.id
    }
    this.props.crowdsaleStore.setProperty('strategy', strategy)
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
          <div className="radios" onChange={this.setStrategy}>
            <label className="radio">
              <input
                type="radio"
                defaultChecked={true}
                name="contract-type"
                id={CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE}
              />
              <span className="title">Whitelist with Cap</span>
              <span className="description">
                Modern crowdsale strategy with multiple tiers, whitelists, and limits. Recommended for every crowdsale.
              </span>
            </label>
            <label className="radio">
              <input
                type="radio"
                defaultChecked={false}
                name="contract-type"
                id={CROWDSALE_STRATEGIES.DUTCH_AUCTION}
              />
              <span className="title">Dutch auction</span>
              <span className="description">
                Dutch auction crowdsale.
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
