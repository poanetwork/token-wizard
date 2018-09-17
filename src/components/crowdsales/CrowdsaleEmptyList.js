import React, { Component } from 'react'

export class CrowdsaleEmptyList extends Component {
  render() {
    const { account } = this.props

    return (
      <p className="sw-EmptyContentTextOnly">
        No crowdsales found for address <span className="text-bold">{account}</span>
      </p>
    )
  }
}
