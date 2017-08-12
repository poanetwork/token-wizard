import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { defaultState } from '../utils/constants'
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
              <input type="radio" checked name="contract-type"/>
              <span className="title">Standard</span>
              <span className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </span>
            </label>
            <label className="radio">
              <input type="radio" disabled name="contract-type"/>
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