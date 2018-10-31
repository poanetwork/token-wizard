import React from 'react'

export const CrowdsaleID = ({ hash, description, extraClassname = '' }) => {
  return (
    <div className={`cs-CrowdsaleID ${extraClassname}`}>
      <div className="cs-CrowdsaleID_InnerContainer">
        <h3 className="cs-CrowdsaleID_Hash">{hash}</h3>
        <p className="cs-CrowdsaleID_Description">{description}</p>
      </div>
    </div>
  )
}
