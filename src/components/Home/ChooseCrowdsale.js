import React, { Component } from 'react'
import { navigateTo } from '../../utils/utils'
import logdown from 'logdown'

const logger = logdown('TW:Home:ChooseCrowdsale')

export class ChooseCrowdsale extends Component {
  goToCrowdsales = () => {
    try {
      localStorage.reload = true
      navigateTo({
        history: this.props.history,
        location: 'crowdsales',
        fromLocation: 'home'
      })
    } catch (err) {
      logger.log('Error to navigate', err)
    }
  }

  render() {
    return (
      <div onClick={() => this.goToCrowdsales()} className="hm-Home_BtnChoose">
        Choose Crowdsale
      </div>
    )
  }
}
