import React from 'react'
import {
  getCurrentAccount,
  checkNetWorkByID,
  checkWeb3,
  attachToSpecificCrowdsaleContract,
  attachToSpecificCrowdsaleContractByAddr,
  getCrowdsaleStrategy,
  getCrowdsaleStrategyByName
} from '../../utils/blockchainHelpers'
import {
  getExecID,
  getAddr,
  getContractStoreProperty,
  getCrowdsaleData,
  getTokenData,
  initializeAccumulativeData
} from './utils'
import logdown from 'logdown'
import { ButtonContinue } from '../Common/ButtonContinue'
import { CrowdsaleConfig } from '../Common/config'
import { CrowdsaleID } from './CrowdsaleID'
import { CrowdsaleProgress } from './CrowdsaleProgress'
import { CrowdsaleSummaryMintedCapped } from './CrowdsaleSummaryMintedCapped'
import { CrowdsaleSummaryDutchAuction } from './CrowdsaleSummaryDutchAuction'
import { Loader } from '../Common/Loader'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { StepInfo } from '../Common/StepInfo'
import { StepNavigation } from '../Common/StepNavigation'
import { getCrowdsaleAssets } from '../../stores/utils'
import { getNetworkID, toBigNumber, isExecIDValid } from '../../utils/utils'
import { inject, observer } from 'mobx-react'
import { invalidCrowdsaleExecIDAlert, invalidNetworkIDAlert } from '../../utils/alerts'

const logger = logdown('TW:crowdsale')
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
      .catch(err => logger.error(err))
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
    const crowdsaleExecID = getExecID()
    contractStore.setContractProperty('crowdsale', 'execID', crowdsaleExecID)
  }

  getCrowdsale = async () => {
    const { crowdsaleStore, contractStore, generalStore } = this.props

    try {
      await getCrowdsaleAssets(generalStore.networkID)
      const crowdsaleAddr = await getAddr()

      if (!isExecIDValid(contractStore.crowdsale.execID) && contractStore.crowdsale.execID) {
        invalidCrowdsaleExecIDAlert()
        return Promise.reject('invalid exec-id')
      }

      let strategy
      if (contractStore.crowdsale.execID) {
        strategy = await getCrowdsaleStrategy(contractStore.crowdsale.execID)
      } else {
        //note: we can use contractStore.MintedCappedProxy.abi for both strategies, because app_exec_id property exists in both strategies
        const proxyContract = await attachToSpecificCrowdsaleContractByAddr(
          crowdsaleAddr,
          contractStore.MintedCappedProxy.abi
        )
        const appName = await proxyContract.methods.app_name().call()
        strategy = await getCrowdsaleStrategyByName(appName)
      }
      crowdsaleStore.setProperty('strategy', strategy)
      contractStore.setContractProperty(crowdsaleStore.proxyName, 'addr', crowdsaleAddr)
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
    } else {
      target = crowdsaleStore.proxyName
    }

    logger.log('target:', target)

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
      await getCrowdsaleData()
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
    if (!CrowdsaleConfig.proxyAddress || !CrowdsaleConfig.networkID) {
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
    const { proxyName, isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore

    const crowdsaleExecID = getContractStoreProperty('crowdsale', 'execID')
    const contributorsCount = crowdsalePageStore.contributors ? crowdsalePageStore.contributors.toString() : 0

    const rate = toBigNumber(crowdsalePageStore.rate)
    const startRate = toBigNumber(crowdsalePageStore.startRate || 0)
    const endRate = toBigNumber(crowdsalePageStore.endRate || 0)
    const tokenDecimals = toBigNumber(tokenStore.decimals)
    const maximumSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
    const maximumSellableTokensInWei = toBigNumber(crowdsalePageStore.maximumSellableTokensInWei)
    const ethRaised = toBigNumber(crowdsalePageStore.ethRaised)
    const tokensSold = toBigNumber(crowdsalePageStore.tokensSold)
    const maxCapBeforeDecimals = maximumSellableTokens.div(`1e${tokenDecimals}`)

    // tokens claimed
    const tokensClaimedTiers = tokensSold.div(`1e${tokenDecimals}`).toFixed()
    const tokensClaimed = tokensClaimedTiers

    //prices
    const toToken = inETH =>
      inETH > 0
        ? inETH
            .pow(-1)
            .decimalPlaces(0)
            .toFixed()
        : 0
    const rateInETH = toBigNumber(web3.utils.fromWei(rate.toFixed(), 'ether'))
    const startRateInETH = toBigNumber(web3.utils.fromWei(startRate.toFixed(), 'ether'))
    const endRateInETH = toBigNumber(web3.utils.fromWei(endRate.toFixed(), 'ether'))
    const currentRatePerETH = toToken(rateInETH)
    const startRatePerETH = toToken(startRateInETH)
    const endRatePerETH = toToken(endRateInETH)

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
    const proxy = contractStore[proxyName]

    return (
      <div>
        <section className={`lo-MenuBarAndContent`} ref="five">
          <StepNavigation activeStep={CROWDSALE_PAGE} />
          <div className="st-StepContent">
            <StepInfo
              description="Page with statistics of crowdsale. Statistics for all tiers combined on the page. Please press Ctrl-D to
                bookmark the page."
              stepNumber="5"
              title="Crowdsale Page"
            />
            <CrowdsaleProgress
              ethGoal={goalInETH}
              tokensClaimedRatio={tokensClaimedRatio}
              totalRaisedFunds={ethRaised.toFixed()}
            />
            {isMintedCappedCrowdsale ? (
              <CrowdsaleSummaryMintedCapped
                contributorsCount={contributorsCount}
                currentRatePerETH={currentRatePerETH}
                tokensClaimed={tokensClaimed}
                totalSupply={totalSupply}
              />
            ) : null}
            {isDutchAuction ? (
              <CrowdsaleSummaryDutchAuction
                contributorsCount={contributorsCount}
                currentRatePerETH={currentRatePerETH}
                endRatePerETH={endRatePerETH}
                startRatePerETH={startRatePerETH}
                tokensClaimed={tokensClaimed}
                totalSupply={totalSupply}
              />
            ) : null}
            <CrowdsaleID
              description={crowdsaleExecID ? 'Crowdsale Execution ID' : 'Crowdsale Proxy Address'}
              hash={crowdsaleExecID || (proxy && proxy.addr)}
            />
            <div className="st-StepContent_Buttons">
              <ButtonContinue buttonText="Contribute" onClick={this.goToContributePage} />
            </div>
          </div>
        </section>
        <Loader show={this.state.loading} />
      </div>
    )
  }
}
