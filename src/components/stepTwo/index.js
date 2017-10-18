import React, { Component } from 'react'
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { StepNavigation } from '../Common/StepNavigation'
import { InputField } from '../Common/InputField'
import { ReservedTokensInputBlock } from '../Common/ReservedTokensInputBlock'
import { NAVIGATION_STEPS, VALIDATION_MESSAGES, TEXT_FIELDS } from '../../utils/constants'
import { inject, observer } from 'mobx-react';
const { TOKEN_SETUP } = NAVIGATION_STEPS
const { NAME, TICKER, DECIMALS } = TEXT_FIELDS

@inject('tokenStore', 'web3Store', 'tierCrowdsaleListStore') @observer
export class stepTwo extends Component {

  componentDidMount() {
    checkWeb3(this.props.web3Store.web3);
  }

  showErrorMessages = (parent) => {

    console.log('error',  this.props.tokenStore, this.props.tokenStore.validToken, this.props.tokenStore.isTokenValid)
    this.props.tokenStore.invalidateToken();
  }
  
  //depreciated
  /*setBlockTimes = (key, property, targetTime) => {
    let newState = { ...this.state }
    calculateFutureBlock(targetTime, this.state.blockTimeGeneration, (targetBlock) => {
      if (property === "startTime") {
        newState.crowdsale[key].startBlock = targetBlock;
        console.log("startBlock: " + newState.crowdsale[key].startBlock);
      } else if (property === "endTime") {
        newState.crowdsale[key].endBlock = targetBlock;
        console.log("endBlock: " + newState.crowdsale[key].endBlock);
      }
      this.setState(newState);
    });
  }*/

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

  updateTokenStore = (event, property) => {
    const value = event.target.value;
    this.props.tokenStore.setProperty(property, value);
    this.props.tokenStore.validateTokens(property);
  }

  renderLink () {
    return <Link className="button button_fill" to='/3'>Continue</Link>
  }

  renderLinkComponent = () => {
    if(this.props.tokenStore.isTokenValid) {
      return this.renderLink();
    }
    return <div onClick={this.showErrorMessages.bind(this, 'token')} className="button button_fill"> Continue</div>
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
              Configure properties of your token. Created token contract will be ERC-20 compatible. 
            </p>
          </div>
          <div className="hidden">
            <InputField side='left' type='text' 
              errorMessage={VALIDATION_MESSAGES.NAME} 
              valid={this.props.tokenStore.validToken['name']} 
              title={NAME} 
              value={this.props.tokenStore.name} 
              onChange={(e) => this.updateTokenStore(e, 'name')}
              description={`The name of your token. Will be used by Etherscan and other token browsers. Be afraid of trademarks.`}
            />
            <InputField 
              side='right' type='text' 
              errorMessage={VALIDATION_MESSAGES.TICKER} 
              valid={this.props.tokenStore.validToken['ticker']} 
              title={TICKER} 
              value={this.props.tokenStore.ticker} 
              onChange={(e) => this.updateTokenStore(e, 'ticker')}
              description={`The three letter ticker for your token. There are 17,576 combinations for 26 english letters. Be hurry. `}
            />
            <InputField 
              side='left' type='number'
              errorMessage={VALIDATION_MESSAGES.DECIMALS} 
              valid={this.props.tokenStore.validToken['decimals']} 
              title={DECIMALS}
              value={this.props.tokenStore.decimals} 
              onChange={(e) => this.updateTokenStore(e, 'decimals')} // changeInputField
              description={`Refers to how divisible a token can be, from 0 (not at all divisible) to 18 (pretty much continuous).`}
            />
          </div>
          <div className="reserved-tokens-title">
            <p className="title">Reserved tokens</p>
          </div>
          <ReservedTokensInputBlock />
        </div>
        <div className="button-container">
          {this.renderLinkComponent()}
        </div>
      </section>
  )}
}
