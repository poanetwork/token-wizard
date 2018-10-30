import React from 'react'

export const CrowdsaleSummary = ({
  contributorsCount,
  currentRatePerETH,
  endRatePerETH,
  extraClassName = '',
  isMintedCappedCrowdsale,
  startRatePerETH,
  tokensClaimed,
  totalSupply
}) => {
  const isDutchAuctionCrowdsale = !isMintedCappedCrowdsale

  const renderCrowdsaleSummaryItem = (title, description) => {
    return (
      <div className="cs-CrowdsaleSummary_Item">
        <h3 className="cs-CrowdsaleSummary_ItemTitle">{title}</h3>
        <p className="cs-CrowdsaleSummary_ItemDescription">{description}</p>
      </div>
    )
  }

  return (
    <div className={`cs-CrowdsaleSummary ${extraClassName}`}>
      {renderCrowdsaleSummaryItem(tokensClaimed, 'Tokens Claimed')}
      {renderCrowdsaleSummaryItem(contributorsCount, 'Contributors')}
      {isMintedCappedCrowdsale ? renderCrowdsaleSummaryItem(currentRatePerETH, 'Rate (Tokens/ETH)') : null}
      {renderCrowdsaleSummaryItem(totalSupply, 'Total Supply')}
      {isDutchAuctionCrowdsale ? renderCrowdsaleSummaryItem(startRatePerETH, 'Start Rate (Tokens/ETH)') : null}
      {isDutchAuctionCrowdsale ? renderCrowdsaleSummaryItem(currentRatePerETH, 'Rate (Tokens/ETH)') : null}
      {isDutchAuctionCrowdsale ? renderCrowdsaleSummaryItem(endRatePerETH, 'End Rate (Tokens/ETH)') : null}
    </div>
  )
}
