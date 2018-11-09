import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'

export class ButtonChooseCrowdsale extends Component {
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
      <div onClick={() => this.goToCrowdsales()} className="hm-ButtonChooseCrowdsale">
        Choose Crowdsale
      </div>
    )
  }
}
