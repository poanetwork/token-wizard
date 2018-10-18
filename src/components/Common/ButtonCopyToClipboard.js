import React from 'react'

export const ButtonCopyToClipboard = ({ disabled, extraClassName, value }) => (
  <button
    className={`sw-ButtonCopyToClipboard ${extraClassName ? extraClassName : ''}`}
    data-clipboard-action="copy"
    data-clipboard-text={value}
    disabled={disabled}
    type="button"
  />
)
