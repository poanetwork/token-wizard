import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import '../../assets/stylesheets/application.css'
import { TX_STEP_DESCRIPTION } from '../stepFour/constants'

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

  txActivity = ({ active, confirmationPending, miningPending, mined }, index) => {
    let statusMessage = ''

    if (active && !confirmationPending) statusMessage = 'constructing tx...'
    if (confirmationPending && !miningPending) statusMessage = 'please confirm tx...'
    if (miningPending && !mined) statusMessage = 'tx pending of being mined...'

    return statusMessage === '' ? null : <span key={index.toString()}>{statusMessage}</span>
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
              (value, index) =>
                value || index === 0 ? (
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
                  <div className="table-row datagrid" key={tx.name}>
                    <div className="text">
                      {TX_STEP_DESCRIPTION[tx.name]} {tx.status.map((status, index) => this.txActivity(status, index))}
                    </div>
                    {whitelisted.map(
                      (tierWhitelisted, index) =>
                        tierWhitelisted ? (
                          <div className="sm-text" key={index.toString()}>
                            {tx.status.length > index ? (
                              <i className="material-icons">
                                {tx.status[index].mined === true ? 'check' : 'access_time'}
                              </i>
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
