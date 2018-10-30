import React from 'react'

export const CrowdsaleID = ({ hash, description, extraClassname = '' }) => {
  return (
    <div className={`cs-CrowdsaleID ${extraClassname}`}>
      <div className="cs-CrowdsaleID_Hash">{hash}</div>
      <div className="cs-CrowdsaleID_Description">{description}</div>
    </div>
  )
}
