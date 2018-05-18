import React from 'react'
import { Link } from 'react-router-dom'
import { DESCRIPTION } from '../../utils/constants'

export const AboutCrowdsale = ({ name, ticker, execID, networkID }) => (
  <div className="about-step">
    <div className="step-icons step-icons_crowdsale-setup"/>
    <p className="title">{name} ({ticker}) Settings</p>
    <p className="description">
      {DESCRIPTION.CROWDSALE_SETUP}
    </p>
    <Link to={`/crowdsale/?exec-id=${execID}&networkID=${networkID}`} className="crowdsale-page-link">
      Crowdsale page
    </Link>
  </div>
)