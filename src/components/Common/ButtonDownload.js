import React from 'react'

export const ButtonDownload = ({ disabled, onClick, extraClassName = '' }) => (
  <button className={`sw-ButtonDownload ${extraClassName}`} disabled={disabled} onClick={onClick} type="button">
    Download
  </button>
)
