import React from 'react'
import '../../assets/stylesheets/application.css';
import { defaultState } from '../../utils/constants'
import { getOldState } from '../../utils/utils'

export class WhitelistItem extends React.Component {
	constructor(props) {
        super(props);
        let oldState = getOldState(props, defaultState)
        this.state = Object.assign({}, oldState)
    }

    removeItem() {
		let state = this.state;
		state.crowdsale[this.props.crowdsaleNum].whitelist[this.props.whiteListNum].deleted = true;
		this.setState(state);
	}

    render() {
    	return this.state.crowdsale[this.props.crowdsaleNum].whitelist[this.props.whiteListNum].deleted?null:(
			<div className={this.props.isLast?"white-list-item-container white-list-item-container-last":"white-list-item-container"}>
				<div className="white-list-item-container-inner">
	              <span className="white-list-item white-list-item-left">{this.props.addr}</span>
	              <span className="white-list-item white-list-item-middle">{this.props.min}</span>
	              <span className="white-list-item white-list-item-right">{this.props.max}</span>
	            </div>
            	<div className="white-list-item-empty">
            		<a onClick={this.removeItem.bind(this)}><span className="item-remove"></span></a>
            	</div>
            </div>)
    }
}