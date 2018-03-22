import React from 'react'
import '../../assets/stylesheets/application.css'
import { checkNetWorkByID, checkWeb3 } from '../../utils/blockchainHelpers'
import {
  findCurrentContractRecursively,
  getAccumulativeCrowdsaleData,
  getContractStoreProperty,
  getCrowdsaleData,
  getJoinedTiers,
  initializeAccumulativeData,
  toBigNumber
} from './utils'
import { getQueryVariable } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { NAVIGATION_STEPS } from '../../utils/constants'
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

    this.getCrowdsale(networkID)
  }

  getCrowdsale = (networkID) => {
    const { generalStore, web3Store } = this.props
    const { web3 } = web3Store

    if (!web3) {
      this.setState({ loading: false })
      return
    }

    checkNetWorkByID(networkID);
    generalStore.setProperty('networkID', networkID);

    getWhiteListWithCapCrowdsaleAssets()
      .then(() => this.extractContractsData())
      .catch(console.log)
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
    const { web3Store, tokenStore, crowdsalePageStore } = this.props
    const { web3 } = web3Store

    const tokenAddr = getContractStoreProperty('token','addr')
    const tempCrowdsaleAddr = getContractStoreProperty('crowdsale','addr')
    const crowdsaleAddr = tempCrowdsaleAddr === 'string' ? tempCrowdsaleAddr : tempCrowdsaleAddr[0]
    const investorsCount = crowdsalePageStore.investors ? crowdsalePageStore.investors.toString() : 0

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
    const tokensPerETH = rateInETH.pow(-1).decimalPlaces(0).toFixed()

    //total supply
    const totalSupply = maxCapBeforeDecimals.toFixed()

    //goal in ETH
    const goalInETHTiers = toBigNumber(web3.utils.fromWei(maximumSellableTokensInWei.toFixed(), 'ether')).toFixed()
    const goalInETH = goalInETHTiers
    const tokensClaimedRatio = goalInETH > 0 ? ethRaised.div(goalInETH).times(100).toFixed() : '0'

    return (
      <section className="steps steps_crowdsale-page">
        <StepNavigation activeStep={CROWDSALE_PAGE}/>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-page"/>
            <p className="title">Crowdsale Page</p>
            <p className="description">Page with statistics of crowdsale. Statistics for all tiers combined on the page.
              Please press Ctrl-D to bookmark the page.</p>
          </div>
          <div className="total-funds">
            <div className="hidden">
              <div className="left">
                <p className="total-funds-title">{`${ethRaised}`} ETH</p>
                <p className="total-funds-description">Total Raised Funds</p>
              </div>
              <div className="right">
                <p className="total-funds-title">{`${goalInETH}`} ETH</p>
                <p className="total-funds-description">Goal</p>
              </div>
            </div>
          </div>
          <div className="total-funds-chart-container">
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart-division"/>
            <div className="total-funds-chart">
              <div className="total-funds-chart-active" style={{ width: `${tokensClaimedRatio}%` }}/>
            </div>
          </div>
          <div className="total-funds-statistics">
            <div className="hidden">
              <div className="left" style={{ width: '42% '}}>
                <div className="hidden">
                  <div className="left">
                    <p className="title">{`${tokensClaimed}`}</p>
                    <p className="description">Tokens Claimed</p>
                  </div>
                  <div className="right">
                    <p className="title">{`${investorsCount}`}</p>
                    <p className="description">Contributors</p>
                  </div>
                </div>
                <p className="hash">{`${tokenAddr}`}</p>
                <p className="description">Token Address</p>
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
                <p className="hash">{`${crowdsaleAddr}`}</p>
                <p className="description">Crowdsale Contract Address</p>
              </div>
            </div>
          </div>
        </div>
        <div className="button-container">
          <a onClick={this.goToInvestPage} className="button button_fill">Invest</a>
        </div>
        <Loader show={this.state.loading} />
      </section>
    )
  }
}
