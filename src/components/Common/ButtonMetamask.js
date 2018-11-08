import React from 'react'

export const ButtonMetamask = ({ onClick, extraClassName = '', disabled }) => (
  <button className={`btn-ButtonMetamask ${extraClassName}`} disabled={disabled} onClick={onClick} type="button">
    <span className="btn-ButtonMetamask_Icon" />
    <span className="btn-ButtonMetamask_TextContainer">
      <span className="btn-ButtonMetamask_TopText">Download</span>
      <span className="btn-ButtonMetamask_BottomText">Metamask</span>
    </span>
  </button>
)
