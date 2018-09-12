import React, { Component } from 'react'
import { StepNavigation } from '../Common/StepNavigation'
import { inject, observer } from 'mobx-react'
import { ButtonContinue } from '../Common/ButtonContinue'
import { checkWeb3 } from '../../utils/blockchainHelpers'
import {
  NAVIGATION_STEPS,
  CROWDSALE_STRATEGIES,
  CROWDSALE_STRATEGIES_DISPLAYNAMES,
  DOWNLOAD_STATUS
} from '../../utils/constants'
import logdown from 'logdown'
import { Loader } from '../Common/Loader'

const logger = logdown('TW:StepOne')
const { CROWDSALE_STRATEGY } = NAVIGATION_STEPS
const { MINTED_CAPPED_CROWDSALE, DUTCH_AUCTION } = CROWDSALE_STRATEGIES

@inject('crowdsaleStore', 'contractStore', 'web3Store')
@observer
export class StepOne extends Component {
  state = {
    loading: false,
    strategy: null
  }

  async componentDidMount() {
    const { crowdsaleStore } = this.props
    await checkWeb3()

    this.setState({ loading: true })
    logger.log('CrowdsaleStore strategy', crowdsaleStore.strategy)

    // Set default value
    if (crowdsaleStore && !crowdsaleStore.strategy) {
      crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)
    }

    this.setState({
      loading: false,
      strategy: crowdsaleStore.strategy
    })
  }

  /**
   * Handle radio input and set value for strategy
   * @param e
   */
  handleChange = e => {
    const { crowdsaleStore } = this.props
    const strategy = e.currentTarget.value

    crowdsaleStore.setProperty('strategy', strategy)
    this.setState({
      strategy: crowdsaleStore.strategy
    })
    logger.log('CrowdsaleStore strategy selected:', strategy)
  }

  navigateTo = (location, params = '') => {
    const path =
      {
        home: '/',
        stepOne: '1',
        stepTwo: '2',
        manage: 'manage'
      }[location] || null

    if (path === null) {
      throw new Error(`invalid location specified: ${location}`)
    }

    this.props.history.push(`${path}${params}`)
  }

  goNextStep = async () => {
    this.navigateTo('stepTwo')
  }

  /**
   * Render method for stepOne component
   * @returns {*}
   */
  render() {
    const { contractStore } = this.props

    let status = (contractStore && contractStore.downloadStatus === DOWNLOAD_STATUS.SUCCESS) || localStorage.length > 0

    return (
      <div>
        <section className="lo-MenuBarAndContent">
          <StepNavigation activeStep={CROWDSALE_STRATEGY} />
          <div className="st-StepContent">
            <div className="st-StepContent_Info">
              <div className="st-StepContent_InfoIcon st-StepContent_InfoIcon-step1" />
              <div className="st-StepContentInfo_InfoText">
                <h1 className="st-StepContent_InfoTitle">{CROWDSALE_STRATEGY}</h1>
                <p className="st-StepContent_InfoDescription">Select a strategy for your crowdsale contract.</p>
              </div>
            </div>
            <div className="sw-RadioItems">
              <label className="sw-RadioItems_Item">
                <input
                  checked={this.state.strategy === MINTED_CAPPED_CROWDSALE}
                  className="sw-RadioItems_InputRadio"
                  id={MINTED_CAPPED_CROWDSALE}
                  name="contract-type"
                  onChange={this.handleChange}
                  type="radio"
                  value={MINTED_CAPPED_CROWDSALE}
                />
                <span className="sw-RadioItems_ItemContent">
                  <span className="sw-RadioItems_ItemContentText">
                    <span className="sw-RadioItems_ItemTitle">
                      {CROWDSALE_STRATEGIES_DISPLAYNAMES.MINTED_CAPPED_CROWDSALE}
                    </span>
                    <span className="sw-RadioItems_ItemDescription">
                      Modern crowdsale strategy with multiple tiers, whitelists, and limits. Recommended for every
                      crowdsale.
                    </span>
                  </span>
                  <span className="sw-RadioItems_Radio" />
                </span>
              </label>
              <label className="sw-RadioItems_Item">
                <input
                  checked={this.state.strategy === DUTCH_AUCTION}
                  className="sw-RadioItems_InputRadio"
                  id={DUTCH_AUCTION}
                  name="contract-type"
                  onChange={this.handleChange}
                  type="radio"
                  value={DUTCH_AUCTION}
                />
                <span className="sw-RadioItems_ItemContent">
                  <span className="sw-RadioItems_ItemContentText">
                    <span className="sw-RadioItems_ItemTitle">{CROWDSALE_STRATEGIES_DISPLAYNAMES.DUTCH_AUCTION}</span>
                    <span className="sw-RadioItems_ItemDescription">An auction with descending price.</span>
                  </span>
                  <span className="sw-RadioItems_Radio" />
                </span>
              </label>
            </div>
            <div className="st-StepContent_Buttons">
              <ButtonContinue status={status} onClick={() => this.goNextStep()} />
            </div>
          </div>
        </section>
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
