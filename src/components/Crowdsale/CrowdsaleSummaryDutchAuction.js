import React from 'react'
import { CrowdsaleSummaryItem } from './CrowdsaleSummaryItem'

export const CrowdsaleSummaryDutchAuction = ({
  contributorsCount,
  currentRatePerETH,
  endRatePerETH,
  extraClassName = '',
  startRatePerETH,
  tokensClaimed,
  totalSupply
}) => {
  return (
    <div className={`cs-CrowdsaleSummaryDutchAuction ${extraClassName}`}>
      <CrowdsaleSummaryItem title={tokensClaimed} description={'Tokens Claimed'} />
      <CrowdsaleSummaryItem title={contributorsCount} description={'Contributors'} />
      <CrowdsaleSummaryItem title={totalSupply} description={'Total Supply'} />
      <CrowdsaleSummaryItem title={startRatePerETH} description={'Start Rate (Tokens/ETH)'} />
      <CrowdsaleSummaryItem title={currentRatePerETH} description={'Rate (Tokens/ETH)'} />
      <CrowdsaleSummaryItem title={endRatePerETH} description={'End Rate (Tokens/ETH)'} />
    </div>
  )
}
