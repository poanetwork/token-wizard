import React from 'react'

export const SectionInfo = ({ stepNumber, title, description, extraClassName = '' }) => (
  <div className={`st-SectionInfo ${extraClassName}`}>
    <div className={`st-SectionInfo_Icon st-SectionInfo_Icon-step${stepNumber}`} />
    <div className="st-SectionInfo_Text">
      <h1 className="st-SectionInfo_Title">{title}</h1>
      <p className="st-SectionInfo_Description" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  </div>
)
