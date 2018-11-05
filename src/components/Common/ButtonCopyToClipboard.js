import React from 'react'
import { copy, showClipboardCopyToast } from '../../utils/copy'

const elementClass = 'sw-ButtonCopyToClipboard'

copy(`.${elementClass}`)

export const ButtonCopyToClipboard = ({ disabled, extraClassName = '', value, title = '' }) => (
  <button
    className={`${elementClass} ${extraClassName}`}
    data-clipboard-action="copy"
    data-clipboard-text={value}
    disabled={disabled}
    type="button"
    onClick={() => {
      showClipboardCopyToast(title)
    }}
  />
)
