import React, { Component } from 'react'
import { GAS_PRICE } from '../../utils/constants'
import { Error } from '../Common/Error'

class GasPriceInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isCustom: false,
      customGasPrice: undefined
    }
  }

  handleNonCustomSelected = (value) => {
    this.setState({
      isCustom: false
    })
    this.props.input.onChange(value)
  }

  handleCustomSelected = () => {
    const { input, gasPrices } = this.props

    const newState = { isCustom: true }

    if (this.state.customGasPrice === undefined) {
      const slow = gasPrices.find(gasPrice => gasPrice.id === GAS_PRICE.SLOW.ID)
      newState.customGasPrice = slow.price
    }

    this.setState(newState, () => {
      input.onChange(Object.assign({}, {
        id: GAS_PRICE.CUSTOM.ID,
        price: this.state.customGasPrice
      }))
    })
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
          <div key={index} className="radios-inline">
            <label className="radio-inline">
              <input
                type="radio"
                checked={input.value.id === gasPrice.id}
                onChange={() => {
                  gasPrice.id !== GAS_PRICE.CUSTOM.ID
                    ? this.handleNonCustomSelected(gasPrice)
                    : this.handleCustomSelected()
                }}
              />
              <span className="title">{gasPrice.description}</span>
            </label>
          </div>
        ))}
        {this.state.isCustom ? (
          <input
            type="number"
            className="input"
            value={this.state.customGasPrice}
            onChange={(e) => this.handleCustomGasPriceChange(e.target.value)}
          />
        ) : null}
        <p className="description">Slow is cheap, fast is expensive</p>
        <Error name={input.name}/>
      </div>
    )
  }
}

export default GasPriceInput
