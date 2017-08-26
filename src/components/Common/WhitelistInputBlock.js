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
        state.children = [];
        this.setState(state);
    }

    addWhitelistItem = () => {
        console.log("fdjsksdjf");
        let state = this.state
        state.children.push(<WhitelistItem 
                addr={"bla"}
                min={"dfgjdfg"}
                max={"kfdslfkd"}></WhitelistItem>);
        this.setState(state);
    }

    render() {
        return (<div className="white-list-container"><div className="white-list-input-container">
              <InputField 
                side='white-list-input-property-left' 
                type='text' 
                title={ADDRESS} 
                value={this.props.addr} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_addr')}/>
              <InputField 
                side='white-list-input-property-middle' 
                type='number' 
                title={MIN} 
                value={this.props.min} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_min')}/>
              <InputField 
                side='white-list-input-property-right'
                type='number' 
                title={MAX} 
                value={this.props.max} 
                onChange={(e) => this.props.onChange(e, 'crowdsale', this.props.num, 'whitelist_max')}/>
              <div className="plus-button-container"><div onClick={this.addWhitelistItem} className="button button_fill button_fill_plus"></div></div>
            </div>
            {this.state.children}
            </div>)
    }
}