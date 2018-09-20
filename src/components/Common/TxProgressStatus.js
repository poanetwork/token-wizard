import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

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
                    <div className="text">{TX_STEP_DESCRIPTION[tx.name]}</div>
                    {whitelisted.map(
                      (tierWhitelisted, index) =>
                        tierWhitelisted ? (
                          <div className="sm-text" key={index.toString()}>
                            {tx.status[index] === true ? (
                              <i className="material-icons">check</i>
                            ) : tx.status[index] === false ? (
                              <i className="material-icons">access_time</i>
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
