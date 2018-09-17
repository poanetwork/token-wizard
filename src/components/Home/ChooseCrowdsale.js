import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'

export class ChooseCrowdsale extends Component {
  goToCrowdsales = () => {
    navigateTo(this.props, 'crowdsales')
  }

  render() {
    return (
      <div onClick={() => this.goToCrowdsales()} className="hm-Home_BtnChoose">
        Choose Crowdsale
      </div>
    )
  }
}
