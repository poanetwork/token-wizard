import React from 'react'
import { ButtonCopyToClipboard } from '../Common/ButtonCopyToClipboard'

export const DisplayField = ({ description, title, value, mobileTextSize = 'medium' }) => {
  const valueSize = {
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    extralarge: 'ExtraLarge'
  }

  return (
    <div className="pb-DisplayField" title={description}>
      <h3 className="pb-DisplayField_Title">{title}</h3>
      <p className={`pb-DisplayField_Value pb-DisplayField_Value-MobileTextSize${valueSize[mobileTextSize]}`}>
        {value} <ButtonCopyToClipboard value={value} />
      </p>
    </div>
  )
}
