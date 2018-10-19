import React from 'react'

export const ButtonContinue = ({ status, type, onClick, extraClassName }) => (
  <button
    className={`sw-ButtonContinue ${extraClassName ? extraClassName : ''}`}
    disabled={!status}
    onClick={onClick}
    type={type}
  >
    <span className={`sw-ButtonContinue_Text`}>Continue</span>
  </button>
)
