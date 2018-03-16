import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import cancelDeploy from '../utils/cancelDeploy'

class CheckIncompleteDeploy extends Component {
  cancel() {
    cancelDeploy()
  }

  render() {
    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Welcome to Token Wizard</h1>
              <p className="description">
                You have an incomplete deploy.
              </p>
              <div className="buttons">
                <Link to='/4'><span className="button button_fill">Resume</span></Link>
                <div onClick={this.cancel} className="button button_outline">Cancel</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default CheckIncompleteDeploy
