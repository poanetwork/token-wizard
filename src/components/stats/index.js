import React, {Component} from 'react'
import { inject, observer } from 'mobx-react';
import { getAllCrowdsaleAddresses } from '../../utils/blockchainHelpers'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { Loader } from '../Common/Loader'
import { BigNumber } from 'bignumber.js'

@inject(
  'web3Store',
  'statsStore'
)
@observer
export class Stats extends Component {
  constructor (props) {
    super(props)
    const { web3Store, statsStore } = props
    const { web3 } = web3Store
    this.setState({
      loading: true
    })
    getWhiteListWithCapCrowdsaleAssets()
      .then(() => getAllCrowdsaleAddresses())
      .then(([fullCrowdsalesArr, reservedDestinationsLensArr, weiRaisedArr, joinedCrowdsalesArr, contributorsArr]) => {
        console.log("fullCrowdsalesArr:", fullCrowdsalesArr)
        console.log("reservedDestinationsLensArr:", reservedDestinationsLensArr)
        console.log("weiRaisedArr:", weiRaisedArr)
        console.log("joinedCrowdsalesArr:", joinedCrowdsalesArr)
        console.log("contributorsArr:", contributorsArr)
        let totalEthRaised = new BigNumber("0")
        let maxTiersAmount = 0
        let maxEthRaised = new BigNumber("0")
        let totalInvolvedContributorsAmount = 0
        weiRaisedArr.forEach((_weiRaised) => {
          let weiRaised = _weiRaised ? _weiRaised.toString() : "0"
          let ethRaised = web3.utils.fromWei(weiRaised, "ether")
          totalEthRaised = totalEthRaised.plus(ethRaised)
          maxEthRaised = Math.max(maxEthRaised, ethRaised)
        })

        joinedCrowdsalesArr.forEach((val) => {
          let tiersAmount = isNaN(val) ? 0 : Number(val)
          maxTiersAmount = Math.max(maxTiersAmount, tiersAmount)
        })

        contributorsArr.forEach((val) => {
          let contributors = isNaN(val) ? 0 : Number(val)
          totalInvolvedContributorsAmount += contributors
        })

        const whitelistedCrowdsales = fullCrowdsalesArr.filter((_crowdsale) => {
          return _crowdsale.isWhitelisted
        })
        const percentageOfWhitelisted = fullCrowdsalesArr.length > 0 ? Math.round(whitelistedCrowdsales.length * 100 / fullCrowdsalesArr.length * 100) / 100 : 0

        const crowdsalesWithRservedDestinations = reservedDestinationsLensArr.filter((reservedLength) => {
          return Number(reservedLength) > 0
        })
        const percentageOfReserved = fullCrowdsalesArr.length > 0 ? Math.round(crowdsalesWithRservedDestinations.length * 100 / fullCrowdsalesArr.length * 100) / 100 : 0

        const finalizedCrowdsales =fullCrowdsalesArr.filter((_crowdsale) => {
          return _crowdsale.isFinalized
        })
        const percentageOfFinalized = fullCrowdsalesArr.length > 0 ? Math.round(finalizedCrowdsales.length * 100 / fullCrowdsalesArr.length * 100) / 100 : 0

        const multiTiersCrowdsales =fullCrowdsalesArr.filter((_crowdsale) => {
          return _crowdsale.joinedCrowdsales.length > 1
        })
        const percentageOfMultiTiers = fullCrowdsalesArr.length > 0 ? Math.round(multiTiersCrowdsales.length * 100 / fullCrowdsalesArr.length * 100) / 100 : 0

        statsStore.setProperty("totalEthRaised", totalEthRaised)
        statsStore.setProperty("totalCrowdsales", fullCrowdsalesArr.length)
        statsStore.setProperty("percentageOfWhitelisted", percentageOfWhitelisted)
        statsStore.setProperty("percentageOfFinalized", percentageOfFinalized)
        statsStore.setProperty("percentageOfMultiTiers", percentageOfMultiTiers)
        statsStore.setProperty("percentageOfReserved", percentageOfReserved)
        statsStore.setProperty("totalInvolvedContributorsAmount", totalInvolvedContributorsAmount)
        statsStore.setProperty("maxTiersAmount", maxTiersAmount)
        statsStore.setProperty("maxEthRaised", maxEthRaised)

        this.setState({
          loading: false
        })
      })
  }

  render () {
    const { statsStore } = this.props
    const totalEthRaised = statsStore.totalEthRaised ? statsStore.totalEthRaised.toString() : '0'
    const totalCrowdsalesAmount = statsStore.totalCrowdsales ? statsStore.totalCrowdsales.toString() : '0'
    const totalInvolvedContributorsAmount = statsStore.totalInvolvedContributorsAmount ? statsStore.totalInvolvedContributorsAmount.toString() : '0'
    const maxTiersAmount = statsStore.maxTiersAmount ? statsStore.maxTiersAmount.toString() : '0'
    const maxEthRaised = statsStore.maxEthRaised ? statsStore.maxEthRaised.toString() : '0'
    const percentageOfWhitelisted = statsStore.percentageOfWhitelisted ? statsStore.percentageOfWhitelisted.toString() : '0'
    const percentageOfFinalized = statsStore.percentageOfFinalized ? statsStore.percentageOfFinalized.toString() : '0'
    const percentageOfMultiTiers = statsStore.percentageOfMultiTiers ? statsStore.percentageOfMultiTiers.toString() : '0'
    const percentageOfReserved = statsStore.percentageOfReserved ? statsStore.percentageOfReserved.toString() : '0'
    return (
      <div className="stats container">
        <p className="title">Token Wizard statistics (from 2018)</p>
        <div className="stats-table">
          <div className="stats-table-cell">
            <div className="stats-items">
              <div className="stats-items-i">
                <p className="stats-items-title">{totalCrowdsalesAmount}</p>
                <p className="stats-items-description">Total crowdsales amount</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{totalEthRaised}</p>
                <p className="stats-items-description">Total eth raised</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{totalInvolvedContributorsAmount}</p>
                <p className="stats-items-description">Total involved contributors</p>
              </div>
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              <div className="stats-items-i">
                <p className="stats-items-title">{maxTiersAmount}</p>
                <p className="stats-items-description">Max tiers amount in one crowdsale</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{maxEthRaised}</p>
                <p className="stats-items-description">Max eth raised in one tier</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfFinalized} %</p>
                <p className="stats-items-description">Percentage of finalized crowdsales</p>
              </div>
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfReserved} %</p>
                <p className="stats-items-description">Percentage of crowdsales with reserved tokens</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfWhitelisted} %</p>
                <p className="stats-items-description">Percentage of whitelisted crowdsales</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfMultiTiers} %</p>
                <p className="stats-items-description">Percentage of crowdsales with multiple tiers</p>
              </div>
            </div>
          </div>
        </div>
        <Loader show={this.state ? this.state.loading : true}/>
      </div>
    )
  }
}