import React, { Component } from 'react'

export class ResumeCrowdsale extends Component {
  resume = () => {
    localStorage.reload = true
    window.location = '/4'
  }

  render() {
    return (
      <button onClick={() => this.resume()} className="hm-Home_BtnNew">
        Resume crowdsale
      </button>
    )
  }
}
