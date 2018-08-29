import React from 'react'

export const RadioInputField = props => {
  const inputs = props.items.map((item, index) => (
    <label className="radio-inline" key={index}>
      <input
        type="radio"
        id={item.value}
        checked={props.selectedItem === item.value}
        onChange={props.onChange}
        value={item.value}
      />
      <span className="title">{item.label}</span>
    </label>
  ))

  return (
    <div className={props.extraClassName}>
      <label className="label">{props.title}</label>
      <div className="radios-inline">{inputs}</div>
      <p className="description">{props.description}</p>
    </div>
  )
}
