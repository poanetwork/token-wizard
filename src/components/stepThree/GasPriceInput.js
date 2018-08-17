import React, { Component } from 'react'
import { GAS_PRICE } from '../../utils/constants'
import { objectKeysToLowerCase } from '../../utils/utils'
import { Error } from '../Common/Error'
import { inject, observer } from 'mobx-react'

@inject('generalStore')
@observer
class GasPriceInput extends Component {
  state = {
    isCustom: false,
    customGasPrice: 0,
    gasTypeSelected: {}
  }

  async componentDidMount() {
    const { generalStore } = this.props
    const gasTypeSelected = objectKeysToLowerCase(generalStore.getGasTypeSelected)
    this.setState({ gasTypeSelected: gasTypeSelected })

    if (gasTypeSelected.id === GAS_PRICE.CUSTOM.ID) {
      this.setState({
        isCustom: true,
        customGasPrice: gasTypeSelected.price
      })
    }
  }

  handleNonCustomSelected = value => {
    const { input } = this.props
    this.setState({
      isCustom: false
    })

    const gasTypeSelected = objectKeysToLowerCase(value)
    this.handleGasType(gasTypeSelected)

    input.onChange(
      Object.assign(
        {},
        {
          id: gasTypeSelected.id,
          price: gasTypeSelected.price
        }
      )
    )
  }

  handleCustomSelected = () => {
    const { input } = this.props
    this.setState({
      isCustom: true
    })

    let gasTypeSelected = objectKeysToLowerCase(GAS_PRICE.CUSTOM)
    if (this.state.customGasPrice) {
      gasTypeSelected.price = this.state.customGasPrice
    }

    this.handleGasType(gasTypeSelected)
    input.onChange(
      Object.assign(
        {},
        {
          id: gasTypeSelected.id,
          price: gasTypeSelected.price
        }
      )
    )
  }

  handleGasType = value => {
    const { updateGasTypeSelected } = this.props

    updateGasTypeSelected(value)
    this.setState({
      gasTypeSelected: value
    })
  }

  handleCustomGasPriceChange = value => {
    const { updateGasTypeSelected, input } = this.props

    let gasTypeSelected = this.state.gasTypeSelected
    gasTypeSelected.price = value

    updateGasTypeSelected(gasTypeSelected)
    this.setState({
      gasTypeSelected: gasTypeSelected,
      customGasPrice: value
    })

    input.onChange(
      Object.assign(
        {},
        {
          id: gasTypeSelected.id,
          price: value
        }
      )
    )
  }

  compareChecked = value => {
    // eslint-disable-next-line
    return new String(this.state.gasTypeSelected.id).valueOf() === new String(value).valueOf()
  }

  render() {
    const { input, side, gasPrices } = this.props
    return (
      <div className={side}>
        <label htmlFor={input.name} className="label">
          Gas Price
        </label>
        {gasPrices.map((gasPrice, index) => (
          <div key={index} className="radios-inline">
            <label className="radio-inline">
              <input
                id={gasPrice.id}
                type="radio"
                value={gasPrice.id}
                checked={this.compareChecked(gasPrice.id)}
                name="gas-price"
                onChange={e => {
                  gasPrice.id !== GAS_PRICE.CUSTOM.ID
                    ? this.handleNonCustomSelected(gasPrice)
                    : this.handleCustomSelected(e.target.value)
                }}
              />
              <span className="title">{gasPrice.description}</span>
            </label>
          </div>
        ))}
        {this.state.isCustom ? (
          <input
            id="customGasPrice"
            type="number"
            className="input"
            value={this.state.customGasPrice}
            name="gas-price-custom-value"
            onChange={e => {
              this.handleCustomGasPriceChange(e.target.value)
            }}
          />
        ) : null}
        <p className="description">Slow is cheap, fast is expensive</p>
        <Error name={input.name} />
      </div>
    )
  }
}

export default GasPriceInput
