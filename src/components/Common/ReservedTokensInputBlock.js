import React, { Component } from 'react'
import Web3 from 'web3'
import Dropzone from 'react-dropzone'
import Papa from 'papaparse'
import '../../assets/stylesheets/application.css'
import { InputField } from './InputField'
import { RadioInputField } from './RadioInputField'
import { TEXT_FIELDS, VALIDATION_TYPES } from '../../utils/constants'
import update from 'immutability-helper'
import ReservedTokensItem from './ReservedTokensItem'
import { observer } from 'mobx-react'
import { NumericInput } from './NumericInput'
import { reservedTokensImported, noMoreReservedSlotAvailableCSV } from '../../utils/alerts'
import processReservedTokens from '../../utils/processReservedTokens'
import logdown from 'logdown'

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

    const tokensListEmpty = this.props.tokens.length === 0

    let valueInputParams = null

    if (this.state.dim === 'tokens') {
      valueInputParams = {
        min: !this.props.decimals ? 0 : Number(`1e-${this.props.decimals}`),
        maxDecimals: !this.props.decimals ? 0 : this.props.decimals,
        errorMessage: 'Value must be positive and decimals should not exceed the amount of decimals specified',
        description: "Value in tokens. Don't forget to click + button for each reserved token."
      }
    } else if (this.state.dim === 'percentage') {
      valueInputParams = {
        min: Number.MIN_VALUE,
        errorMessage: 'Value must be positive',
        description: "Value in percentage. Don't forget to click + button for each reserved token."
      }
    } else {
      logger.error(`unrecognized dimension '${this.state.dim}'`)
    }

    const actionsStyle = {
      textAlign: 'right'
    }

    const clearAllStyle = {
      display: 'inline-block',
      cursor: 'pointer'
    }

    const dropzoneStyle = {
      display: 'inline-block',
      marginLeft: '1em',
      position: 'relative',
      cursor: 'pointer'
    }

    return (
      <div className="reserved-tokens-container">
        <div className="reserved-tokens-input-container">
          <div className="reserved-tokens-input-container-inner">
            <InputField
              side="reserved-tokens-input-property reserved-tokens-input-property-left"
              type="text"
              title={ADDRESS}
              name={ADDRESS}
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
            <NumericInput
              side="reserved-tokens-input-property reserved-tokens-input-property-right"
              title={VALUE}
              name={VALUE}
              value={this.state.val}
              pristine={this.state.validation.value.pristine}
              valid={this.state.validation.value.valid}
              acceptFloat={true}
              onValueUpdate={this.handleValueChange}
              {...valueInputParams}
            />
          </div>
          <div className="plus-button-container">
            <div onClick={this.addReservedTokensItem} className="button button_fill button_no_icon">
              Submit
            </div>
          </div>
        </div>
        {reservedTokensElements}

        {/* Actions */}
        <div style={actionsStyle}>
          {tokensListEmpty ? null : (
            <div className="clear-all-tokens" style={clearAllStyle} onClick={this.props.clearAll}>
              <i className="fa fa-trash" />&nbsp;Clear All
            </div>
          )}

          <Dropzone onDrop={this.onDrop} accept=".csv" style={dropzoneStyle}>
            <i className="fa fa-upload" title="Upload CSV" />&nbsp; Upload CSV
          </Dropzone>
        </div>
      </div>
    )
  }
}
