import React, { Component } from 'react'
import Web3 from 'web3'
import Dropzone from 'react-dropzone'
import Papa from 'papaparse'

import { InputField } from './InputField'
import { RadioInputField } from './RadioInputField'
import { TEXT_FIELDS, VALIDATION_TYPES } from '../../utils/constants'
import update from 'immutability-helper'
import ReservedTokensTable from './ReservedTokensTable'
import { inject, observer } from 'mobx-react'
import { NumericInput } from './NumericInput'
import {
  reservedTokensImported,
  noMoreReservedSlotAvailableCSV,
  clearingReservedTokens,
  noMoreReservedSlotAvailable
} from '../../utils/alerts'
import processReservedTokens from '../../utils/processReservedTokens'
import logdown from 'logdown'
import { downloadFile } from '../../utils/utils'

const logger = logdown('TW:ReservedTokensInputBlock')
const { VALID, INVALID } = VALIDATION_TYPES
const { ADDRESS, DIMENSION, VALUE } = TEXT_FIELDS

@inject('reservedTokenStore')
@observer
export class ReservedTokensInputBlock extends Component {
  state = {
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

  clearInput() {
    this.setState({
      addr: '',
      dim: 'tokens',
      val: ''
    })
  }

  updateReservedTokenInput = (value, property) => {
    this.setState(
      update(this.state, {
        validation: {
          value: {
            $set: {
              pristine: true,
              valid: INVALID
            }
          }
        }
      })
    )
    this.setState({
      [property]: value
    })
  }

  validateReservedTokensList = () => {
    if (!this.props.reservedTokenStore.validateLength) {
      noMoreReservedSlotAvailable()
    }
    return this.props.reservedTokenStore.validateLength
  }

  addReservedTokensItem = () => {
    const { addr, dim, val } = this.state

    let response = this.validateReservedTokensList()

    logger.log('Valid reserved token list length', response)

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

    this.props.reservedTokenStore.addToken(newToken)
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
            newToken => {
              this.props.reservedTokenStore.addToken(newToken)
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

  clearAll = async () => {
    const result = await clearingReservedTokens()

    if (result && result.value) {
      this.props.reservedTokenStore.clearAll()
    }
    return result
  }

  downloadCSV = async () => {
    try {
      const response = await fetch(`/metadata/reservedTokenTemplate.csv`)
      const text = await response.text()

      // See RFC for csv MIME type http://tools.ietf.org/html/rfc4180
      downloadFile(text, 'template.csv', 'text/csv')
    } catch (err) {
      logger.log('Error fetching file when download template csv')
    }
  }

  render() {
    const reservedTokensElements = <ReservedTokensTable extraClassName="sw-BorderedBlock_Row2Column1" {...this.props} />
    const tokensListEmpty = this.props.reservedTokenStore.tokens.length === 0
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
      <div>
        <h2 className="sw-BorderedBlockTitle">Reserved tokens</h2>
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
            dimension={this.state.dim}
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
                onClick={this.clearAll}
              >
                Clear All
              </div>
            )}
            <Dropzone onDrop={this.onDrop} accept=".csv" style={dropzoneStyle}>
              <div className="sw-ReservedTokensListControls_Button sw-ReservedTokensListControls_Button-uploadcsv">
                Upload CSV
              </div>
            </Dropzone>
            <div
              className="sw-ReservedTokensListControls_Button sw-ReservedTokensListControls_Button-uploadcsv m-r-0"
              onClick={this.downloadCSV}
            >
              Download CSV template
            </div>
          </div>
        </div>
      </div>
    )
  }
}
