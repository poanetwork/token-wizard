import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { defaultState } from '../utils/constants'
import { getOldState, stepsAreValid, isValidName } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { InputField } from './Common/InputField'
import { NAVIGATION_STEPS } from '../utils/constants'
const { TOKEN_SETUP } = NAVIGATION_STEPS

export class stepTwo extends React.Component {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, defaultState, {validations: {name: false, supply: false, decimals: false, ticker: false }})
  }

  getNewParent (property, parent, value) {
    let newParent = { ...this.state[`${parent}`] }
    newParent[property] = value
    return newParent
  }

  changeState (event, parent, property) {
    let newParent = this.getNewParent(property, parent, event.target.value)
    let newState = Object.assign({}, this.state)
    newState[parent] = newParent
    this.setState(newState)
  }

  renderLinkComponent () {
    // if(stepsAreValid(this.state.validations)){
      return <Link className="button button_fill" to={{ pathname: '/3', query: { state: this.state, changeState: this.changeState } }}>Continue</Link>
    // }
    // return <div className="button button_fill"> Continue</div>
  }

  render() {
    return (
    	<section className="steps steps_crowdsale-contract" ref="two">
        <StepNavigation activeStep={TOKEN_SETUP}/>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_token-setup"></div>
            <p className="title">Token setup</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <InputField side='left' title={'Name'} value={this.state.token.name} onChange={(e) => this.changeState(e, 'token', 'name')}/>
            <InputField side='right' title={'Ticker'} value={this.state.token.ticker} onChange={(e) => this.changeState(e, 'token', 'ticker')}/>
            <InputField side='left' title={'Supply'} value={this.state.token.supply} onChange={(e) => this.changeState(e, 'token', 'supply')}/>
            <InputField side='right' title={'Decimals'} value={this.state.token.decimals} onChange={(e) => this.changeState(e, 'token', 'decimals')}/>
          </div>
        </div>
        <div className="button-container">
          {this.renderLinkComponent()}
        </div>
      </section>
  )}
}