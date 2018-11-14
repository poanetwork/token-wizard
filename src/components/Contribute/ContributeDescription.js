import React from 'react'

export const ContributeDescription = ({ extraClassName = '' }) => (
  <div className={`cnt-ContributeDescription ${extraClassName}`}>
    Here you can contribute in the crowdsale campaign. At the moment, you need{' '}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
    >
      a Wallet
    </a>{' '}
    client to contribute into the crowdsale.
  </div>
)
