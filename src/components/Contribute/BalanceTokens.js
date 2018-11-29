import React from 'react'

export const BalanceTokens = ({ balance, ticker, extraClassName = '' }) => (
  <div className={`ba-BalanceTokens ${extraClassName}`}>
    <h2 className="ba-BalanceTokens_Title">
      {balance} <span className="ba-BalanceTokens_Title-uppercase">{ticker}</span>
    </h2>
    <p className="ba-BalanceTokens_Description">Your Balance</p>
  </div>
)
