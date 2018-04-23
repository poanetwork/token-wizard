import React from 'react'
import { Error } from './Error'

export const InputField2 = (props) => (
  <div className={props.side}>
    <label htmlFor={props.input.name} className="label">{props.label}</label>
    <input
      autoComplete="off"
      className={props.inputClassName ? props.inputClassName : "input"}
      type={props.type}
      disabled={props.disabled}
      placeholder={props.placeholder}
      id={props.input.name}
      {...props.input}
    />
    <p className="description">{props.description}</p>
    <Error name={props.input.name} errorStyle={props.errorStyle}/>
  </div>
)

