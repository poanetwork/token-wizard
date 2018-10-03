import React, { Component } from 'react'

export class ButtonCSV extends Component {
  /**
   * Render method for ButtonBack component
   * @returns {*}
   */
  render() {
    const { onClick, text, extraClassName } = this.props

    return (
      <div onClick={onClick} className={`sw-ButtonCSV ${extraClassName}`}>
        {text}
      </div>
    )
  }
}
