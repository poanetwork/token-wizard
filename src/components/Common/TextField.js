import React from 'react'

export const TextField = props => {
  return (
    <input
      className="sw-TextField"
      disabled={props.disabled}
      id={props.name}
      name={props.name}
      max={props.max}
      min={props.min}
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onKeyPress={props.onKeyPress}
      onPaste={props.onPaste}
      placeholder={props.placeholder}
      style={props.style}
      type={props.type}
      value={props.value}
    />
  )
}
