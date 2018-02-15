import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import '../../assets/stylesheets/application.css'
import { TX_STEP_DESCRIPTION } from '../../utils/constants'

@inject('tierStore', 'deploymentStore')
@observer
export class TxProgressStatus extends Component {
  constructor (props) {
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

  render () {
    const { tierStore, deploymentStore } = this.props
    const tiers = new Array(tierStore.tiers.length).fill(true)
    const tableContent = this.txStatuses()

    return (
      tableContent.length
        ? <div className="flex-table">
          <div className="container-fluid">
            <div className="table-row flex-table-header">
              <div className="text">Tx Name</div>
              {tiers.map((value, index) => <div className="sm-text" key={index.toString()}>Tier {index + 1}</div>)}
            </div>
            <div className="scrollable-content">
              {tableContent.map(tx =>
                tx.status.length
                  ? <div className="table-row datagrid" key={tx.name}>
                    <div className="text">{TX_STEP_DESCRIPTION[tx.name]}</div>
                    {tiers.map((value, index) => (
                      <div className="sm-text" key={index.toString()}>
                        {tx.status[index] === true
                          ? <i className="material-icons">check</i>
                          : tx.status[index] === false
                            ? <i className="material-icons">access_time</i>
                            : ''
                        }
                      </div>
                    ))}
                  </div>
                  : null
              )}
            </div>
          </div>
          <div className="steps">
            {process.env.NODE_ENV === 'development' && !deploymentStore.deploymentHasFinished
              ? !deploymentStore.deploymentStep
                ? <a onClick={this.props.deployCrowdsale} className="no_image button button_fill">Deploy!</a>
                : <a onClick={this.props.deployCrowdsale} className="no_image button button_fill">Resume deploy...</a>
              : null
            }
            {this.props.onSkip
              ? <a onClick={this.props.onSkip} className="no_image button button_fill">Skip transaction</a>
              : null
            }
          </div>
        </div>
        : null
    )
  }
}
