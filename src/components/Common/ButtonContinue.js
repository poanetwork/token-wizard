import React, { Component } from 'react'

export class ButtonContinue extends Component {
  /**
   * Render method for ButtonContinue component
   * @returns {*}
   */
  render() {
    const { status, type, onClick } = this.props

    return (
      <button onClick={onClick} type={type} disabled={!status} className={`sw-ButtonContinue`}>
        <span className={`sw-ButtonContinue_Text`}>Continue</span>
      </button>
    )
  }
}
