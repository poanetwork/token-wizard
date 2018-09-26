import React from 'react'

export const FormControlTitle = props => {
  const tooltip = props.description ? (
    <div className="sw-FormControlTitle_Info" tabIndex="-1">
      <span className="sw-FormControlTitle_Tooltip">{props.description}</span>
    </div>
  ) : null

  return (
    <div className="sw-FormControlTitle">
      <label className="sw-FormControlTitle_Label">{props.title}</label>
      {tooltip}
    </div>
  )
}
