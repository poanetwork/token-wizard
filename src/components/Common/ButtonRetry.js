import React from 'react'

export const ButtonRetry = ({ disabled = false, onClick, extraClassName = '' }) => (
  <button className={`sw-ButtonRetry ${extraClassName}`} disabled={disabled} onClick={onClick} type="button">
    <span className={`sw-ButtonRetry_Text`}>Retry transaction</span>
  </button>
)
