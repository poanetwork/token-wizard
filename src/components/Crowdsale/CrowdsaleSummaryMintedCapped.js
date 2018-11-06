import React from 'react'
import { CrowdsaleSummaryItem } from './CrowdsaleSummaryItem'

export const CrowdsaleSummaryMintedCapped = ({
  contributorsCount,
  currentRatePerETH,
  extraClassName = '',
  tokensClaimed,
  totalSupply
}) => {
  return (
    <div className={`cs-CrowdsaleSummaryMintedCapped ${extraClassName}`}>
      <CrowdsaleSummaryItem title={tokensClaimed} description={'Tokens Claimed'} />
      <CrowdsaleSummaryItem title={contributorsCount} description={'Contributors'} />
      <CrowdsaleSummaryItem title={currentRatePerETH} description={'Rate (Tokens/ETH)'} />
      <CrowdsaleSummaryItem title={totalSupply} description={'Total Supply'} />
    </div>
  )
}
