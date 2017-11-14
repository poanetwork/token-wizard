import React from 'react'
import '../../assets/stylesheets/application.css';
import { WhitelistInputBlock } from './WhitelistInputBlock'
import { defaultCompanyEndDate } from '../../utils/utils'
import InputField from './InputField'
import { RadioInputField } from './RadioInputField'
import { VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS } from '../../utils/constants'
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, RATE, SUPPLY, CROWDSALE_SETUP_NAME, ALLOWMODIFYING } = TEXT_FIELDS

export class CrowdsaleBlock extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let newState = this.props.state
    newState.crowdsale[this.props.num].startTime = newState.crowdsale[this.props.num - 1].endTime;
    newState.crowdsale[this.props.num].endTime = defaultCompanyEndDate(newState.crowdsale[this.props.num].startTime);
  }

	render() {
    const { validations } = this.props.state
    let { crowdsale } = this.props.state
    let { pricingStrategy } = this.props.state
    let { num } = this.props
    let { onChange } = this.props
    let { handleInputBlur } = this.props
    let whitelistInputBlock = <div>
      <div className="section-title">
          <p className="title">Whitelist</p>
        </div>
        <WhitelistInputBlock
          num = {num}
          onChange={(e, cntrct, num, prop) => onChange(e, cntrct, num, prop)}
        ></WhitelistInputBlock>
    </div>
    return (<div key={num.toString()} style={{"marginTop": "40px"}} className="steps-content container">
        <div className="hidden">
          <div className='input-block-container'>
          <InputField
            side='left'
            type='text'
            title={CROWDSALE_SETUP_NAME}
            value={crowdsale[num].tier}
            valid={validations[num].tier}
            errorMessage={VALIDATION_MESSAGES.TIER}
            onBlur={() => handleInputBlur('crowdsale', 'tier', num)}
            onChange={(e) => onChange(e, 'crowdsale', num, 'tier')}
            description={`Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We simplified that and will increment a number after each tier.`}
          />
          <InputField
            side='right'
            type='number'
            title={RATE}
            value={pricingStrategy[num].rate}
            valid={validations[num].rate}
            errorMessage={VALIDATION_MESSAGES.RATE}
            onBlur={() => handleInputBlur('pricingStrategy', 'rate', num)}
            onChange={(e) => onChange(e, 'pricingStrategy', num, 'rate')}
            description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
          />
          </div>
          <div className='input-block-container'>
          <InputField
            side='left'
            type='datetime-local'
            title={START_TIME}
            value={crowdsale[num].startTimeTemp}
            valid={validations[num].startTime}
            errorMessage={VALIDATION_MESSAGES.START_TIME}
            onBlur={() => handleInputBlur('crowdsale', 'startTime', num)}
            defaultValue={this.props.state.crowdsale[this.props.num - 1].endTime}
            onChange={(e) => onChange(e, 'crowdsale', num, 'startTime')}
            description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
          />
          <InputField
            side='right'
            type='datetime-local'
            title={END_TIME}
            value={crowdsale[num].endTimeTemp}
            valid={validations[num].endTime}
            errorMessage={VALIDATION_MESSAGES.END_TIME}
            onBlur={() => handleInputBlur('crowdsale', 'endTime', num)}
            defaultValue={defaultCompanyEndDate(this.props.state.crowdsale[this.props.num - 1].endTime)}
            onChange={(e) => onChange(e, 'crowdsale', num, 'endTime')}
            description={`Date and time when the tier ends. Can be only in the future.`}
          />
          </div>
          <div className='input-block-container'>
          <InputField
            side='left'
            type='number'
            title={SUPPLY}
            value={crowdsale[num].supply}
            valid={validations[num].supply}
            errorMessage={VALIDATION_MESSAGES.SUPPLY}
            onBlur={() => handleInputBlur('crowdsale', 'supply', num)}
            onChange={(e) => onChange(e, 'crowdsale', num, 'supply')}
            description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
          />
          <RadioInputField
            side='right'
            title={ALLOWMODIFYING}
            items={["on", "off"]}
            vals={["on", "off"]}
            state={this.props.state}
            num={num}
            defaultValue={this.props.state.crowdsale[num].updatable}
            name={'crowdsale-updatable-' + num}
            onChange={(e) => onChange(e, 'crowdsale', num, 'updatable')}
            description={`Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`}
          />
          </div>
        </div>
        {this.props.state.crowdsale[0].whitelistdisabled === "yes"?"":whitelistInputBlock}
      </div>)
  }
}
