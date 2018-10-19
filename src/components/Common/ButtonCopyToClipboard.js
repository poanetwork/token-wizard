import React from 'react'
import { copy } from '../../utils/copy'

const elementClass = 'sw-ButtonCopyToClipboard'

copy(`.${elementClass}`)

export const ButtonCopyToClipboard = ({ disabled, extraClassName, value }) => (
  <button
    className={`${elementClass} ${extraClassName ? extraClassName : ''}`}
    data-clipboard-action="copy"
    data-clipboard-text={value}
    disabled={disabled}
    type="button"
  />
)
