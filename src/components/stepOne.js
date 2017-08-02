import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'

export const stepOne = () => (
	 <section className="steps steps_crowdsale-contract">
    <div className="steps-navigation">
      <div className="container">
        <div className="step-navigation step-navigation_active">Crowdsale Contract</div>
        <div className="step-navigation">Token Setup</div>
        <div className="step-navigation">Crowdsale Setup</div>
        <div className="step-navigation">Publish</div>
        <div className="step-navigation">Crowdsale Page</div>
      </div>
    </div>
    <div className="steps-content container">
      <div className="about-step">
        <div className="step-icons step-icons_crowdsale-contract"></div>
        <p className="title">Crowdsale Contract</p>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>
      <div className="radios">
        <label className="radio">
          <input type="radio" checked name="contract-type"/>
          <span className="title">Standard</span>
          <span className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </span>
        </label>
        <label className="radio">
          <input type="radio" disabled name="contract-type"/>
          <span className="title title_soon">Capped</span>
          <span className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </span>
        </label>
      </div>
    </div>
    <div className="button-container">
      <Link to='/2'><a href="#" className="button button_fill">Continue</a></Link>
    </div>
  </section>
)