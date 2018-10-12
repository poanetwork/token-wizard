import React, { Component } from 'react'

export class ButtonPlus extends Component {
  render() {
    const { onClick, extraClassName } = this.props

    return <div onClick={onClick} className={`sw-ButtonPlus ${extraClassName ? extraClassName : ''}`} />
  }
}
