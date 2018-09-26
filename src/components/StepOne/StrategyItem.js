import React, { Component } from 'react'

export class StrategyItem extends Component {
  render() {
    const { strategy, strategyType, strategyDisplayTitle, stragegyDisplayDescription, handleChange } = this.props
    return (
      <label className="sw-RadioItems_Item">
        <input
          checked={strategy === strategyType}
          className="sw-RadioItems_InputRadio"
          id={strategyType}
          name="contract-type"
          onChange={handleChange}
          type="radio"
          value={strategyType}
        />
        <span className="sw-RadioItems_ItemContent">
          <span className="sw-RadioItems_ItemContentText">
            <span className="sw-RadioItems_ItemTitle">{strategyDisplayTitle}</span>
            <span className="sw-RadioItems_ItemDescription">{stragegyDisplayDescription}</span>
          </span>
          <span className="sw-RadioItems_Radio" />
        </span>
      </label>
    )
  }
}
