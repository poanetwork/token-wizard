import React, { Component } from 'react'
import { StepNavigation } from '../Common/StepNavigation'
import { inject, observer } from 'mobx-react'
import { ButtonContinue } from '../Common/ButtonContinue'
import { checkWeb3ForErrors } from '../../utils/blockchainHelpers'
import { reloadStorage } from '../Home/utils'
import { NAVIGATION_STEPS, CROWDSALE_STRATEGIES, DOWNLOAD_STATUS } from '../../utils/constants'
import { clearStorage, navigateTo } from '../../utils/utils'
import { strategies } from '../../utils/strategies'
import { Loader } from '../Common/Loader'
import logdown from 'logdown'
import { StrategyItem } from './StrategyItem'

const logger = logdown('TW:StepOne')
const { CROWDSALE_STRATEGY } = NAVIGATION_STEPS
const { MINTED_CAPPED_CROWDSALE } = CROWDSALE_STRATEGIES

@inject('crowdsaleStore', 'contractStore', 'web3Store', 'generalStore')
@observer
export class StepOne extends Component {
  state = {
    loading: false,
    strategy: MINTED_CAPPED_CROWDSALE
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true })
      await checkWeb3ForErrors(result => {
        const { value } = result
        if (value) {
          navigateTo(this.props.history, 'home')
        }
      })

      const { strategy } = await this.load()
      this.setState({ strategy: strategy })
    } catch (e) {
      logger.log('An error has occurred', e)
    }

    this.setState({ loading: false })
  }

  async load() {
    // Reload storage
    clearStorage(this.props)
    await reloadStorage(this.props)

    // Set default strategy value
    const { crowdsaleStore } = this.props
    logger.log('CrowdsaleStore strategy', crowdsaleStore.strategy)
    return {
      strategy: crowdsaleStore.strategy
    }
  }

  goNextStep = () => {
    try {
      navigateTo(this.props.history, 'stepTwo')
    } catch (err) {
      logger.log('Error to navigate', err)
    }
  }

  handleChange = e => {
    const { crowdsaleStore } = this.props
    const strategy = e.currentTarget.value

    crowdsaleStore.setProperty('strategy', strategy)
    this.setState({
      strategy: crowdsaleStore.strategy
    })
    logger.log('CrowdsaleStore strategy selected:', strategy)
  }

  render() {
    const { contractStore } = this.props
    const status =
      (contractStore && contractStore.downloadStatus === DOWNLOAD_STATUS.SUCCESS) || localStorage.length > 0

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
              {strategies.map((strategy, i) => {
                return (
                  <StrategyItem
                    key={i}
                    strategy={this.state.strategy}
                    strategyType={strategy.type}
                    strategyDisplayTitle={strategy.display}
                    stragegyDisplayDescription={strategy.description}
                    handleChange={this.handleChange}
                  />
                )
              })}
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
