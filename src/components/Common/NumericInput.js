import React, { Component } from 'react'
import { VALIDATION_TYPES } from '../../utils/constants'
import { countDecimalPlaces } from '../../utils/utils'
import { observer } from 'mobx-react'
import { FormControlTitle } from '../Common/FormControlTitle'
import { TextField } from '../Common/TextField'
import { FormError } from '../Common/FormError'
import { BigNumber } from 'bignumber.js'

const { VALID, INVALID } = VALIDATION_TYPES

@observer
export class NumericInput extends Component {
  constructor(props) {
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
    let value = this.props.acceptFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10)

    if (this.props.acceptEmpty && e.target.value === '') value = ''

    this.validate(value)
  }

  validate = value => {
    const { acceptEmpty, acceptFloat, maxDecimals, minDecimals, min, max } = this.props
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

    if (acceptEmpty && value === '') {
      result.value = ''
      result.valid = VALID
    }

    this.props.onValueUpdate(result)
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value,
      pristine: newProps.pristine,
      valid: newProps.valid
    })
  }

  componentDidUpdate(prevProps) {
    const { acceptEmpty, acceptFloat, maxDecimals, minDecimals, min, max } = this.props

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

  zeroDecimals(decimals) {
    if (decimals === '0' || decimals === 0 || !decimals) {
      return true
    } else return false
  }

  getMinimumWithDecimals(minimum, decimals) {
    if (this.zeroDecimals(decimals)) return

    let minDecimals = new BigNumber(0)

    minDecimals = minimum + 1 / Math.pow(10, decimals)

    return minDecimals.toFixed(decimals)
  }

  getDimensionValidMinimum(dimension, decimals) {
    if (dimension === 'tokens' && this.zeroDecimals(decimals)) {
      return 1
    }

    if (dimension === 'tokens' && !this.zeroDecimals(decimals)) {
      return 0
    }

    if (dimension === 'percentage') {
      return 0
    }
  }

  getMinimumValue(dimension, decimals, minimum) {
    if (this.zeroDecimals(decimals)) {
      return this.getDimensionValidMinimum(dimension, decimals)
    } else {
      return this.getMinimumWithDecimals(minimum, decimals)
    }
  }

  render() {
    const { value, pristine, valid } = this.state
    const {
      decimals,
      description,
      dimension,
      disabled,
      errorMessage,
      extraClassName,
      min,
      name,
      onClick,
      placeholder,
      title
    } = this.props
    const error = valid === INVALID ? <FormError errorMessage={errorMessage} /> : ''
    const minimumValue = this.getMinimumValue(dimension, decimals, min)
    const renderedValue = value <= minimumValue ? minimumValue : value

    return (
      <div className={`sw-NumericInput ${extraClassName ? extraClassName : ''}`}>
        <FormControlTitle title={title} description={description} />
        <div className="sw-NumericInput_InputAndButtonContainer">
          <TextField
            disabled={disabled}
            id={name}
            min={minimumValue}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            onPaste={this.onPaste}
            placeholder={placeholder}
            step="1"
            type="number"
            value={pristine ? '' : renderedValue}
          />
          <div onClick={onClick} className="sw-NumericInput_ButtonPlus" />
        </div>
        {pristine ? '' : error}
      </div>
    )
  }
}
