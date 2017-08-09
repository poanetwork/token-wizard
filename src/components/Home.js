import React, { Component } from 'react';
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { setFlatFileContentToState } from '../utils/utils';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: {
        crowdsale: {}, 
        token: {}
      }
    };
  }

  addContractsToState (src, bin, abi) {
    this.setState({
      contracts: {
        src,
        bin,
        abi: JSON.parse(abi)
      },
      token: {}
    })
  }

  componentDidMount() {
    const contractName = "SampleCrowdsale";
    let src, bin
    console.log('hello hello')
    //var contractName = "RomanCrowdsale";
    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", (content) => src = content);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", (_bin) => bin = _bin);
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", (_abi) => this.addContractsToState(src, bin, _abi));
    /*setFlatFileContentToState("./contracts/SampleCrowdsaleToken_flat.bin", function(content) {
      $this.state.contracts.token.bin = content;
    });
    setFlatFileContentToState("./contracts/SampleCrowdsaleToken_flat.abi", function(content) {
      $this.state.contracts.token.abi = JSON.parse(content);
    });*/
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
                {/*<Link to='/1'><a href="#" className="button button_outline">Choose contract</a></Link>*/}
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