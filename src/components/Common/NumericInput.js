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

  onKeyPress = e => {
    if (!this.props.acceptFloat) {
      if (isNaN(parseInt(e.key, 10))) e.preventDefault()
    }
  }

  onChange = e => {
    const { value } = e.target
    let isValid = true

    if (this.props.min) {
      isValid = isValid && value >= parseFloat(this.props.min)
    }

    if (isValid && this.props.max) {
      isValid = isValid && value <= parseFloat(this.props.max)
    }

    if (isValid && this.props.acceptFloat) {
      if (this.props.maxDecimals) {
        isValid = isValid && countDecimalPlaces(value) <= this.props.maxDecimals
      }

      if (this.props.minDecimals) {
        isValid = isValid && countDecimalPlaces(value) >= this.props.minDecimals
      }
    }

    if (value === '') {
      isValid = true
    }

    const newValue = value === '' ? '' : parseFloat(value)
    this.setState({
      pristine: false,
      valid: isValid ? VALID : INVALID,
      value: newValue
    }, () => this.props.onValueUpdate(newValue))
  }

  render () {
    return (
      <InputField
        side={this.props.side}
        type='number'
        errorMessage={this.props.errorMessage}
        valid={this.state.valid}
        pristine={this.state.pristine}
        value={this.state.value}
        title={this.props.title}
        onKeyPress={e => this.onKeyPress(e)}
        onChange={e => this.onChange(e)}
        description={this.props.description}
      />
    )
  }
}
