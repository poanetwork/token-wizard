import React from 'react'
import { copy } from '../../utils/copy'
import { toast } from '../../utils/utils'

const elementClass = 'sw-ButtonCopyToClipboard'

copy(`.${elementClass}`)

const showToast = title => {
  let copyMessage = title ? `"${title}" copied to clipboard.` : 'Copied to clipboard'

  toast.showToaster({ message: copyMessage, options: { time: 3000 } })
}

export const ButtonCopyToClipboard = ({ disabled, extraClassName, value, title = '' }) => (
  <button
    className={`${elementClass} ${extraClassName ? extraClassName : ''}`}
    data-clipboard-action="copy"
    data-clipboard-text={value}
    disabled={disabled}
    type="button"
    onClick={() => {
      showToast(title)
    }}
  />
)
