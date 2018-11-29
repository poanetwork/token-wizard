import React, { Component } from 'react'

export class StrategyItem extends Component {
  render() {
    const { strategy, strategyType, strategyDisplayTitle, stragegyDisplayDescription, handleChange } = this.props
    return (
      <label className="st-StrategyItem_Item">
        <input
          checked={strategy === strategyType}
          className="st-StrategyItem_InputRadio"
          id={strategyType}
          name="contract-type"
          onChange={handleChange}
          type="radio"
          value={strategyType}
        />
        <span className="st-StrategyItem_ItemContent">
          <span className="st-StrategyItem_ItemContentText">
            <span className="st-StrategyItem_ItemTitle">{strategyDisplayTitle}</span>
            <span className="st-StrategyItem_ItemDescription">{stragegyDisplayDescription}</span>
          </span>
          <span className="st-StrategyItem_Radio" />
        </span>
      </label>
    )
  }
}
