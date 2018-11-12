import React from 'react'
import { Errors } from './Errors'
import { FormControlTitle } from '../Common/FormControlTitle'
import { TextField } from '../Common/TextField'

export const InputField2 = props => {
  if (props.val) {
    props.input.value = props.val
  }

  return (
    <div className={`sw-InputField2 ${props.extraClassName ? props.extraClassName : ''}`}>
      {props.label ? <FormControlTitle title={props.label} description={props.description} /> : null}
      <TextField
        autoComplete="off"
        className={props.inputClassName ? props.inputClassName : 'input'}
        disabled={props.disabled}
        id={props.input.name}
        placeholder={props.placeholder}
        type={props.type}
        min={props.min}
        max={props.max}
        {...props.input}
      />
      <Errors name={props.input.name} />
    </div>
  )
}
