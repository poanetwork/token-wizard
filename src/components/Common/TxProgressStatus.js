import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { ButtonContinue } from './ButtonContinue'
import { TX_STEP_DESCRIPTION } from '../StepFour/constants'

@inject('tierStore', 'deploymentStore')
@observer
export class TxProgressStatus extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: true
    }
  }

  txStatuses = () => {
    const { txMap } = this.props
    const table = []

    txMap.forEach((status, name) => {
      table.push({ name, status })
    })

    return table
  }

  getTableHeader(whitelisted) {
    return (
      <thead className="md-TxProgressStatus_Thead">
        <th className="md-TxProgressStatus_Th">Tx Name</th>
        {whitelisted.map(
          (value, index) =>
            value || index === 0 ? (
              <th className="md-TxProgressStatus_Th md-TxProgressStatus_Th-center" key={index.toString()}>
                Tier {index + 1}
              </th>
            ) : null
        )}
      </thead>
    )
  }

  getTableBody(tableContent, whitelisted) {
    return (
      <tbody className="md-TxProgressStatus_Tbody">
        {tableContent.map(
          tx =>
            tx.status.length ? (
              <tr className="md-TxProgressStatus_Tr" key={tx.name}>
                <td className="md-TxProgressStatus_Td">{TX_STEP_DESCRIPTION[tx.name]}</td>
                {whitelisted.map(
                  (tierWhitelisted, index) =>
                    tierWhitelisted ? (
                      <td className="md-TxProgressStatus_Td md-TxProgressStatus_Td-center" key={index.toString()}>
                        {tx.status[index] === true ? (
                          <span className="md-TxProgressStatus_StatusIcon md-TxProgressStatus_StatusIcon-check" />
                        ) : tx.status[index] === false ? (
                          <span className="md-TxProgressStatus_StatusIcon md-TxProgressStatus_StatusIcon-clock" />
                        ) : (
                          ''
                        )}
                      </td>
                    ) : null
                )}
              </tr>
            ) : null
        )}
      </tbody>
    )
  }

  render() {
    const { tierStore, extraClassName = '' } = this.props
    const whitelisted = tierStore.tiers.map((tier, index) => (index === 0 ? true : tier.whitelistEnabled === 'yes'))
    const tableContent = this.txStatuses()

    return tableContent.length ? (
      <div className={`md-TxProgressStatus ${extraClassName}`}>
        <div className={`md-TxProgressStatus_TableContainer`}>
          <div className="md-TxProgressStatus_Inner">
            <table className={`md-TxProgressStatus_Table`} cellPadding="0" cellSpacing="0">
              {this.getTableHeader(whitelisted)}
              {this.getTableBody(tableContent, whitelisted)}
            </table>
          </div>
        </div>
        <div className="md-TxProgressStatus_ButtonsContainer md-TxProgressStatus_ButtonsContainer-right">
          <ButtonContinue buttonText="Skip transaction" onClick={this.props.onSkip} disabled={!this.props.onSkip} />
        </div>
      </div>
    ) : null
  }
}
