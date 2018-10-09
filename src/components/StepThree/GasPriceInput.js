import React, { Component } from 'react'
import { GAS_PRICE } from '../../utils/constants'
import { objectKeysToLowerCase } from '../../utils/utils'
import { Error } from '../Common/Error'
import { inject, observer } from 'mobx-react'
import { FormControlTitle } from '../Common/FormControlTitle'
import { TextField } from '../Common/TextField'

@inject('generalStore')
@observer
class GasPriceInput extends Component {
  state = {
    customGasPrice: GAS_PRICE.CUSTOM.PRICE,
    gasTypeSelected: {},
    isCustom: false,
    selectText: ''
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

    input.onChange(gasTypeSelected)
  }

  handleCustomSelected = value => {
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
    this.updateSelect(value.description)

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

  updateSelect = text => {
    this.setState({ selectText: text })
  }

  render() {
    const { input, gasPrices, extraClassName } = this.props
    return (
      <div className={`sw-GasPriceInput ${extraClassName ? extraClassName : ''}`}>
        <FormControlTitle title="Gas Price" description="Slow is cheap, fast is expensive." />
        <div className="sw-GasPriceInput_Select">
          <button type="button" className={`sw-GasPriceInput_SelectButton`}>
            <span className="sw-GasPriceInput_SelectButtonText">
              {this.state.selectText ? this.state.selectText : 'Select'}
            </span>
            <span className="sw-GasPriceInput_SelectButtonChevron" />
          </button>
          <div
            className="sw-GasPriceInput_SelectList"
            onClick={e => {
              e.stopPropagation()
            }}
          >
            {gasPrices.map((gasPrice, index) => (
              <label
                key={index}
                className="sw-GasPriceInput_SelectItem"
                onClick={e => {
                  gasPrice.id !== GAS_PRICE.CUSTOM.ID
                    ? this.handleNonCustomSelected(gasPrice)
                    : this.handleCustomSelected(gasPrice.id)
                }}
              >
                <input
                  checked={this.compareChecked(gasPrice.id)}
                  className="sw-GasPriceInput_SelectInput"
                  id={gasPrice.id}
                  name="gas-price"
                  type="radio"
                  value={gasPrice.id}
                />
                <span className="sw-GasPriceInput_SelectText">{gasPrice.description}</span>
              </label>
            ))}
          </div>
        </div>
        {this.state.isCustom ? (
          <TextField
            id="customGasPrice"
            name="gas-price-custom-value"
            onChange={e => this.handleCustomGasPriceChange(e.target.value)}
            type="number"
            value={this.state.customGasPrice}
          />
        ) : null}
        <Error name={input.name} />
      </div>
    )
  }
}

export default GasPriceInput