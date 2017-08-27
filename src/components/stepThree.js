import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3, calculateFutureBlock } from '../utils/web3'
import { stepTwo } from './stepTwo'
import { getOldState, defaultCompanyStartDate, defaultCompanyEndDate, stepsAreValid, allFieldsAreValid } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { InputField } from './Common/InputField'
import { CrowdsaleBlock } from './Common/CrowdsaleBlock'
import { WhitelistBlock } from './Common/WhitelistBlock'
import { NAVIGATION_STEPS, defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS, initialStepThreeValues, intitialStepThreeValidations } from '../utils/constants'
const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME } = TEXT_FIELDS

export class stepThree extends stepTwo {
  constructor(props) {
    super(props);
    const oldState = getOldState(props, defaultState)
    oldState.children = [];
    oldState.crowdsale[0].tier = "Tier 1"
    this.state = Object.assign({}, oldState, {validations: { ...oldState.validations, startTime: VALID, endTime: VALID, walletAddress: VALID, supply: EMPTY, rate: EMPTY } } )
    // console.log('this.state', this.state)
  }

  addCrowdsale() {
    let newState = {...this.state}
    // console.log(newState);
    // console.log(newState.children);
    let num = newState.children.length + 1;
    console.log(num);
    newState.crowdsale.push({whitelist:[{}]});
    newState.crowdsale[num].startTime = newState.crowdsale[num - 1].endTime
    newState.pricingStrategy.push({});
    this.setState(newState, () => this.addCrowdsaleBlock(num));
  }

  addCrowdsaleBlock(num) {
    let newState = {...this.state}
    newState.children.push(<CrowdsaleBlock
      num = {num}
      state = {newState}
      onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, num, prop)}
    ></CrowdsaleBlock>)
    this.setState(newState)
  }

  renderStandardLink () {
    // console.log('render link four')
    const oldState = getOldState(this.props, defaultState)
    this.state = Object.assign({}, oldState, initialStepThreeValues, {validations: { ...oldState.validations, intitialStepThreeValidations  } } )
  }

  renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      return this.renderLink()
    }
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Crowdsale</div>
      <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
    </div>
  }

  renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      console.log('steeeeeep 33333')
      return this.renderLink()
    }
    console.log('not valid')
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    console.log('render link four')
    return <div>
    <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Crowdsale</div>
    <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
    </div>
  }

  renderLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      // console.log('step 3 is valididididididididididididididididi')
      return this.renderLink()
    }
    console.log('not valid')
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Crowdsale</div>
      <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
    </div>
  }
  componentDidMount () {
    setTimeout( () => {
      getWeb3((web3) => {
        console.log('timeout state', this.state)
        let newState = {...this.state}
        newState.crowdsale[0].walletAddress = web3.eth.accounts[0];
        newState.crowdsale[0].startTime = defaultCompanyStartDate();
        newState.crowdsale[0].endTime = defaultCompanyEndDate(newState.crowdsale[0].startTime);
        let datesIterator = 0;
        let datesCount = 2;
        let $this = this;
        calculateFutureBlock(new Date(newState.crowdsale[0].startTime), newState.blockTimeGeneration, function(targetBlock) {
          newState.crowdsale[0].startBlock = targetBlock;
          datesIterator++;

          if (datesIterator == datesCount) {
            $this.setState(newState);
          }
        });
        calculateFutureBlock(new Date(newState.crowdsale[0].endTime), newState.blockTimeGeneration, function(targetBlock) {
          newState.crowdsale[0].endBlock = targetBlock;
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
    console.log('this.state.contractType', this.state.contractType)
    if (this.state.contractType == this.state.contractTypes.standard) {
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
                value={console.log('this.state.crowdsale[0].startTime', this.state) || this.state.crowdsale[0].startTime} 
                valid={validations.startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'startTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'startTime')}/>
              <InputField 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={this.state.crowdsale[0].endTime} 
                valid={validations.endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'endTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'endTime')}/>
              <InputField 
                side='left' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={this.state.crowdsale[0].walletAddress} 
                valid={validations.walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
                onBlur={() => this.handleInputBlur('crowdsale', 'walletAddress', 0)} 
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'walletAddress')}/>
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={this.state.crowdsale[0].supply} 
                valid={validations.supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY}
                onBlur={() => this.handleInputBlur('crowdsale', 'supply', 0)} 
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'supply')}/>
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={this.state.pricingStrategy[0].rate} 
                valid={validations.rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onBlur={() => this.handleInputBlur('crowdsale', 'rate', 0)}
                onChange={(e) => this.changeState(e, 'pricingStrategy', 0, 'rate')}/>
            </div>
          </div>
          <div className="button-container">
            {this.renderStandardLinkComponent()}
          </div>
        </section>
      )
    } else if (this.state.contractType == this.state.contractTypes.whitelistwithcap) {
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
                type='text' 
                title={CROWDSALE_SETUP_NAME} 
                value={this.state.crowdsale[0].tier}
                onBlur={() => this.handleInputBlur('crowdsale', 'tier', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'tier')}/>
              <InputField 
                side='right' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={this.state.crowdsale[0].walletAddress} 
                valid={validations.walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS} 
                onBlur={() => this.handleInputBlur('crowdsale', 'walletAddress', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'walletAddress')}/>
              <InputField 
                side='left' 
                type='datetime-local' 
                title={START_TIME} 
                value={this.state.crowdsale[0].startTime} 
                valid={validations.startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'startTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'startTime')}/>
              <InputField 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={this.state.crowdsale[0].endTime} 
                valid={validations.endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'endTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'endTime')}/>
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={this.state.crowdsale[0].supply} 
                valid={validations.supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY} 
                onBlur={() => this.handleInputBlur('crowdsale', 'supply', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'supply')}/>
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={this.state.pricingStrategy[0].rate} 
                valid={validations.rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onBlur={() => this.handleInputBlur('crowdsale', 'rate', 0)}
                onChange={(e) => this.changeState(e, 'pricingStrategy', 0, 'rate')}/>
            </div>
            <div className="white-list-title">
              <p className="title">Whitelist</p>
            </div>
            <WhitelistBlock
              addr={this.state.crowdsale[0].whitelist[0].addr}
              min={this.state.crowdsale[0].whitelist[0].min}
              max={this.state.crowdsale[0].whitelist[0].max}
              onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, 0, prop)}
            ></WhitelistBlock>
          </div>
          <div>{this.state.children}</div>
          <div className="button-container">
            {this.renderLinkComponent()}
          </div>
        </section>
      )
    }
  }
}