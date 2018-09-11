import React from 'react'

import { VALIDATION_TYPES } from '../../utils/constants'
const { INVALID } = VALIDATION_TYPES

export const InputField = props => {
  const errorStyle = {
    color: 'red',
    fontWeight: 'bold',
    fontSize: '12px',
    width: '100%',
    height: '10px'
  }

  const error = props.valid === INVALID ? props.errorMessage : ''

  return (
    <div className={props.side}>
      <div className="sw-FormControlBlock_TitleAndInfo">
        <label className="sw-FormControlBlock_Label">{props.title}</label>
        <span className="sw-FormControlBlock_Info">
          <span className="sw-FormControlBlock_Tooltip">{props.description}</span>
        </span>
      </div>
      <input
        className="sw-FormControlBlock_TextInput"
        disabled={props.disabled}
        id={props.name}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
        onPaste={props.onPaste}
        style={props.style}
        type={props.type}
        value={props.value}
      />
      {props.pristine ? '' : <p className="sw-FormControlBlock_Error">{error}</p>}
    </div>
  )
}
