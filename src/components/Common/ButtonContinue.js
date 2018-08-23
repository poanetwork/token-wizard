import React, { Component } from 'react'
import classNames from 'classnames'
import logdown from 'logdown'

const logger = logdown('TW:ButtonContinue')

export class ButtonContinue extends Component {
  /**
   * Render method for ButtonContinue component
   * @returns {*}
   */
  render() {
    const { status } = this.props

    logger.log('Button continue disabled status:', status)
    const submitButtonClass = classNames('button', 'button_fill', 'button_no_border', {
      button_disabled: !status
    })

    return (
      <button disabled={!status} className={submitButtonClass}>
        Continue
      </button>
    )
  }
}
