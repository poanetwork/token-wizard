import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { getCurrentAccount, getAllCrowdsaleAddresses, getNetworkVersion } from '../../utils/blockchainHelpers'
import { getCrowdsaleAssets } from '../../stores/utils'
import { Loader } from '../Common/Loader'
import { toBigNumber } from '../../utils/utils'
import logdown from 'logdown'

const logger = logdown('TW:stats')

@inject('web3Store', 'statsStore')
@observer
export class Stats extends Component {
  constructor(props) {
    super(props)
    this.setState({
      loading: true
    })
    this.getStats(props)
  }

  getStats = async props => {
    const { web3Store, statsStore } = props
    const { web3 } = web3Store
    const networkID = await getNetworkVersion()
    logger.log('networkID:', networkID)
    getCrowdsaleAssets(networkID)
      .then(getCurrentAccount)
      .then(getAllCrowdsaleAddresses)
      .then(crowdsaleInstances => {
        let totalEthRaised = toBigNumber('0')
        let maxEthRaised = toBigNumber('0')
        let totalContributorsAmount = 0
        crowdsaleInstances.forEach(_crowdsale => {
          let ethRaised = web3.utils.fromWei(_crowdsale.crowdsaleInfo.wei_raised, 'ether')
          totalEthRaised = totalEthRaised.plus(ethRaised)
          maxEthRaised = Math.max(maxEthRaised, ethRaised)
          totalContributorsAmount += Number(_crowdsale.crowdsaleContributors)
        })

        const curDate = new Date().getTime()

        const mintedCappedCrowdsales = crowdsaleInstances.filter(_crowdsale => {
          return _crowdsale.appName === process.env['REACT_APP_MINTED_CAPPED_APP_NAME']
        })
        let mintedCappedEthRaised = toBigNumber('0')
        let mintedCappedMaxEthRaised = toBigNumber('0')
        let mintedCappedContributorsAmount = 0
        let mintedCappedOngoingCrowdsales = 0
        let mintedCappedFutureCrowdsales = 0
        let mintedCappedPastCrowdsales = 0
        let mintedCappedMaxTiersAmount = 0
        mintedCappedCrowdsales.forEach(_crowdsale => {
          let ethRaised = web3.utils.fromWei(_crowdsale.crowdsaleInfo.wei_raised, 'ether')
          mintedCappedEthRaised = mintedCappedEthRaised.plus(ethRaised)
          mintedCappedMaxEthRaised = Math.max(mintedCappedMaxEthRaised, ethRaised)
          mintedCappedContributorsAmount += Number(_crowdsale.crowdsaleContributors)
          let crowdsaleStart = _crowdsale.crowdsaleDates.start_time * 1000
          let crowdsaleEnd = _crowdsale.crowdsaleDates.end_time * 1000

          if (crowdsaleStart > curDate) {
            mintedCappedFutureCrowdsales++
          } else if (crowdsaleEnd < curDate) {
            mintedCappedPastCrowdsales++
          } else {
            mintedCappedOngoingCrowdsales++
          }

          mintedCappedMaxTiersAmount = Math.max(mintedCappedMaxTiersAmount, _crowdsale.crowdsaleTierList.length)
        })

        const mintedCappedFinalizedCrowdsales = mintedCappedCrowdsales.filter(_crowdsale => {
          return _crowdsale.crowdsaleInfo.is_finalized
        })
        const mintedCappedPercentageOfFinalized =
          mintedCappedPastCrowdsales > 0
            ? Math.round(((mintedCappedFinalizedCrowdsales.length * 100) / mintedCappedPastCrowdsales) * 100) / 100
            : 0

        const mintedCappedMultiTiersCrowdsales = mintedCappedCrowdsales.filter(_crowdsale => {
          return _crowdsale.crowdsaleTierList.length > 1
        })
        const mintedCappedPercentageOfMultiTiers =
          mintedCappedCrowdsales.length > 0
            ? Math.round(((mintedCappedMultiTiersCrowdsales.length * 100) / mintedCappedCrowdsales.length) * 100) / 100
            : 0

        const dutchAuctionCrowdsales = crowdsaleInstances.filter(_crowdsale => {
          return _crowdsale.appName === process.env['REACT_APP_DUTCH_APP_NAME']
        })
        let dutchAuctionEthRaised = toBigNumber('0')
        let dutchAuctionMaxEthRaised = toBigNumber('0')
        let dutchAuctionContributorsAmount = 0
        let dutchAuctionOngoingCrowdsales = 0
        let dutchAuctionFutureCrowdsales = 0
        let dutchAuctionPastCrowdsales = 0
        dutchAuctionCrowdsales.forEach(_crowdsale => {
          let ethRaised = web3.utils.fromWei(_crowdsale.crowdsaleInfo.wei_raised, 'ether')
          dutchAuctionEthRaised = dutchAuctionEthRaised.plus(ethRaised)
          dutchAuctionMaxEthRaised = Math.max(dutchAuctionMaxEthRaised, ethRaised)
          dutchAuctionContributorsAmount += Number(_crowdsale.crowdsaleContributors)
          let crowdsaleStart = _crowdsale.crowdsaleDates.start_time * 1000
          let crowdsaleEnd = _crowdsale.crowdsaleDates.end_time * 1000

          if (crowdsaleStart > curDate) {
            dutchAuctionFutureCrowdsales++
          } else if (crowdsaleEnd < curDate) {
            dutchAuctionPastCrowdsales++
          } else {
            dutchAuctionOngoingCrowdsales++
          }
        })

        const dutchAuctionFinalizedCrowdsales = dutchAuctionCrowdsales.filter(_crowdsale => {
          return _crowdsale.crowdsaleInfo.is_finalized
        })
        const dutchAuctionPercentageOfFinalized =
          dutchAuctionPastCrowdsales > 0
            ? Math.round(((dutchAuctionFinalizedCrowdsales.length * 100) / dutchAuctionPastCrowdsales) * 100) / 100
            : 0

        logger.log('crowdsaleInstances:', crowdsaleInstances)

        statsStore.setProperty('totalEthRaised', totalEthRaised)
        statsStore.setProperty('maxEthRaised', maxEthRaised)
        statsStore.setProperty('totalCrowdsales', crowdsaleInstances.length)
        statsStore.setProperty('totalContributorsAmount', totalContributorsAmount)
        statsStore.setProperty('mintedCappedEthRaised', mintedCappedEthRaised)
        statsStore.setProperty('dutchAuctionEthRaised', dutchAuctionEthRaised)
        statsStore.setProperty('mintedCappedCrowdsales', mintedCappedCrowdsales.length)
        statsStore.setProperty('dutchAuctionCrowdsales', dutchAuctionCrowdsales.length)
        statsStore.setProperty('mintedCappedContributorsAmount', mintedCappedContributorsAmount)
        statsStore.setProperty('dutchAuctionContributorsAmount', dutchAuctionContributorsAmount)
        statsStore.setProperty('mintedCappedPercentageOfFinalized', mintedCappedPercentageOfFinalized)
        statsStore.setProperty('dutchAuctionPercentageOfFinalized', dutchAuctionPercentageOfFinalized)
        statsStore.setProperty('mintedCappedPercentageOfMultiTiers', mintedCappedPercentageOfMultiTiers)
        statsStore.setProperty('mintedCappedMaxTiersAmount', mintedCappedMaxTiersAmount)
        statsStore.setProperty('mintedCappedMaxEthRaised', mintedCappedMaxEthRaised)
        statsStore.setProperty('dutchAuctionMaxEthRaised', dutchAuctionMaxEthRaised)
        statsStore.setProperty('mintedCappedOngoingCrowdsales', mintedCappedOngoingCrowdsales)
        statsStore.setProperty('mintedCappedFutureCrowdsales', mintedCappedFutureCrowdsales)
        statsStore.setProperty('mintedCappedPastCrowdsales', mintedCappedPastCrowdsales)
        statsStore.setProperty('dutchAuctionOngoingCrowdsales', dutchAuctionOngoingCrowdsales)
        statsStore.setProperty('dutchAuctionFutureCrowdsales', dutchAuctionFutureCrowdsales)
        statsStore.setProperty('dutchAuctionPastCrowdsales', dutchAuctionPastCrowdsales)

        this.setState({
          loading: false
        })
      })
  }

