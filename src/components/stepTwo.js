import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { defaultState } from '../utils/constants'
import { getOldState } from '../utils/utils'
import { StepNavigation } from './StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'
const { TOKEN_SETUP } = NAVIGATION_STEPS

export class stepTwo extends React.Component {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, defaultState)
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
            <div className="left">
              <label className="label">Name</label>
              <input type="text" className="input" value={this.state.token.name} onChange={(e) => this.changeState(e, "token", "name")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label className="label">Ticker</label>
              <input type="text" className="input" value={this.state.token.ticker} onChange={(e) => this.changeState(e, "token","ticker")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="left">
              <label className="label">Supply</label>
              <input type="text" className="input" value={this.state.token.supply} onChange={(e) => this.changeState(e, "token", "supply")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label className="label">Decimals</label>
              <input type="text" className="input" value={this.state.token.decimals} onChange={(e) => this.changeState(e, "token", "decimals")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
          </div>
        </div>
        <div className="button-container">
          <Link  className="button button_fill" to={{ pathname: '/3', query: { state: this.state, changeState: this.changeState } }}>Continue</Link>
        </div>
      </section>
  )}
}