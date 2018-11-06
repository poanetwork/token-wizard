import React from 'react'
import { ButtonCopyToClipboard } from '../Common/ButtonCopyToClipboard'

export const CrowdsaleID = ({ hash, description, extraClassname = '' }) => {
  return (
    <div className={`cs-CrowdsaleID ${extraClassname}`}>
      <div className="cs-CrowdsaleID_InnerContainer">
        <h3 className="cs-CrowdsaleID_Hash">
          <span className="cs-CrowdsaleID_HashText">{hash}</span> <ButtonCopyToClipboard value={hash} />
        </h3>
        <p className="cs-CrowdsaleID_Description">{description}</p>
      </div>
    </div>
  )
}
