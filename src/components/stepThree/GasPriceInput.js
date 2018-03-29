import React, { Component } from 'react'
import { GAS_PRICE } from '../../utils/constants'

class GasPriceInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isCustom: false,
      customGasPrice: 0
    }
  }

  handleNonCustomSelected = (value) => {
    this.setState({
      isCustom: false
    })
    this.props.input.onChange(value)
  }

  handleCustomSelected = () => {
    const { input } = this.props

    this.setState({
      isCustom: true
    })

    input.onChange(Object.assign({}, {
      id: GAS_PRICE.CUSTOM.ID,
      gasPrice: this.state.customGasPrice
    }))
  }

  handleCustomGasPriceChange = (value) => {
    const { input } = this.props

    this.setState({
      customGasPrice: value
    })

    input.onChange(Object.assign({}, {
      id: GAS_PRICE.CUSTOM.ID,
      price: value
    }))
  }

  render() {
    const { input, side, gasPrices } = this.props

    return (
      <div className={side}>
        <label htmlFor={input.name} className="label">Gas Price</label>
        {gasPrices.map((gasPrice, index) => (
          gasPrice.id !== 'CUSTOM' ? (
            <div key={index} className="radios-inline">
              <label className="radio-inline">
                <input
                  type="radio"
                  checked={input.value.id === gasPrice.id}
                  onChange={() => this.handleNonCustomSelected(gasPrice)}
                />
                <span className="title">{gasPrice.description}</span>
              </label>
            </div>
          ) : (
            <div key={index} className="radios-inline">
              <label className="radio-inline">
                <input
                  type="radio"
                  checked={input.value.id === gasPrice.id}
                  onChange={this.handleCustomSelected}
                />
                <span className="title">{gasPrice.description}</span>
              </label>
            </div>
          )
        ))}
        {this.state.isCustom ? (
          <input
            type="number"
            value={this.state.customGasPrice}
            onChange={(e) => this.handleCustomGasPriceChange(e.target.value)}
          />
        ) : null}
        <p className="description">Slow is cheap, fast is expensive</p>
      </div>
    )
  }
}

export default GasPriceInput
