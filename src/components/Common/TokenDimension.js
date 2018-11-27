import React from 'react'

export const TokenDimension = ({ type = 'tokens', extraClassName = '' }) => {
  const denomination =
    {
      percentage: '%',
      token: 'token',
      tokens: 'tokens'
    }[type] || null

  return (
    <div className={`sw-TokenDimension sw-TokenDimension-${type} ${extraClassName}`}>
      <span className={`sw-TokenDimension_Text sw-TokenDimension_Text-${type}`}>{denomination}</span>
    </div>
  )
}
