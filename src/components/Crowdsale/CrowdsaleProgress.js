import React from 'react'

export const CrowdsaleProgress = ({ totalRaisedFunds, ethGoal, tokensClaimedRatio, extraClassName = '' }) => {
  const renderDividers = () => {
    return Array.apply('', Array(9)).map((noUse, index) => (
      <div key={index} className="cs-CrowdsaleProgress_Division" />
    ))
  }

  return (
    <div className={`cs-CrowdsaleProgress ${extraClassName}`}>
      <div className="cs-CrowdsaleProgress_Funds">
        <div className="cs-CrowdsaleProgress_FundsAmount cs-CrowdsaleProgress_FundsAmount-total-raised">
          <h2 className="cs-CrowdsaleProgress_FundsTitle">
            {totalRaisedFunds} <span className="cs-CrowdsaleProgress_NoBreak">ETH</span>
          </h2>
          <p className="cs-CrowdsaleProgress_FundsDescription">Total Raised Funds</p>
        </div>
        <div className="cs-CrowdsaleProgress_FundsAmount cs-CrowdsaleProgress_FundsAmount-goal">
          <h2 className="cs-CrowdsaleProgress_FundsTitle">
            {ethGoal} <span className="cs-CrowdsaleProgress_NoBreak">ETH</span>
          </h2>
          <p className="cs-CrowdsaleProgress_FundsDescription">Goal</p>
        </div>
      </div>
      <div className="cs-CrowdsaleProgress_Bar">
        <div className="cs-CrowdsaleProgress_BarWidth" style={{ width: tokensClaimedRatio + '%' }} />
        {renderDividers()}
      </div>
    </div>
  )
}
