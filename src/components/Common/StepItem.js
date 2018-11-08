import React from 'react'

export const StepItem = ({ extraClass = '', active = false, itemTitle, hideSeparator = true, size = '' }) => {
  const separator = hideSeparator ? null : <div className="st-StepItem_Line" />

  return (
    <div
      className={`st-StepItem
        ${active ? 'active' : ''} ${extraClass} ${size === 'sm' ? 'st-StepItem-small' : ''}`}
    >
      <div className="st-StepItem_Circle" />
      {separator}
      <span className="st-StepItem_Text">{itemTitle}</span>
    </div>
  )
}
