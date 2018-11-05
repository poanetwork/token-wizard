import React from 'react'

export const ButtonSkip = ({ disabled = false, onClick, extraClassName = '' }) => (
  <button className={`sw-ButtonSkip ${extraClassName}`} disabled={disabled} onClick={onClick} type="button">
    <span className={`sw-ButtonSkip_Text`}>Skip transaction</span>
  </button>
)
