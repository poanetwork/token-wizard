import React from 'react'
import { FormControlTitle } from './FormControlTitle'

export const RadioButton = ({ title, description, buttons, extraClassName, disabled }) => (
  <div className={`sw-RadioButton ${extraClassName ? extraClassName : ''}`}>
    <FormControlTitle title={title} description={description} />
    <div className="sw-RadioButton_Container">
      {buttons.map((item, index) => (
        <label className="sw-RadioButton_Label" key={index}>
          <input
            checked={item.checked}
            className="sw-RadioButton_Input"
            disabled={disabled}
            id={item.id}
            name={item.name}
            onChange={item.onChange}
            type="radio"
            value={item.value}
          />
          <span className="sw-RadioButton_Button">{item.label}</span>
        </label>
      ))}
    </div>
  </div>
)
