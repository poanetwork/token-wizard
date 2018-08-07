import React, { Component } from 'react'
import '../../assets/stylesheets/application.css'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { StepNavigation } from '../Common/StepNavigation'
import { Loader } from '../Common/Loader'
import { clearingReservedTokens, noMoreReservedSlotAvailable } from '../../utils/alerts'
import { NAVIGATION_STEPS, VALIDATION_TYPES } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { Form } from 'react-final-form'
import { StepTwoForm } from './StepTwoForm'
import logdown from 'logdown'

const { TOKEN_SETUP } = NAVIGATION_STEPS
const { VALID, INVALID } = VALIDATION_TYPES

// eslint-disable-next-line no-unused-vars
const logger = logdown('TW:stepTwo:index')

@inject('tokenStore', 'crowdsaleStore', 'web3Store', 'reservedTokenStore')
@observer
export class stepTwo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  async componentDidMount() {
    const { tokenStore, web3Store, crowdsaleStore } = this.props
    await checkWeb3(web3Store.web3)

    if (tokenStore.isEmpty(crowdsaleStore)) {
      tokenStore.addTokenSetup()
    }

    this.tokenValues = tokenStore.getToken(crowdsaleStore)

    this.setState({ loading: false })
  }

  removeReservedToken = index => {
    const { reservedTokenStore } = this.props

    reservedTokenStore.removeToken(index)
  }

  clearReservedTokens = async () => {
    const { reservedTokenStore } = this.props

    let result = await clearingReservedTokens()
    if (result && result.value) {
      reservedTokenStore.clearAll()
    }
  }

  validateReservedTokensList = () => {
    const { reservedTokenStore } = this.props

    let result = reservedTokenStore.validateLength
    if (!result) {
      noMoreReservedSlotAvailable()
    }
    return result
  }

  addReservedTokensItem = newToken => {
    const { reservedTokenStore } = this.props

    reservedTokenStore.addToken(newToken)
  }

  updateTokenStore = ({ values, errors }) => {
    const { tokenStore } = this.props

    Object.keys(values).forEach(key => {
      tokenStore.setProperty(key, values[key])
      tokenStore.updateValidity(key, errors[key] !== undefined ? INVALID : VALID)
    })
  }

  onSubmit = () => {
    this.props.history.push('/3')
  }

  render() {
    const { reservedTokenStore, crowdsaleStore, tokenStore } = this.props
    const decimals =
      tokenStore.validToken.decimals === VALID && tokenStore.decimals >= 0 ? parseInt(tokenStore.decimals, 10) : 0

    return (
      <section className="steps steps_crowdsale-contract" ref="two">
        <StepNavigation activeStep={TOKEN_SETUP} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_token-setup" />
            <p className="title">Token setup</p>
            <p className="description">Configure properties of your token. Created token will be ERC-20 compatible.</p>
          </div>
          <Form
            onSubmit={this.onSubmit}
            initialValues={this.tokenValues}
            component={StepTwoForm}
            disableDecimals={!!reservedTokenStore.tokens.length}
            updateTokenStore={this.updateTokenStore}
            tokens={reservedTokenStore.tokens}
            decimals={decimals}
            addReservedTokensItem={this.addReservedTokensItem}
            validateReservedTokensList={this.validateReservedTokensList}
            removeReservedToken={this.removeReservedToken}
            clearAll={this.clearReservedTokens}
            id="tokenData"
            crowdsaleStore={crowdsaleStore}
          />
        </div>
        <Loader show={this.state.loading} />
      </section>
    )
  }
}
