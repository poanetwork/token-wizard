import React, { Component } from 'react'

export class ButtonBack extends Component {
  /**
   * Render method for ButtonBack component
   * @returns {*}
   */
  render() {
    const { onClick } = this.props

    return (
      <button onClick={onClick} type="button" className={`sw-ButtonBack`}>
        Back
      </button>
    )
  }
}
