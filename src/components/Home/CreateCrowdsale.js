import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'
import logdown from 'logdown'

const logger = logdown('TW:Home:CreateCrowdsale')

export class CreateCrowdsale extends Component {
  goToStepOne = () => {
    try {
      localStorage.reload = true
      navigateTo({
        history: this.props.history,
        location: 'stepOne',
        fromLocation: 'home'
      })
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
