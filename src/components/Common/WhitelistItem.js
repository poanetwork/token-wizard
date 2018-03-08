import React from 'react'
import '../../assets/stylesheets/application.css';
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

@inject('tierStore')
@observer
export class WhitelistItem extends React.Component {
  removeItem (address) {
    const { tierStore, crowdsaleNum } = this.props
    tierStore.removeWhitelistItem(address, crowdsaleNum)
  }

  render () {
    const { addr, min, max, alreadyDeployed, duplicated } = this.props

    return (
      <div className={classNames('white-list-item-container', {
        'duplicated': duplicated && !alreadyDeployed,
        'to-be-removed': duplicated && alreadyDeployed,
        'no-style': (!duplicated && alreadyDeployed) || (!duplicated && !alreadyDeployed)
      })}>
        <div className="white-list-item-container-inner">
          <span className="white-list-item white-list-item-left">{addr}</span>
          <span className="white-list-item white-list-item-middle">{min}</span>
          <span className="white-list-item white-list-item-right">{max}</span>
        </div>
        <div className="white-list-item-empty">
          {!alreadyDeployed
            ? <a onClick={() => this.removeItem(addr)}><span className="item-remove"/></a>
            : null
          }
          {duplicated && !alreadyDeployed
            ? <a className="swal2-icon swal2-info warning-logo" data-tip="React-tooltip">!</a>
            : null
          }
        </div>
        <ReactTooltip place="right" type="warning" effect="solid">
          <p>Address already loaded,</p>
          <p>saving will overwrite old values</p>
        </ReactTooltip>
      </div>
    )
  }
}
