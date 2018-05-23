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
      .then(([fullCrowdsalesArr, reservedDestinationsLensArr, tierData]) => {
        console.log("fullCrowdsalesArr:", fullCrowdsalesArr)
        console.log("reservedDestinationsLensArr:", reservedDestinationsLensArr)
        console.log("tierData:", tierData)
        let totalEthRaised = new BigNumber("0")
        let maxTiersAmount = 0
        let maxEthRaised = new BigNumber("0")
        let totalInvolvedContributorsAmount = 0

        const saneCrowdsales = fullCrowdsalesArr.filter((_crowdsale) => {
          return _crowdsale.joinedTiers.length > 0
        })

        console.log("saneCrowdsales:", saneCrowdsales)

        saneCrowdsales.forEach((obj) => {
          let tiersAmount = obj.joinedTiers.length
          maxTiersAmount = Math.max(maxTiersAmount, tiersAmount)
        })

        const tierDataArr = Object.keys(tierData)
        .map(function(addr) {
          let obj = {
            "addr": addr,
            "startsAt": tierData[addr].startsAt,
            "endsAt": tierData[addr].endsAt,
            "weiRaised": tierData[addr].weiRaised,
            "contributorsCount": tierData[addr].contributorsCount,
          }
          return obj
        })

        tierDataArr.forEach((obj) => {
          let weiRaised = obj.weiRaised ? obj.weiRaised.toString() : "0"
          let ethRaised = web3.utils.fromWei(weiRaised, "ether")
          totalEthRaised = totalEthRaised.plus(ethRaised)
          maxEthRaised = Math.max(maxEthRaised, ethRaised)

          let contributors = isNaN(obj.contributorsCount) ? 0 : Number(obj.contributorsCount)
          totalInvolvedContributorsAmount += contributors
        })

        const curDate = (new Date()).getTime()

        let ongoingCrowdsales = 0
        let futureCrowdsales = 0
        let pastCrowdsales = 0
        saneCrowdsales.forEach((crowdsale) => {
          const tier1StartsAt = tierData[crowdsale.addr].startsAt * 1000
          if (tier1StartsAt > curDate) {
            futureCrowdsales++
          } else {
            crowdsale.joinedTiers.every((addr, ind) => {
              let joinedTierAddr = crowdsale.joinedTiers[ind]
              let tierStartsAt = tierData[joinedTierAddr].startsAt * 1000
              let tierEndsAt = tierData[joinedTierAddr].endsAt * 1000

              if (tierStartsAt <= curDate && curDate <= tierEndsAt) {
                //ongoing tier
                return false
              } else {
                if (curDate > tierEndsAt && ind == crowdsale.joinedTiers.length - 1) {
                  pastCrowdsales++
                  return false
                } else if (ind == crowdsale.joinedTiers.length - 1) {
                  return true
                } else {
                  return true
                }
              }
            })
          }
        })

        let ongoincCrowdsaleRaw = saneCrowdsales.length - futureCrowdsales - pastCrowdsales
        ongoingCrowdsales = ongoincCrowdsaleRaw > 0 ? ongoincCrowdsaleRaw : 0

        const whitelistedCrowdsales = saneCrowdsales.filter((_crowdsale) => {
          return _crowdsale.isWhitelisted
        })
        const percentageOfWhitelisted = saneCrowdsales.length > 0 ? Math.round(whitelistedCrowdsales.length * 100 / saneCrowdsales.length * 100) / 100 : 0

        const crowdsalesWithRservedDestinations = reservedDestinationsLensArr.filter((reservedLength) => {
          return Number(reservedLength) > 0
        })
        const percentageOfReserved = saneCrowdsales.length > 0 ? Math.round(crowdsalesWithRservedDestinations.length * 100 / saneCrowdsales.length * 100) / 100 : 0

        const finalizedCrowdsales = saneCrowdsales.filter((_crowdsale) => {
          return _crowdsale.isFinalized
        })
        const percentageOfFinalized = pastCrowdsales > 0 ? Math.round(finalizedCrowdsales.length * 100 / pastCrowdsales * 100) / 100 : 0

        const multiTiersCrowdsales = saneCrowdsales.filter((_crowdsale) => {
          return _crowdsale.joinedTiers.length > 1
        })
        const percentageOfMultiTiers = saneCrowdsales.length > 0 ? Math.round(multiTiersCrowdsales.length * 100 / saneCrowdsales.length * 100) / 100 : 0

        statsStore.setProperty("totalEthRaised", totalEthRaised)
        statsStore.setProperty("totalCrowdsales", saneCrowdsales.length)
        statsStore.setProperty("percentageOfWhitelisted", percentageOfWhitelisted)
        statsStore.setProperty("percentageOfFinalized", percentageOfFinalized)
        statsStore.setProperty("percentageOfMultiTiers", percentageOfMultiTiers)
        statsStore.setProperty("percentageOfReserved", percentageOfReserved)
        statsStore.setProperty("totalInvolvedContributorsAmount", totalInvolvedContributorsAmount)
        statsStore.setProperty("maxTiersAmount", maxTiersAmount)
        statsStore.setProperty("maxEthRaised", maxEthRaised)
        statsStore.setProperty("ongoingCrowdsales", ongoingCrowdsales)
        statsStore.setProperty("futureCrowdsales", futureCrowdsales)
        statsStore.setProperty("pastCrowdsales", pastCrowdsales)

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
    const ongoingCrowdsales = statsStore.ongoingCrowdsales ? statsStore.ongoingCrowdsales.toString() : '0'
    const futureCrowdsales = statsStore.futureCrowdsales ? statsStore.futureCrowdsales.toString() : '0'
    const pastCrowdsales = statsStore.pastCrowdsales ? statsStore.pastCrowdsales.toString() : '0'
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
                <p className="stats-items-description">Total amount of eth raised</p>
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
                <p className="stats-items-title">{ongoingCrowdsales}</p>
                <p className="stats-items-description">Ongoing crowdsales amount</p>
              </div>
            </div>
            <div className="stats-items">
              <div className="stats-items-i">
                <p className="stats-items-title">{futureCrowdsales}</p>
                <p className="stats-items-description">Future crowdsales amount</p>
              </div>
            </div>
            <div className="stats-items">
              <div className="stats-items-i">
                <p className="stats-items-title">{pastCrowdsales}</p>
                <p className="stats-items-description">Past crowdsales amount</p>
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
                <p className="stats-items-description">Max amount of eth raised in one tier</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfFinalized} %</p>
                <p className="stats-items-description">% of finalized crowdsales from ended</p>
              </div>
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfReserved} %</p>
                <p className="stats-items-description">% of crowdsales with reserved tokens</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfWhitelisted} %</p>
                <p className="stats-items-description">% of whitelisted crowdsales</p>
              </div>
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfMultiTiers} %</p>
                <p className="stats-items-description">% of crowdsales with multiple tiers</p>
              </div>
            </div>
          </div>
        </div>
        <Loader show={this.state ? this.state.loading : true}/>
      </div>
    )
  }
}