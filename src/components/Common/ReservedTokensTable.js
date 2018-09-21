import React from 'react'

const ReservedTokensTable = props => {
  const reservedTokensItems = props.tokens.map((token, index) => {
    const deleteButton = token.readOnly ? null : (
      <td className="sw-ReservedTokensTable_Column">
        <div className="sw-ReservedTokensTable_Delete" onClick={() => props.removeReservedToken(index)} />
      </td>
    )

    return (
      <tr key={index.toString()} className="sw-ReservedTokensTable_Row">
        <td className="sw-ReservedTokensTable_Column sw-ReservedTokensTable_Column-address">{token.addr}</td>
        <td className="sw-ReservedTokensTable_Column">
          <div className={`sw-ReservedTokensTable_Dimension sw-ReservedTokensTable_Dimension-${token.dim}`} />
        </td>
        <td className="sw-ReservedTokensTable_Column sw-ReservedTokensTable_Column-value">{token.val}</td>
        {deleteButton}
      </tr>
    )
  })

  return (
    <div className={`sw-ReservedTokensTable ${props.extraClassName}`}>
      <div className="sw-ReservedTokensTable_Inner">
        <table className={`sw-ReservedTokensTable_Table`} cellPadding="0" cellSpacing="0">
          <tbody>{reservedTokensItems}</tbody>
        </table>
      </div>
    </div>
  )
}

export default ReservedTokensTable
