import React from 'react'
import '../../assets/stylesheets/application.css';
import InputField from './InputField'
import { TEXT_FIELDS, defaultState } from '../../utils/constants'
import { WhitelistItem } from './WhitelistItem'
import { getOldState } from '../../utils/utils'
import update from 'immutability-helper'
const { ADDRESS, MIN, MAX } = TEXT_FIELDS

export class WhitelistInputBlock extends React.Component {

    constructor(props) {
        super(props);
        let oldState = getOldState(props, defaultState)
        this.state = Object.assign({}, oldState)
    }

    addWhitelistItem = (addr, min, max) => {
        if (!addr || !min || !max) return;

        this.clearWhiteListInputs()

        let isAdded = false;
        for (let i = 0; i < this.state.crowdsale[this.props.num].whitelist.length; i++) {
            let item = this.state.crowdsale[this.props.num].whitelist[i];
            let addedAddr = item.addr;
            if (addedAddr === addr && !item.deleted) {
                isAdded = true;
                break;
            }
        }

        if (isAdded) return;

        let state = this.state
        let whiteListNum = state.crowdsale[this.props.num].whiteListElements.length;
        state.crowdsale[this.props.num].whiteListElements.push(
            <WhitelistItem 
                key={whiteListNum.toString()}
                crowdsaleNum={this.props.num}
                whiteListNum={whiteListNum}
                addr={addr}
                min={min}
                max={max}>
            </WhitelistItem>
        );
        state.crowdsale[this.props.num].whitelist.push({
            addr,
            min,
            max
        });
        this.setState(state);
    }

    clearWhiteListInputs = () => {
        const { num } = this.props
        const newCrowdsale = update(this.state.crowdsale[num], {
            whiteListInput: {
                $merge: {
                    addr: '',
                    min: '',
                    max: ''
                }
            }
        })

        const newState = update(this.state, {
            crowdsale: {
                [num]: {
                    $set: newCrowdsale
                }
            }
        })

        this.setState(newState)
    }

    render() {
        let { crowdsale } = this.state
        const { num } = this.props
        return (
            <div className="white-list-container">
                <div className="white-list-input-container">
                    <div className="white-list-input-container-inner">
                      <InputField 
                        side='white-list-input-property white-list-input-property-left' 
                        type='text' 
                        title={ADDRESS} 
                        value={crowdsale[num].whiteListInput.addr} 
                        onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_addr')}
                        description={`Address of a whitelisted account. Whitelists are inherited. E.g., if an account whitelisted on Tier 1 and didn't buy max cap on Tier 1, he can buy on Tier 2, and following tiers.`}
                      />
                      <InputField 
                        side='white-list-input-property white-list-input-property-middle' 
                        type='number' 
                        title={MIN} 
                        value={crowdsale[num].whiteListInput.min} 
                        onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_min')}
                        description={`Minimum amount tokens to buy. Not a mininal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
                      />
                      <InputField 
                        side='white-list-input-property white-list-input-property-right'
                        type='number' 
                        title={MAX} 
                        value={crowdsale[num].whiteListInput.max} 
                        onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_max')}
                        description={`Maximum is the hard limit.`}
                      />
                    </div>
                    <div className="plus-button-container">
                        <div onClick={(e) => this.addWhitelistItem(crowdsale[num].whiteListInput.addr, crowdsale[num].whiteListInput.min, crowdsale[num].whiteListInput.max)} className="button button_fill button_fill_plus">
                        </div>
                    </div>
                </div>
                {crowdsale[num].whiteListElements}
            </div>)
    }
}
