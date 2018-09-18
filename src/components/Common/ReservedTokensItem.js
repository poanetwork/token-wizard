import React from 'react'

const ReservedTokensItem = props => {
  const deleteButton = props.readOnly ? null : <div onClick={() => props.onRemove(props.num)} />

  return (
    <div className="sw-ReservedTokensItem">
      <div className="sw-ReservedTokensItem_Column">{props.addr}</div>
      <div className="sw-ReservedTokensItem_Column">{props.dim}</div>
      <div className="sw-ReservedTokensItem_Column">{props.val}</div>
      {deleteButton}
    </div>
  )
}

export default ReservedTokensItem
