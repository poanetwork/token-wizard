import React from 'react'
import '../../assets/stylesheets/application.css'
import { Link } from 'react-router-dom'
import { StepNavigation } from '../Common/StepNavigation'
import {
  NAVIGATION_STEPS,
  CROWDSALE_STRATEGIES,
  CROWDSALE_STRATEGIES_DISPLAYNAMES,
  DOWNLOAD_STATUS
} from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import logdown from 'logdown'

const logger = logdown('TW:manage:utils')
const { CROWDSALE_STRATEGY } = NAVIGATION_STEPS

@inject('crowdsaleStore', 'contractStore')
@observer
export class stepOne extends React.Component {
  constructor(props) {
    super(props)

    this.setStrategy(null, CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE)
  }

  setStrategy = (event, strategy) => {
    if (!strategy) {
      strategy = event.target.id
    }
    this.props.crowdsaleStore.setProperty('strategy', strategy)
  }

  render() {
    const { contractStore } = this.props

    let status = contractStore.downloadStatus === DOWNLOAD_STATUS.SUCCESS && localStorage.length > 0
    logger.log('Contract store status', status)
    const submitButtonClass = classNames('button', 'button_fill', 'button_no_border', {
      button_disabled: !status
    })

    return (
      <section className="steps steps_crowdsale-contract">
        <StepNavigation activeStep={CROWDSALE_STRATEGY} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-contract" />
            <p className="title">{CROWDSALE_STRATEGY}</p>
            <p className="description">Select a strategy for your crowdsale.</p>
          </div>
          <div className="radios" onChange={this.setStrategy}>
            <label className="radio">
              <input
                type="radio"
                defaultChecked={true}
                name="contract-type"
                id={CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE}
              />
              <span className="title">{CROWDSALE_STRATEGIES_DISPLAYNAMES.MINTED_CAPPED_CROWDSALE}</span>
              <span className="description">
                Modern crowdsale strategy with multiple tiers, whitelists, and limits. Recommended for every crowdsale.
              </span>
            </label>
            <label className="radio">
              <input type="radio" defaultChecked={false} name="contract-type" id={CROWDSALE_STRATEGIES.DUTCH_AUCTION} />
              <span className="title">{CROWDSALE_STRATEGIES_DISPLAYNAMES.DUTCH_AUCTION}</span>
              <span className="description">An auction with descending price.</span>
            </label>
          </div>
        </div>
        <div className="button-container">
          <Link to="/2">
            <button disabled={!status} className={submitButtonClass}>
              Continue
            </button>
          </Link>
        </div>
      </section>
    )
  }
}
