import React, { Component } from 'react'
import { ButtonSkip } from './ButtonSkip'
import { ButtonRetry } from './ButtonRetry'
import { TX_STEP_DESCRIPTION } from '../StepFour/constants'
import { TxStatusIconCheck } from './TxStatusIconCheck'
import { TxStatusIconClock } from './TxStatusIconClock'
import { TxStatusIconClockActive } from './TxStatusIconClockActive'
import { observer, inject } from 'mobx-react'

@inject('tierStore', 'deploymentStore')
@observer
export class TxProgressStatus extends Component {
  state = {
    showModal: true
  }

  txStatuses = () => {
    const { txMap } = this.props
    const table = []

    txMap.forEach((status, name) => {
      table.push({ name, status })
    })

    return table
  }

  isConstructing = ({ active, confirmationPending }) => active && !confirmationPending
  isConfirmationPending = ({ confirmationPending, miningPending }) => confirmationPending && !miningPending
  isMiningPending = ({ miningPending, mined }) => miningPending && !mined

  txActivity = (status, index) => {
    let statusMessage = ''

    if (this.isConstructing(status)) statusMessage = 'Constructing Tx...'
    if (this.isConfirmationPending(status)) statusMessage = 'Please confirm Tx...'
    if (this.isMiningPending(status)) statusMessage = 'Tx pending of being mined...'

    return statusMessage === '' ? null : (
      <span className="md-TxProgressStatus_ActiveText" key={index.toString()}>
        {statusMessage}
      </span>
    )
  }

  getTableHeader(whitelisted) {
    return (
      <thead className="md-TxProgressStatus_Thead">
        <tr className="md-TxProgressStatus_Tr">
          <th className="md-TxProgressStatus_Th">Tx Name</th>
          {whitelisted.map(
            (tierWhitelisted, index) =>
              tierWhitelisted || index === 0 ? (
                <th className="md-TxProgressStatus_Th md-TxProgressStatus_Th-right" key={index.toString()}>
                  <div className="md-TxProgressStatus_ThTierInner md-TxProgressStatus_ThTierInner-center">
                    Tier {index + 1}
                  </div>
                </th>
              ) : null
          )}
        </tr>
      </thead>
    )
  }

  isTxStatusActive(txStatus) {
    return txStatus.some(
      status =>
        status
          ? this.isMiningPending(status) || this.isConfirmationPending(status) || this.isConstructing(status)
          : false
    )
  }

  getStatusIcon(txStatus, index) {
    if (this.isTxStatusActive(txStatus)) {
      return <TxStatusIconClockActive />
    } else if (txStatus[index] && !txStatus[index].mined) {
      return <TxStatusIconClock />
    } else if (txStatus[index] && txStatus[index].mined) {
      return <TxStatusIconCheck />
    }
  }

  getTableBody(tableContent, whitelisted) {
    return (
      <tbody className="md-TxProgressStatus_Tbody">
        {tableContent.map(
          tx =>
            tx.status.length ? (
              <tr
                className={`md-TxProgressStatus_Tr ${
                  this.isTxStatusActive(tx.status) ? 'md-TxProgressStatus_Tr-active' : ''
                }`}
                key={tx.name}
              >
                <td className="md-TxProgressStatus_Td md-TxProgressStatus_Td-status-message">
                  {TX_STEP_DESCRIPTION[tx.name]}{' '}
                  {tx.status.map((status, index) => (status ? this.txActivity(status, index) : null))}
                </td>
                {whitelisted.map(
                  (tierWhitelisted, index) =>
                    tierWhitelisted || index === 0 ? (
                      <td className="md-TxProgressStatus_Td md-TxProgressStatus_Td-right" key={index.toString()}>
                        <div className="md-TxProgressStatus_TdTierInner md-TxProgressStatus_TdTierInner-center">
                          {this.getStatusIcon(tx.status, index)}
                        </div>
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
          <ButtonRetry buttonText="Retry transaction" onClick={this.props.onRetry} disabled={!this.props.onRetry} />
          <ButtonSkip onClick={this.props.onSkip} disabled={!this.props.onSkip} />
        </div>
      </div>
    ) : null
  }
}
