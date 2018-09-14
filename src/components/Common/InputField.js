import React from 'react'

import { VALIDATION_TYPES } from '../../utils/constants'
const { INVALID } = VALIDATION_TYPES

export const InputField = props => {
  const error = props.valid === INVALID ? props.errorMessage : ''

  return (
    <div className={`sw-FormControlBlock ${props.extraClassName}`}>
      <div className="sw-FormControlBlock_TitleAndInfo">
        <label className="sw-FormControlBlock_Label">{props.title}</label>
        <div className="sw-FormControlBlock_Info" tabIndex="-1">
          <span className="sw-FormControlBlock_Tooltip">{props.description}</span>
        </div>
      </div>
      <input
        className="sw-FormControlBlock_TextInput"
        disabled={props.disabled}
        id={props.name}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
        onPaste={props.onPaste}
        placeholder={props.placeholder}
        style={props.style}
        type={props.type}
        value={props.value}
      />
      {props.pristine ? '' : <div className="sw-FormControlBlock_Error">{error}</div>}
    </div>
  )
}
