import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3 } from '../utils/web3'
import { defaultState } from '../utils/constants'
import { stepTwo } from './stepTwo'
import { getOldState } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { InputField } from './Common/InputField'
import { NAVIGATION_STEPS } from '../utils/constants'
const { CROWDSALE_SETUP } = NAVIGATION_STEPS

export class stepThree extends stepTwo {
  constructor(props) {
    super(props);
    const oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
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
            <InputField side='left' type='datetime-local' title={'Start time'} value={this.state.crowdsale.startTime} onChange={(e) => this.changeState(e, 'crowdsale', 'startTime')}/>
            <InputField side='right' type='datetime-local' title={'End time'} value={this.state.crowdsale.endTime} onChange={(e) => this.changeState(e, 'crowdsale', 'endTime')}/>
            <InputField side='left' type='text' title={'Wallet address'} value={this.state.crowdsale.walletAddress} onChange={(e) => this.changeState(e, 'crowdsale', 'walletAddress')}/>
            <InputField side='right' type='number' title={'Supply'} value={this.state.crowdsale.supply} onChange={(e) => this.changeState(e, 'crowdsale', 'supply')}/>
            <InputField side='left' type='number' title={'Rate'} value={this.state.crowdsale.rate} onChange={(e) => this.changeState(e, 'crowdsale', 'rate')}/>
          </div>
        </div>
        <div className="button-container">
          <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
        </div>
      </section>
    )}
}