import React from 'react'

export const ButtonCSV = ({ onClick, text, extraClassName = '', disabled }) => (
  <button className={`sw-ButtonCSV ${extraClassName}`} disabled={disabled} onClick={onClick} type="button">
    {text}
  </button>
)
