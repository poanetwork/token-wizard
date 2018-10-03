import React from 'react'
import { FormControlTitle } from '../Common/FormControlTitle'

export const RadioInputField = props => {
  const inputs = props.items.map((item, index) => (
    <label className="sw-RadioInputField_Label" key={index}>
      <input
        checked={props.selectedItem === item.value}
        className="sw-RadioInputField_Input"
        id={item.value}
        onChange={props.onChange}
        type="radio"
        value={item.value}
        name={props.name}
      />
      <span className="sw-RadioInputField_Button">{item.label}</span>
    </label>
  ))

  return (
    <div className={`sw-RadioInputField ${props.extraClassName ? props.extraClassName : ''}`}>
      <FormControlTitle title={props.title} description={props.description} />
      <div className="sw-RadioInputField_ButtonsContainer">{inputs}</div>
    </div>
  )
}
