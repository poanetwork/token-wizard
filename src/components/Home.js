import React, { Component } from 'react';
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { setFlatFileContentToState } from '../utils/utils';
import { defaultState } from '../utils/constants'

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState
  }

  addContractsToState (src, bin, abi, contract) {
    let newState = Object.assign({}, this.state)
    newState.contracts[contract] = {
      src,
      bin,
      abi: JSON.parse(abi)
    }
    this.setState(newState)
  }

  componentDidMount() {
    //const contractName = "RomanCrowdsale";
    //const contractName = "SampleCrowdsale";
    const contractName = "Crowdsale";
    let srcC, binC
    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", (content) => srcC = content);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", (_bin) => binC = _bin);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", (_abi) => this.addContractsToState(srcC, binC, _abi, "crowdsale"));

    const tokenName = "CrowdsaleToken";
    let srcT, binT
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.sol", (content) => srcT = content);
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.bin", (_bin) => binT = _bin);
    setFlatFileContentToState("./contracts/" + tokenName + "_flat.abi", (_abi) => this.addContractsToState(srcT, binT, _abi, "token"));
    
    const pricingStrategyName = "CrowdsalePricingStrategy";
    let srcP, binP
    setFlatFileContentToState("./contracts/" + pricingStrategyName + "_flat.sol", (content) => srcP = content);
    setFlatFileContentToState("./contracts/" + pricingStrategyName + "_flat.bin", (_bin) => binP = _bin);
    setFlatFileContentToState("./contracts/" + pricingStrategyName + "_flat.abi", (_abi) => this.addContractsToState(srcP, binP, _abi, "pricingStrategy"));
  }

  render() {
    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Create crowdsale</h1>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat.
              </p>
              <div className="buttons">
                <Link to={{ pathname: '/1', query: { state: this.state } }}><a className="button button_fill">New crowdsale</a></Link>
              </div>
            </div>
          </div>
          <div className="process">
            <div className="container">
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-contract"></div>
                <p className="title">Crowdsale Contract</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_token-setup"></div>
                <p className="title">Token Setup</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-setup"></div>
                <p className="title">Crowdsale Setup</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_publish"></div>
                <p className="title">Publish</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
              <div className="process-item">
                <div className="step-icons step-icons_crowdsale-page"></div>
                <p className="title">Crowdsale Page</p>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}