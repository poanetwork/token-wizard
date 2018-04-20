import React from 'react'

export const ReadOnlyWhitelistAddresses = ({ tier }) => {
  if (!tier.whitelist.length) {
    return (
      <div className="white-list-item-container">
        <div className="white-list-item-container-inner">
          <span className="white-list-item white-list-item-left">no addresses loaded</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {tier.whitelist.map(item => (
        <div className={'white-list-item-container no-style'} key={item.addr}>
          <div className="white-list-item-container-inner">
            <span className="white-list-item white-list-item-left">{item.addr}</span>
            <span className="white-list-item white-list-item-middle">{item.min}</span>
            <span className="white-list-item white-list-item-right">{item.max}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
