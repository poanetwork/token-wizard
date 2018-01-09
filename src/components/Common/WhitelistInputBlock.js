import React from 'react'
import Web3 from 'web3';
import update from 'immutability-helper';
import '../../assets/stylesheets/application.css';
import { InputField } from './InputField'
import { TEXT_FIELDS, defaultState, VALIDATION_TYPES } from '../../utils/constants'
import { WhitelistItem } from './WhitelistItem'
import { getOldState } from '../../utils/utils'
import { inject, observer } from 'mobx-react'
const { ADDRESS, MIN, MAX } = TEXT_FIELDS
const {VALID, INVALID} = VALIDATION_TYPES;

@inject('tierStore')
@observer
export class WhitelistInputBlock extends React.Component {
  constructor (props) {
    super(props)
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState, {
      validation: {
        address: {
          pristine: true,
          valid: INVALID
        }
      }
    })
  }

  addWhitelistItem = () => {
    const { tierStore } = this.props
    const crowdsaleNum = this.props.num
    const tier = tierStore.tiers[crowdsaleNum]
    const { addr, min, max } = tier.whitelistInput

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

    this.setState(update(this.state, {
      validation: {
        address: {
          $set: {
            pristine: true,
            valid: INVALID
          }
        }
      }
    }))

    this.clearWhiteListInputs()

    const whitelist = tier.whitelist.slice()

    const isAdded = whitelist.find(item => item.addr === addr && !item.deleted)

    if (isAdded) return

    const whitelistElements = tier.whitelistElements.slice()
    const whitelistNum = whitelistElements.length

    whitelistElements.push({ addr, min, max, whitelistNum, crowdsaleNum })
    whitelist.push({ addr, min, max })

    tierStore.setTierProperty(whitelistElements, 'whitelistElements', crowdsaleNum)
    tierStore.setTierProperty(whitelist, 'whitelist', crowdsaleNum)
  }

  clearWhiteListInputs = () => {
    const whitelistInput = {
      addr: '',
      min: '',
      max: ''
    }
    this.props.tierStore.setTierProperty(whitelistInput, 'whitelistInput', this.props.num)
  }

  handleAddressChange = e => {
    this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_addr')

    const address = e.target.value
    const isAddressValid = Web3.utils.isAddress(address) ? VALID : INVALID;

    const newState = update(this.state, {
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

  render () {
    const { num } = this.props
    const { whitelistInput, whitelistElements } = this.props.tierStore.tiers[num]

    return (
      <div className="white-list-container">
        <div className="white-list-input-container">
          <div className="white-list-input-container-inner">
            <InputField
              side='white-list-input-property white-list-input-property-left'
              type='text'
              title={ADDRESS}
              value={whitelistInput && whitelistInput.addr}
              onChange={e => this.handleAddressChange(e)}
              description={`Address of a whitelisted account. Whitelists are inherited. E.g., if an account whitelisted on Tier 1 and didn't buy max cap on Tier 1, he can buy on Tier 2, and following tiers.`}
              pristine={this.state.validation.address.pristine}
              valid={this.state.validation.address.valid}
              errorMessage="The inserted address is invalid"
            />
            <InputField
              side='white-list-input-property white-list-input-property-middle'
              type='number'
              title={MIN}
              value={whitelistInput && whitelistInput.min}
              onChange={e => this.props.onChange(e, 'crowdsale', num, 'whitelist_min')}
              description={`Minimum amount tokens to buy. Not a minimal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
            />
            <InputField
              side='white-list-input-property white-list-input-property-right'
              type='number'
              title={MAX}
              value={whitelistInput && whitelistInput.max}
              onChange={e => this.props.onChange(e, 'crowdsale', num, 'whitelist_max')}
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
        {whitelistElements && whitelistElements.map(e =>
          <WhitelistItem
            key={e.whitelistNum.toString()}
            crowdsaleNum={e.crowdsaleNum}
            whitelistNum={e.whitelistNum}
            addr={e.addr}
            min={e.min}
            max={e.max}
            alreadyDeployed={e.alreadyDeployed}
          />
        )}
      </div>
    )
  }
}
