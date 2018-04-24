import React from "react";
import "../../assets/stylesheets/application.css";
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { setExistingContractParams, getNetworkVersion, getNetWorkNameById } from "../../utils/blockchainHelpers";
import { StepNavigation } from "../Common/StepNavigation";
import { NAVIGATION_STEPS, CHAINS } from '../../utils/constants'
import { inject, observer } from "mobx-react";
import { Loader } from '../Common/Loader'
import { noGasPriceAvailable, warningOnMainnetAlert } from '../../utils/alerts'
import { StepThreeForm } from './StepThreeForm'
import { isLessOrEqualThan } from '../../utils/validations'

const { CROWDSALE_SETUP } = NAVIGATION_STEPS;

@inject(
  "contractStore",
  "web3Store",
  "tierStore",
  "generalStore",
  "gasPriceStore",
  "reservedTokenStore",
  "deploymentStore",
  "tokenStore"
)
@observer
export class stepThree extends React.Component {
  constructor(props) {
    super(props);

    const { contractStore } = props;

    if (contractStore.crowdsale.addr.length > 0) {
      contractStore.setContractProperty("pricingStrategy", "addr", []);
      setExistingContractParams(contractStore.abi, contractStore.addr[0], contractStore.setContractProperty);
    }

    this.state = {
      loading: true,
    }
  }

  componentWillMount () {
    const { gasPriceStore, tierStore, web3Store } = this.props

    if (tierStore.tiers.length === 0) {
      tierStore.addCrowdsale(web3Store.curAddress)
      this.initialTiers = JSON.parse(JSON.stringify(tierStore.tiers))
    }

    gasPriceStore.updateValues()
      .catch(() => noGasPriceAvailable())
      .then(() => {
        this.setState({ loading: false })
        window.scrollTo(0, 0)
      })
  }

  goToDeploymentStage = () => {
    this.props.history.push('/4')
  }

  handleOnSubmit = () => {
    const { tierStore, reservedTokenStore, deploymentStore } = this.props
    const tiersCount = tierStore.tiers.length
    const reservedCount = reservedTokenStore.tokens.length
    const hasWhitelist = tierStore.tiers[0].whitelistEnabled === 'yes'

    deploymentStore.initialize(!!reservedCount, hasWhitelist, tiersCount)

    getNetworkVersion()
      .then(networkID => {
        if (getNetWorkNameById(networkID) === CHAINS.MAINNET) {
          const { generalStore } = this.props
          const priceSelected = generalStore.gasPrice
          let whitelistCount = 0

          if (hasWhitelist) {
            whitelistCount = tierStore.tiers.reduce((total, tier) => {
              total += tier.whitelist.length
              return total
            }, 0)
          }

          return warningOnMainnetAlert(tiersCount, priceSelected, reservedCount, whitelistCount, this.goToDeploymentStage)
        }

        this.goToDeploymentStage()
      })
      .catch(error => {
        console.error(error)
      })
  }

  render () {
    const { generalStore, tierStore, gasPriceStore, tokenStore, web3Store } = this.props

    return (
      <section className="steps steps_crowdsale-contract" ref="three">
        <StepNavigation activeStep={CROWDSALE_SETUP}/>
        <Form
          onSubmit={this.handleOnSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{
            walletAddress: web3Store.curAddress,
            minCap: 0,
            gasPrice: gasPriceStore.gasPricesInGwei[0],
            whitelistEnabled: "no",
            tiers: this.initialTiers
          }}
          component={StepThreeForm}
          addCrowdsale={tierStore.addCrowdsale}
          gasPricesInGwei={gasPriceStore.gasPricesInGwei}
          decimals={tokenStore.decimals}
          tierStore={tierStore}
          generalStore={generalStore}
          validate={(values) => {
            const errors = {}
            const maxSupply = tierStore.maxSupply
            const minCap = maxSupply !== 0
              ? isLessOrEqualThan('Should be less or equal than the supply of some tier')(maxSupply)(values.minCap)
              : undefined

            if (minCap) errors.minCap = minCap

            return errors
          }}
        />
        <Loader show={this.state.loading}/>
      </section>
    )
  }
}
