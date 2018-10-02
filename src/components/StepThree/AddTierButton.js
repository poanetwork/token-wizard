import React from 'react'

export const AddTierButton = props => {
  return (
    <button type="button" className="ti-AddTierButton" onClick={props.onClick}>
      <span className="ti-AddTierButton_Text">Add Tier</span>
      <span className="ti-AddTierButton_PlusIcon" />
    </button>
  )
}
