import React, { Component } from 'react'

export class ButtonCSV extends Component {
  render() {
    const { onClick, text, extraClassName } = this.props

    return (
      <div onClick={onClick} className={`sw-ButtonCSV ${extraClassName}`}>
        {text}
      </div>
    )
  }
}
