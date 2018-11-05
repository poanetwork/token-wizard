import React from 'react'

export const ButtonBack = ({ onClick, extraClassName = '', disabled }) => (
  <button className={`sw-ButtonBack ${extraClassName}`} disabled={disabled} onClick={onClick} type="button">
    Back
  </button>
)
