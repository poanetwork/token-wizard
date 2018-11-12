import React from 'react'

export const TokenDimension = ({ type = 'tokens', extraClassName = '' }) => (
  <div className={`sw-TokenDimension sw-TokenDimension-${type} ${extraClassName}`} />
)
