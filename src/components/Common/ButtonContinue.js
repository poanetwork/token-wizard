import React from 'react'

export const ButtonContinue = ({ disabled = false, type, onClick, extraClassName, buttonText = 'Continue' }) => (
  <button
    className={`sw-ButtonContinue ${extraClassName ? extraClassName : ''}`}
    disabled={disabled}
    onClick={onClick}
    type={type}
  >
    <span className={`sw-ButtonContinue_Text`}>{buttonText}</span>
  </button>
)
