import React, { Component } from 'react'
import cancelDeploy from '../utils/cancelDeploy'

class CheckIncompleteDeploy extends Component {
  cancel() {
    cancelDeploy()
  }

  navigateTo = (location, params = '') => {
    const path =
      {
        home: '/',
        stepOne: '1',
        stepTwo: '2',
        stepFour: '4',
        manage: 'manage'
      }[location] || null

    if (path === null) {
      throw new Error(`invalid location specified: ${location}`)
    }

    this.props.history.push(`${path}${params}`)
  }

  goToStepFour = () => {
    this.navigateTo('stepFour')
  }

  render() {
    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Welcome to Token Wizard</h1>
              <p className="description">You have an incomplete deploy.</p>
              <div className="buttons">
                <button onClick={this.goToStepFour} className="button button_fill">
                  Resume
                </button>
                <button onClick={() => this.cancel()} className="button button_outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default CheckIncompleteDeploy
