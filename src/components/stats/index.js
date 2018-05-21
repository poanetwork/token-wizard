import React, {Component} from 'react'
import { inject, observer } from 'mobx-react';
import { getAllCrowdsaleAddresses } from '../../utils/blockchainHelpers'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { Loader } from '../Common/Loader'

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
      totalWeiRaised: 0,
      totalCrowdsales: 0,
      totalInvolvedContributorsAmount: 0,
      maxTiersAmount: 0,
      maxEthRaised: 0,
      loading: true
    })
    getWhiteListWithCapCrowdsaleAssets()
      .then(() => getAllCrowdsaleAddresses())
      .then(([weiRaisedArr, joinedCrowdsalesArr, contributorsArr]) => {
        console.log("weiRaisedArr:", weiRaisedArr)
        console.log("joinedCrowdsalesArr:", joinedCrowdsalesArr)
        console.log("contributorsArr:", contributorsArr)
        let totalWeiRaised = 0
        let maxTiersAmount = 0
        let maxEthRaised = 0
        let totalInvolvedContributorsAmount = 0
        weiRaisedArr.forEach((val, ind) => {
          let _weiRaised = val
          let weiRaised = _weiRaised ? Number(_weiRaised) : 0
          totalWeiRaised += weiRaised
          maxEthRaised = Math.max(maxEthRaised, Number(web3.utils.fromWei(weiRaised.toString(), 'ether')))
        })

        joinedCrowdsalesArr.forEach((val, ind) => {
          let tiersAmount = isNaN(val) ? 0 : Number(val)
          maxTiersAmount = Math.max(maxTiersAmount, tiersAmount)
        })

        contributorsArr.forEach((val, ind) => {
          let contributors = isNaN(val) ? 0 : Number(val)
          totalInvolvedContributorsAmount += contributors
        })

        this.setState({
          totalWeiRaised: totalWeiRaised,
          totalCrowdsales: weiRaisedArr.length,
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
    const totalWeiRaised = this.state ? this.state.totalWeiRaised ? this.state.totalWeiRaised.toString() : '0' : '0'
    const totalEthRaised = web3.utils.fromWei(totalWeiRaised, 'ether')
    const totalCrowdsalesAmount = this.state ? this.state.totalCrowdsales ? this.state.totalCrowdsales.toString() : '0' : '0'
    const totalInvolvedContributorsAmount = this.state ? this.state.totalInvolvedContributorsAmount ? this.state.totalInvolvedContributorsAmount.toString() : '0' : '0'
    const maxTiersAmount = this.state ? this.state.maxTiersAmount ? this.state.maxTiersAmount.toString() : '0' : '0'
    const maxEthRaised = this.state ? this.state.maxEthRaised ? this.state.maxEthRaised.toString() : '0' : '0'
    return (
      <div className="stats container">
        <p className="title">Token Wizard statistics</p>
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
                <p className="stats-items-description">Max eth raised in one crowdsale</p>
              </div>
            </div>
          </div>
        </div>
        <Loader show={this.state ? this.state.loading : true}/>
      </div>
    )
  }
}