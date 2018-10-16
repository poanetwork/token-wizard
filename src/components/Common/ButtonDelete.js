import React, { Component } from 'react'

export class ButtonDelete extends Component {
  render() {
    const { onClick, extraClassName } = this.props
    const extraClass = extraClassName ? extraClassName : ''

    return <div onClick={onClick} className={`sw-ButtonDelete ${extraClass ? extraClass : ''}`} />
  }
}
