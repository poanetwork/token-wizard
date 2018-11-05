import React from 'react'

export const ButtonPlus = ({ onClick, extraClassName = '', disabled }) => (
  <button className={`sw-ButtonPlus ${extraClassName}`} disabled={disabled} onClick={onClick} type="button" />
)
