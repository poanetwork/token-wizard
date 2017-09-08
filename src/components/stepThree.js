import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3, calculateFutureBlock, setExistingContractParams } from '../utils/web3'
import { stepTwo } from './stepTwo'
import { getQueryVariable, getURLParam, getOldState, defaultCompanyStartDate, defaultCompanyEndDate, stepsAreValid, allFieldsAreValid } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { InputField } from './Common/InputField'
import { RadioInputField } from './Common/RadioInputField'
import { CrowdsaleBlock } from './Common/CrowdsaleBlock'
import { WhitelistInputBlock } from './Common/WhitelistInputBlock'
import { NAVIGATION_STEPS, defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS, initialStepThreeValues, intitialStepThreeValidations } from '../utils/constants'
const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME, ALLOWMODIFYING, DISABLEWHITELISTING } = TEXT_FIELDS

export class stepThree extends stepTwo {
  constructor(props) {
    super(props);
    const oldState = getOldState(props, defaultState)
    if (oldState.contracts.crowdsale.addr.length > 0) {
      oldState.contracts.pricingStrategy.addr = [];
      setExistingContractParams(oldState.contracts.crowdsale.abi, oldState.contracts.crowdsale.addr[0], this);
    }
    oldState.children = [];
    oldState.crowdsale[0].tier = "Tier 1"
    oldState.crowdsale[0].updatable = "off"
    oldState.crowdsale[0].whitelistdisabled = "no"
    this.state = Object.assign({}, oldState, {validations: { ...oldState.validations, startTime: VALID, endTime: VALID, walletAddress: VALID, supply: EMPTY, rate: EMPTY } } )
    //console.log('this.state', this.state)
  }

  addCrowdsale() {
    let newState = {...this.state}
    let num = newState.children.length + 1;
    newState.crowdsale.push({
      whitelist:[], 
      whiteListElements: [], 
      whiteListInput:{}
    });
    //newState.crowdsale[num].startTime = newState.crowdsale[num - 1].endTime;
    //newState.crowdsale[num].endTime = defaultCompanyEndDate(newState.crowdsale[num].startTime);
    newState.pricingStrategy.push({});
    this.setState(newState, () => this.addCrowdsaleBlock(num));
  }

