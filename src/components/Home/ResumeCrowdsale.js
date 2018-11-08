import React, { Component } from 'react'
import logdown from 'logdown'
import { navigateTo } from '../../utils/utils'

const logger = logdown('TW:Home:ResumeCrowdsale')

export class ResumeCrowdsale extends Component {
  resume = () => {
    logger.log('Resume crowdsale')

    navigateTo({
      history: this.props.history,
      location: 'stepFour'
    })
  }

  render() {
    return (
      <button onClick={() => this.resume()} className="hm-Home_BtnNew">
        Resume crowdsale
      </button>
    )
  }
}
