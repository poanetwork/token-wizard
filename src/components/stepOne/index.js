import React from 'react'
import '../../assets/stylesheets/application.css'
import { Link } from 'react-router-dom'
import { StepNavigation } from '../Common/StepNavigation'
import { inject, observer } from 'mobx-react'
import { ButtonContinue } from '../Common/ButtonContinue'
import {
  NAVIGATION_STEPS,
  CROWDSALE_STRATEGIES,
  CROWDSALE_STRATEGIES_DISPLAYNAMES,
  DOWNLOAD_STATUS
} from '../../utils/constants'
import logdown from 'logdown'

const logger = logdown('TW:stepOne')
const { CROWDSALE_STRATEGY } = NAVIGATION_STEPS
const { MINTED_CAPPED_CROWDSALE, DUTCH_AUCTION } = CROWDSALE_STRATEGIES

@inject('crowdsaleStore', 'contractStore')
@observer
export class stepOne extends React.Component {
  /**
   * Function that handle configuration, update our state and prepare for first render
   */
  componentWillMount() {
    logger.log('CrowdsaleStore strategy', this.props.crowdsaleStore.strategy)

    // Set default value
    if (this.props.crowdsaleStore && !this.props.crowdsaleStore.strategy) {
      this.props.crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)
    }
  }

  /**
   * Handle radio input and set value for strategy
   * @param e
   */
  handleChange = e => {
    this.props.crowdsaleStore.setProperty('strategy', e.currentTarget.value)
    logger.log('CrowdsaleStore strategy selected:', e.currentTarget.value)
  }

  /**
   * Render method for stepOne component
   * @returns {*}
   */
  render() {
    const { contractStore } = this.props

    let status = contractStore && contractStore.downloadStatus === DOWNLOAD_STATUS.SUCCESS && localStorage.length > 0

    return (
      <section className="steps steps_crowdsale-contract">
        <StepNavigation activeStep={CROWDSALE_STRATEGY} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-contract" />
            <p className="title">{CROWDSALE_STRATEGY}</p>
            <p className="description">Select a strategy for your crowdsale.</p>
          </div>
          <div className="radios">
            <label className="radio">
              <input
                id={MINTED_CAPPED_CROWDSALE}
                value={MINTED_CAPPED_CROWDSALE}
                name="contract-type"
                type="radio"
                checked={this.props.crowdsaleStore.strategy === MINTED_CAPPED_CROWDSALE}
                onChange={this.handleChange}
              />
              <span className="title">{CROWDSALE_STRATEGIES_DISPLAYNAMES.MINTED_CAPPED_CROWDSALE}</span>
              <span className="description">
                Modern crowdsale strategy with multiple tiers, whitelists, and limits. Recommended for every crowdsale.
              </span>
            </label>
            <label className="radio">
              <input
                id={DUTCH_AUCTION}
                value={DUTCH_AUCTION}
                name="contract-type"
                type="radio"
                checked={this.props.crowdsaleStore.strategy === DUTCH_AUCTION}
                onChange={this.handleChange}
              />
              <span className="title">{CROWDSALE_STRATEGIES_DISPLAYNAMES.DUTCH_AUCTION}</span>
              <span className="description">An auction with descending price.</span>
            </label>
          </div>
        </div>
        <div className="button-container">
          <Link to="/2">
            <ButtonContinue status={status} />
          </Link>
        </div>
      </section>
    )
  }
}
