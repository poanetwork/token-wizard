import React from 'react'
import { inject, observer } from 'mobx-react'
import { ButtonDelete } from '../Common/ButtonDelete'

@inject('tierStore')
@observer
export class WhitelistTable extends React.Component {
  removeItem(whitelistNum, crowdsaleNum) {
    const { tierStore } = this.props
    tierStore.removeWhitelistItem(whitelistNum, crowdsaleNum)
  }

  render() {
    const { list, crowdsaleNum, extraClassName, showTableHeader = false } = this.props

    const whitelistItems = list.map((item, index) => {
      const deleteButton = !item.stored ? (
        <td className="sw-WhiteListTable_Column">
          <ButtonDelete onClick={() => this.removeItem(index, crowdsaleNum)} />
        </td>
      ) : (
        <td>&nbsp;</td>
      )

      return (
        <tr key={index.toString()} className="sw-WhiteListTable_Row">
          <td className="sw-WhiteListTable_Column sw-WhiteListTable_Column-address">{item.addr}</td>
          <td
            className={`sw-WhiteListTable_Column sw-WhiteListTable_Column-value-min ${
              showTableHeader ? 'sw-WhiteListTable_Column-center' : ''
            }`}
          >
            {item.min}
          </td>
          <td
            className={`sw-WhiteListTable_Column sw-WhiteListTable_Column-value-max ${
              showTableHeader ? 'sw-WhiteListTable_Column-center' : ''
            }`}
          >
            {item.max}
          </td>
          {deleteButton}
        </tr>
      )
    })

    const getTableHeader = () => {
      return (
        <thead>
          <tr className="sw-WhiteListTable_Row">
            <th className="sw-WhiteListTable_TH sw-WhiteListTable_TH-address">Address</th>
            <th className="sw-WhiteListTable_TH sw-WhiteListTable_TH-min">Min</th>
            <th className="sw-WhiteListTable_TH sw-WhiteListTable_TH-max">Max</th>
            <th className="sw-WhiteListTable_TH sw-WhiteListTable_TH-delete">&nbsp;</th>
          </tr>
        </thead>
      )
    }

    return (
      <div className={`sw-WhiteListTable ${extraClassName ? extraClassName : ''}`}>
        <div className="sw-WhiteListTable_Inner">
          <table className={`sw-WhiteListTable_Table`} cellPadding="0" cellSpacing="0">
            {showTableHeader ? getTableHeader() : null}
            <tbody>{whitelistItems}</tbody>
          </table>
        </div>
      </div>
    )
  }
}
