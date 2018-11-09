import React, { Component } from 'react'
import logdown from 'logdown'
import cancelDeploy from '../../utils/cancelDeploy'

const logger = logdown('TW:Home:CancelCrowdsale')

export class ButtonCancelCrowdsale extends Component {
  cancel = () => {
    logger.log('Cancel crowdsale')
    cancelDeploy()
  }

  render() {
    return (
      <button onClick={() => this.cancel()} className="hm-ButtonCancelCrowdsale">
        Cancel crowdsale
      </button>
    )
  }
}
