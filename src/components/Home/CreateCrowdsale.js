import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'

export class CreateCrowdsale extends Component {
  goToStepOne = () => {
    localStorage.reload = true
    navigateTo({
      history: this.props.history,
      location: 'stepOne',
      fromLocation: 'home'
    })
  }

  render() {
    return (
      <button onClick={() => this.goToStepOne()} className="hm-Home_BtnNew">
        New crowdsale
      </button>
    )
  }
}
