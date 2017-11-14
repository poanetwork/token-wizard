import React from 'react'
import Web3 from 'web3'
import '../../assets/stylesheets/application.css';
import InputField from './InputField'
import { RadioInputField } from './RadioInputField'
import { TEXT_FIELDS, defaultState, VALIDATION_TYPES } from '../../utils/constants'
import ReservedTokensItem from './ReservedTokensItem'
import { getOldState } from '../../utils/utils'
import update from 'immutability-helper'

const { ADDRESS, DIMENSION, VALUE } = TEXT_FIELDS
const {INVALID, VALID} = VALIDATION_TYPES;

export class ReservedTokensInputBlock extends React.Component {

    constructor(props) {
        super(props);

        let oldState = getOldState(props, defaultState)
        this.state = Object.assign({}, oldState, {
            validation: {
                address: {
                    valid: INVALID,
                    pristine: true
                }
            }
        })
    }

    addReservedTokensItem = (addr, dim, val) => {
        if (this.state.validation.address.valid === INVALID) {
            this.setState(update(this.state, {
                validation: {
                    address: {
                        pristine: { $set: false }
                    }
                }
            }))
            return;
        }

        if (!dim || !val) {
            return
        }

        let state = update(this.state, {
            token: {
                reservedTokensInput: {
                    $merge: {
                        addr: '',
                        val: ''
                    }
                }
            }
        })

        let isAdded = false;
        for (let i = 0; i < this.state.token.reservedTokens.length; i++) {
            let item = this.state.token.reservedTokens[i];
            if (item.addr === addr && item.dim === dim && !item.deleted) {
                isAdded = true;
                break;
            }
        }

        if (isAdded) return;

        state = update(state, {
            token: {
                reservedTokens: {
                    $push: [{
                        addr,
                        dim,
                        val
                    }]
                }
            }
        })

        this.props.onTokensChange(state.token.reservedTokens)
        this.setState(state);
    }

    handleReservedTokensInputAddrChange = (e) => {
        this.props.onChange(e, 'token', 0, 'reservedtokens_addr')

        const address = e.target.value
        const validAddress = Web3.utils.isAddress(address) ?  VALID : INVALID

        this.setState(update(this.state, {
            validation: {
                address: {
                    $set: {
                        valid: validAddress,
                        pristine: false
                    }
                }
            },
            token: {
                reservedTokensInput: {
                    addr: {
                        $set: address
                    }
                }
            }
        }))
    }

    handleReservedTokensInputDimChange = (e) => {
        this.props.onChange(e, 'token', 0, 'reservedtokens_dim')
        this.setState(update(this.state, {
            token: {
                reservedTokensInput: {
                    dim: {
                        $set: e.target.value
                    }
                }
            }
        }))
    }

    handleReservedTokensInputValChange = (e) => {
        this.props.onChange(e, 'token', 0, 'reservedtokens_val')
        this.setState(update(this.state, {
            token: {
                reservedTokensInput: {
                    val: {
                        $set: e.target.value
                    }
                }
            }
        }))
    }

    removeToken(index) {
        const newState = update(this.state, {
            token: {
                reservedTokens: {
                    $splice: [[index, 1]]
                }
            }
        })

        this.props.onTokensChange(newState.token.reservedTokens)
        this.setState(newState)
    }

    render() {
        let { token } = this.state

        const reservedTokensElements = this.state.token.reservedTokens
            .map((token, index) => {
                return (
                    <ReservedTokensItem
                        key={index.toString()}
                        num={index}
                        addr={token.addr}
                        dim={token.dim}
                        val={token.val}
                        onRemove={(index) => this.removeToken(index)}>
                    </ReservedTokensItem>
                )
            })

        return (
            <div className="reserved-tokens-container">
                <div className="reserved-tokens-input-container">
                    <div className="reserved-tokens-input-container-inner">
                      <InputField
                        side='reserved-tokens-input-property reserved-tokens-input-property-left'
                        type='text'
                        title={ADDRESS}
                        value={token.reservedTokensInput.addr}
                        pristine={this.state.validation.address.pristine}
                        valid={this.state.validation.address.valid}
                        errorMessage="The inserted address is invalid"
                        onChange={this.handleReservedTokensInputAddrChange}
                        description={`Address where to send reserved tokens.`}
                      />
                      <RadioInputField
                        side='reserved-tokens-input-property reserved-tokens-input-property-middle'
                        title={DIMENSION}
                        items={["tokens", "percentage"]}
                        vals={["tokens", "percentage"]}
                        defaultValue={token.reservedTokensInput.dim}
                        name={'reserved-tokens-dim'}
                        onChange={this.handleReservedTokensInputDimChange}
                        description={`Fixed amount or % of crowdsaled tokens. Will be deposited to the account after fintalization of the crowdsale. `}
                      />
                      <InputField
                        side='reserved-tokens-input-property reserved-tokens-input-property-right'
                        type='number'
                        title={VALUE}
                        value={token.reservedTokensInput.val}
                        onChange={this.handleReservedTokensInputValChange}
                        description={`Value in tokens or percents. Don't forget to press + button for each reserved token.`}
                      />
                    </div>
                    <div className="plus-button-container">
                        <div onClick={(e) => this.addReservedTokensItem(token.reservedTokensInput.addr, token.reservedTokensInput.dim, token.reservedTokensInput.val)} className="button button_fill button_fill_plus">
                        </div>
                    </div>
                </div>
                {reservedTokensElements}
            </div>
        )
    }
}
