import React, { Component } from 'react'
import Web3 from 'web3'
import '../../assets/stylesheets/application.css'
import { InputField } from './InputField'
import { RadioInputField } from './RadioInputField'
import { TEXT_FIELDS, VALIDATION_TYPES } from '../../utils/constants'
import update from 'immutability-helper'
import ReservedTokensItem from './ReservedTokensItem'
import { observer } from 'mobx-react';

const { VALID, INVALID } = VALIDATION_TYPES
const { ADDRESS, DIMENSION, VALUE } = TEXT_FIELDS

@observer
export class ReservedTokensInputBlock extends Component {
  constructor (props) {
    super(props)

    this.state = {
      addr: '',
      dim: 'tokens',
      val: '',
      validation: {
        address: {
          pristine: true,
          valid: INVALID
        },
        value: {
          pristine: true,
          valid: INVALID
        }
      }
    }
  }

  clearInput () {
    this.setState({
      addr: '',
      dim: 'tokens',
      val: ''
    })
  }

  updateReservedTokenInput = (value, property) => {
    this.setState({
      [property]: value
    })
  }

  addReservedTokensItem = () => {
    const { addr, dim, val } = this.state

    this.setState(update(this.state, {
      validation: {
        address: {
          pristine: { $set: false }
        },
        value: {
          pristine: { $set: false }
        }
      }
    }))

    const validFields = this.state.validation.address.valid === VALID && this.state.validation.value.valid === VALID

    if (!addr || !dim || !val || !validFields) {
      return
    }

    this.setState(update(this.state, {
      validation: {
        address: {
          $set: {
            pristine: true,
            valid: INVALID
          }
        },
        value: {
          $set: {
            pristine: true,
            valid: INVALID
          }
        }
      }
    }))

    this.clearInput()

    let newToken = {
      addr: addr,
      dim: dim,
      val: val
    }

    this.props.addReservedTokensItem(newToken)
  }

  handleAddressChange = address => {
    const isAddressValid = Web3.utils.isAddress(address) ? VALID : INVALID

    const newState = update(this.state, {
      validation: {
        address: {
          $set: {
            pristine: false,
            valid: isAddressValid
          },
        },
      },
    })
    newState.addr = address

    this.setState(newState)
  }

  handleValueChange = value => {
    const isValueValid = value > 0 ? VALID : INVALID

    const newState = update(this.state, {
      validation: {
        value: {
          $set: {
            pristine: false,
            valid: isValueValid
          }
        }
      }
    })
    newState.val = value

    this.setState(newState)
  }

  render () {
    const reservedTokensElements = this.props.tokens.map((token, index) => {
      return (
        <ReservedTokensItem
          key={index.toString()}
          num={index}
          addr={token.addr}
          dim={token.dim}
          val={token.val}
          onRemove={index => this.props.removeReservedToken(index)}
        />
      )
    })

    return (
      <div className="reserved-tokens-container">
        <div className="reserved-tokens-input-container">
          <div className="reserved-tokens-input-container-inner">
            <InputField
              side="reserved-tokens-input-property reserved-tokens-input-property-left"
              type="text"
              title={ADDRESS}
              value={this.state.addr}
              onChange={e => this.handleAddressChange(e.target.value)}
              description="Address where to send reserved tokens."
              pristine={this.state.validation.address.pristine}
              valid={this.state.validation.address.valid}
              errorMessage="The inserted address is invalid"
            />
            <RadioInputField
              extraClassName="reserved-tokens-input-property reserved-tokens-input-property-middle"
              title={DIMENSION}
              items={[{ label: 'tokens', value: 'tokens' }, { label: 'percentage', value: 'percentage' }]}
              selectedItem={this.state.dim}
              onChange={e => this.updateReservedTokenInput(e.target.value, 'dim')}
              description="Fixed amount or % of crowdsaled tokens. Will be deposited to the account after finalization
               of the crowdsale."
            />
            <InputField
              side="reserved-tokens-input-property reserved-tokens-input-property-right"
              type="number"
              title={VALUE}
              value={this.state.val}
              onChange={e => this.handleValueChange(e.target.value)}
              description="Value in tokens or percents. Don't forget to press + button for each reserved token."
              pristine={this.state.validation.value.pristine}
              valid={this.state.validation.value.valid}
              errorMessage="Value must be positive"
            />
          </div>
          <div className="plus-button-container">
            <div onClick={e => this.addReservedTokensItem()} className="button button_fill button_fill_plus"/>
          </div>
        </div>
        {reservedTokensElements}
      </div>
    )
  }
}
