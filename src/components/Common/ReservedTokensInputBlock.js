import React from 'react'
import '../../assets/stylesheets/application.css';
import { InputField } from './InputField'
import { RadioInputField } from './RadioInputField'
import { TEXT_FIELDS, defaultState, initialStepTwoValues, intitialStepTwoValidations } from '../../utils/constants'
import { ReservedTokensItem } from './ReservedTokensItem'
import { getOldState } from '../../utils/utils'
const { ADDRESS, DIMENSION, VALUE } = TEXT_FIELDS

export class ReservedTokensInputBlock extends React.Component {

    constructor(props) {
        super(props);
        //props.onChange.bind(this);
        //let oldState = getOldState(props, defaultState)
        //this.state = Object.assign({}, oldState)

        let oldState = getOldState(props, defaultState)
        console.log('oldState', oldState)
        this.state = Object.assign({}, defaultState, oldState, initialStepTwoValues, intitialStepTwoValidations )
    }

    addReservedTokensItem = (addr, dim, val, token) => {
        console.log(token);
        console.log(addr, dim, val);
        if (!addr || !dim || !val) return;

        let isAdded = false;
        for (let i = 0; i < this.state.token.reservedTokens.length; i++) {
            let addedAddr = this.state.token.reservedTokens[i].addr;
            if (addedAddr === addr) {
                isAdded = true;
                break;
            }
        }

        if (isAdded) return;

        let state = this.state
        let num = state.token.reservedTokensElements.length;
        state.token.reservedTokensElements.push(
            <ReservedTokensItem 
                num={num}
                addr={addr}
                dim={dim}
                val={val}>
            </ReservedTokensItem>);
        state.token.reservedTokens.push({
            addr,
            dim,
            val
        });
        this.setState(state);
    }

    render() {
        let { token } = this.state
        let { onChange } = this.props
        return (
            <div className="reserved-tokens-container">
              <div className="reserved-tokens-input-container">
                  <InputField 
                    side='reserved-tokens-input-property-left' 
                    type='text' 
                    title={ADDRESS} 
                    onChange={(e) => onChange(e, 'token', 0, 'reservedtokens_addr')}/>
                  <RadioInputField 
                    side='reserved-tokens-input-property-middle' 
                    title={DIMENSION} 
                    items={["tokens", "percentage"]}
                    vals={["tokens", "percentage"]}
                    state={this.state}
                    target={this.state.token.reservedTokensInput.dim}
                    onChange={(e) => onChange(e, 'token', 0, 'reservedtokens_dim')}/>
                  <InputField 
                    side='reserved-tokens-input-property-right'
                    type='number' 
                    title={VALUE} 
                    value={token.reservedTokensInput.val}
                    onChange={(e) => onChange(e, 'token', 0, 'reservedtokens_val')}/>
              <div className="plus-button-container"><div onClick={(e) => this.addReservedTokensItem(token.reservedTokensInput.addr, token.reservedTokensInput.dim, token.reservedTokensInput.val, token)} className="button button_fill button_fill_plus"></div></div>
            </div>
            {token.reservedTokensElements}
            </div>)
    }
}