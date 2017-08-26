import React from 'react'
import '../../assets/stylesheets/application.css';
import { WhitelistInputBlock } from './WhitelistInputBlock'

import { InputField } from './InputField'

import { defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS } from '../../utils/constants'
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME } = TEXT_FIELDS

export const CrowdsaleBlock = ({num, state, onChange}) => {
	const { validations } = state
  console.log('333 validations', validations)
  state.crowdsale[num].tier = "Tier " + (num + 1)
	return <div style={{"marginTop": "40px"}} className="steps-content container">
            <div className="hidden">
              <InputField 
                side='left' 
                type='text' 
                title={CROWDSALE_SETUP_NAME} 
                value={state.crowdsale[num].tier}
                onChange={(e) => onChange(e, 'crowdsale', num, 'tier')}/>
              <InputField 
                side='right' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={state.crowdsale[num].walletAddress} 
                valid={validations.walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS} 
                onChange={(e) => onChange(e, 'crowdsale', num, 'walletAddress')}/>
              <InputField 
                side='left' 
                type='datetime-local' 
                title={START_TIME} 
                value={state.crowdsale[num].startTime} 
                valid={validations.startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onChange={(e) => onChange(e, 'crowdsale', num, 'startTime')}/>
              <InputField 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={state.crowdsale[num].endTime} 
                valid={validations.endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onChange={(e) => onChange(e, 'crowdsale', num, 'endTime')}/>
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={state.crowdsale[num].supply} 
                valid={validations.supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY} 
                onChange={(e) => onChange(e, 'crowdsale', num, 'supply')}/>
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={state.pricingStrategy[num].rate} 
                valid={validations.rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onChange={(e) => onChange(e, 'pricingStrategy', num, 'rate')}/>
            </div>
            <div className="white-list-title">
              <p className="title">Whitelist</p>
            </div>
            <WhitelistInputBlock
              num = {num}
              onChange={(e, cntrct, num, prop) => onChange(e, cntrct, num, prop)}
            ></WhitelistInputBlock>
          </div>
}