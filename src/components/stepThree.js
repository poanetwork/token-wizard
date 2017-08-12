import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3 } from '../utils/web3'
import { defaultState } from '../utils/constants'
import { stepTwo } from './stepTwo'
import { getOldState } from '../utils/utils'
import { StepNavigation } from './StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'
const { CROWDSALE_SETUP } = NAVIGATION_STEPS

export class stepThree extends stepTwo {
  constructor(props) {
    super(props);
    const oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
    //this.state.crowdsale.startBlock = 3036872;
    //this.state.crowdsale.endBlock = 5000000;
    //this.state.crowdsale.rate = 1;
  }

  componentDidMount () {
    setTimeout( () => {
      getWeb3((web3) => {
        let newState = {...this.state}
        newState.crowdsale.walletAddress = web3.eth.accounts[0];
        this.setState(newState);
      });
    }, 500);
  }

  render() {
    return (
      <section className="steps steps_crowdsale-contract" ref="three">
        <StepNavigation activeStep={CROWDSALE_SETUP}/>
        <div className="steps-content container">
          <div className="about-step">
            <div className="step-icons step-icons_crowdsale-setup"></div>
            <p className="title">Crowdsale setup</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <div className="hidden">
            <div className="left">
              <label className="label">Start block</label>
              <input type="text" className="input" value={this.state.crowdsale.startBlock} onChange={(e) => this.changeState(e, "crowdsale", "startBlock")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label className="label">End block</label>
              <input type="text" className="input" value={this.state.crowdsale.endBlock} onChange={(e) => this.changeState(e, "crowdsale", "endBlock")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="left">
              <label className="label">Wallet address</label>
              <input type="text" className="input" value={this.state.crowdsale.walletAddress} onChange={(e) => this.changeState(e, "crowdsale", "walletAddress")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="right">
              <label className="label">Supply</label>
              <input type="text" className="input" value={this.state.crowdsale.supply} onChange={(e) => this.changeState(e, "crowdsale", "supply")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
            <div className="left">
              <label className="label">Rate</label>
              <input type="text" className="input" value={this.state.crowdsale.rate} onChange={(e) => this.changeState(e, "crowdsale", "rate")}/>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
              </p>
            </div>
          </div>
        </div>
        <div className="button-container">
          <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
        </div>
      </section>
    )}
}