  valToStr = val => {
    return val ? val.toString() : '0'
  }

  render() {
    const { valToStr, props } = this
    const { statsStore } = props
    const {
      totalCrowdsales,
      totalEthRaised,
      totalContributorsAmount,
      maxEthRaised,
      mintedCappedCrowdsales,
      mintedCappedEthRaised,
      mintedCappedContributorsAmount,
      mintedCappedOngoingCrowdsales,
      mintedCappedFutureCrowdsales,
      mintedCappedPastCrowdsales,
      mintedCappedMaxEthRaised,
      mintedCappedPercentageOfFinalized,
      mintedCappedPercentageOfMultiTiers,
      mintedCappedMaxTiersAmount,
      dutchAuctionCrowdsales,
      dutchAuctionEthRaised,
      dutchAuctionContributorsAmount,
      dutchAuctionOngoingCrowdsales,
      dutchAuctionFutureCrowdsales,
      dutchAuctionPastCrowdsales,
      dutchAuctionMaxEthRaised,
      dutchAuctionPercentageOfFinalized
    } = statsStore
    const statsItem = (value, description) => {
      return (
        <div className="stats-items-i">
          <p className="stats-items-title">{value}</p>
          <p className="stats-items-description">{description}</p>
        </div>
      )
    }
    return (
      <div className="stats container">
        <p className="title">Token Wizard statistics</p>
        <div className="stats-table">
          <div className="stats-table-cell">
            <div className="stats-items">{statsItem(valToStr(totalCrowdsales), 'Total crowdsales amount')}</div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">{statsItem(valToStr(totalEthRaised), 'Total amount of eth raised')}</div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(totalContributorsAmount), 'Total contributors amount')}
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(maxEthRaised), 'Max amount of eth raised in one crowdsale')}
            </div>
          </div>
        </div>
        <p className="title-secondary">Minted capped crowdsales statistics</p>
        <div className="stats-table">
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(mintedCappedCrowdsales), 'Crowdsales amount')}
              {statsItem(valToStr(mintedCappedEthRaised), 'Total amount of eth raised')}
              {statsItem(valToStr(mintedCappedContributorsAmount), 'Total contributors amount')}
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(mintedCappedOngoingCrowdsales), 'Ongoing crowdsales amount')}
              {statsItem(valToStr(mintedCappedFutureCrowdsales), 'Future crowdsales amount')}
              {statsItem(valToStr(mintedCappedPastCrowdsales), 'Past crowdsales amount')}
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(mintedCappedMaxEthRaised), 'Max amount of eth raised in one crowdsale')}
              {statsItem(valToStr(mintedCappedPercentageOfFinalized), '% of finalized crowdsales from ended')}
              {statsItem(valToStr(mintedCappedPercentageOfMultiTiers), '% of crowdsales with multiple tiers')}
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(mintedCappedMaxTiersAmount), 'Max tiers amount in one crowdsale')}
            </div>
          </div>
        </div>
        <p className="title-secondary">Dutch auction crowdsales statistics</p>
        <div className="stats-table">
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(dutchAuctionCrowdsales), 'Crowdsales amount')}
              {statsItem(valToStr(dutchAuctionEthRaised), 'Total amount of eth raised')}
              {statsItem(valToStr(dutchAuctionContributorsAmount), 'Total contributors amount')}
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(dutchAuctionOngoingCrowdsales), 'Ongoing crowdsales amount')}
              {statsItem(valToStr(dutchAuctionFutureCrowdsales), 'Future crowdsales amount')}
              {statsItem(valToStr(dutchAuctionPastCrowdsales), 'Past crowdsales amount')}
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              {statsItem(valToStr(dutchAuctionMaxEthRaised), 'Max amount of eth raised in one crowdsale')}
              {statsItem(valToStr(dutchAuctionPercentageOfFinalized), '% of finalized crowdsales from ended')}
            </div>
          </div>
        </div>
        <Loader show={this.state ? this.state.loading : true} />
      </div>
    )
  }
}
