import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'

export class stepTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = props?props.location?props.location.query?props.location.query.state?props.location.query.state:{}:{}:{}:{};
    if (this.changeState.bind) this.changeState = this.changeState.bind(this);
    var state = this.state;
    state.token = {};
    this.setState(state);
  }

  changeState(event, $this, parent, prop, ref) {
    var state = $this.state;
    if ($this.refs[ref]) state[parent][prop] = event.target.value;
    $this.setState(state);
  }

  render() {
    return (
    	<section className="steps steps_crowdsale-contract" ref="two">
        <div className="steps-navigation">
          <div className="container">
            <div className="step-navigation">Crowdsale Contract</div>
            <div className="step-navigation step-navigation_active">Token Setup</div>
            <div className="step-navigation">Crowdsale Setup</div>
            <div className="step-navigation">Publish</div>
            <div className="step-navigation">Crowdsale Page</div>
          </div>
        </div>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_token-setup"></div>
            <p className="title">Token setup</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <div className="left">
              <label for="" className="label">Name</label>
              <input type="text" className="input" value={this.state.token.name} onChange={(e) => this.changeState(e, this, "token", "name", "two")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label for="" className="label">Ticker</label>
              <input type="text" className="input" value={this.state.token.ticker} onChange={(e) => this.changeState(e, this, "token", "ticker", "two")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="left">
              <label for="" className="label">Supply</label>
              <input type="text" className="input" value={this.state.token.supply} onChange={(e) => this.changeState(e, this, "token", "supply", "two")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label for="" className="label">Decimals</label>
              <input type="text" className="input" value={this.state.token.decimals} onChange={(e) => this.changeState(e, this, "token", "decimals", "two")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
          </div>
        </div>
        <div className="button-container">
          <Link to={{ pathname: '/3', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
        </div>
      </section>
  )}
}