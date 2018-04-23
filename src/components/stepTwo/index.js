import React, { Component } from 'react'
import '../../assets/stylesheets/application.css'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { StepNavigation } from '../Common/StepNavigation'
import { clearingReservedTokens } from '../../utils/alerts'
import { NAVIGATION_STEPS, VALIDATION_TYPES } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { Form } from 'react-final-form'
import { StepTwoForm } from './StepTwoForm'

const { TOKEN_SETUP } = NAVIGATION_STEPS
const { VALID, INVALID } = VALIDATION_TYPES

@inject('tokenStore', 'web3Store', 'reservedTokenStore')
@observer
export class stepTwo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tokenValues: {
        name: this.props.tokenStore.name,
        ticker: this.props.tokenStore.ticker,
        decimals: this.props.tokenStore.decimals || 0,
      }
    }
  }

  componentDidMount() {
    checkWeb3(this.props.web3Store.web3)
  }

  removeReservedToken = index => {
    this.props.reservedTokenStore.removeToken(index)
  }

  clearReservedTokens = () => {
    return clearingReservedTokens()
      .then(result => {
        if (result.value) {
          this.props.reservedTokenStore.clearAll()
        }
      })
  }

  addReservedTokensItem = newToken => {
    this.props.reservedTokenStore.addToken(newToken)
  }

  updateTokenStore = ({ values, errors }) => {
    const { tokenStore } = this.props

    Object.keys(values).forEach((key) => {
      tokenStore.setProperty(key, values[key])
      tokenStore.updateValidity(key, errors[key] !== undefined ? INVALID : VALID)
    })
  }

  onSubmit = () => {
    this.props.history.push('/3')
  }

  render () {
    const decimals = this.props.tokenStore.validToken.decimals === VALID && this.props.tokenStore.decimals >= 0
      ? parseInt(this.props.tokenStore.decimals, 10)
      : 0

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
          <Form
            onSubmit={this.onSubmit}
            initialValues={this.state.tokenValues}
            component={StepTwoForm}
            disableDecimals={!!this.props.reservedTokenStore.tokens.length}
            updateTokenStore={this.updateTokenStore}
            tokens={this.props.reservedTokenStore.tokens}
            decimals={decimals}
            addReservedTokensItem={this.addReservedTokensItem}
            removeReservedToken={this.removeReservedToken}
            clearAll={this.clearReservedTokens}
            id="tokenData"
          />
        </div>
      </section>
    )}
}
