import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import { calculateFutureBlock } from '../utils/web3'
import { getOldState, stepsAreValid, getValidationValue, getNewValue, validateValue, allFieldsAreValid } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { InputField } from './Common/InputField'
import { NAVIGATION_STEPS, VALIDATION_MESSAGES, VALIDATION_TYPES, defaultState, TEXT_FIELDS } from '../utils/constants'
const { TOKEN_SETUP } = NAVIGATION_STEPS
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { NAME, TICKER, SUPPLY, DECIMALS } = TEXT_FIELDS

export class stepTwo extends React.Component {
  constructor(props) {
    super(props);
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState, {validations: {name: EMPTY, supply: EMPTY, decimals: EMPTY, ticker: EMPTY }})
    console.log(this.state);
  }

  showErrorMessages = (parent) => {
    this.validateAllFields(parent)
  }
  
   setBlockTimes (event, key, property) {
    let newState = Object.assign({}, this.state)
    let targetTime = new Date(event.target.value);
    let targetTimeTemp = new Date(targetTime).setUTCHours(new Date(targetTime).getHours());
    if (property == "startTime") {
      newState.crowdsale[key].startTime = new Date(targetTimeTemp).toISOString().split(".")[0];
    } else if (property == "endTime") {
      newState.crowdsale[key].endTime = new Date(targetTimeTemp).toISOString().split(".")[0];
      if (newState.crowdsale[key + 1]) {
        newState.crowdsale[key + 1].startTime = newState.crowdsale[key].endTime;
        let newEndDate = new Date(newState.crowdsale[key].endTime).setDate(new Date(newState.crowdsale[key].endTime).getDate() + 4);;
        newState.crowdsale[key + 1].endTime = new Date(newEndDate).toISOString().split(".")[0];;
      }
    }
    calculateFutureBlock(targetTime, this.state.blockTimeGeneration, (targetBlock) => {
      if (property == "startTime") {
        newState.crowdsale[key].startBlock = targetBlock;
        console.log("startBlock: " + newState.crowdsale[key].startBlock);
      } else if (property == "endTime") {
        newState.crowdsale[key].endBlock = targetBlock;
        console.log("endBlock: " + newState.crowdsale[key].endBlock);
      }
      this.setState(newState);
    });
  }

  /*getNewParent (property, parent, key, value) {
    if( Object.prototype.toString.call( {...this.state[`${parent}`]} ) === '[object Array]' ) {
      let newParent = { ...this.state[`${parent}`][key] }
      newParent[property][key] = value
      return newParent
    } else {
      let newParent = { ...this.state[`${parent}`] }
      newParent[property] = value
      return newParent
    }
  }*/

  changeState (event, parent, key, property) {
    console.log("parent: " + parent, "key: " + key, "property: " + property);
    let value = event.target.value
    let newState = { ...this.state }
    if (property == "startTime" || property == "endTime") {
      this.setBlockTimes(event, key, property)
    } else if (property.indexOf("whitelist") == 0) {
      let prop = property.split("_")[1];
      newState.crowdsale[key][`whitelist`][0][prop] = value
    } else {
      if( Object.prototype.toString.call( newState[parent] ) === '[object Array]' ) {
        newState[parent][key][property] = value;//this.getNewParent(property, parent, key, value)
      } else {
        newState[parent][property] = value;//this.getNewParent(property, parent, key, value)
      }
    }
    if (property.indexOf("whitelist") == -1) {
      newState[`validations`][property] = getValidationValue(value, property, newState)
      console.log('newState[`validations`][property]',  newState[`validations`][property])
    }
    console.log(newState);
    this.setState(newState)
  }

  renderLink () {
    return <Link className="button button_fill" to={{ pathname: '/3', query: { state: this.state, changeState: this.changeState } }}>Continue</Link>
  }
  
  validateAllFields (parent) {
    let newState = { ...this.state }
    console.log('validateAllFields', this.state)
    let properties = Object.keys(newState.validations)
    let values = properties.map(property => newState[parent][property])
    properties.forEach((property, index) => {
      newState[`validations`][property] = validateValue(values[index], property)
    })
    this.setState(newState)
  }

  renderLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('token', this.state)){
      return this.renderLink()
    }
    return <div onClick={this.showErrorMessages.bind(this, 'token')} className="button button_fill"> Continue</div>
  }

  render() {
    const { token, validations } = this.state
     console.log('step 2 validations', validations)

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
            <InputField side='left' type='text' 
              errorMessage={VALIDATION_MESSAGES.NAME} 
              valid={validations.name} title={NAME} 
              value={token.name} 
              onChange={(e) => this.changeState(e, 'token', 0, 'name')}
            />
            <InputField 
              side='right' type='text' 
              errorMessage={VALIDATION_MESSAGES.TICKER} 
              valid={validations.ticker} 
              title={TICKER} 
              value={token.ticker} 
              onChange={(e) => this.changeState(e, 'token', 0, 'ticker')}
            />
            <InputField 
              side='left' type='number' 
              errorMessage={VALIDATION_MESSAGES.SUPPLY} 
              valid={validations.supply} 
              title={SUPPLY} 
              value={token.supply} 
              onChange={(e) => this.changeState(e, 'token', 0, 'supply')}
            />
            <InputField 
              side='right' type='number'
              errorMessage={VALIDATION_MESSAGES.DECIMALS} 
              valid={validations.decimals} 
              title={DECIMALS}
              value={token.decimals} 
              onChange={(e) => this.changeState(e, 'token', 0, 'decimals')}
            />
          </div>
        </div>
        <div className="button-container">
          {this.renderLinkComponent()}
        </div>
      </section>
  )}
}