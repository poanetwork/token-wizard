import React, { Component } from 'react'
import '../../assets/stylesheets/application.css'
import { inject, observer } from 'mobx-react'

@inject('crowdsaleStore', 'web3Store')
@observer
export default class CrowdsalesList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      account: null,
      selectedCrowdsale: '',
      selectedRow: null
    }
  }

  componentDidMount() {
    this.props.web3Store.web3.eth.getAccounts()
      .then((accounts) => accounts[0])
      .then((account) => this.setState({ account }))
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

    const crowdsalesList = (
      <div className="container-fluid">
        <div className="table-row flex-table-header">
          <div className="text">Address</div>
        </div>
        <div className="scrollable-content">
          {
            crowdsaleStore.crowdsales.map((crowdsaleAddress, index) => (
              <div className={`table-row clickable ${this.state.selectedRow === index ? 'selected' : ''}`}
                    key={index.toString()}
                    onClick={() => this.selectCrowdsale(index, crowdsaleAddress)}
              >
                <div className="text">{crowdsaleAddress}</div>
              </div>
            ))
          }
        </div>
        <div className="steps">
          <div className={`button button_${selectedCrowdsale ? 'fill' : 'disabled'}`}
               onClick={() => selectedCrowdsale && onClick(selectedCrowdsale)}
          >Continue
          </div>
        </div>
      </div>
    )

    const noCrowdsalesMsg = (
      <div>No crowdsales found for address <strong>{ this.state.account }</strong></div>
    )

    return (
      <div className="flex-table">
        { crowdsaleStore.crowdsales.length ? crowdsalesList : noCrowdsalesMsg }
      </div>
    )
  }
}

