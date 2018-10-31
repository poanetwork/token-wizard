import React from 'react'
import { ButtonCopyToClipboard } from '../Common/ButtonCopyToClipboard'

export const DisplayTextArea = ({ title, value, key = '', description = '' }) => {
  return (
    <div key={key ? key : ''} className="pb-DisplayTextArea">
      <h3 className="pb-DisplayTextArea_Title">
        {title} <ButtonCopyToClipboard value={value} title={title} />
      </h3>
      <pre className="pb-DisplayTextArea_Content">{value}</pre>
      {description ? <p className="pb-DisplayTextArea_Description">{description}</p> : null}
    </div>
  )
}
