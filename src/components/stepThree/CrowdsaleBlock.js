import React from 'react'
import '../../assets/stylesheets/application.css'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { defaultCompanyStartDate, defaultCompanyEndDate } from './utils'
import { InputField } from '../Common/InputField'
import { RadioInputField } from '../Common/RadioInputField'
import { inject, observer } from 'mobx-react'
import { VALIDATION_TYPES, VALIDATION_MESSAGES, TEXT_FIELDS, DESCRIPTION } from '../../utils/constants'
import { BigNumberInput } from '../Common/BigNumberInput'
import update from 'immutability-helper'

const { START_TIME, END_TIME, RATE, SUPPLY, CROWDSALE_SETUP_NAME, ALLOWMODIFYING } = TEXT_FIELDS
const { EMPTY, INVALID } = VALIDATION_TYPES

@inject('tierStore')
@observer
export class CrowdsaleBlock extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      rate: '',
      validation: {
        rate: {
          pristine: true,
          valid: INVALID
        }
      }
    }
  }

  componentWillMount () {
    const { tierStore, num } = this.props
    const startTime = 0 === num ? defaultCompanyStartDate() : this.tierEndTime(num - 1)
    const endTime = 0 === num ? defaultCompanyEndDate(startTime) : defaultCompanyEndDate(this.tierEndTime(num - 1))

    tierStore.setTierProperty(startTime, 'startTime', num)
    tierStore.setTierProperty(endTime, 'endTime', num)
  }

  tierEndTime = (index) => this.props.tierStore.tiers[index].endTime

  updateTierStore = (value, property) => {
    const { num, tierStore } = this.props

    tierStore.setTierProperty(value, property, num)
    tierStore.validateTiers(property, num)
  }

  updateRate = ({ value, pristine, valid }) => {
    const { num, tierStore } = this.props

    const newState = update(this.state, {
      validation: {
        rate: {
          $set: {
            pristine,
            valid
          }
        }
      }
    })
    newState.rate = value

    this.setState(newState)
    tierStore.updateRate(value, valid, num)
  }

  render () {
    const { num, tierStore } = this.props
    const whitelistInputBlock = (
      <div>
        <div className="section-title">
          <p className="title">Whitelist</p>
        </div>
        <WhitelistInputBlock num={num}/>
      </div>
    )

    return (
      <div style={{ marginTop: '40px' }} className="steps-content container">
        <div className="hidden">
          <div className="input-block-container">
            <InputField
              side="left"
              type="text"
              title={CROWDSALE_SETUP_NAME}
              value={tierStore.tiers[num].tier}
              valid={tierStore.validTiers[num].tier}
              errorMessage={VALIDATION_MESSAGES.TIER}
              onChange={e => this.updateTierStore(e.target.value, 'tier')}
              description={DESCRIPTION.CROWDSALE_SETUP_NAME}
            />
            <RadioInputField
              extraClassName="right"
              title={ALLOWMODIFYING}
              items={[{ label: 'on', value: 'on' }, { label: 'off', value: 'off' }]}
              selectedItem={this.props.tierStore.tiers[this.props.num].updatable}
              onChange={e => this.updateTierStore(e.target.value, 'updatable')}
              description={DESCRIPTION.ALLOW_MODIFYING}
            />
          </div>
          <div className="input-block-container">
            <InputField
              side="left"
              type="datetime-local"
              title={START_TIME}
              value={tierStore.tiers[num].startTime}
              valid={tierStore.validTiers[num].startTime}
              errorMessage={VALIDATION_MESSAGES.MULTIPLE_TIERS_START_TIME}
              onChange={e => this.updateTierStore(e.target.value, 'startTime')}
              description={DESCRIPTION.START_TIME}
            />
            <InputField
              side="right"
              type="datetime-local"
              title={END_TIME}
              value={tierStore.tiers[num].endTime}
              valid={tierStore.validTiers[num].endTime}
              errorMessage={VALIDATION_MESSAGES.END_TIME}
              onChange={e => this.updateTierStore(e.target.value, 'endTime')}
              description={DESCRIPTION.END_TIME}
            />
          </div>
          <div className="input-block-container">
            <BigNumberInput
              side="left"
              title={RATE}
              min={1}
              max={1e18}
              value={this.state.rate}
              valid={this.state.validation.rate.valid}
              pristine={tierStore.validTiers[num].rate === EMPTY}
              errorMessage={VALIDATION_MESSAGES.RATE}
              onChange={this.updateRate}
              description={DESCRIPTION.RATE}
            />
            <InputField
              side="right"
              type="number"
              title={SUPPLY}
              value={tierStore.tiers[num].supply}
              valid={tierStore.validTiers[num].supply}
              errorMessage={VALIDATION_MESSAGES.SUPPLY}
              onChange={e => this.updateTierStore(e.target.value, 'supply')}
              description={DESCRIPTION.SUPPLY}
            />
          </div>
        </div>
        {tierStore.tiers[0].whitelistEnabled === 'yes' ? whitelistInputBlock : ''}
      </div>
    )
  }
}
