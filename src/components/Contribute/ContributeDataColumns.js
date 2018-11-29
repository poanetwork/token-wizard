import React from 'react'

export const ContributeDataColumns = ({ extraClassName = '', data }) => (
  <div className={`cnt-ContributeDataColumns ${extraClassName}`}>
    {data.map((item, index) => (
      <div className="cnt-ContributeDataColumns_Item" key={index}>
        <p className="cnt-ContributeDataColumns_ItemData">{item.title}</p>
        <h4 className="cnt-ContributeDataColumns_ItemTitle">{item.description}</h4>
      </div>
    ))}
  </div>
)
