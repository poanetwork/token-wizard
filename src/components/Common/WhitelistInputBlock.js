import React from 'react'
import Web3 from 'web3';
import update from 'immutability-helper';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse'
import '../../assets/stylesheets/application.css';
import { InputField } from './InputField'
import { TEXT_FIELDS, VALIDATION_TYPES } from '../../utils/constants'
import { WhitelistItem } from './WhitelistItem'
import { inject, observer } from 'mobx-react'
import { whitelistImported } from '../../utils/alerts'
import processWhitelist from '../../utils/processWhitelist'
const { ADDRESS, MIN, MAX } = TEXT_FIELDS
const {VALID, INVALID} = VALIDATION_TYPES;

@inject('tierStore')
@observer
export class WhitelistInputBlock extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      addr: '',
      min: '',
      max: '',
      validation: {
        address: {
          pristine: true,
          valid: INVALID
        }
      }
    }
  }

  addWhitelistItem = () => {
    const { tierStore } = this.props
    const crowdsaleNum = this.props.num
    const { addr, min, max } = this.state

    this.setState(update(this.state, {
      validation: {
        address: {
          pristine: { $set: false }
        }
      }
    }))

    if (!addr || !min || !max ||  this.state.validation.address.valid === INVALID) {
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
        }
      }
    })

    tierStore.addWhitelistItem({ addr, min, max }, crowdsaleNum)
  }

  handleAddressChange = address => {
    const isAddressValid = Web3.utils.isAddress(address) ? VALID : INVALID;

    const newState = update(this.state, {
      addr: { $set: address },
      validation: {
        address: {
          $set: {
            pristine: false,
            valid: isAddressValid
          },
        },
      },
    });

    this.setState(newState)
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: results => {
          const { called } = processWhitelist(results.data, item => {
            this.props.tierStore.addWhitelistItem(item, this.props.num)
          })

          whitelistImported(called)
        }
      })
    })
  }


  render () {
    const { num, tierStore } = this.props
    const { whitelist } = tierStore.tiers[num]

    const dropzoneStyle = {
      position: 'relative',
      cursor: 'pointer',
      textAlign: 'right'
    }

    return (
      <div className="white-list-container">
        <div className="white-list-input-container">
          <div className="white-list-input-container-inner">
            <InputField
              side='white-list-input-property white-list-input-property-left'
              type='text'
              title={ADDRESS}
              value={this.state.addr}
              onChange={e => this.handleAddressChange(e.target.value)}
              description={`Address of a whitelisted account. Whitelists are inherited. E.g., if an account whitelisted on Tier 1 and didn't buy max cap on Tier 1, he can buy on Tier 2, and following tiers.`}
              pristine={this.state.validation.address.pristine}
              valid={this.state.validation.address.valid}
              errorMessage="The inserted address is invalid"
            />
            <InputField
              side='white-list-input-property white-list-input-property-middle'
              type='number'
              title={MIN}
              value={this.state.min}
              onChange={e => this.setState({ min: e.target.value })}
              description={`Minimum amount tokens to buy. Not a minimal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
            />
            <InputField
              side='white-list-input-property white-list-input-property-right'
              type='number'
              title={MAX}
              value={this.state.max}
              onChange={e => this.setState({ max: e.target.value })}
              description={`Maximum is the hard limit.`}
            />
          </div>
          <div className="plus-button-container">
            <div
              onClick={e => this.addWhitelistItem()}
              className="button button_fill button_fill_plus"
            />
          </div>
        </div>
        {whitelist && whitelist.map((item, index) =>
          <WhitelistItem
            key={`${num}-${item.addr}-${item.stored ? 0 : 1}`}
            crowdsaleNum={num}
            whitelistNum={index}
            {...item}
          />
        )}
        <Dropzone
          onDrop={this.onDrop}
          accept=".csv"
          style={dropzoneStyle}
        >
          <i className="fa fa-upload" title="Upload CSV"></i>&nbsp;
          Upload CSV
        </Dropzone>

      </div>
    )
  }
}
