import React from 'react'
import '../../assets/stylesheets/application.css'
import { checkNetWorkByID, checkWeb3 } from '../../utils/blockchainHelpers'
import {
  findCurrentContractRecursively,
  getAccumulativeCrowdsaleData,
  getContractStoreProperty,
  getCrowdsaleData,
  getJoinedTiers,
  initializeAccumulativeData
} from './utils'
import { getQueryVariable, toFixed } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { CONTRACT_TYPES, NAVIGATION_STEPS } from '../../utils/constants'
import { invalidCrowdsaleAddrAlert } from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { CrowdsaleConfig } from '../Common/config'
import { inject, observer } from 'mobx-react'

const { CROWDSALE_PAGE } = NAVIGATION_STEPS

@inject('contractStore', 'crowdsalePageStore', 'web3Store', 'tierStore', 'tokenStore', 'generalStore')
@observer
export class Crowdsale extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loading: true }
  }

  componentDidMount () {
    checkWeb3()

    const networkID = CrowdsaleConfig.networkID ? CrowdsaleConfig.networkID : getQueryVariable('networkID')
    const contractType = CONTRACT_TYPES.whitelistwithcap//getQueryVariable("contractType");

    this.getCrowdsale(networkID, contractType)
  }

  getCrowdsale = (networkID, contractType) => {
    const { contractStore, generalStore, web3Store } = this.props
    const { web3 } = web3Store

    if (!web3) {
      this.setState({ loading: false })
      return
    }

    checkNetWorkByID(networkID);
    generalStore.setProperty('networkID', networkID);
    contractStore.setContractType(contractType);

    if (contractType === CONTRACT_TYPES.whitelistwithcap) {
      getWhiteListWithCapCrowdsaleAssets()
        .then(() => this.extractContractsData())
        .catch(console.log)
    }
  }

  extractContractsData = () => {
    const { contractStore, web3Store } = this.props
    const { web3 } = web3Store
    const crowdsaleAddr = CrowdsaleConfig.crowdsaleContractURL ? CrowdsaleConfig.crowdsaleContractURL : getQueryVariable('addr')

    if (!web3.utils.isAddress(crowdsaleAddr)) {
      this.setState({ loading: false })
      return invalidCrowdsaleAddrAlert()
    }

    getJoinedTiers(contractStore.crowdsale.abi, crowdsaleAddr, [], (joinedCrowdsales) => {
      console.log('joinedCrowdsales:', joinedCrowdsales)

      const _crowdsaleAddrs = typeof joinedCrowdsales === 'string' ? [joinedCrowdsales] : joinedCrowdsales
      contractStore.setContractProperty('crowdsale', 'addr', _crowdsaleAddrs)

      if (!contractStore.crowdsale.addr) {
        return
      }

      findCurrentContractRecursively(0, null, (crowdsaleContract) => {
        if (!crowdsaleContract) {
          return this.setState({ loading: false })
        }

        this.getFullCrowdsaleData(crowdsaleContract)
      })
    });
  }

  getFullCrowdsaleData (crowdsaleContract) {
    getCrowdsaleData(crowdsaleContract)
      .then(() => initializeAccumulativeData())
      .then(() => {
        return getAccumulativeCrowdsaleData()
      })
      .then(() => {
        this.setState({ loading: false })
      })
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
      })
  }

  goToInvestPage = () => {
    const { contractStore, generalStore } = this.props
    let queryStr = "";
    if (!CrowdsaleConfig.crowdsaleContractURL || !CrowdsaleConfig.networkID) {
      if (contractStore.crowdsale.addr) {
        queryStr = "?addr=" + contractStore.crowdsale.addr[0];
        if (generalStore.networkID) {
          queryStr += "&networkID=" + generalStore.networkID;
        }
      }
    }

    this.props.history.push('/invest' + queryStr);
  }

  render() {
    const { web3Store, contractStore, tokenStore, crowdsalePageStore } = this.props
    const { web3 } = web3Store
    const tokenAddr = getContractStoreProperty('token','addr')
    const tempCrowdsaleAddr = getContractStoreProperty('crowdsale','addr')
    const crowdsaleAddr = tempCrowdsaleAddr === 'string' ? tempCrowdsaleAddr : tempCrowdsaleAddr[0]
    const tokenDecimals = !isNaN(tokenStore.decimals) ? tokenStore.decimals : 0;
    const rate = crowdsalePageStore.rate; //for tiers: 1 token in wei, for standard: 1/? 1 token in eth
    const maxCapBeforeDecimals = crowdsalePageStore.maximumSellableTokens / 10**tokenDecimals;
    const investorsCount = crowdsalePageStore.investors ? crowdsalePageStore.investors.toString() : 0;
    const ethRaised = crowdsalePageStore.ethRaised;

    //tokens claimed: tiers, standard
    const tokensClaimedStandard = rate ? (crowdsalePageStore.ethRaised / rate) : 0;
    const tokensClaimedTiers = rate ? (crowdsalePageStore.tokensSold / 10**tokenDecimals) : 0;
    const tokensClaimed = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) ? tokensClaimedTiers : tokensClaimedStandard;

    //price: tiers, standard
    const tokensPerETHStandard = !isNaN(rate) ? rate : 0;
    const tokensPerETHTiers = !isNaN(1 / rate) ? 1 / web3.utils.fromWei(toFixed(rate).toString(), "ether") : 0;
    const tokensPerETH = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) ? tokensPerETHTiers : tokensPerETHStandard;

    //total supply: tiers, standard
    const tierCap = maxCapBeforeDecimals ? (maxCapBeforeDecimals).toString() : 0;
    const standardCrowdsaleSupply = !isNaN(crowdsalePageStore.supply) ? (crowdsalePageStore.supply).toString() : 0;
    const totalSupply = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) ? tierCap : standardCrowdsaleSupply;

    //goal in ETH
    const goalInETHStandard = (totalSupply / rate).toExponential();
    let goalInETHTiers = crowdsalePageStore.maximumSellableTokensInWei ? (web3.utils.fromWei(toFixed(crowdsalePageStore.maximumSellableTokensInWei).toString(), "ether").toString()) : 0;
    goalInETHTiers = 1.0 / 100 * Math.floor(100 * goalInETHTiers)
    const goalInETH = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) ? goalInETHTiers : goalInETHStandard;

    const tokensClaimedRatio = goalInETH ? (ethRaised / goalInETH) * 100 : "0";

    return (
      <section className="steps steps_crowdsale-page">
        <StepNavigation activeStep={CROWDSALE_PAGE} />
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-page"></div>
            <p className="title">Crowdsale Page</p>
            <p className="description">
              Page with statistics of crowdsale. Statistics for all tiers combined on the page. Please press Ctrl-D to bookmark the page.
            </p>
          </div>
          <div className="total-funds">
            <div className="hidden">
              <div className="left">
                <p className="total-funds-title">{ethRaised} ETH</p>
                <p className="total-funds-description">
                  Total Raised Funds
                </p>
              </div>
              <div className="right">
                <p className="total-funds-title">{goalInETH} ETH</p>
                <p className="total-funds-description">
                  Goal
                </p>
              </div>
            </div>
          </div>
          <div className="total-funds-chart-container">
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart-division"></div>
            <div className="total-funds-chart">
              <div className="total-funds-chart-active" style={{width : tokensClaimedRatio + "%"}}></div>
            </div>
          </div>
          <div className="total-funds-statistics">
            <div className="hidden">
              <div className="left">
                <div className="hidden">
                  <div className="left">
                    <p className="title">{tokensClaimed}</p>
                    <p className="description">
                      Tokens Claimed
                    </p>
                  </div>
                  <div className="right">
                    <p className="title">{investorsCount}</p>
                    <p className="description">
                      Contributors
                    </p>
                  </div>
                </div>
                <p className="hash">{tokenAddr}</p>
                <p className="description">
                  Token Address
                </p>
              </div>
              <div className="right">
                <div className="hidden">
                  <div className="left">
                    <p className="title">{tokensPerETH}</p>
                    <p className="description">
                      Price (Tokens/ETH)
                    </p>
                  </div>
                  <div className="right">
                    <p className="title">{totalSupply}</p>
                    <p className="description">
                      Total Supply
                    </p>
                  </div>
                </div>
                <p className="hash">{crowdsaleAddr}</p>
                <p className="description">
                  Crowdsale Contract Address
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="button-container">
          <a onClick={this.goToInvestPage} className="button button_fill">Invest</a>
        </div>
        <Loader show={this.state.loading}></Loader>
      </section>
    )
  }
}
