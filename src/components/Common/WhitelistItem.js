import React from 'react'
import '../../assets/stylesheets/application.css';
import { inject, observer } from 'mobx-react'

@inject('tierStore')
@observer
export class WhitelistItem extends React.Component {
  removeItem (address) {
    const { tierStore, crowdsaleNum } = this.props
    tierStore.removeWhitelistItem(address, crowdsaleNum)
  }

  render () {
    const { addr, min, max, alreadyDeployed } = this.props

    return (
      <div
        className="white-list-item-container">
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
        </div>
      </div>
    )
  }
}
