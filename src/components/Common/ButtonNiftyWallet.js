import React from 'react'

export const ButtonNiftyWallet = ({ onClick, extraClassName = '', disabled }) => (
  <button className={`btn-ButtonNiftyWallet ${extraClassName}`} disabled={disabled} onClick={onClick} type="button">
    <span className="btn-ButtonNiftyWallet_Icon" />
    <span className="btn-ButtonNiftyWallet_TextContainer">
      <span className="btn-ButtonNiftyWallet_TopText">Download</span>
      <span className="btn-ButtonNiftyWallet_BottomText">Nifty Wallet</span>
    </span>
  </button>
)
