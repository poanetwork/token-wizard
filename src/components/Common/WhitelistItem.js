import React from 'react'
import '../../assets/stylesheets/application.css';
import { inject, observer } from 'mobx-react'

@inject('tierStore')
@observer
export class WhitelistItem extends React.Component {
  removeItem () {
    const { tierStore, crowdsaleNum, whitelistNum } = this.props
    tierStore.removeWhiteListItem(whitelistNum, crowdsaleNum)
  }

  render () {
    const { addr, min, max, crowdsaleNum, whitelistNum, tierStore, isLast, alreadyDeployed } = this.props
    const whitelist = tierStore.tiers[crowdsaleNum].whitelist[whitelistNum]

    return whitelist && whitelist.deleted ? null : (
      <div
        className={isLast ? 'white-list-item-container white-list-item-container-last' : 'white-list-item-container'}>
        <div className="white-list-item-container-inner">
          <span className="white-list-item white-list-item-left">{addr}</span>
          <span className="white-list-item white-list-item-middle">{min}</span>
          <span className="white-list-item white-list-item-right">{max}</span>
        </div>
        <div className="white-list-item-empty">
          {!alreadyDeployed
            ? <a onClick={() => this.removeItem()}><span className="item-remove"/></a>
            : null
          }
        </div>
      </div>
    )
  }
}
