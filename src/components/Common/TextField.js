import React from 'react'

export const TextField = props => {
  return (
    <input
      className="sw-TextField"
      disabled={props.disabled}
      id={props.name}
      max={props.max}
      min={props.min}
      name={props.name}
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onKeyPress={props.onKeyPress}
      onPaste={props.onPaste}
      placeholder={props.placeholder}
      step={props.step}
      type={props.type}
      value={props.value}
    />
  )
}
