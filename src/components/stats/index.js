import React, {Component} from 'react'
import { inject, observer } from 'mobx-react';
import { getAllCrowdsaleAddresses } from '../../utils/blockchainHelpers'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { Loader } from '../Common/Loader'
import { BigNumber } from 'bignumber.js'

@inject(
  'web3Store',
)
@observer
export class Stats extends Component {
  constructor (props) {
    super(props)
    const { web3Store } = props
    const { web3 } = web3Store
    this.setState({
      totalEthRaised: 0,
      totalCrowdsales: 0,
      percentageOfWhitelisted: 0,
      percentageOfFinalized: 0,
      percentageOfMultiTiers: 0,
      totalInvolvedContributorsAmount: 0,
      maxTiersAmount: 0,
      maxEthRaised: 0,
      loading: true
    })
    getWhiteListWithCapCrowdsaleAssets()
      .then(() => getAllCrowdsaleAddresses())
      .then(([fullCrowdsalesArr, weiRaisedArr, joinedCrowdsalesArr, contributorsArr]) => {
        console.log("fullCrowdsalesArr:", fullCrowdsalesArr)
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

        const finalizedCrowdsales =fullCrowdsalesArr.filter((_crowdsale) => {
          return _crowdsale.isFinalized
        })
        const percentageOfFinalized = fullCrowdsalesArr.length > 0 ? Math.round(finalizedCrowdsales.length * 100 / fullCrowdsalesArr.length * 100) / 100 : 0

        const multiTiersCrowdsales =fullCrowdsalesArr.filter((_crowdsale) => {
          return _crowdsale.joinedCrowdsales.length > 1
        })
        const percentageOfMultiTiers = fullCrowdsalesArr.length > 0 ? Math.round(multiTiersCrowdsales.length * 100 / fullCrowdsalesArr.length * 100) / 100 : 0

        this.setState({
          totalEthRaised: totalEthRaised,
          totalCrowdsales: fullCrowdsalesArr.length,
          percentageOfWhitelisted: percentageOfWhitelisted,
          percentageOfFinalized: percentageOfFinalized,
          percentageOfMultiTiers: percentageOfMultiTiers,
          totalInvolvedContributorsAmount: totalInvolvedContributorsAmount,
          maxTiersAmount: maxTiersAmount,
          maxEthRaised: maxEthRaised,
          loading: false
        })
      })
  }

  render () {
    const { web3Store } = this.props
    const { web3 } = web3Store
    const totalEthRaised = this.state ? this.state.totalEthRaised ? this.state.totalEthRaised.toString() : '0' : '0'
    const totalCrowdsalesAmount = this.state ? this.state.totalCrowdsales ? this.state.totalCrowdsales.toString() : '0' : '0'
    const totalInvolvedContributorsAmount = this.state ? this.state.totalInvolvedContributorsAmount ? this.state.totalInvolvedContributorsAmount.toString() : '0' : '0'
    const maxTiersAmount = this.state ? this.state.maxTiersAmount ? this.state.maxTiersAmount.toString() : '0' : '0'
    const maxEthRaised = this.state ? this.state.maxEthRaised ? this.state.maxEthRaised.toString() : '0' : '0'
    const percentageOfWhitelisted = this.state ? this.state.percentageOfWhitelisted ? this.state.percentageOfWhitelisted.toString() : '0' : '0'
    const percentageOfFinalized = this.state ? this.state.percentageOfFinalized ? this.state.percentageOfFinalized.toString() : '0' : '0'
    const percentageOfMultiTiers = this.state ? this.state.percentageOfMultiTiers ? this.state.percentageOfMultiTiers.toString() : '0' : '0'
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
            </div>
          </div>
          <div className="stats-table-cell">
            <div className="stats-items">
              <div className="stats-items-i">
                <p className="stats-items-title">{percentageOfFinalized} %</p>
                <p className="stats-items-description">Percentage of finalized crowdsales</p>
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