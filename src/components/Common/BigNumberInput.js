import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { VALIDATION_TYPES } from '../../utils/constants'
import { InputField } from './InputField'

const { VALID, INVALID } = VALIDATION_TYPES

export class BigNumberInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value || '',
      pristine: props.pristine !== undefined ? props.pristine : true,
      valid: props.valid || VALID
    }
  }

  componentWillReceiveProps (newProps) {
    const { value, pristine, valid } = newProps

    this.setState({ value, pristine, valid })
  }

  componentDidUpdate (prevProps) {
    const { acceptEmpty, acceptFloat, minDecimals, maxDecimals, min, max } = prevProps

    if (
      prevProps.acceptEmpty !== acceptEmpty ||
      prevProps.acceptFloat !== acceptFloat ||
      prevProps.minDecimals !== minDecimals ||
      prevProps.maxDecimals !== maxDecimals ||
      prevProps.min !== min ||
      prevProps.max !== max
    ) {
      // re-check validity if any of the props had changed
      this.validate(this.state.value)
    }
  }

  validate = (value) => {
    const { acceptEmpty, acceptFloat, minDecimals, maxDecimals, min, max } = this.props
    const newState = {
      pristine: false
    }

    if (isNaN(Number(value)) || isNaN(parseFloat(value))) {
      newState.value = ''
      newState.valid = acceptEmpty ? VALID : INVALID

    } else {
      const number = new BigNumber(value)
      const decimals = number.decimalPlaces()
      let isValid = true

      if (acceptFloat) {
        if (maxDecimals !== undefined) {
          isValid = decimals <= maxDecimals
        }

        if (isValid && minDecimals !== undefined) {
          isValid = decimals >= minDecimals
        }

      } else {
        isValid = !decimals
      }

      if (isValid && min !== undefined) {
        isValid = number.gte(min)
      }

      if (isValid && max !== undefined) {
        isValid = number.lte(max)
      }

      newState.value = number.toFixed()
      newState.valid = isValid ? VALID : INVALID
    }

    this.setState(newState)
    this.props.onChange(newState)
  }

  onKeyPress = e => {
    const { acceptFloat, min, max } = this.props
    const { key } = e
    const isValidNumericKey = /[0-9.+e-]/
    const isValidIntegerKey = /[0-9-]/

    if (!isValidNumericKey.test(key)) e.preventDefault()
    if (!acceptFloat && !isValidIntegerKey.test(key)) e.preventDefault()
    if (!acceptFloat && key === '-' && min >= 0 && max >= 0) e.preventDefault()
  }

  onPaste = e => {
    if (isNaN(Number(e.clipboardData.getData('text/plain')))) e.preventDefault()
  }

  onChange = e => {
    this.validate(e.target.value)
  }

  render () {
    const { value, pristine, valid } = this.state
    const { disabled, side, errorMessage, title, description } = this.props

    return (
      <InputField
        disabled={disabled}
        side={side}
        type="text"
        errorMessage={errorMessage}
        value={value}
        pristine={pristine}
        valid={valid}
        title={title}
        onKeyPress={this.onKeyPress}
        onChange={this.onChange}
        onPaste={this.onPaste}
        description={description}
      />
    )
  }
}
