import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'

@inject('crowdsaleStore', 'web3Store')
@observer
export default class CrowdsalesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: null,
      selectedCrowdsale: '',
      selectedRow: null
    }
  }

  componentDidMount() {
    this.props.web3Store.web3.eth
      .getAccounts()
      .then(accounts => accounts[0])
      .then(account => this.setState({ account }))
  }

  selectCrowdsale = (index, contractAddress) => {
    this.setState({
      selectedCrowdsale: contractAddress,
      selectedRow: index
    })
  }

  render() {
    const { crowdsaleStore, onClick } = this.props
    const { selectedCrowdsale } = this.state

    const crowdsalesList = (
      <div>
        <div className="sw-FlexTable">
          <div className="sw-FlexTable_Head sw-FlexTable_Row">
            <div className="sw-FlexTable_Td">Address</div>
          </div>
          <div className="sw-FlexTable_Body sw-FlexTable_Body-scrollable sw-FlexTable_Body-crowdsale m-b-15">
            {crowdsaleStore.crowdsales.map((crowdsale, index) => (
              <div
                className={`sw-FlexTable_Row sw-FlexTable_Row-selectable
                ${this.state.selectedRow === index ? 'selected' : ''}`}
                key={index.toString()}
                onClick={() => this.selectCrowdsale(index, crowdsale.execID)}
              >
                <div className="sw-FlexTable_Td">{crowdsale.execID}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="sw-ModalWindow_ButtonsContainer sw-ModalWindow_ButtonsContainer-right">
          <button
            className={`sw-Button sw-Button-secondary`}
            disabled={!selectedCrowdsale}
            onClick={() => selectedCrowdsale && onClick(selectedCrowdsale)}
          >
            Continue
          </button>
        </div>
      </div>
    )

    const noCrowdsalesMsg = (
      <p className="sw-EmptyContentTextOnly">
        No crowdsales found for address <span className="text-bold">{this.state.account}</span>
      </p>
    )

    return crowdsaleStore.crowdsales.length ? crowdsalesList : noCrowdsalesMsg
  }
}
