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
      <div>
        <div className="sw-FlexTable">
          <div className="sw-FlexTable_Head sw-FlexTable_Row">
            <div className="sw-FlexTable_Td">Address</div>
          </div>
          <div className="sw-FlexTable_Body sw-FlexTable_Body-scrollable sw-FlexTable_Body-crowdsale m-b-15">
            {crowdsales.map((crowdsale, index) => (
              <div
                className={`sw-FlexTable_Row sw-FlexTable_Row-selectable
                ${selectedRow === index ? 'selected' : ''}`}
                key={index.toString()}
                onClick={() => this.selectCrowdsale(index, crowdsale.execID)}
              >
                <div className="sw-FlexTable_Td">{crowdsale.execID}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sw-ModalWindow_ButtonsContainer sw-ModalWindow_ButtonsContainer-right">
          <ButtonContinue
            status={selectedCrowdsale}
            onClick={() => selectedCrowdsale && this.onClick(selectedCrowdsale)}
          />
        </div>
      </div>
    )
  }
}
