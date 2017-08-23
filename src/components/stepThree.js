import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3, calculateFutureBlock } from '../utils/web3'
import { stepTwo } from './stepTwo'
import { getOldState, defaultCompanyStartDate, defaultCompanyEndDate, stepsAreValid, allFieldsAreValid } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { InputField } from './Common/InputField'
import { NAVIGATION_STEPS, defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS } from '../utils/constants'
const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, RATE, SUPPLY, WALLET_ADDRESS } = TEXT_FIELDS

export class stepThree extends stepTwo {
  constructor(props) {
    super(props);
    const oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState, {validations: { ...oldState.validations, startTime: VALID, endTime: VALID, walletAddress: EMPTY, supply: EMPTY, rate: EMPTY } } )
  }

  renderLink () {
    console.log('render link four')
    return <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
  }

  renderLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      console.log('steeeeeep 33333')
      return this.renderLink()
    }
    console.log('not valid')
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  componentDidMount () {
    setTimeout( () => {
      getWeb3((web3) => {
        let newState = {...this.state}
        newState.crowdsale.walletAddress = web3.eth.accounts[0];
        newState.crowdsale.startTime = defaultCompanyStartDate();
        newState.crowdsale.endTime = defaultCompanyEndDate(newState.crowdsale.startTime);
        let datesIterator = 0;
        let datesCount = 2;
        let $this = this;
        calculateFutureBlock(new Date(newState.crowdsale.startTime), newState.blockTimeGeneration, function(targetBlock) {
          newState.crowdsale.startBlock = targetBlock;
          datesIterator++;

          if (datesIterator == datesCount) {
            $this.setState(newState);
          }
        });
        calculateFutureBlock(new Date(newState.crowdsale.endTime), newState.blockTimeGeneration, function(targetBlock) {
          newState.crowdsale.endBlock = targetBlock;
          datesIterator++;

          if (datesIterator == datesCount) {
            $this.setState(newState);
          }
        });
      });
    }, 500);
  }

  render() {
    const { validations } = this.state
    console.log('333 validations', validations)
    return (
      <section className="steps steps_crowdsale-contract" ref="three">
        <StepNavigation activeStep={CROWDSALE_SETUP}/>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-setup"></div>
            <p className="title">Crowdsale setup</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <InputField 
              side='left' 
              type='datetime-local' 
              title={START_TIME} 
              value={this.state.crowdsale.startTime} 
              valid={validations.startTime} 
              errorMessage={VALIDATION_MESSAGES.START_TIME} 
              onChange={(e) => this.changeState(e, 'crowdsale', 'startTime')}/>
            <InputField 
              side='right' 
              type='datetime-local' 
              title={END_TIME} 
              value={this.state.crowdsale.endTime} 
              valid={validations.endTime} 
              errorMessage={VALIDATION_MESSAGES.END_TIME} 
              onChange={(e) => this.changeState(e, 'crowdsale', 'endTime')}/>
            <InputField 
              side='left' 
              type='text' 
              title={WALLET_ADDRESS} 
              value={this.state.crowdsale.walletAddress} 
              valid={validations.walletAddress} 
              errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS} 
              onChange={(e) => this.changeState(e, 'crowdsale', 'walletAddress')}/>
            <InputField 
              side='right' 
              type='number' 
              title={SUPPLY} 
              value={this.state.crowdsale.supply} 
              valid={validations.supply} 
              errorMessage={VALIDATION_MESSAGES.SUPPLY} 
              onChange={(e) => this.changeState(e, 'crowdsale', 'supply')}/>
            <InputField 
              side='left' 
              type='number' 
              title={RATE} 
              value={this.state.crowdsale.rate} 
              valid={validations.rate} 
              errorMessage={VALIDATION_MESSAGES.RATE} 
              onChange={(e) => this.changeState(e, 'crowdsale', 'rate')}/>
          </div>
        </div>
        <div className="button-container">
          {this.renderLinkComponent()}
        </div>
      </section>
    )}
}