import React from 'react'
import { inject, observer } from 'mobx-react'
import { BigNumber } from 'bignumber.js'

const ReservedTokensTable = inject('reservedTokenStore')(
  observer(props => {
    const reservedTokensItems = props.reservedTokenStore.tokens.map((token, index) => {
      const deleteButton = token.readOnly ? null : (
        <td className="sw-ReservedTokensTable_Column">
          <div className="sw-ReservedTokensTable_Delete" onClick={() => props.reservedTokenStore.removeToken(index)} />
        </td>
      )

      const tokenValue = new BigNumber(token.val)

      return (
        <tr key={index.toString()} className="sw-ReservedTokensTable_Row">
          <td className="sw-ReservedTokensTable_Column sw-ReservedTokensTable_Column-address">{token.addr}</td>
          <td className="sw-ReservedTokensTable_Column">
            <div className={`sw-ReservedTokensTable_Dimension sw-ReservedTokensTable_Dimension-${token.dim}`} />
          </td>
          <td className="sw-ReservedTokensTable_Column sw-ReservedTokensTable_Column-value">
            {tokenValue.toFixed(tokenValue.decimalPlaces())}
          </td>
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
  })
)

export default ReservedTokensTable
