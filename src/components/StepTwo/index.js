import React, { Component } from 'react'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { StepNavigation } from '../Common/StepNavigation'
import { Loader } from '../Common/Loader'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { Form } from 'react-final-form'
import { StepTwoForm } from './StepTwoForm'
import logdown from 'logdown'
import setFieldTouched from 'final-form-set-field-touched'

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

  /**
   * Goto to the step 3 on submit
   */
  onSubmit = () => {
    this.props.history.push('/3')
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
              id="tokenData"
              initialValues={this.state.tokenValues}
              mutators={{ setFieldTouched }}
              onSubmit={this.onSubmit}
              reload={this.state.reload}
              history={this.props.history}
            />
          </div>
        </section>
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
