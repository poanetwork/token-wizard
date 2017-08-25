import React from 'react'
import '../../assets/stylesheets/application.css';
import { InputField } from './InputField'
import { TEXT_FIELDS } from '../../utils/constants'
const { ADDRESS, MIN, MAX } = TEXT_FIELDS

export const WhitelistBlock = ({num, addr, min, max, onChange}) => {
	return <div className="white-list-item-container">
              <InputField 
                side='white-list-item-property-left' 
                type='text' 
                title={ADDRESS} 
                value={addr} 
                onChange={(e) => onChange(e, 'crowdsale', num, 'whitelist_addr')}/>
              <InputField 
                side='white-list-item-property-middle' 
                type='number' 
                title={MIN} 
                value={min} 
                onChange={(e) => onChange(e, 'crowdsale', num, 'whitelist_min')}/>
              <InputField 
                side='white-list-item-property-right'
                type='number' 
                title={MAX} 
                value={max} 
                onChange={(e) => onChange(e, 'crowdsale', num, 'whitelist_max')}/>
            </div>
}