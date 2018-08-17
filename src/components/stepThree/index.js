import React from 'react'
import '../../assets/stylesheets/application.css'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { getNetworkVersion, getNetWorkNameById, checkWeb3 } from '../../utils/blockchainHelpers'
import { StepNavigation } from '../Common/StepNavigation'
import { NAVIGATION_STEPS, CHAINS } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { Loader } from '../Common/Loader'
import { noGasPriceAvailable, warningOnMainnetAlert } from '../../utils/alerts'
import { getStep3Component } from './utils'
import createDecorator from 'final-form-calculate'
import logdown from 'logdown'
import { sleep } from '../../utils/utils'
import setFieldTouched from 'final-form-set-field-touched'

const logger = logdown('TW:stepThree')

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
export class stepThree extends React.Component {
  state = {
    loading: false,
    reload: false,
    initialTiers: [],
    burnExcess: 'no',
    gasTypeSelected: {}
  }

  async componentDidMount() {
    const { web3Store, gasPriceStore } = this.props
    await checkWeb3(web3Store.web3)

    this.setState({ loading: true })
    const { initialTiers, burnExcess, gasTypeSelected } = await this.load()

    try {
      await gasPriceStore.updateValues()
    } catch (error) {
      noGasPriceAvailable()
    }

    this.setState({
      loading: false,
      initialTiers: initialTiers,
      burnExcess: burnExcess,
      gasTypeSelected: gasTypeSelected
    })
    window.scrollTo(0, 0)
  }

  async load() {
    const { tierStore, generalStore, web3Store, crowdsaleStore } = this.props

    await sleep(1000)

    if (tierStore.tiers.length === 0) {
      logger.log('Web3store', web3Store)
      tierStore.addCrowdsale(web3Store.curAddress)
    } else {
      this.setState({
        reload: true
      })
    }

    let initialTiers

    if (crowdsaleStore.isDutchAuction) {
      initialTiers = [JSON.parse(JSON.stringify(tierStore.tiers))[0]]
    } else {
      initialTiers = JSON.parse(JSON.stringify(tierStore.tiers))
    }

    return {
      initialTiers: initialTiers,
      burnExcess: generalStore.burnExcess,
      gasTypeSelected: generalStore.getGasTypeSelected
    }
  }

  goToDeploymentStage = () => {
    this.props.history.push('/4')
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

          return warningOnMainnetAlert(
            tiersCount,
            priceSelected,
            reservedCount,
            whitelistCount,
            this.goToDeploymentStage
          )
        }

        this.goToDeploymentStage()
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

  updateGasTypeSelected = value => {
    const { generalStore } = this.props
    this.setState({
      gasTypeSelected: value
    })
    generalStore.setGasTypeSelected(value)
  }

  render() {
    if (this.state.initialTiers.length === 0) {
      //Not render the form until tiers are setup
      return (
        <section className="steps steps_crowdsale-contract" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP} />
          <Loader show={this.state.loading} />
        </section>
      )
    }

    const { generalStore, tierStore, gasPriceStore, tokenStore, web3Store, crowdsaleStore } = this.props
    let stepThreeComponent = getStep3Component(crowdsaleStore.strategy)

    return (
      <section className="steps steps_crowdsale-contract" ref="three">
        <StepNavigation activeStep={CROWDSALE_SETUP} />
        <Form
          onSubmit={this.handleOnSubmit}
          mutators={{ ...arrayMutators, setFieldTouched }}
          decorators={[this.calculator]}
          initialValues={{
            walletAddress: web3Store.curAddress,
            gasPrice: this.state.gasTypeSelected,
            whitelistEnabled: 'no',
            burnExcess: this.state.burnExcess,
            tiers: this.state.initialTiers
          }}
          component={stepThreeComponent}
          addCrowdsale={tierStore.addCrowdsale}
          gasPricesInGwei={gasPriceStore.gasPricesInGwei}
          decimals={tokenStore.decimals}
          updateGasTypeSelected={this.updateGasTypeSelected}
          tierStore={tierStore}
          generalStore={generalStore}
          crowdsaleStore={crowdsaleStore}
          reload={this.state.reload}
        />
        <Loader show={this.state.loading} />
      </section>
    )
  }
}