  addCrowdsaleBlock(num) {
    let newState = {...this.state}
    newState.children.push(<CrowdsaleBlock
      num = {num}
      state = {this.state}
      onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, num, prop)}
    ></CrowdsaleBlock>)
    this.setState(newState)
  }

  renderStandardLink () {
    return <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
  }

  /*renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      return this.renderStandardLink()
    }
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
      <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
    </div>
  }*/

  renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      console.log('steeeeeep 33333')
      return this.renderStandardLink()
    }
    console.log('not valid')
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    console.log('render link four')
    return <div>
    <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
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
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
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

          if (datesIterator === datesCount) {
            $this.setState(newState);
          }
        });
        calculateFutureBlock(new Date(newState.crowdsale[0].endTime), newState.blockTimeGeneration, function(targetBlock) {
          newState.crowdsale[0].endBlock = targetBlock;
          datesIterator++;

          if (datesIterator === datesCount) {
            $this.setState(newState);
          }
        });
      });
    }, 500);
  }

  render() {
    const { validations } = this.state
    let { crowdsale } = this.state
    let { pricingStrategy } = this.state
    console.log('this.state.contractType', this.state.contractType)
    if (this.state.contractType === this.state.contractTypes.standard) {
      return (
        <section className="steps steps_crowdsale-contract" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP}/>
          <div className="steps-content container">
            <div className="about-step">
              <div className="step-icons step-icons_crowdsale-setup"></div>
              <p className="title">Crowdsale setup</p>
              <p className="description">
                The most important and exciting part of the crowdsale process. Here you can define parameters of your crowdsale campaign. 
              </p>
            </div>
            <div className="hidden">
              <InputField 
                side='left' 
                type='datetime-local' 
                title={START_TIME} 
                value={console.log('crowdsale[0].startTime', this.state) || crowdsale[0].startTime} 
                valid={validations.startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'startTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'startTime')}
                description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
              />
              <InputField 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={crowdsale[0].endTime} 
                valid={validations.endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'endTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'endTime')}
                description={`Date and time when the tier ends. Can be only in the future.`}
              />
              <InputField 
                side='left' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={crowdsale[0].walletAddress} 
                valid={validations.walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
                onBlur={() => this.handleInputBlur('crowdsale', 'walletAddress', 0)} 
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'walletAddress')}
                description={`Where the money goes after investors transactions. Immediately after each transaction. We recommend to setup a multisig wallet with hardware based signers.`}
              />
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={crowdsale[0].supply} 
                valid={validations.supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY}
                onBlur={() => this.handleInputBlur('crowdsale', 'supply', 0)} 
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'supply')}
                description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
              />
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={pricingStrategy[0].rate} 
                valid={validations.rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onBlur={() => this.handleInputBlur('crowdsale', 'rate', 0)}
                onChange={(e) => this.changeState(e, 'pricingStrategy', 0, 'rate')}
                description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
              />
            </div>
          </div>
          <div className="button-container">
            {this.renderStandardLinkComponent()}
          </div>
        </section>
      )
    } else if (this.state.contractType === this.state.contractTypes.whitelistwithcap) {
      let whitelistInputBlock = <div><div className="white-list-title">
              <p className="title">Whitelist</p>
            </div><WhitelistInputBlock
              num={0}
              onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, 0, prop)}
            ></WhitelistInputBlock></div>;
      return (
        <section className="steps steps_crowdsale-contract" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP}/>
          <div className="steps-content container">
            <div className="about-step">
              <div className="step-icons step-icons_crowdsale-setup"></div>
              <p className="title">Crowdsale setup</p>
              <p className="description">
              The most important and exciting part of the crowdsale process. Here you can define parameters of your crowdsale campaign.
              </p>
            </div>
            <div className="hidden">
              <InputField 
                side='left' 
                type='text' 
                title={CROWDSALE_SETUP_NAME} 
                value={crowdsale[0].tier}
                onBlur={() => this.handleInputBlur('crowdsale', 'tier', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'tier')}
                description={`Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We simplified that and will increment a number after each tier.`}
              />
              <InputField 
                side='right' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={crowdsale[0].walletAddress} 
                valid={validations.walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS} 
                onBlur={() => this.handleInputBlur('crowdsale', 'walletAddress', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'walletAddress')}
                description={`Where the money goes after investors transactions. Immediately after each transaction. We recommend to setup a multisig wallet with hardware based signers.`}
              />
              <InputField 
                side='left' 
                type='datetime-local' 
                title={START_TIME} 
                value={crowdsale[0].startTime} 
                valid={validations.startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'startTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'startTime')}
                description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
              />
              <InputField 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={crowdsale[0].endTime} 
                valid={validations.endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'endTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'endTime')}
                description={`Date and time when the tier ends. Can be only in the future.`}
              />
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={pricingStrategy[0].rate} 
                valid={validations.rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onBlur={() => this.handleInputBlur('crowdsale', 'rate', 0)}
                onChange={(e) => this.changeState(e, 'pricingStrategy', 0, 'rate')}
                description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
              />
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={crowdsale[0].supply} 
                valid={validations.supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY} 
                onBlur={() => this.handleInputBlur('crowdsale', 'supply', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'supply')}
                description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
              />
              <RadioInputField 
                  side='left' 
                  title={ALLOWMODIFYING} 
                  items={["on", "off"]}
                  vals={["on", "off"]}
                  state={this.state}
                  num={0}
                  defaultValue={this.state.crowdsale[0].updatable}
                  name='crowdsale-updatable-0'
                  onChange={(e) => this.changeState(e, 'crowdsale', 0, 'updatable')}
                  description={`Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`}
              />
              <RadioInputField 
                  side='right' 
                  title={DISABLEWHITELISTING} 
                  items={["yes", "no"]}
                  vals={["yes", "no"]}
                  state={this.state}
                  num={0}
                  defaultValue={this.state.crowdsale[0].whitelistdisabled}
                  name='crowdsale-whitelistdisabled-0'
                  onChange={(e) => this.changeState(e, 'crowdsale', 0, 'whitelistdisabled')}
                  description={`Disables whitelistings. Anyone can buy on the tier.`}
              />
            </div>
            {this.state.crowdsale[0].whitelistdisabled === "yes"?"":whitelistInputBlock}
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