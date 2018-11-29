import React from 'react'

export const Button = ({ buttonText = '', disabled = false, extraClassName = '', onClick, type = 'button' }) => (
  <button className={`sw-Button ${extraClassName}`} disabled={disabled} onClick={onClick} type={type}>
    {buttonText}
  </button>
)
