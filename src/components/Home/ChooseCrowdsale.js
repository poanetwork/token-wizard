import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'

export class ChooseCrowdsale extends Component {
  goToCrowdsales = () => {
    localStorage.reload = true
    navigateTo({
      history: this.props.history,
      location: 'crowdsales',
      fromLocation: 'home'
    })
  }

  render() {
    return (
      <div onClick={() => this.goToCrowdsales()} className="hm-Home_BtnChoose">
        Choose Crowdsale
      </div>
    )
  }
}
