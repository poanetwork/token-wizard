import React from 'react'
import '../../assets/stylesheets/application.css';
import { Link, Redirect } from 'react-router-dom'
import { getWeb3, checkWeb3, setExistingContractParams, getNetworkVersion } from '../../utils/blockchainHelpers'
import { stepTwo } from '../stepTwo'
import { defaultCompanyStartDate } from './utils'
import { getOldState, stepsAreValid, allFieldsAreValid, defaultCompanyEndDate } from '../../utils/utils'
import { StepNavigation } from '../Common/StepNavigation'
import InputField from '../Common/InputField'
import { InputFieldExt } from '../Common/InputFieldExt'
import { RadioInputField } from '../Common/RadioInputField'
import { CrowdsaleBlock } from '../Common/CrowdsaleBlock'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { NAVIGATION_STEPS, defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS, intitialStepThreeValidations } from '../../utils/constants'
import { noDeploymentOnMainnetAlert, warningOnMainnetAlert } from '../../utils/alerts'
const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, MINCAP, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME, ALLOWMODIFYING, DISABLEWHITELISTING } = TEXT_FIELDS

export class stepThree extends stepTwo {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    const oldState = getOldState(props, defaultState)
    if (oldState.contracts.crowdsale.addr.length > 0) {
      oldState.contracts.pricingStrategy.addr = [];
      setExistingContractParams(oldState.contracts.crowdsale.abi, oldState.contracts.crowdsale.addr[0], this);
    }
    oldState.children = [];
    oldState.crowdsale[0].tier = "Tier 1"
    oldState.crowdsale[0].updatable = "off"
    oldState.crowdsale[0].whitelistdisabled = "yes"
    this.state = Object.assign({}, oldState, intitialStepThreeValidations )
  }

  addCrowdsale() {
    let newState = {...this.state}
    let num = newState.children.length + 1;
    newState.crowdsale.push({
      tier: "Tier " + (num + 1),
      supply: 0,
      updatable: "off",
      whitelist:[],
      whiteListElements: [],
      whiteListInput:{}
    });
    newState.validations.push({
      tier: VALID,
      startTime: VALID,
      endTime: VALID,
      supply: EMPTY,
      rate: EMPTY
    });
    newState.pricingStrategy.push({rate: 0});
    this.setState(newState, () => this.addCrowdsaleBlock(num));
  }

  gotoDeploymentStage() {
    let state = this.state;
    state.redirect = true;
    this.setState(state);
  }

  addCrowdsaleBlock(num) {
    let newState = {...this.state}
    newState.children.push(
      <CrowdsaleBlock
        num = {num}
        state = {this.state}
        onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, num, prop)}
        handleInputBlur={(parent, property, key) => this.handleInputBlur(parent, property, key)}
      />
    )
    this.setState(newState)
  }

  renderLink () {
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Redirect>
    }

    return <div>
    <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
    <div onClick={() => warningOnMainnetAlert(this.state.crowdsale.length, () => this.gotoDeploymentStage())} className="button button_fill"> Continue</div>
    </div>
  }

  renderLinkComponent () {
    if(stepsAreValid(this.state.validations) || (allFieldsAreValid('crowdsale', this.state) && allFieldsAreValid('pricingStrategy', this.state))){
      return this.renderLink()
    }

    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
      <div onClick={() => {
        this.showErrorMessages('crowdsale')
        this.showErrorMessages('pricingStrategy')
      }} className="button button_fill"> Continue</div>
    </div>
  }
  componentDidMount () {
    checkWeb3(this.state.web3);
    setTimeout( () => {
      getWeb3((web3) => {
        web3.eth.getAccounts().then((accounts) => {
          let newState = {...this.state}
          newState.crowdsale[0].walletAddress = accounts[0];
          newState.crowdsale[0].startTime = defaultCompanyStartDate();
          newState.crowdsale[0].endTime = defaultCompanyEndDate(newState.crowdsale[0].startTime);
          this.setState(newState);
        })
      });
    }, 500);
  }

  render() {
    const { validations } = this.state
    let { token } = this.state
    let { crowdsale } = this.state
    let { pricingStrategy } = this.state
    let globalSettingsBlock = <div><div className="section-title">
        <p className="title">Global limits</p>
      </div>
      <div className='input-block-container'>
        <InputField
          side='left'
          type='number'
          title={MINCAP}
          value={token.globalmincap}
          valid={validations.globalmincap}
          errorMessage={VALIDATION_MESSAGES.MINCAP}
          onBlur={() => this.handleInputBlur('token', 'globalmincap')}
          onChange={(e) => this.changeState(e, 'token', 0, 'globalmincap')}
          description={`Minimum amount tokens to buy. Not a mininal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
        />
      </div></div>
      let whitelistInputBlock = <div><div className="section-title">
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
              <div className='input-block-container'>
              <InputField
                side='left'
                type='text'
                title={CROWDSALE_SETUP_NAME}
                value={crowdsale[0].tier}
                valid={validations[0].tier}
                errorMessage={VALIDATION_MESSAGES.TIER}
                onBlur={() => this.handleInputBlur('crowdsale', 'tier', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'tier')}
                description={`Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We simplified that and will increment a number after each tier.`}
              />
              <InputFieldExt
                side='right'
                type='text'
                title={WALLET_ADDRESS}
                value={crowdsale[0].walletAddress}
                valid={validations[0].walletAddress}
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
                onBlur={() => this.handleInputBlur('crowdsale', 'walletAddress', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'walletAddress')}
                description={`Where the money goes after investors transactions. Immediately after each transaction. We recommend to setup a multisig wallet with hardware based signers.`}
              />
              </div>
              <div className='input-block-container'>
              <InputFieldExt
                side='left'
                type='datetime-local'
                title={START_TIME}
                value={crowdsale[0].startTime}
                valid={validations[0].startTime}
                errorMessage={VALIDATION_MESSAGES.START_TIME}
                onBlur={() => this.handleInputBlur('crowdsale', 'startTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'startTime')}
                description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
              />
              <InputFieldExt
                side='right'
                type='datetime-local'
                title={END_TIME}
                value={crowdsale[0].endTime}
                valid={validations[0].endTime}
                errorMessage={VALIDATION_MESSAGES.END_TIME}
                onBlur={() => this.handleInputBlur('crowdsale', 'endTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'endTime')}
                description={`Date and time when the tier ends. Can be only in the future.`}
              />
              </div>
              <div className='input-block-container'>
              <InputField
                side='left'
                type='number'
                title={RATE}
                value={pricingStrategy[0].rate}
                valid={validations[0].rate}
                errorMessage={VALIDATION_MESSAGES.RATE}
                onBlur={() => this.handleInputBlur('pricingStrategy', 'rate', 0)}
                onChange={(e) => this.changeState(e, 'pricingStrategy', 0, 'rate')}
                description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
              />
              <InputField
                side='right'
                type='number'
                title={SUPPLY}
                value={crowdsale[0].supply}
                valid={validations[0].supply}
                errorMessage={VALIDATION_MESSAGES.SUPPLY}
                onBlur={() => this.handleInputBlur('crowdsale', 'supply', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'supply')}
                description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
              />
              </div>
              <div className='input-block-container'>
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
              {this.state.crowdsale[0].whitelistdisabled === "no"?"":globalSettingsBlock}
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
