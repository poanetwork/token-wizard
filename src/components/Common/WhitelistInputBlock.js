import React from 'react'
import '../../assets/stylesheets/application.css';
import { InputField } from './InputField'
import { TEXT_FIELDS, defaultState } from '../../utils/constants'
import { WhitelistItem } from './WhitelistItem'
import { getOldState } from '../../utils/utils'
import { inject, observer } from 'mobx-react'
const { ADDRESS, MIN, MAX } = TEXT_FIELDS

@inject('tierStore')
@observer
export class WhitelistInputBlock extends React.Component {
  constructor (props) {
    super(props)
    let oldState = getOldState(props, defaultState)
    this.state = Object.assign({}, oldState)
  }

  addWhitelistItem = () => {
    const { tierStore } = this.props
    const crowdsaleNum = this.props.num
    const tier = tierStore.tiers[crowdsaleNum]
    const { addr, min, max } = tier.whitelistInput

    if (!addr || !min || !max) return

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
    this.props.tierStore.setTierProperty({}, 'whitelistInput', this.props.num)
    this.whiteListInputAddr.clearVal()
    this.whiteListInputMin.clearVal()
    this.whiteListInputMax.clearVal()
  }

  render () {
    const { num } = this.props
    const { whitelistInput, whitelistElements } = this.props.tierStore.tiers[num]

    return (
      <div className="white-list-container">
        <div className="white-list-input-container">
          <div className="white-list-input-container-inner">
            <InputField
              ref={whiteListInputAddr => this.whiteListInputAddr = whiteListInputAddr}
              side='white-list-input-property white-list-input-property-left'
              type='text'
              title={ADDRESS}
              value={whitelistInput && whitelistInput.addr}
              onChange={e => this.props.onChange(e, 'crowdsale', num, 'whitelist_addr')}
              description={`Address of a whitelisted account. Whitelists are inherited. E.g., if an account whitelisted on Tier 1 and didn't buy max cap on Tier 1, he can buy on Tier 2, and following tiers.`}
            />
            <InputField
              ref={whiteListInputMin => this.whiteListInputMin = whiteListInputMin}
              side='white-list-input-property white-list-input-property-middle'
              type='number'
              title={MIN}
              value={whitelistInput && whitelistInput.min}
              onChange={e => this.props.onChange(e, 'crowdsale', num, 'whitelist_min')}
              description={`Minimum amount tokens to buy. Not a minimal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
            />
            <InputField
              ref={whiteListInputMax => this.whiteListInputMax = whiteListInputMax}
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
          />
        )}
      </div>
    )
  }
}
