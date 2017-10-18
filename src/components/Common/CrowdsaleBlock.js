import React from 'react'
import '../../assets/stylesheets/application.css';
import { WhitelistInputBlock } from './WhitelistInputBlock'
import { defaultCompanyEndDate } from '../../utils/utils'
import { InputField } from './InputField'
import { RadioInputField } from './RadioInputField'
import { inject, observer } from 'mobx-react'
import { VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS } from '../../utils/constants'
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, RATE, SUPPLY, CROWDSALE_SETUP_NAME, ALLOWMODIFYING } = TEXT_FIELDS

//behaves like normal tier block
 // accesses data from tierstore
 //remove all this
 //pass down onChange function
@inject ('tierStore')
@observer export class CrowdsaleBlock extends React.Component {
  constructor(props) {
    super(props);
    props.tierStore.setTierProperty("Tier " + props.num, 'name', props.num)
    props.tierStore.setTierProperty( "off", 'updatable', props.num)
    props.tierStore.setTierProperty( "yes", 'whitelistdisabled', 0)
  }

  componentDidMount() {
    const { tierStore, num } = this.props
    const startTime = tierStore.tiers[num - 1].endTime
    const endTime = defaultCompanyEndDate(tierStore.tiers[num-1].startTime)
    tierStore.setTierProperty(startTime, 'startTime', num)
    tierStore.setTierProperty(endTime, 'endTime', num)
  }

  updateTierStore = (event, property) => {
    const { tierStore, num } = this.props
    const value = event.target.value;
    tierStore.setTierProperty(value, property, num);
    tierStore.validateTiers(property, num)
  }

	render() {
    let { num, onChange, tierStore } = this.props
    let whitelistInputBlock = <div>
      <div className="section-title">
          <p className="title">Whitelist</p>
        </div>
        <WhitelistInputBlock
          num = {num}
          onChange={(e, prop) => onChange(e, prop)}
        ></WhitelistInputBlock>
    </div>
    return (<div key={num.toString()} style={{"marginTop": "40px"}} className="steps-content container">
        <div className="hidden">
          <div className='input-block-container'>
          <InputField 
            side='left' 
            type='text' 
            title={CROWDSALE_SETUP_NAME} 
            value={tierStore.tiers[num].tier}
            valid={tierStore.validTiers[num].tier} 
            errorMessage={VALIDATION_MESSAGES.TIER} 
            onChange={(e) => this.updateTierStore(e, 'name')}
            description={`Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We simplified that and will increment a number after each tier.`}
          />
          <InputField 
            side='right' 
            type='number' 
            title={RATE} 
            value={tierStore.tiers[num].rate} 
            valid={tierStore.validTiers[num].rate} 
            errorMessage={VALIDATION_MESSAGES.RATE} 
            onChange={(e) => this.updateTierStore(e,'rate')}
            description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
          />
          </div>
          <div className='input-block-container'>
          <InputField 
            side='left' 
            type='datetime-local' 
            title={START_TIME} 
            value={tierStore.tiers[num].startTimeTemp} 
            valid={tierStore.validTiers[num].startTime} 
            errorMessage={VALIDATION_MESSAGES.START_TIME} 
            defaultValue={tierStore.tiers[num - 1].startTime}
            onChange={(e) => this.updateTierStore(e, 'startTime')}
            description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
          />
          <InputField 
            side='right' 
            type='datetime-local' 
            title={END_TIME} 
            value={tierStore.tiers[num].endTimeTemp} 
            valid={tierStore.validTiers[num].endTime} 
            errorMessage={VALIDATION_MESSAGES.END_TIME} 
            defaultValue={defaultCompanyEndDate(tierStore.tiers[num-1].endTime)}
            onChange={(e) => this.updateTierStore(e, 'endTime')}
            description={`Date and time when the tier ends. Can be only in the future.`}
          />
          </div>
          <div className='input-block-container'>
          <InputField 
            side='left' 
            type='number' 
            title={SUPPLY} 
            value={tierStore.tiers[num].supply} 
            valid={tierStore.validTiers[num].supply} 
            errorMessage={VALIDATION_MESSAGES.SUPPLY}
            onChange={(e) => this.updateTierStore(e, 'supply')}
            description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
          />
          <RadioInputField 
            side='right' 
            title={ALLOWMODIFYING}
            items={["on", "off"]}
            vals={["on", "off"]}
            num={num}
            defaultValue={this.props.tierStore.tiers[num].updatable}
            name={'crowdsale-updatable-' + num}
            onChange={(e) => this.updateTierStore(e, 'updatable')}
            description={`Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`}
          />
          </div>
        </div>
        {tierStore.tiers[0].whitelistdisabled === "yes"?"":whitelistInputBlock}
      </div>)
  }
}