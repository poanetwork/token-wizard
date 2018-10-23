import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'
import storage from 'store2'
import logdown from 'logdown'

const logger = logdown('TW:Home:CreateCrowdsale')

export class CreateCrowdsale extends Component {
  goToStepOne = () => {
    try {
      if (storage.has('DeploymentStore') && storage.get('DeploymentStore').deploymentStep) {
        navigateTo({
          history: this.props.history,
          location: 'home',
          fromLocation: 'home'
        })
      } else {
        const data = {
          history: this.props.history,
          location: 'stepOne',
          fromLocation: 'home'
        }

        localStorage.reload = true
        navigateTo(data)
      }
    } catch (err) {
      logger.log('Error to navigate', err)
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
