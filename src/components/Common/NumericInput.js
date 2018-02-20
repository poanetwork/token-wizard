import React, { Component } from 'react'
import { InputField } from './InputField'
import { VALIDATION_TYPES } from '../../utils/constants'
import { observer } from 'mobx-react'
import { countDecimalPlaces } from '../../utils/utils'

const { VALID, INVALID } = VALIDATION_TYPES

@observer
export class NumericInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: '',
      pristine: true,
      valid: INVALID
    }
  }

  onPaste = e => {
    if (isNaN(parseFloat(e.clipboardData.getData('text/plain'))))
      e.preventDefault()
  }

  onKeyPress = e => {
    if (!this.props.acceptFloat) {
      const firstCharacterIsMinus = e.key === '-' && this.state.value === ''
      const acceptsNegativeValues = this.props.min < 0 || this.props.max < 0

      if (!(firstCharacterIsMinus && acceptsNegativeValues) && isNaN(parseInt(e.key, 10))) e.preventDefault()
    }
  }

  onChange = e => {
    let value = this.props.acceptFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10)
    let isValid = true

    if (this.props.acceptFloat) {
      if (this.props.maxDecimals !== undefined) {
        isValid = isValid && countDecimalPlaces(value) <= this.props.maxDecimals
      }

      if (this.props.minDecimals !== undefined) {
        isValid = isValid && countDecimalPlaces(value) >= this.props.minDecimals
      }
    }

    if (isValid && this.props.min !== undefined) {
      isValid = isValid && value >= this.props.min
    }

    if (isValid && this.props.max !== undefined) {
      isValid = isValid && value <= this.props.max
    }

    if (isNaN(value)) {
      value = ''
      isValid = true
    }

    this.setState({
      pristine: false,
      valid: isValid ? VALID : INVALID,
      value
    })

    this.props.onValueUpdate(value)
  }

  render () {
    return (
      <InputField
        disabled={this.props.disabled}
        side={this.props.side}
        type='number'
        errorMessage={this.props.errorMessage}
        valid={this.state.valid}
        pristine={this.state.pristine}
        value={this.state.value}
        title={this.props.title}
        onKeyPress={e => this.onKeyPress(e)}
        onChange={e => this.onChange(e)}
        onPaste={e => this.onPaste(e)}
        description={this.props.description}
      />
    )
  }
}
