import React from 'react'
import { ButtonCopyToClipboard } from '../Common/ButtonCopyToClipboard'

export const DisplayField = props => (
  <div className="pb-DisplayField" title={props.description}>
    <h3 className="pb-DisplayField_Title">{props.title}</h3>
    <div className="pb-DisplayField_ValueContainer">
      <p className="pb-DisplayField_Value">{props.value}</p>
      <ButtonCopyToClipboard value={props.value} />
    </div>
  </div>
)
