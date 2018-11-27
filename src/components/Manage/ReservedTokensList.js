import React from 'react'
import { inject, observer } from 'mobx-react'
import { TokenDimension } from '../Common/TokenDimension'

export const ReservedTokensList = inject('reservedTokenStore')(
  observer(({ reservedTokenStore, owner }) => {
    const { tokens } = reservedTokenStore

    return tokens.length === 0 ? null : (
      <div className="mng-ReservedTokensList">
        <h3 className="mng-ReservedTokensList_Title">Reserved tokens</h3>
        {!owner ? null : (
          <div className="mng-ReservedTokensList_Container">
            <div className="mng-ReservedTokensList_TableContainer">
              <div className="mng-ReservedTokensList_Inner">
                {/* Table */}
                <table className={`mng-ReservedTokensList_Table`} cellPadding="0" cellSpacing="0">
                  <thead>
                    <tr className="mng-ReservedTokensList_TableRow">
                      <th className="mng-ReservedTokensList_TableTH mng-ReservedTokensList_TableTH-address">Address</th>
                      <th className="mng-ReservedTokensList_TableTH mng-ReservedTokensList_TableTH-dimension">
                        Dimension
                      </th>
                      <th className="mng-ReservedTokensList_TableTH mng-ReservedTokensList_TableTH-value">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token, index) => (
                      <tr key={index.toString()} className="mng-ReservedTokensList_TableRow">
                        <td className="mng-ReservedTokensList_TableColumn mng-ReservedTokensList_TableColumn-address">
                          {token.addr}
                        </td>
                        <td className="mng-ReservedTokensList_TableColumn mng-ReservedTokensList_TableColumn-dimension">
                          <TokenDimension type={token.dim} />
                        </td>
                        <td className="mng-ReservedTokensList_TableColumn mng-ReservedTokensList_TableColumn-value">
                          {token.val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  })
)
