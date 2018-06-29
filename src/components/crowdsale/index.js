import React from 'react'
import '../../assets/stylesheets/application.css'
import {
  getCurrentAccount,
  checkNetWorkByID,
  checkWeb3,
  attachToSpecificCrowdsaleContract,
  getCrowdsaleStrategy
} from '../../utils/blockchainHelpers'
import {
  getContractStoreProperty,
  getCrowdsaleData,
  getTokenData,
  initializeAccumulativeData,
  toBigNumber
} from './utils'
import { getExecID, getAddr, getNetworkID } from '../../utils/utils'
import { getCrowdsaleAssets } from '../../stores/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { Loader } from '../Common/Loader'
import { CrowdsaleConfig } from '../Common/config'
import { inject, observer } from 'mobx-react'
import { invalidCrowdsaleExecIDAlert, invalidCrowdsaleAddrAlert, invalidNetworkIDAlert } from '../../utils/alerts'

const { CROWDSALE_PAGE } = NAVIGATION_STEPS

@inject('contractStore', 'crowdsaleStore', 'crowdsalePageStore', 'web3Store', 'tierStore', 'tokenStore', 'generalStore')
@observer
export class Crowdsale extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount() {
    this.validateEnvironment()
      .then(() => this.getCrowdsale())
      .then(() => this.extractContractsData())
      .catch(err => console.error(err))
      .then(() => this.setState({ loading: false }))
  }

  validateEnvironment = async () => {
    const { generalStore, web3Store, contractStore } = this.props

    await checkWeb3()

    if (!web3Store.web3) {
      return Promise.reject('no web3 available')
    }

    const networkID = CrowdsaleConfig.networkID || getNetworkID()
    generalStore.setProperty('networkID', networkID)

    const networkInfo = await checkNetWorkByID(networkID)

    if (networkInfo === null || !networkID) {
      invalidNetworkIDAlert()
      return Promise.reject('invalid networkID')
    } else if (String(networkInfo) !== networkID) {
      return Promise.reject('invalid networkID')
    }

    //todo: change config to support exec-id and address
    const crowdsaleExecID = CrowdsaleConfig.crowdsaleContractURL || getExecID()
    contractStore.setContractProperty('crowdsale', 'execID', crowdsaleExecID)
  }

  getCrowdsale = async () => {
    const { crowdsaleStore, contractStore, generalStore } = this.props

    try {
      await getCrowdsaleAssets(generalStore.networkID)
      const strategy = await getCrowdsaleStrategy(contractStore.crowdsale.execID)
      crowdsaleStore.setProperty('strategy', strategy)
      const crowdsaleAddr = CrowdsaleConfig.crowdsaleContractURL || getAddr()
      contractStore.setContractProperty(crowdsaleStore.proxyName, 'addr', crowdsaleAddr)
      //todo: change to 2 alerts
      if (!contractStore.crowdsale.execID && !crowdsaleAddr) {
        invalidCrowdsaleExecIDAlert()
        return Promise.reject('invalid exec-id or addr')
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  extractContractsData = async () => {
    const { crowdsaleStore, contractStore } = this.props

    let target
    if (contractStore.crowdsale && contractStore.crowdsale.execID) {
      const targetPrefix = 'idx'
      const targetSuffix = crowdsaleStore.contractTargetSuffix
      target = `${targetPrefix}${targetSuffix}`
      console.log('target:', target)
    } else {
      target = crowdsaleStore.proxyName
    }

    try {
      const initCrowdsaleContract = await attachToSpecificCrowdsaleContract(target)
      await this.getFullCrowdsaleData(initCrowdsaleContract)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  getFullCrowdsaleData = async initCrowdsaleContract => {
    const { execID } = this.props.contractStore.crowdsale

    try {
      const account = await getCurrentAccount()
      await getTokenData(initCrowdsaleContract, execID, account)
      await getCrowdsaleData(initCrowdsaleContract, execID)
      await initializeAccumulativeData()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  goToContributePage = () => {
    const { contractStore, generalStore, crowdsaleStore } = this.props
    const { crowdsale } = contractStore
    const { proxyName } = crowdsaleStore
    let queryStr = ''
    if (!CrowdsaleConfig.crowdsaleContractURL || !CrowdsaleConfig.networkID) {
      const crowdsaleParamVal = crowdsale.execID || (contractStore[proxyName] ? contractStore[proxyName].addr : null)
      if (crowdsaleParamVal) {
        let crowdsaleParam
        if (crowdsale.execID) {
          crowdsaleParam = 'exec-id'
        } else {
          if (contractStore[proxyName].addr) {
            crowdsaleParam = 'addr'
          }
        }
        queryStr = `?${crowdsaleParam}=${crowdsaleParamVal}`
        if (generalStore.networkID) {
          queryStr += '&networkID=' + generalStore.networkID
        }
      }
    }

    this.props.history.push('/contribute' + queryStr)
  }

  render() {
    const { web3Store, tokenStore, crowdsalePageStore, contractStore, crowdsaleStore } = this.props
    const { web3 } = web3Store
    const { proxyName } = crowdsaleStore

    const crowdsaleExecID = getContractStoreProperty('crowdsale', 'execID')
    const contributorsCount = crowdsalePageStore.contributors ? crowdsalePageStore.contributors.toString() : 0

    const rate = toBigNumber(crowdsalePageStore.rate)
    const tokenDecimals = toBigNumber(tokenStore.decimals)
    const maximumSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
    const maximumSellableTokensInWei = toBigNumber(crowdsalePageStore.maximumSellableTokensInWei)
    const ethRaised = toBigNumber(crowdsalePageStore.ethRaised)
    const tokensSold = toBigNumber(crowdsalePageStore.tokensSold)
    const maxCapBeforeDecimals = maximumSellableTokens.div(`1e${tokenDecimals}`)

    // tokens claimed
    const tokensClaimedTiers = tokensSold.div(`1e${tokenDecimals}`).toFixed()
    const tokensClaimed = tokensClaimedTiers

    //price
    const rateInETH = toBigNumber(web3.utils.fromWei(rate.toFixed(), 'ether'))
    const tokensPerETH =
      rateInETH > 0
        ? rateInETH
            .pow(-1)
            .decimalPlaces(0)
            .toFixed()
        : 0

    //total supply
    const totalSupply = maxCapBeforeDecimals.toFixed()

    //goal in ETH
    const goalInETHTiers = toBigNumber(web3.utils.fromWei(maximumSellableTokensInWei.toFixed(), 'ether')).toFixed()
    const goalInETH = goalInETHTiers
    const tokensClaimedRatio =
      goalInETH > 0
        ? ethRaised
            .div(goalInETH)
            .times(100)
            .toFixed()
        : '0'

    const contributorsBlock = (
      <div className="right">
        <p className="title">{`${contributorsCount}`}</p>
        <p className="description">Contributors</p>
      </div>
    )

    const proxy = contractStore[proxyName]
    return (
      <section className="steps steps_crowdsale-page">
        <StepNavigation activeStep={CROWDSALE_PAGE} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-page" />
            <p className="title">Crowdsale Page</p>
            <p className="description">
              Page with statistics of crowdsale. Statistics for all tiers combined on the page. Please press Ctrl-D to
              bookmark the page.
            </p>
          </div>
          <div className="total-funds">
            <div className="hidden">
              <div className="left">
                <p className="total-funds-title">{`${ethRaised.toFixed()}`} ETH</p>
                <p className="total-funds-description">Total Raised Funds</p>
              </div>
              <div className="right">
                <p className="total-funds-title">{`${goalInETH}`} ETH</p>
                <p className="total-funds-description">Goal</p>
              </div>
            </div>
          </div>
          <div className="total-funds-chart-container">
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart-division" />
            <div className="total-funds-chart">
              <div className="total-funds-chart-active" style={{ width: `${tokensClaimedRatio}%` }} />
            </div>
          </div>
          <div className="total-funds-statistics">
            <div className="hidden">
              <div className="left" style={{ width: '42% ' }}>
                <div className="hidden">
                  <div className="left">
                    <p className="title">{`${tokensClaimed}`}</p>
                    <p className="description">Tokens Claimed</p>
                  </div>
                  {contributorsBlock}
                </div>
                <p className="hash">{`${crowdsaleExecID || (proxy && proxy.addr)}`}</p>
                <p className="description">{crowdsaleExecID ? 'Crowdsale Execution ID' : 'Crowdsale Proxy Address'}</p>
              </div>
              <div className="right" style={{ width: '58%' }}>
                <div className="hidden">
                  <div className="left">
                    <p className="title">{`${tokensPerETH}`}</p>
                    <p className="description">Price (Tokens/ETH)</p>
                  </div>
                  <div className="right">
                    <p className="title">{`${totalSupply}`}</p>
                    <p className="description">Total Supply</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="button-container">
          <a onClick={this.goToContributePage} className="button button_fill">
            Contribute
          </a>
        </div>
        <Loader show={this.state.loading} />
      </section>
    )
  }
}
