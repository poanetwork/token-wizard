import React, { Component } from 'react'

export class ButtonDownload extends Component {
  render() {
    const { disabled, onClick, extraClass } = this.props
    return (
      <button
        className={`sw-ButtonDownload ${extraClass ? extraClass : ''}`}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        Download
      </button>
    )
  }
}
