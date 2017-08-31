import React from 'react'
import '../../assets/stylesheets/application.css';
import { InputField } from './InputField'
import { RadioInputField } from './RadioInputField'
import { TEXT_FIELDS, defaultState } from '../../utils/constants'
import { ReservedTokensItem } from './ReservedTokensItem'
import { getOldState } from '../../utils/utils'
const { ADDRESS, DIMENSION, VALUE } = TEXT_FIELDS

export class ReservedTokensInputBlock extends React.Component {

    constructor(props) {
        super(props);
        let oldState = getOldState(props, defaultState)
        this.state = Object.assign({}, oldState)
    }

    addReservedTokensItem = (addr, dim, val) => {
        if (!addr || !dim || !val) return;

        let isAdded = false;
        for (let i = 0; i < this.state.crowdsale[this.props.num].reservedTokens.length; i++) {
            let addedAddr = this.state.crowdsale[this.props.num].reservedTokens[i].addr;
            if (addedAddr === addr) {
                isAdded = true;
                break;
            }
        }

        if (isAdded) return;

        let state = this.state
        state.crowdsale[this.props.num].reservedTokensElements.push(<ReservedTokensItem 
                addr={addr}
                dim={dim}
                val={val}></ReservedTokensItem>);
        state.crowdsale[this.props.num].reservedTokens.push({
            addr,
            dim,
            val
        });
        this.setState(state);
    }

    render() {
        let { crowdsale } = this.state
        const { num } = this.props
        return (<div className="reserved-tokens-container"><div className="reserved-tokens-input-container">
              <InputField 
                side='reserved-tokens-input-property-left' 
                type='text' 
                title={ADDRESS} 
                value={crowdsale[num].reservedTokensInput.addr} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'reservedtokens_addr')}/>
              <RadioInputField 
                side='reserved-tokens-input-property-middle' 
                type='number' 
                title={DIMENSION} 
                value={crowdsale[num].reservedTokensInput.dim} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'reservedtokens_dim')}/>
              <InputField 
                side='reserved-tokens-input-property-right'
                type='number' 
                title={VALUE} 
                value={crowdsale[num].reservedTokensInput.val} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'reservedtokens_val')}/>
              <div className="plus-button-container"><div onClick={(e) => this.addReservedTokensItem(crowdsale[num].reservedTokensInput.addr, crowdsale[num].reservedTokensInput.dim, crowdsale[num].reservedTokensInput.val)} className="button button_fill button_fill_plus"></div></div>
            </div>
            {crowdsale[num].reservedTokensElements}
            </div>)
    }
}