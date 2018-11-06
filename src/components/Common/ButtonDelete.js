import React from 'react'

export const ButtonDelete = ({ onClick, extraClassName = '', disabled }) => (
  <button className={`sw-ButtonDelete ${extraClassName}`} disabled={disabled} onClick={onClick} type="button" />
)
