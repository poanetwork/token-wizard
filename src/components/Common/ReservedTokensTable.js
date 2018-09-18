import React from 'react'

const ReservedTokensTable = props => {
  const reservedTokensItems = props.tokens.map((token, index) => {
    const deleteButton = token.readOnly ? null : (
      <div className="sw-ReservedTokensTable_Delete" onClick={() => props.removeReservedToken(index)} />
    )

    return (
      <div key={index.toString()} num={index} className="sw-ReservedTokensTable_Row">
        <div className="sw-ReservedTokensTable_Column sw-ReservedTokensTable_Column-address">{token.addr}</div>
        <div
          className={`sw-ReservedTokensTable_Column sw-ReservedTokensTable_Column-dimension sw-ReservedTokensTable_Column-${
            token.dim
          }`}
        />
        <div className="sw-ReservedTokensTable_Column sw-ReservedTokensTable_Column-value">{token.val}</div>
        {deleteButton}
      </div>
    )
  })

  return (
    <div className="sw-ReservedTokensTable">
      <div className="sw-ReservedTokensTable_Inner">{reservedTokensItems}</div>
    </div>
  )
}

export default ReservedTokensTable
