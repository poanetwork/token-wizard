import React from 'react'
import { Link } from 'react-router-dom'

export const AboutCrowdsale = ({ name, ticker, execID, networkID }) => (
  <div className="about-step">
    <div className="step-icons step-icons_crowdsale-setup"/>
    <p className="title">{name} ({ticker}) Settings</p>
    <p className="description">
      The most important and exciting part of the crowdsale process. Here you can define parameters of your crowdsale
      campaign.
    </p>
    <Link to={`/crowdsale/?exec-id=${execID}&networkID=${networkID}`} className="crowdsale-page-link">
      Crowdsale page
    </Link>
  </div>
)
