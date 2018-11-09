import React, { Component } from 'react'

export class ButtonResumeCrowdsale extends Component {
  resume = () => {
    localStorage.reload = true
    window.location = '/4'
  }

  render() {
    return (
      <button onClick={() => this.resume()} className="hm-ButtonResumeCrowdsale">
        Resume crowdsale
      </button>
    )
  }
}
