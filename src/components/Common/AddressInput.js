import React, { Component } from 'react'
import Web3 from 'web3'
import { VALIDATION_TYPES } from '../../utils/constants'
import { InputField } from './InputField'

const { INVALID, VALID } = VALIDATION_TYPES

export class AddressInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      address: props.address || '',
      pristine: props.pristine !== undefined ? props.pristine : true,
      valid: props.valid || INVALID,
    }
  }

  updateWalletAddress = address => {
    const newState = {
      address,
      pristine: false,
      valid: Web3.utils.isAddress(address) ? VALID : INVALID,
    }

    this.setState(newState)
    this.props.onChange(newState)
  }

  render () {
    const { address, description, errorMessage, pristine, side, title, valid } = this.props

    return (
      <InputField
        side={side}
        type="text"
        title={title}
        value={address}
        valid={valid}
        pristine={pristine}
        errorMessage={errorMessage}
        onChange={e => this.updateWalletAddress(e.target.value)}
        description={description}
      />
    )
  }
}
