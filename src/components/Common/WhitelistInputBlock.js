import React from 'react'
import Web3 from 'web3'
import update from 'immutability-helper'
import Dropzone from 'react-dropzone'
import Papa from 'papaparse'

import { InputField } from './InputField'
import { TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import { WhitelistTable } from './WhitelistTable'
import { inject, observer } from 'mobx-react'
import {
  clearingWhitelist,
  maxCapExceedsSupply,
  noMoreWhitelistedSlotAvailable,
  noMoreWhitelistedSlotAvailableCSV,
  whitelistImported
} from '../../utils/alerts'
import processWhitelist from '../../utils/processWhitelist'
import { isLessOrEqualThan, validateWhitelistMax, validateWhitelistMin } from '../../utils/validations'
import logdown from 'logdown'
import { ButtonCSV } from '../Common/ButtonCSV'
import { downloadFile } from '../../utils/utils'

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
    const errorMessage =
      !this.state.validation.max.pristine &&
      validateWhitelistMin({
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
    let errorMessage =
      !this.state.validation.max.pristine &&
      validateWhitelistMax({
        min: this.state.min,
        max,
        decimals: this.props.decimals
      })

    if (typeof errorMessage === 'undefined') {
      const { tierStore, num } = this.props
      const { supply } = tierStore.tiers[num]
      errorMessage = isLessOrEqualThan(`Exceeds supply (${supply})`)(supply)(max)
    }

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
          const { called, whitelistedAddressLengthError, maxCapExceedsSupplyError } = processWhitelist(
            {
              rows: results.data,
              decimals: decimals
            },
            item => {
              tierStore.addWhitelistItem(item, num)
            },
            () => {
              return tierStore.validateWhitelistedAddressLength(num)
            },
            isLessOrEqualThan()(tierStore.tiers[num].supply)
          )

          if (whitelistedAddressLengthError) {
            noMoreWhitelistedSlotAvailableCSV(called)
          } else if (maxCapExceedsSupplyError) {
            maxCapExceedsSupply(called)
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

  downloadCSV = async () => {
    try {
      const response = await fetch(`/metadata/whitelistTemplate.csv`)
      const text = await response.text()

      // See RFC for csv MIME type http://tools.ietf.org/html/rfc4180
      downloadFile(text, 'whitelist-template.csv', 'text/csv')
    } catch (err) {
      logger.log('Error fetching file when download template csv')
    }
  }

  render() {
    const { num, tierStore } = this.props
    const { whitelist } = tierStore.tiers[num]
    const whitelistEmpty = tierStore.isWhitelistEmpty(num)
    const dropzoneStyle = {}

    return (
      <div className="sw-WhitelistInputBlock">
        <h2 className="sw-BorderedBlock_Title">Whitelist</h2>
        <InputField
          description={`Address of a whitelisted account. Whitelists are inherited. E.g., if an account whitelisted on Tier 1 and didn't buy max cap on Tier 1, he can buy on Tier 2, and following tiers.`}
          errorMessage="The inserted address is invalid"
          onChange={e => this.handleAddressChange(e.target.value)}
          placeholder="Enter here"
          pristine={this.state.validation.address.pristine}
          title={ADDRESS}
          type="text"
          valid={this.state.validation.address.valid}
          value={this.state.addr}
        />
        <div className="sw-WhitelistInputBlock_MinMaxFields">
          <InputField
            description={`Minimum amount tokens to buy. Not a minimal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
            errorMessage={this.state.validation.min.errorMessage}
            onChange={e => this.handleMinMaxChange({ min: e.target.value })}
            placeholder="Enter here"
            pristine={this.state.validation.min.pristine}
            title={MIN}
            type="number"
            valid={this.state.validation.min.valid}
            value={this.state.min}
          />
          <InputField
            description={`Maximum is the hard limit.`}
            errorMessage={this.state.validation.max.errorMessage}
            onChange={e => this.handleMinMaxChange({ max: e.target.value })}
            placeholder="Enter here"
            pristine={this.state.validation.max.pristine}
            title={MAX}
            type="number"
            valid={this.state.validation.max.valid}
            value={this.state.max}
          />
          <div onClick={e => this.addWhitelistItem()} className="sw-ButtonPlus" />
        </div>
        {whitelist ? <WhitelistTable list={whitelist} crowdsaleNum={num} /> : null}

        {/* Actions */}
        <div className="sw-WhitelistInputBlock_Controls">
          {whitelistEmpty ? null : (
            <ButtonCSV extraClassName="sw-ButtonCSV-clearall" onClick={this.clearAll} text="Clear All" />
          )}
          <Dropzone onDrop={this.onDrop} accept=".csv" style={dropzoneStyle}>
            <ButtonCSV extraClassName="sw-ButtonCSV-uploadcsv" text="Upload CSV" type="button" />
          </Dropzone>
          <ButtonCSV
            extraClassName="sw-ButtonCSV-downloadcsv m-r-0"
            onClick={this.downloadCSV}
            text="Download CSV template"
          />
        </div>
      </div>
    )
  }
}
