import React from 'react'
import { Error } from './Error'

export const InputField2 = props => {
  if (props.val) {
    props.input.value = props.val
  }
  return (
    <div className={props.side}>
      <label htmlFor={props.input.name} className="label">
        {props.label}
      </label>
      <input
        autoComplete="off"
        className={props.inputClassName ? props.inputClassName : 'input'}
        disabled={props.disabled}
        id={props.input.name}
        placeholder={props.placeholder}
        type={props.type}
        {...props.input}
      />
      <p className="description">{props.description}</p>
      <Error name={props.input.name} errorStyle={props.errorStyle} />
    </div>
  )
}
