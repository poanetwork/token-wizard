import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'
import storage from 'store2'

export class CreateCrowdsale extends Component {
  goToStepOne = async () => {
    if (storage.has('DeploymentStore') && storage.get('DeploymentStore').deploymentStep) {
      navigateTo(this.props, 'home')
    } else {
      navigateTo(this.props, 'stepOne')
    }
  }

  render() {
    return (
      <button onClick={() => this.goToStepOne()} className="hm-Home_BtnNew">
        New crowdsale
      </button>
    )
  }
}
