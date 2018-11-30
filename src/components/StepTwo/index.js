import React, { Component } from 'react'
import logdown from 'logdown'
import setFieldTouched from 'final-form-set-field-touched'
import { Form } from 'react-final-form'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { SectionInfo } from '../Common/SectionInfo'
import { StepNavigation } from '../Common/StepNavigation'
import { StepTwoForm } from './StepTwoForm'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import { inject, observer } from 'mobx-react'
import { navigateTo, goBack, goBackMustBeEnabled } from '../../utils/utils'

const { TOKEN_SETUP } = NAVIGATION_STEPS
const logger = logdown('TW:stepTwo:index')

@inject('tokenStore', 'crowdsaleStore', 'reservedTokenStore')
@observer
export class StepTwo extends Component {
  state = {
    tokenValues: {},
    reload: false,
    backButtonTriggered: false, //Testing purposes
    nextButtonTriggered: false, //Testing purposes
    goBackEnabledTriggered: false //Testing purposes
  }

  async componentDidMount() {
    await checkWeb3()

    logger.log('Component did mount')
    window.addEventListener('beforeunload', this.onUnload)

    const tokenValues = this.load()
    logger.log('Token Values', tokenValues)
    this.setState({ tokenValues: tokenValues })
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
      this.setState({
        nextButtonTriggered: true
      })
      navigateTo({
        history: this.props.history,
        location: 'stepThree',
        fromLocation: 'stepTwo'
      })
    } catch (err) {
      logger.log('Error to navigate', err)
    }
  }

  goBack = () => {
    try {
      this.setState({
        backButtonTriggered: true
      })
      goBack({
        history: this.props.history,
        location: '/stepOne'
      })
    } catch (err) {
      logger.log('Error to navigate', err)
    }
  }

  goBackEnabled = () => {
    let goBackEnabled = false
    try {
      this.setState({
        goBackEnabledTriggered: true
      })
      goBackEnabled = goBackMustBeEnabled({ history: this.props.history })
      logger.log(`Go back is enabled ${goBackEnabled}`)
    } catch (err) {
      logger.log(`There is an error trying to set enable/disable on back button`)
    }
    return goBackEnabled
  }

  onUnload = e => {
    logger.log('On unload')
    e.returnValue = 'Are you sure you want to leave?'
  }

  componentWillUnmount() {
    logger.log('Component unmount')
    window.removeEventListener('beforeunload', this.onUnload)
  }

  render() {
    return (
      <div>
        <section className="lo-MenuBarAndContent" ref="two">
          <StepNavigation activeStepTitle={TOKEN_SETUP} />
          <div className="st-StepContent">
            <SectionInfo
              description="Configure properties for your token. Created token contract will be ERC-20 compatible."
              stepNumber="2"
              title="Token Setup"
            />
            <Form
              component={StepTwoForm}
              id="tokenData"
              initialValues={this.state.tokenValues}
              mutators={{ setFieldTouched }}
              onSubmit={this.goNextStep}
              reload={this.state.reload}
              goBack={this.goBack}
              goBackEnabled={this.goBackEnabled}
            />
          </div>
        </section>
      </div>
    )
  }
}
