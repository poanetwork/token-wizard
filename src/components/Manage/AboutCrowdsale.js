import React from 'react'
import { Link } from 'react-router-dom'
import { DESCRIPTION } from '../../utils/constants'
import { isExecIDValid } from '../../utils/utils'
import { isAddressValid } from '../../utils/blockchainHelpers'

export const AboutCrowdsale = ({ name, ticker, crowdsalePointer, networkID }) => {
  let queryParam
  if (isExecIDValid(crowdsalePointer)) {
    queryParam = 'exec-id'
  } else if (isAddressValid(crowdsalePointer)) {
    queryParam = 'addr'
  }
  return (
    <div className="about-step">
      <div className="step-icons step-icons_crowdsale-setup" />
      <p className="title">
        {name} ({ticker}) Settings
      </p>
      <p className="description">{DESCRIPTION.CROWDSALE_SETUP}</p>
      <Link to={`/crowdsale/?${queryParam}=${crowdsalePointer}&networkID=${networkID}`} className="crowdsale-page-link">
        Crowdsale page
      </Link>
    </div>
  )
}
