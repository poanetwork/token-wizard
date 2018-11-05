import React from 'react'

export const StepInfo = ({ stepNumber, title, description, extraClassName = '' }) => (
  <div className={`st-StepInfo ${extraClassName}`}>
    <div className={`st-StepInfo_Icon st-StepInfo_Icon-step${stepNumber}`} />
    <div className="st-StepInfo_Text">
      <h1 className="st-StepInfo_Title">{title}</h1>
      <p className="st-StepInfo_Description" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  </div>
)
