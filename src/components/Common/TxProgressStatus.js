import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import '../../assets/stylesheets/application.css'
import { TX_STEP_DESCRIPTION } from '../stepFour/constants'
import classNames from 'classnames'

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

    if (this.isConstructing(status)) statusMessage = 'constructing tx...'
    if (this.isConfirmationPending(status)) statusMessage = 'please confirm tx...'
    if (this.isMiningPending(status)) statusMessage = 'tx pending of being mined...'

    return statusMessage === '' ? null : (
      <span className="tx-status" key={index.toString()}>
        {statusMessage}
      </span>
    )
  }

  render() {
    const { tierStore } = this.props
    const whitelisted = tierStore.tiers.map((tier, index) => (index === 0 ? true : tier.whitelistEnabled === 'yes'))
    const tableContent = this.txStatuses()

    return tableContent.length ? (
      <div className="flex-table">
        <div className="container-fluid">
          <div className="table-row flex-table-header">
            <div className="text">Tx Name</div>
            {whitelisted.map(
              (tierWhitelisted, index) =>
                tierWhitelisted || index === 0 ? (
                  <div className="sm-text" key={index.toString()}>
                    Tier {index + 1}
                  </div>
                ) : null
            )}
          </div>
          <div className="scrollable-content">
            {tableContent.map(
              tx =>
                tx.status.length ? (
                  <div
                    className={classNames('table-row', 'datagrid', {
                      active: tx.status.some(
                        status =>
                          status
                            ? this.isMiningPending(status) ||
                              this.isConfirmationPending(status) ||
                              this.isConstructing(status)
                            : false
                      )
                    })}
                    key={tx.name}
                  >
                    <div className="text">
                      {TX_STEP_DESCRIPTION[tx.name]}{' '}
                      {tx.status.map((status, index) => (status ? this.txActivity(status, index) : null))}
                    </div>
                    {whitelisted.map(
                      (tierWhitelisted, index) =>
                        tierWhitelisted || index === 0 ? (
                          <div className="sm-text" key={index.toString()}>
                            {tx.status[index] ? (
                              <i className="material-icons">{tx.status[index].mined ? 'check' : 'access_time'}</i>
                            ) : (
                              ''
                            )}
                          </div>
                        ) : null
                    )}
                  </div>
                ) : null
            )}
          </div>
        </div>
        <div className="steps">
          {this.props.onSkip ? (
            <a onClick={this.props.onSkip} className="no_image button button_fill">
              Skip transaction
            </a>
          ) : null}
        </div>
      </div>
    ) : null
  }
}
