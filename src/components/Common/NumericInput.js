import React, { Component } from 'react'
import { InputField } from './InputField'
import { VALIDATION_TYPES } from '../../utils/constants'
import { countDecimalPlaces } from '../../utils/utils'
import { observer } from 'mobx-react'

const { VALID, INVALID } = VALIDATION_TYPES

@observer
export class NumericInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value || '',
      pristine: props.pristine !== undefined ? props.pristine : true,
      valid: props.valid || VALID
    }
  }

  onPaste = e => {
    if (isNaN(parseFloat(e.clipboardData.getData('text/plain')))) {
      e.preventDefault()
    }
  }

  onKeyPress = e => {
    const { min, max, acceptFloat } = this.props
    const allowsNegative = min < 0 || max < 0

    if ((e.key === 'e' || e.key === '.' || e.key === '+') && !acceptFloat) {
      e.preventDefault()
    }

    // '-' symbol is required for scientific notation and negative values
    if (e.key === '-' && !allowsNegative && !acceptFloat) {
      e.preventDefault()
    }
  }

  onChange = e => {
    const value = this.props.acceptFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10)
    this.validate(value)
  }

  validate = value => {
    const { acceptFloat, maxDecimals, minDecimals, min, max } = this.props
    let isValid = true

    if (acceptFloat) {
      if (maxDecimals !== undefined) {
        isValid = isValid && countDecimalPlaces(value) <= maxDecimals
      }

      if (minDecimals !== undefined) {
        isValid = isValid && countDecimalPlaces(value) >= minDecimals
      }
    }

    if (isValid && min !== undefined) {
      isValid = isValid && value >= min
    }

    if (isValid && max !== undefined) {
      isValid = isValid && value <= max
    }

    const result = {
      value: '',
      pristine: value === this.props.value && this.state.pristine,
      valid: INVALID
    }

    if (!isNaN(value)) {
      result.value = value
      result.valid = isValid ? VALID : INVALID
    }

    this.props.onValueUpdate(result)
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      value: newProps.value,
      pristine: newProps.pristine,
      valid: newProps.valid
    })
  }

  componentDidUpdate (prevProps) {
    const { acceptFloat, maxDecimals, minDecimals, min, max } = this.props

    if (
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

  render () {
    const { value, pristine, valid } = this.state
    const { disabled, side, errorMessage, title, description } = this.props

    return (
      <InputField
        disabled={disabled}
        side={side}
        type='number'
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
