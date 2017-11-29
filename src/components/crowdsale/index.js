import React from 'react'
import '../../assets/stylesheets/application.css';
import { getWeb3, checkWeb3, checkNetWorkByID } from '../../utils/blockchainHelpers'
import { getCrowdsaleData, initializeAccumulativeData, getAccumulativeCrowdsaleData, findCurrentContractRecursively, getJoinedTiers, getContractStoreProperty } from './utils'
import { getQueryVariable, getURLParam, getWhiteListWithCapCrowdsaleAssets, toFixed } from '../../utils/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { NAVIGATION_STEPS, CONTRACT_TYPES } from '../../utils/constants'
import { invalidCrowdsaleAddrAlert } from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { ICOConfig } from '../Common/config'
import { observer, inject } from 'mobx-react'
const { CROWDSALE_PAGE } = NAVIGATION_STEPS

@inject('contractStore', 'crowdsalePageStore', 'web3Store', 'tierStore', 'tokenStore', 'generalStore')
@observer export class Crowdsale extends React.Component {
  constructor(){
    super()
    this.state = { loading: true}
  }

  componentWillMount () {
    const { web3Store } = this.props
    const web3 = web3Store.web3
    checkWeb3(web3);
    let newState = { ...this.state }
    newState.loading = true;
    newState.tokenIsAlreadyCreated = true;
    this.setState(newState);
    const networkID = ICOConfig.networkID?ICOConfig.networkID:getQueryVariable("networkID");
    const contractType = CONTRACT_TYPES.whitelistwithcap;//getQueryVariable("contractType");
    this.getCrowdsale(web3, networkID, contractType)
  }

  getCrowdsale (web3, networkID, contractType) {
    const { contractStore, generalStore } = this.props
    if (!web3) {
      let state = { ...this.state };
      state.loading = false;
      this.setState(state);
      return
    };
    checkNetWorkByID(web3, networkID);
    generalStore.setProperty('networkID', networkID);
    contractStore.setContractType(contractType);

    switch (contractType) {
      case CONTRACT_TYPES.whitelistwithcap: {
        getWhiteListWithCapCrowdsaleAssets(this.extractContractsData.bind(this))
      } break;
      default:
        break;
    }
  }

  extractContractsData() {
    const { contractStore, web3Store } = this.props
    const web3 = web3Store.web3
    const crowdsaleAddr = ICOConfig.crowdsaleContractURL?ICOConfig.crowdsaleContractURL:getURLParam("addr");
    if (!web3.utils.isAddress(crowdsaleAddr)) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return invalidCrowdsaleAddrAlert();
    }
    getJoinedTiers(web3, contractStore.crowdsale.abi, crowdsaleAddr, [], (joinedCrowdsales) => {
      console.log("joinedCrowdsales: ");
      console.log(joinedCrowdsales);

      let _crowdsaleAddrs;
      if ( typeof joinedCrowdsales === 'string' ) {
        _crowdsaleAddrs = [ joinedCrowdsales ];
      } else {
        _crowdsaleAddrs = joinedCrowdsales;
      }
      var state = { ...this.state };
      contractStore.setContractProperty('crowdsale', 'addr', _crowdsaleAddrs )
        if (!contractStore.crowdsale.addr) {
          return;
        }
      findCurrentContractRecursively(0, this, web3, null, (crowdsaleContract) => {
        if (!crowdsaleContract) {
          state.loading = false;
          return this.setState(state);
        }
        this.getFullCrowdsaleData(web3, crowdsaleContract)
      })
    });
  }

  getFullCrowdsaleData(web3, crowdsaleContract) {
    getCrowdsaleData(web3, this, crowdsaleContract, () => {
      initializeAccumulativeData(() => {
        getAccumulativeCrowdsaleData(web3, this, () => {});
      });
    });
  }

  goToInvestPage = () => {
    const { contractStore, generalStore } = this.props
    let queryStr = "";
    if (!ICOConfig.crowdsaleContractURL || !ICOConfig.networkID) {
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
    const web3 = web3Store.web3
    const tokenAddr = getContractStoreProperty('token','addr')
    const tempCrowdsaleAddr = getContractStoreProperty('crowdsale','addr')
    const crowdsaleAddr = tempCrowdsaleAddr === 'string'? tempCrowdsaleAddr : tempCrowdsaleAddr[0]
    const tokenDecimals = !isNaN(tokenStore.decimals)?tokenStore.decimals:0;
    const rate = crowdsalePageStore.rate; //for tiers: 1 token in wei, for standard: 1/? 1 token in eth
    const maxCapBeforeDecimals = crowdsalePageStore.maximumSellableTokens/10**tokenDecimals;
    const investorsCount = crowdsalePageStore.investors?crowdsalePageStore.investors.toString():0;
    const ethRaised = crowdsalePageStore.ethRaised;

    //tokens claimed: tiers, standard
    const tokensClaimedStandard = rate?(crowdsalePageStore.ethRaised/rate):0;
    const tokensClaimedTiers = rate?(crowdsalePageStore.tokensSold/10**tokenDecimals):0;
    const tokensClaimed = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?tokensClaimedTiers:tokensClaimedStandard;

    //price: tiers, standard
    const tokensPerETHStandard = !isNaN(rate)?rate:0;
    const tokensPerETHTiers = !isNaN(1/rate)?1/web3.utils.fromWei(toFixed(rate).toString(), "ether"):0;
    const tokensPerETH = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?tokensPerETHTiers:tokensPerETHStandard;

    //total supply: tiers, standard
    const tierCap = maxCapBeforeDecimals?(maxCapBeforeDecimals).toString():0;
    const standardCrowdsaleSupply = !isNaN(crowdsalePageStore.supply)?(crowdsalePageStore.supply).toString():0;
    const totalSupply = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?tierCap:standardCrowdsaleSupply;

    //goal in ETH
    const goalInETHStandard = (totalSupply/rate).toExponential();
    let goalInETHTiers = crowdsalePageStore.maximumSellableTokensInWei?(web3.utils.fromWei(toFixed(crowdsalePageStore.maximumSellableTokensInWei).toString(), "ether").toString()):0;
    goalInETHTiers = 1.0 / 100 * Math.floor(100 * goalInETHTiers)
    const goalInETH = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?goalInETHTiers:goalInETHStandard;

    const tokensClaimedRatio = goalInETH?(ethRaised/goalInETH)*100:"0";

    return this.state.loading ? <Loader show={this.state.loading}></Loader> :
    (
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
