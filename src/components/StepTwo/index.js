import React, { Component } from 'react'
import logdown from 'logdown'
import setFieldTouched from 'final-form-set-field-touched'
import { Form } from 'react-final-form'
import { Loader } from '../Common/Loader'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { StepNavigation } from '../Common/StepNavigation'
import { StepTwoForm } from './StepTwoForm'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { inject, observer } from 'mobx-react'
import { navigateTo } from '../../utils/utils'

const { TOKEN_SETUP } = NAVIGATION_STEPS
const logger = logdown('TW:stepTwo:index')

@inject('tokenStore', 'crowdsaleStore', 'reservedTokenStore')
@observer
export class StepTwo extends Component {
  state = {
    loading: false,
    tokenValues: {},
    reload: false
  }

  async componentDidMount() {
    await checkWeb3()

    this.setState({ loading: true })
    const tokenValues = this.load()
    logger.log('Token Values', tokenValues)
    this.setState({ loading: false, tokenValues })
  }

  load() {
    const { tokenStore, crowdsaleStore, reservedTokenStore } = this.props
    const isEmpty = crowdsaleStore.isDutchAuction ? tokenStore.checkIsEmptyDutch : tokenStore.checkIsEmptyMinted

    if (isEmpty) {
      tokenStore.addTokenSetup()
    } else {
      this.setState({
        reload: true
      })
    }

    const token = crowdsaleStore.isDutchAuction ? tokenStore.tokenDutchStructure : tokenStore.tokenMintedStructure
    reservedTokenStore.applyDecimalsToTokens(token.decimals)
    return token
  }

  goNextStep = () => {
    try {
      navigateTo({
        history: this.props.history,
        location: 'stepThree'
      })
    } catch (err) {
      logger.log('Error to navigate', err)
    }
  }

  render() {
    return (
      <div>
        <section className="lo-MenuBarAndContent" ref="two">
          <StepNavigation activeStep={TOKEN_SETUP} />
          <div className="st-StepContent">
            <div className="st-StepContent_Info">
              <div className="st-StepContent_InfoIcon st-StepContent_InfoIcon-step2" />
              <div className="st-StepContentInfo_InfoText">
                <h1 className="st-StepContent_InfoTitle">Token setup</h1>
                <p className="st-StepContent_InfoDescription">
                  Configure properties for your token. Created token contract will be ERC-20 compatible.
                </p>
              </div>
            </div>
            <Form
              component={StepTwoForm}
              history={this.props.history}
              id="tokenData"
              initialValues={this.state.tokenValues}
              mutators={{ setFieldTouched }}
              onSubmit={this.goNextStep}
              reload={this.state.reload}
            />
          </div>
        </section>
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
