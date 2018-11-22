import React, { Component } from 'react'
import { ButtonContinue } from './ButtonContinue'
import { inject, observer } from 'mobx-react'
import { navigateTo } from '../../utils/utils'

@inject('crowdsaleStore', 'web3Store')
@observer
export default class CrowdsalesList extends Component {
  state = {
    selectedRow: null,
    selectedCrowdsale: null
  }

  selectCrowdsale = (index, contractAddress) => {
    this.setState({
      selectedRow: index,
      selectedCrowdsale: contractAddress
    })
  }

  onClick = crowdsaleAddress => {
    navigateTo({
      history: this.props.history,
      location: 'manage',
      params: `/${crowdsaleAddress}`
    })
  }

  render() {
    const { selectedRow, selectedCrowdsale } = this.state
    const { crowdsales } = this.props

    return (
      <div className="mng-CrowdsalesList">
        <h2 className="mng-CrowdsalesList_Title">Select Address</h2>
        <div className="mng-CrowdsalesList_Container">
          {crowdsales.map((crowdsale, index) => (
            <label
              className="mng-CrowdsalesList_Item"
              key={index.toString()}
              onClick={() => this.selectCrowdsale(index, crowdsale.execID)}
            >
              <input
                checked={selectedRow === index}
                className="mng-CrowdsalesList_InputRadio"
                name="crowdsale-item"
                type="radio"
                value={index.toString()}
              />
              <span className="mng-CrowdsalesList_ItemContent">
                <span className="mng-CrowdsalesList_ItemContentText">
                  <span className="mng-CrowdsalesList_ItemDescription">{crowdsale.execID}</span>
                </span>
                <span className="mng-CrowdsalesList_Radio" />
              </span>
            </label>
          ))}
        </div>
        <div className="st-StepContent_Buttons">
          <ButtonContinue
            disabled={!selectedCrowdsale}
            onClick={() => selectedCrowdsale && this.onClick(selectedCrowdsale)}
          />
        </div>
      </div>
    )
  }
}
