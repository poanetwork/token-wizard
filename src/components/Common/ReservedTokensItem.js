import React from 'react'
import '../../assets/stylesheets/application.css';
import { defaultState } from '../../utils/constants'
import { getOldState } from '../../utils/utils'

export class ReservedTokensItem extends React.Component {
	constructor(props) {
        super(props);
        let oldState = getOldState(props, defaultState)
        this.state = Object.assign({}, oldState)
    }

	removeItem() {
		let state = this.state;
		state.token.reservedTokens[this.props.num].deleted = true;
		this.setState(state);
	}

	render() {
		return this.state.token.reservedTokens[this.props.num]?this.state.token.reservedTokens[this.props.num].deleted?null:(
			<div className={"reserved-tokens-item-container"}>
				<div className="reserved-tokens-item-container-inner">
	              <span className="reserved-tokens-item reserved-tokens-item-left">{this.props.addr}</span>
	              <span className="reserved-tokens-item reserved-tokens-item-middle">{this.props.dim}</span>
	              <span className="reserved-tokens-item reserved-tokens-item-right">{this.props.val}</span>
	            </div>
	        	<div className="reserved-tokens-item-empty">
	        		<a onClick={this.removeItem.bind(this)}><span className="item-remove"></span></a>
	        	</div>
	        </div>
	    ):null
	}
}