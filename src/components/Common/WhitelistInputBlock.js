import React from 'react'
import Web3 from 'web3'
import update from 'immutability-helper'
import Dropzone from 'react-dropzone'
import Papa from 'papaparse'
import '../../assets/stylesheets/application.css'
import { InputField } from './InputField'
import { TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import { WhitelistItem } from './WhitelistItem'
import { inject, observer } from 'mobx-react'
import {
  clearingWhitelist,
  whitelistImported,
  noMoreWhitelistedSlotAvailable,
  noMoreWhitelistedSlotAvailableCSV
} from '../../utils/alerts'
import processWhitelist from '../../utils/processWhitelist'
import { validateWhitelistMax, validateWhitelistMin } from '../../utils/validations'
import logdown from 'logdown'

const logger = logdown('TW:WhitelistInputBlock')
const { ADDRESS, MIN, MAX } = TEXT_FIELDS
const { VALID, INVALID } = VALIDATION_TYPES

@inject('tierStore')
@observer
export class WhitelistInputBlock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addr: '',
      min: '',
      max: '',
      validation: {
        address: {
          pristine: true,
          valid: INVALID
        },
        min: {
          pristine: true,
          valid: INVALID,
          errorMessage: VALIDATION_MESSAGES.REQUIRED
        },
        max: {
          pristine: true,
          valid: INVALID,
          errorMessage: VALIDATION_MESSAGES.REQUIRED
        }
      }
    }
  }

  validateWhitelistedAddressList = async tierIndex => {
    const { tierStore } = this.props

    let result = tierStore.validateWhitelistedAddressLength(tierIndex)
    if (!result) {
      await noMoreWhitelistedSlotAvailable()
    }
    return result
  }

  addWhitelistItem = async () => {
    const { tierStore } = this.props
    const crowdsaleNum = this.props.num
    const { addr, min, max } = this.state

    let validateWhitelistedLength = await this.validateWhitelistedAddressList(crowdsaleNum)
    logger.log('Validate whitelisted address list length', validateWhitelistedLength)
    if (!validateWhitelistedLength) {
      this.clearInput()
      return
    }

    this.setState(
      update(this.state, {
        validation: {
          address: {
            pristine: { $set: false }
          },
          min: {
            pristine: { $set: false }
          },
          max: {
            pristine: { $set: false }
          }
        }
      })
    )

    const {
      address: { valid: addrValid },
      min: { valid: minValid },
      max: { valid: maxValid }
    } = this.state.validation

    if (!addr || !min || !max || addrValid === INVALID || minValid === INVALID || maxValid === INVALID) {
      return
    }

    this.setState({
      addr: '',
      min: '',
      max: '',
      validation: {
        address: {
          pristine: true,
          valid: INVALID
        },
        min: {
          pristine: true,
          valid: INVALID,
          errorMessage: VALIDATION_MESSAGES.REQUIRED
        },
        max: {
          pristine: true,
          valid: INVALID,
          errorMessage: VALIDATION_MESSAGES.REQUIRED
        }
      }
    })

    tierStore.addWhitelistItem({ addr, min, max }, crowdsaleNum)
  }

  handleAddressChange = address => {
    const isAddressValid = Web3.utils.isAddress(address) ? VALID : INVALID

    const newState = update(this.state, {
      addr: { $set: address },
      validation: {
        address: {
          $set: {
            pristine: false,
            valid: isAddressValid
          }
        }
      }
    })

    this.setState(newState)
  }

  handleMinChange = ({ min }) => {
    const errorMessage = validateWhitelistMin({
      min,
      max: this.state.max,
      decimals: this.props.decimals
    })

    return new Promise(resolve => {
      this.setState(
        update(this.state, {
          min: { $set: min },
          validation: {
            min: {
              $set: {
                pristine: false,
                valid: errorMessage ? INVALID : VALID,
                errorMessage
              }
            }
          }
        }),
        resolve
      )
    })
  }

  handleMaxChange = ({ max }) => {
    const errorMessage = validateWhitelistMax({
      min: this.state.min,
      max,
      decimals: this.props.decimals
    })

    return new Promise(resolve => {
      this.setState(
        update(this.state, {
          max: { $set: max },
          validation: {
            max: {
              $set: {
                pristine: false,
                valid: errorMessage ? INVALID : VALID,
                errorMessage
              }
            }
          }
        }),
        resolve
      )
    })
  }

  handleMinMaxChange = ({ min, max }) => {
    if (min !== undefined) {
      this.handleMinChange({ min }).then(() => {
        if (!this.state.validation.max.pristine) this.handleMaxChange({ max: this.state.max })
      })
    }

    if (max !== undefined) {
      this.handleMaxChange({ max }).then(() => {
        if (!this.state.validation.min.pristine) this.handleMinChange({ min: this.state.min })
      })
    }
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const { decimals, tierStore, num } = this.props
    acceptedFiles.forEach(file => {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: results => {
          const { called, whitelistedAddressLengthError } = processWhitelist(
            {
              rows: results.data,
              decimals: decimals
            },
            item => {
              tierStore.addWhitelistItem(item, num)
            },
            () => {
              return tierStore.validateWhitelistedAddressLength(num)
            }
          )

          if (whitelistedAddressLengthError) {
            noMoreWhitelistedSlotAvailableCSV(called)
          } else {
            whitelistImported(called)
          }
        }
      })
    })
  }

  clearInput() {
    this.setState({
      addr: '',
      min: '',
      max: ''
    })
  }

  clearAll = () => {
    const { num, tierStore } = this.props

    return clearingWhitelist().then(result => {
      if (result.value) {
        tierStore.emptyWhitelist(num)
      }
    })
  }

  render() {
    const { num, tierStore } = this.props
    const { whitelist } = tierStore.tiers[num]

    const whitelistEmpty = tierStore.isWhitelistEmpty(num)

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
      <div className="white-list-container">
        <div className="white-list-input-container">
          <div className="white-list-input-container-inner">
            <InputField
              side="white-list-input-property white-list-input-property-left"
              type="text"
              title={ADDRESS}
              value={this.state.addr}
              onChange={e => this.handleAddressChange(e.target.value)}
              description={`Address of a whitelisted account. Whitelists are inherited. E.g., if an account whitelisted on Tier 1 and didn't buy max cap on Tier 1, he can buy on Tier 2, and following tiers.`}
              pristine={this.state.validation.address.pristine}
              valid={this.state.validation.address.valid}
              errorMessage="The inserted address is invalid"
            />
            <InputField
              side="white-list-input-property white-list-input-property-middle"
              type="number"
              title={MIN}
              value={this.state.min}
              onChange={e => this.handleMinMaxChange({ min: e.target.value })}
              description={`Minimum amount tokens to buy. Not a minimal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
              pristine={this.state.validation.min.pristine}
              valid={this.state.validation.min.valid}
              errorMessage={this.state.validation.min.errorMessage}
            />
            <InputField
              side="white-list-input-property white-list-input-property-right"
              type="number"
              title={MAX}
              value={this.state.max}
              onChange={e => this.handleMinMaxChange({ max: e.target.value })}
              description={`Maximum is the hard limit.`}
              pristine={this.state.validation.max.pristine}
              valid={this.state.validation.max.valid}
              errorMessage={this.state.validation.max.errorMessage}
            />
          </div>
          <div className="plus-button-container">
            <div onClick={e => this.addWhitelistItem()} className="button button_fill button_fill_plus" />
          </div>
        </div>
        {whitelist &&
          whitelist.map((item, index) => (
            <WhitelistItem
              key={`${num}-${item.addr}-${item.stored ? 0 : 1}`}
              crowdsaleNum={num}
              whitelistNum={index}
              {...item}
            />
          ))}

        {/* Actions */}
        <div style={actionsStyle}>
          {whitelistEmpty ? null : (
            <div className="clear-all-tokens" style={clearAllStyle} onClick={this.clearAll}>
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
