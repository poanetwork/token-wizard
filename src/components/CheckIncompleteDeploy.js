import React, { Component } from 'react'
import cancelDeploy from '../utils/cancelDeploy'
import { navigateTo } from '../utils/utils'

class CheckIncompleteDeploy extends Component {
  cancel() {
    cancelDeploy()
  }

  goToStepFour() {
    navigateTo({
      history: this.props.history,
      location: 'stepFour'
    })
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
                <button onClick={() => this.goToStepFour()} className="button button_fill">
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
