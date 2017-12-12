import React, { Component } from 'react'
import '../../assets/stylesheets/application.css'
import { inject, observer } from 'mobx-react'

@inject('crowdsaleStore')
@observer
export default class CrowdsalesList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedCrowdsale: '',
      selectedRow: null
    }
  }

  selectCrowdsale = (index, contractAddress) => {
    this.setState({
      selectedCrowdsale: contractAddress,
      selectedRow: index
    })
  }

  render () {
    const { crowdsaleStore, onClick } = this.props
    const { selectedCrowdsale } = this.state

    return (
      <div className="crowdsale-table">
        <div className="container-fluid">
          <div className="table-row flex-table-header">
            <div className="text">Address</div>
            <div className="sm-text">Token Name</div>
            <div className="sm-text">Ticker</div>
            <div className="sm-text">Date</div>
          </div>
          <div className="scrollable-content">
            {crowdsaleStore.crowdsales.map((crowdsale, index) => (
              <div className={`table-row ${this.state.selectedRow === index ? 'selected' : ''}`}
                   key={index.toString()}
                   onClick={() => this.selectCrowdsale(index, crowdsale.contractAddress)}
              >
                <div className="text">{crowdsale.contractAddress}</div>
                <div className="sm-text">{crowdsale.extraData.tokenName}</div>
                <div className="sm-text">{crowdsale.extraData.ticker}</div>
                <div className="sm-text">{crowdsale.extraData.startTime.split('T').join(' ')}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="steps">
          <div className={`button button_${selectedCrowdsale ? 'fill' : 'disabled'}`}
               onClick={() => selectedCrowdsale && onClick(selectedCrowdsale)}
          >Continue
          </div>
        </div>
      </div>
    )
  }
}

