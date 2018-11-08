import React, { Component } from 'react'
import { LogoPrimary } from '../LogoPrimary/index'
import { ChooseCrowdsale } from './ChooseCrowdsale'
import { CreateCrowdsale } from './CreateCrowdsale'
import { ResumeCrowdsale } from './ResumeCrowdsale'
import { CancelCrowdsale } from './CancelCrowdsale'
import { inject, observer } from 'mobx-react/index'

@inject('deploymentStore')
@observer
export class Home extends Component {
  render() {
    const { history, deploymentStore } = this.props

    return (
      <div>
        <section className={`hm-Home`}>
          <div className="hm-Home_Scroll">
            <div className="hm-Home_Top">
              <LogoPrimary />
            </div>
            <div className="hm-Home_MainInfoContainer">
              <div className="hm-Home_MainInfo">
                <div className="hm-Home_MainInfoTextContainer">
                  <h1 className="hm-Home_MainInfoTitle">Welcome to Token Wizard</h1>
                  <p className="hm-Home_MainInfoDescription">
                    Token Wizard is a client side tool to create ERC20 token and crowdsale in five steps. It helps you
                    to publish contracts on the Ethereum network, create a crowdsale page with stats. For participants,
                    the wizard creates a page to contribute into the campaign.
                  </p>
                  <p className="hm-Home_MainInfoPoweredBy">
                    Token Wizard is powered by <a href="https://github.com/auth-os/beta">Auth-os</a>.
                  </p>
                </div>
                {deploymentStore.deployInProgress ? (
                  <div className="hm-Home_MainInfoButtonContainer">
                    <ResumeCrowdsale history={history} />
                    <CancelCrowdsale history={history} />
                  </div>
                ) : (
                  <div className="hm-Home_MainInfoButtonContainer">
                    <CreateCrowdsale history={history} />
                    <ChooseCrowdsale history={history} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
