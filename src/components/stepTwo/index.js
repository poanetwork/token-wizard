import React, { Component } from 'react'
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { StepNavigation } from '../Common/StepNavigation'
import { InputField } from '../Common/InputField'
import { NumericInput } from '../Common/NumericInput'
import { ReservedTokensInputBlock } from '../Common/ReservedTokensInputBlock'
import { NAVIGATION_STEPS, VALIDATION_MESSAGES, TEXT_FIELDS, DESCRIPTION } from '../../utils/constants'
import { inject, observer } from 'mobx-react';

const { TOKEN_SETUP } = NAVIGATION_STEPS
const { NAME, TICKER, DECIMALS } = TEXT_FIELDS

@inject('tokenStore', 'web3Store', 'tierCrowdsaleListStore', 'reservedTokenStore') @observer
export class stepTwo extends Component {
  componentDidMount() {
    checkWeb3(this.props.web3Store.web3);
  }

  showErrorMessages = (parent) => {
    this.props.tokenStore.invalidateToken();
  }

  updateTokenStore = (event, property) => {
    const value = event.target.value;
    this.props.tokenStore.setProperty(property, value);
    this.props.tokenStore.validateTokens(property);
  }

  updateDecimalsStore = value => {
    this.updateTokenStore({ target: { value } }, 'decimals')
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

  removeReservedToken = index => {
    this.props.reservedTokenStore.removeToken(index)
  }

  addReservedTokensItem = newToken => {
    this.props.reservedTokenStore.addToken(newToken)
  }

  render () {
    return (
      <section className="steps steps_crowdsale-contract" ref="two">
        <StepNavigation activeStep={TOKEN_SETUP}/>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_token-setup"/>
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
              description={`${DESCRIPTION.TOKEN_TICKER} There are 11,881,376 combinations for 26 english letters. Be hurry. `}
            />
            <NumericInput
              side="left"
              title={DECIMALS}
              description="Refers to how divisible a token can be, from 0 (not at all divisible) to 18 (pretty much continuous)."
              min={0}
              max={18}
              errorMessage={VALIDATION_MESSAGES.DECIMALS}
              onValueUpdate={this.updateDecimalsStore}
            />
          </div>
          <div className="reserved-tokens-title">
            <p className="title">Reserved tokens</p>
          </div>
          <ReservedTokensInputBlock
            tokens={this.props.reservedTokenStore.tokens}
            addReservedTokensItem={this.addReservedTokensItem}
            removeReservedToken={this.removeReservedToken}
          />
        </div>
        <div className="button-container">
          {this.renderLinkComponent()}
        </div>
      </section>
    )}
}
