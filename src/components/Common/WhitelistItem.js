import React from 'react'
import '../../assets/stylesheets/application.css';
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

@inject('tierStore')
@observer
export class WhitelistItem extends React.Component {
  removeItem () {
    const { tierStore, whitelistNum, crowdsaleNum } = this.props
    tierStore.removeWhitelistItem(whitelistNum, crowdsaleNum)
  }

  render () {
    const { addr, min, max, stored, duplicated, tierStore } = this.props

    return (
      <div className={classNames('white-list-item-container', {
        'duplicated': duplicated && !stored,
        'to-be-removed': duplicated && stored,
        'no-style': (!duplicated && stored) || (!tierStore.deployedContract && !duplicated && !stored)
      })}>
        <div className="white-list-item-container-inner">
          <span className="white-list-item white-list-item-left">{addr}</span>
          <span className="white-list-item white-list-item-middle">{min}</span>
          <span className="white-list-item white-list-item-right">{max}</span>
        </div>
        <div className="white-list-item-empty">
          {!stored
            ? <a onClick={() => this.removeItem()} className="remove"><span className="item-remove"/></a>
            : null
          }
          {duplicated && !stored
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
