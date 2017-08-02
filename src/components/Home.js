import React, { Component } from 'react';
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {contracts: {}};
    this.setFlatFileContentToState = this.setFlatFileContentToState.bind(this);
  }

  componentDidMount() {
    var $this = this;
    this.setFlatFileContentToState("./contracts/Crowdsale_flat.sol", function(content) {
      var state = $this.state;
      state.contracts.crowdsale = content;
      $this.setState(state);
    });
    this.setFlatFileContentToState("./contracts/CappedCrowdsale_flat.sol", function(content) {
      var state = $this.state;
      state.contracts.capped = content;
      $this.setState(state);
    })
  }

  readSolFile(path, cb)
  {
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", path, false);
      rawFile.onreadystatechange = function ()
      {
          if(rawFile.readyState === 4)
          {
              if(rawFile.status === 200 || rawFile.status === 0)
              {
                  var allText = rawFile.responseText;
                  cb(allText);
              }
          }
      };
      rawFile.send(null);
  }

  setFlatFileContentToState(file, cb) {
    this.readSolFile(file, function(content) {
      cb(content);
    });
  }

  render() {
    return (
      <div>
        <section className="home">
          <input id="crowdsale_flat_src" style={{display: "none"}} value="fdsfsdf" ref="crowdsaleFlat"/>
          <span id="capped_crowdsale_flat_src" style={{display: "none"}} ref="cappedCrowdsaleFlat"></span>
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Create crowdsale</h1>
              <p className="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat.
              </p>
              <div className="buttons">
                <Link to={{ pathname: '/1', query: { state: this.state } }}><a href="#" className="button button_fill">New crowdsale</a></Link>
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