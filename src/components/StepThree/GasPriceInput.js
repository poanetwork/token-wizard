import React, { Component } from 'react'
import { GAS_PRICE } from '../../utils/constants'
import { Errors } from '../Common/Errors'
import { inject, observer } from 'mobx-react'
import { FormControlTitle } from '../Common/FormControlTitle'
import { TextField } from '../Common/TextField'
import classNames from 'classnames'

@inject('generalStore')
@observer
export default class GasPriceInput extends Component {
  state = {
    customGasPrice: undefined,
    gasTypeSelected: {},
    isCustom: false,
    openDropdown: false,
    selectText: ''
  }

  componentDidMount() {
    const { generalStore } = this.props
    const { gasTypeSelected } = generalStore

    if (gasTypeSelected.id === GAS_PRICE.CUSTOM.id) {
      this.setState({
        gasTypeSelected,
        customGasPrice: gasTypeSelected.price,
        isCustom: true
      })
    }

    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef = node => {
    this.wrapperRef = node
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeDropdown()
    }
  }

  openDropdown = () => {
    this.setState({ openDropdown: true })
  }

  closeDropdown() {
    this.setState({ openDropdown: false })
  }

  handleNonCustomSelected = gasTypeSelected => {
    const { input } = this.props

    this.setState({ isCustom: false })
    this.handleGasType(gasTypeSelected)

    input.onChange(gasTypeSelected)

    this.closeDropdown()
  }

  handleCustomSelected = () => {
    const { input } = this.props
    const gasTypeSelected = GAS_PRICE.CUSTOM

    this.setState({ isCustom: true })

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

    this.closeDropdown()
  }

  handleGasType = gasTypeSelected => {
    const { updateGasTypeSelected } = this.props

    updateGasTypeSelected(gasTypeSelected)

    this.setState({ gasTypeSelected })
  }

  handleCustomGasPriceChange = customGasPrice => {
    const { updateGasTypeSelected, input } = this.props
    const { gasTypeSelected } = this.state

    gasTypeSelected.price = customGasPrice

    updateGasTypeSelected(gasTypeSelected)
    this.setState({ gasTypeSelected, customGasPrice })

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

  render() {
    const { input, gasPrices, extraClassName } = this.props
    const { openDropdown, isCustom, customGasPrice, gasTypeSelected } = this.state
    const { selectText, selectItems } = gasPrices.reduce(
      (acc, gasPrice, index) => {
        const content = (
          <label
            key={index}
            className="sw-GasPriceInput_SelectItem"
            onClick={() => {
              gasPrice.id !== GAS_PRICE.CUSTOM.id
                ? this.handleNonCustomSelected(gasPrice)
                : this.handleCustomSelected(gasPrice.id)
            }}
          >
            <input
              checked={gasTypeSelected.id === gasPrice.id}
              className="sw-GasPriceInput_SelectInput"
              id={gasPrice.id}
              name="gas-price"
              type="radio"
              value={gasPrice.id}
            />
            <span className="sw-GasPriceInput_SelectText">{gasPrice.description}</span>
          </label>
        )

        acc.selectItems = [...acc.selectItems, content]

        if (gasTypeSelected.id === gasPrice.id) acc.selectText = gasPrice.description

        return acc
      },
      { selectText: '', selectItems: [] }
    )

    return (
      <div
        className={classNames('sw-GasPriceInput', {
          [extraClassName]: extraClassName,
          'sw-GasPriceInput-open': openDropdown
        })}
      >
        <FormControlTitle title="Gas Price" description="Slow is cheap, fast is expensive." />
        <div className="sw-GasPriceInput_Select" ref={this.setWrapperRef}>
          <button type="button" className="sw-GasPriceInput_SelectButton" onClick={() => this.openDropdown()}>
            <span className="sw-GasPriceInput_SelectButtonText">{selectText ? selectText : 'Select'}</span>
            <span className="sw-GasPriceInput_SelectButtonChevron" />
          </button>
          <div className="sw-GasPriceInput_SelectList" onClick={e => e.stopPropagation()}>
            {selectItems}
          </div>
        </div>
        {isCustom ? (
          <TextField
            id="customGasPrice"
            min={GAS_PRICE.CUSTOM.price}
            step="any"
            name="gas-price-custom-value"
            onChange={e => this.handleCustomGasPriceChange(e.target.value)}
            placeholder="Enter here"
            type="number"
            value={customGasPrice}
          />
        ) : null}
        <Errors name={input.name} />
      </div>
    )
  }
}
