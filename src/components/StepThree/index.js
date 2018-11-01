import React, { Component } from 'react'
import createDecorator from 'final-form-calculate'
import arrayMutators from 'final-form-arrays'
import logdown from 'logdown'
import setFieldTouched from 'final-form-set-field-touched'
import { Form } from 'react-final-form'
import { Loader } from '../Common/Loader'
import { CHAINS, NAVIGATION_STEPS } from '../../utils/constants'
import { StepInfo } from '../Common/StepInfo'
import { StepNavigation } from '../Common/StepNavigation'
import { checkWeb3, getNetWorkNameById, getNetworkVersion } from '../../utils/blockchainHelpers'
import { getStep3Component } from './utils'
import { inject, observer } from 'mobx-react'
import { noGasPriceAvailable, warningOnMainnetAlert } from '../../utils/alerts'
import { navigateTo } from '../../utils/utils'

const logger = logdown('TW:StepThree')
const { CROWDSALE_SETUP } = NAVIGATION_STEPS

@inject(
  'contractStore',
  'web3Store',
  'tierStore',
  'generalStore',
  'gasPriceStore',
  'reservedTokenStore',
  'deploymentStore',
  'tokenStore',
  'crowdsaleStore'
)
@observer
export class StepThree extends Component {
  state = {
    loading: true,
    reload: false,
    initialTiers: [],
    burnExcess: 'no',
    gasTypeSelected: {}
  }

  async componentDidMount() {
    const { web3Store, gasPriceStore } = this.props

    checkWeb3(web3Store.web3)
    const { initialTiers, burnExcess, gasTypeSelected } = this.load()

    this.setState({
      initialTiers: initialTiers,
      burnExcess: burnExcess,
      gasTypeSelected: gasTypeSelected
    })

    window.scrollTo(0, 0)

    gasPriceStore
      .updateValues()
      .catch(() => noGasPriceAvailable())
      .then(() => this.setState({ loading: false }))
  }

  load() {
    const { tierStore, generalStore, web3Store, crowdsaleStore, gasPriceStore } = this.props

    if (tierStore.tiers.length === 0) {
      logger.log('Web3store', web3Store)
      tierStore.addCrowdsale(web3Store.curAddress)
    } else {
      this.setState({
        firstLoad: false
      })
    }

    let initialTiers

    if (crowdsaleStore.isDutchAuction) {
      initialTiers = [JSON.parse(JSON.stringify(tierStore.tiers))[0]]
    } else {
      initialTiers = JSON.parse(JSON.stringify(tierStore.tiers))
    }

    if (!generalStore.getGasTypeSelected) {
      generalStore.setGasTypeSelected(gasPriceStore.gasPricesInGwei[0])
    }

    return {
      initialTiers: initialTiers,
      burnExcess: generalStore.burnExcess,
      gasTypeSelected: generalStore.getGasTypeSelected
    }
  }

  goNextStep = () => {
    try {
      navigateTo({
        history: this.props.history,
        location: 'stepFour'
      })
    } catch (err) {
      logger.log('Error to navigate', err)
    }
  }

  handleOnSubmit = () => {
    const { tierStore, reservedTokenStore, deploymentStore, crowdsaleStore } = this.props
    const tiersCount = tierStore.tiers.length
    const reservedCount = reservedTokenStore.tokens.length
    const hasWhitelist = tierStore.tiers.some(tier => {
      return tier.whitelistEnabled === 'yes'
    })
    const hasMinCap = tierStore.tiers.some(tier => {
      return +tier.minCap !== 0
    })

    deploymentStore.initialize(!!reservedCount, hasWhitelist, crowdsaleStore.isDutchAuction, tierStore.tiers, hasMinCap)

    getNetworkVersion()
      .then(networkID => {
        if (getNetWorkNameById(networkID) === CHAINS.MAINNET) {
          const { generalStore } = this.props
          const priceSelected = generalStore.gasPrice
          let whitelistCount = 0

          if (hasWhitelist) {
            whitelistCount = tierStore.tiers.reduce((total, tier) => {
              if (tier.whitelist) {
                if (tier.whitelist.length) {
                  total++
                }
              }
              return total
            }, 0)
          }

          return warningOnMainnetAlert(tiersCount, priceSelected, reservedCount, whitelistCount, this.goNextStep)
        }

        this.goNextStep()
      })
      .catch(error => {
        logger.error(error)
      })
  }

  calculator = createDecorator({
    field: /.+\.endTime/,
    updates: (value, name) => {
      const nextTierIndex = +name.match(/(\d+)/)[1] + 1
      const { tierStore } = this.props
      const newValue = {}

      if (tierStore.tiers[nextTierIndex]) {
        newValue[`tiers[${nextTierIndex}].startTime`] = value
      }

      return newValue
    }
  })

  render() {
    if (this.state.initialTiers.length === 0) {
      // Do not render the form until tiers are set up
      return (
        <section className="steps steps_crowdsale-contract" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP} />
          <Loader show={this.state.loading} />
        </section>
      )
    }

    const { tierStore, tokenStore, gasPriceStore, generalStore, web3Store, crowdsaleStore } = this.props
    const stepThreeComponent = getStep3Component(crowdsaleStore.strategy)
    const stores = { tierStore, tokenStore, crowdsaleStore, generalStore, gasPriceStore }

    return (
      <div>
        <section className="lo-MenuBarAndContent" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP} />
          <div className="st-StepContent">
            <StepInfo
              description="The most important and exciting part of the crowdsale process.<br />Here you can define parameters of
              your crowdsale campaign."
              stepNumber="3"
              title="Crowdsale Setup"
            />
            <Form
              component={stepThreeComponent}
              decorators={[this.calculator]}
              history={this.props.history}
              initialValues={{
                burnExcess: this.state.burnExcess,
                gasPrice: this.state.gasTypeSelected,
                tiers: this.state.initialTiers,
                walletAddress: web3Store.curAddress,
                whitelistEnabled: 'no'
              }}
              mutators={{ ...arrayMutators, setFieldTouched }}
              onSubmit={this.handleOnSubmit}
              firstLoad={this.state.firstLoad}
              {...stores}
            />
          </div>
        </section>
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
