import React from 'react'
import { ButtonCopyToClipboard } from '../Common/ButtonCopyToClipboard'

export const DisplayField = ({ description, title, value, extraClassName = '', mobileTextSize = 'medium' }) => {
  const valueSize = {
    small: 'small',
    medium: 'medium',
    large: 'large',
    extralarge: 'extra-large'
  }

  return (
    <div className={`pb-DisplayField ${extraClassName}`} title={description}>
      <h3 className="pb-DisplayField_Title">{title}</h3>
      <p className={`pb-DisplayField_Value pb-DisplayField_Value-mobile-text-size-${valueSize[mobileTextSize]}`}>
        {value} <ButtonCopyToClipboard value={value} title={title} />
      </p>
    </div>
  )
}
