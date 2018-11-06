import React from 'react'

export const CrowdsaleSummaryItem = ({ title, description }) => {
  return (
    <div className="cs-CrowdsaleSummaryItem">
      <h3 className="cs-CrowdsaleSummaryItem_Title">{title}</h3>
      <p className="cs-CrowdsaleSummaryItem_Description">{description}</p>
    </div>
  )
}
