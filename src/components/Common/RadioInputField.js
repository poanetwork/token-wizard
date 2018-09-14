import React from 'react'

export const RadioInputField = props => {
  const inputs = props.items.map((item, index) => (
    <label className="sw-FormControlBlock_RadioButtonLabel" key={index}>
      <input
        checked={props.selectedItem === item.value}
        className="sw-FormControlBlock_RadioButtonInput"
        id={item.value}
        onChange={props.onChange}
        type="radio"
        value={item.value}
      />
      <span className="sw-FormControlBlock_RadioButton">{item.label}</span>
    </label>
  ))

  return (
    <div className={`sw-FormControlBlock ${props.extraClassName ? props.extraClassName : ''}`}>
      <div className="sw-FormControlBlock_TitleAndInfo">
        <label className="sw-FormControlBlock_Label">{props.title}</label>
        <div className="sw-FormControlBlock_Info" tabIndex="-1">
          <span className="sw-FormControlBlock_Tooltip">{props.description}</span>
        </div>
      </div>
      <div className="sw-FormControlBlock_RadioButtonsContainer">{inputs}</div>
    </div>
  )
}
