import Dropzone from 'react-dropzone'
import Papa from 'papaparse'
import React, { Component } from 'react'
import ReservedTokensTable from './ReservedTokensTable'
import Web3 from 'web3'
import logdown from 'logdown'
import processReservedTokens from '../../utils/processReservedTokens'
import update from 'immutability-helper'
import { InputField } from './InputField'
import { NumericInput } from './NumericInput'
import { RadioInputField } from './RadioInputField'
import { TEXT_FIELDS, VALIDATION_TYPES } from '../../utils/constants'
import { observer } from 'mobx-react'
import { reservedTokensImported, noMoreReservedSlotAvailableCSV } from '../../utils/alerts'

const logger = logdown('TW:ReservedTokensInputBlock')
const { VALID, INVALID } = VALIDATION_TYPES
const { ADDRESS, DIMENSION, VALUE } = TEXT_FIELDS

@observer
export class ReservedTokensInputBlock extends Component {
  constructor(props) {
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

  clearInput() {
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

    let response = this.props.validateReservedTokensList

    logger.log('Validate reserved token list length', response)

    if (!response) {
      this.clearInput()
      return
    }

    this.setState(
      update(this.state, {
        validation: {
          address: {
            pristine: { $set: false }
          },
          value: {
            pristine: { $set: false }
          }
        }
      })
    )

    const validFields = this.state.validation.address.valid === VALID && this.state.validation.value.valid === VALID

    if (!addr || !dim || !val || !validFields) {
      return
    }

    this.setState(
      update(this.state, {
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
      })
    )

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
          }
        }
      }
    })
    newState.addr = address

    this.setState(newState)
  }

  handleValueChange = ({ value, pristine, valid }) => {
    const newState = update(this.state, {
      validation: {
        value: {
          $set: {
            pristine: pristine,
            valid: valid
          }
        }
      }
    })
    newState.val = value

    this.setState(newState)
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: results => {
          const { called, reservedTokenLengthError } = processReservedTokens(
            {
              rows: results.data,
              decimals: this.props.decimals
            },
            item => {
              this.props.addReservedTokensItem(item)
            }
          )

          if (reservedTokenLengthError) {
            noMoreReservedSlotAvailableCSV(called)
          } else {
            reservedTokensImported(called)
          }
        }
      })
    })
  }

  render() {
    const reservedTokensElements = <ReservedTokensTable extraClassName="sw-BorderedBlock_Row2Column1" {...this.props} />
    const tokensListEmpty = this.props.tokens.length === 0
    let valueInputParams = null

    if (this.state.dim === 'tokens') {
      valueInputParams = {
        min: 0,
        maxDecimals: this.props.decimals ? this.props.decimals : 0,
        errorMessage: 'Value must be positive and decimals should not exceed the amount of decimals specified',
        description: "Value in tokens. Don't forget to click + button for each reserved token."
      }
    } else if (this.state.dim === 'percentage') {
      valueInputParams = {
        min: 0,
        errorMessage: 'Value must be positive',
        description: "Value in percentage. Don't forget to click + button for each reserved token."
      }
    } else {
      logger.error(`unrecognized dimension '${this.state.dim}'`)
    }

    const dropzoneStyle = {}

    return (
      <div className="sw-BorderedBlock sw-BorderedBlock-3Rows3Columns">
        <InputField
          extraClassName="sw-BorderedBlock_Row1Column1"
          description="Address where to send reserved tokens."
          errorMessage="The inserted address is invalid"
          name={ADDRESS}
          onChange={e => this.handleAddressChange(e.target.value)}
          placeholder="Enter here"
          pristine={this.state.validation.address.pristine}
          title={ADDRESS}
          type="text"
          valid={this.state.validation.address.valid}
          value={this.state.addr}
        />
        <RadioInputField
          extraClassName="sw-BorderedBlock_Row1Column2"
          items={[{ label: 'Tokens', value: 'tokens' }, { label: 'Percentage', value: 'percentage' }]}
          onChange={e => this.updateReservedTokenInput(e.target.value, 'dim')}
          selectedItem={this.state.dim}
          title={DIMENSION}
          description="Fixed amount or % of crowdsaled tokens. Will be deposited to the account after finalization
              of the crowdsale."
        />
        <NumericInput
          acceptFloat={true}
          extraClassName="sw-BorderedBlock_Row1Column3"
          decimals={this.props.decimals}
          name={VALUE}
          onClick={this.addReservedTokensItem}
          onValueUpdate={this.handleValueChange}
          placeholder="Enter here"
          pristine={this.state.validation.value.pristine}
          title={VALUE}
          valid={this.state.validation.value.valid}
          value={this.state.val}
          {...valueInputParams}
        />
        {reservedTokensElements}
        {/* Actions */}
        <div className="sw-ReservedTokensListControls sw-BorderedBlock_Row3Column1">
          {tokensListEmpty ? null : (
            <div
              className="sw-ReservedTokensListControls_Button sw-ReservedTokensListControls_Button-clearall"
              onClick={this.props.clearAll}
            >
              Clear All
            </div>
          )}
          <Dropzone onDrop={this.onDrop} accept=".csv" style={dropzoneStyle}>
            <div className="sw-ReservedTokensListControls_Button sw-ReservedTokensListControls_Button-uploadcsv m-r-0">
              Upload CSV
            </div>
          </Dropzone>
        </div>
      </div>
    )
  }
}
