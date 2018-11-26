import React from 'react'
import { ButtonCopyToClipboard } from '../Common/ButtonCopyToClipboard'

export const ContributeDataList = ({ currentAccount, crowdsaleAddress, extraClassName = '' }) => (
  <div className={`cnt-ContributeDataList ${extraClassName}`}>
    {currentAccount ? (
      <div className="cnt-ContributeDataList_Item">
        <p className="cnt-ContributeDataList_ItemData">
          <span className="cnt-ContributeDataList_ItemDataValue">{currentAccount}</span>
          <ButtonCopyToClipboard value={currentAccount} />
        </p>
        <h4 className="cnt-ContributeDataList_ItemTitle">Current Account</h4>
      </div>
    ) : null}
    {crowdsaleAddress ? (
      <div className="cnt-ContributeDataList_Item">
        <p className="cnt-ContributeDataList_ItemData">
          <span className="cnt-ContributeDataList_ItemDataValue">{crowdsaleAddress}</span>{' '}
          <ButtonCopyToClipboard value={crowdsaleAddress} />
        </p>
        <h4 className="cnt-ContributeDataList_ItemTitle">Proxy Address</h4>
      </div>
    ) : null}
  </div>
)
