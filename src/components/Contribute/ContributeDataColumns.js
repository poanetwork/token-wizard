import React from 'react'

export const ContributeDataColumns = ({
  extraClassName = '',
  maximumContribution,
  minimumContribution,
  tokenName,
  tokenTicker,
  totalSupply
}) => (
  <div className={`cnt-ContributeDataColumns ${extraClassName}`}>
    <div className="cnt-ContributeDataColumns_Item">
      <p className="cnt-ContributeDataColumns_ItemData">{tokenName}</p>
      <h4 className="cnt-ContributeDataColumns_ItemTitle">Name</h4>
    </div>
    <div className="cnt-ContributeDataColumns_Item">
      <p className="cnt-ContributeDataColumns_ItemData">{tokenTicker}</p>
      <h4 className="cnt-ContributeDataColumns_ItemTitle">Ticker</h4>
    </div>
    <div className="cnt-ContributeDataColumns_Item">
      <p className="cnt-ContributeDataColumns_ItemData">
        {totalSupply} {tokenTicker}
      </p>
      <h4 className="cnt-ContributeDataColumns_ItemTitle">Total Supply</h4>
    </div>
    <div className="cnt-ContributeDataColumns_Item">
      <p className="cnt-ContributeDataColumns_ItemData">{minimumContribution}</p>
      <h4 className="cnt-ContributeDataColumns_ItemTitle">Minimum Contribution</h4>
    </div>
    <div className="cnt-ContributeDataColumns_Item">
      <p className="cnt-ContributeDataColumns_ItemData">{maximumContribution}</p>
      <h4 className="cnt-ContributeDataColumns_ItemTitle">Maximum Contribution</h4>
    </div>
  </div>
)
