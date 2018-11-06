import React from 'react'

export const ButtonContinue = ({
  buttonText = 'Continue',
  disabled = false,
  extraClassName = '',
  onClick,
  type = 'button'
}) => (
  <button className={`sw-ButtonContinue ${extraClassName}`} disabled={disabled} onClick={onClick} type={type}>
    <span className={`sw-ButtonContinue_Text`}>{buttonText}</span>
  </button>
)
