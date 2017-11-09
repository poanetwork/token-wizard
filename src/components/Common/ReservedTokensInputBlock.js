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
        console.log(addr, dim, val);
        if (!addr || !dim || !val) return;

        this.clearReservedTokenInputs()

        let isAdded = false;
        for (let i = 0; i < this.state.token.reservedTokens.length; i++) {
            let item = this.state.token.reservedTokens[i];
            if (item.addr === addr && item.dim === dim && !item.deleted) {
                isAdded = true;
                break;
            }
        }

        if (isAdded) return;

        let state = this.state
        let num = state.token.reservedTokensElements.length;
        state.token.reservedTokens.push({
            addr,
            dim,
            val
        });
        this.setState(state, function() {
            state.token.reservedTokensElements.push(
                <ReservedTokensItem
                    key={num.toString()}
                    num={num}
                    addr={addr}
                    dim={dim}
                    val={val}>
                </ReservedTokensItem>
            );
            this.setState(state);
        });
    }

    clearReservedTokenInputs = () => {
        let state = this.state
        state.token.reservedTokensInput.addr = ""
        state.token.reservedTokensInput.val = ""
        this.setState(state)
        this.reservedTokensInputAddr.clearVal()
        this.reservedTokensInputVal.clearVal()
    }

    render() {
        let { token } = this.state
        let { onChange } = this.props
        return (
            <div className="reserved-tokens-container">
                <div className="reserved-tokens-input-container">
                    <div className="reserved-tokens-input-container-inner">
                      <InputField
                        ref={reservedTokensInputAddr => this.reservedTokensInputAddr = reservedTokensInputAddr}
                        side='reserved-tokens-input-property reserved-tokens-input-property-left'
                        type='text'
                        title={ADDRESS}
                        value={token.reservedTokensInput.addr}
                        onChange={(e) => onChange(e, 'token', 0, 'reservedtokens_addr')}
                        description={`Address where to send reserved tokens.`}
                      />
                      <RadioInputField
                        side='reserved-tokens-input-property reserved-tokens-input-property-middle'
                        title={DIMENSION}
                        items={["tokens", "percentage"]}
                        vals={["tokens", "percentage"]}
                        defaultValue={token.reservedTokensInput.dim}
                        name={'reserved-tokens-dim'}
                        onChange={(e) => onChange(e, 'token', 0, 'reservedtokens_dim')}
                        description={`Fixed amount or % of crowdsaled tokens. Will be deposited to the account after fintalization of the crowdsale. `}
                      />
                      <InputField
                        ref={reservedTokensInputVal => this.reservedTokensInputVal = reservedTokensInputVal}
                        side='reserved-tokens-input-property reserved-tokens-input-property-right'
                        type='number'
                        title={VALUE}
                        value={token.reservedTokensInput.val}
                        onChange={(e) => onChange(e, 'token', 0, 'reservedtokens_val')}
                        description={`Value in tokens or percents. Don't forget to press + button for each reserved token.`}
                      />
                    </div>
                    <div className="plus-button-container">
                        <div onClick={(e) => this.addReservedTokensItem(token.reservedTokensInput.addr, token.reservedTokensInput.dim, token.reservedTokensInput.val)} className="button button_fill button_fill_plus">
                        </div>
                    </div>
                </div>
                {token.reservedTokensElements}
            </div>)
    }
}
