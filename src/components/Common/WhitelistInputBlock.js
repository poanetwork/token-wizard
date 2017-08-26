import React from 'react'
import '../../assets/stylesheets/application.css';
import { InputField } from './InputField'
import { TEXT_FIELDS, defaultState } from '../../utils/constants'
import { WhitelistItem } from './WhitelistItem'
import { getOldState } from '../../utils/utils'
const { ADDRESS, MIN, MAX } = TEXT_FIELDS

export class WhitelistInputBlock extends React.Component {

    constructor(props) {
        super(props);
        let oldState = getOldState(props, defaultState)
        this.state = Object.assign({}, oldState)
        let state = this.state
        state.crowdsale[this.props.num].whiteListElements = [];
        this.setState(state);
    }

    addWhitelistItem = (addr, min, max) => {
        if (!addr || !min || !max) return;

        let isAdded = false;
        for (let i = 0; i < this.state.crowdsale[this.props.num].whitelist.length; i++) {
            let addedAddr = this.state.crowdsale[this.props.num].whitelist[i].addr;
            if (addedAddr == addr) {
                isAdded = true;
                break;
            }
        }

        if (isAdded) return;

        let state = this.state
        let childrenLen = this.state.crowdsale[this.props.num].whiteListElements.length;
        state.crowdsale[this.props.num].whiteListElements.push(<WhitelistItem 
                addr={addr}
                min={min}
                max={max}></WhitelistItem>);
        state.crowdsale[this.props.num].whitelist.push({
            addr,
            min,
            max
        });
        this.setState(state);
    }

    render() {
        return (<div className="white-list-container"><div className="white-list-input-container">
              <InputField 
                side='white-list-input-property-left' 
                type='text' 
                title={ADDRESS} 
                value={this.state.crowdsale[this.props.num].whiteListInput.addr} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_addr')}/>
              <InputField 
                side='white-list-input-property-middle' 
                type='number' 
                title={MIN} 
                value={this.state.crowdsale[this.props.num].whiteListInput.min} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_min')}/>
              <InputField 
                side='white-list-input-property-right'
                type='number' 
                title={MAX} 
                value={this.state.crowdsale[this.props.num].whiteListInput.max} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_max')}/>
              <div className="plus-button-container"><div onClick={(e) => this.addWhitelistItem(this.state.crowdsale[this.props.num].whiteListInput.addr, this.state.crowdsale[this.props.num].whiteListInput.min, this.state.crowdsale[this.props.num].whiteListInput.max)} className="button button_fill button_fill_plus"></div></div>
            </div>
            {this.state.crowdsale[this.props.num].whiteListElements}
            </div>)
    }
}