import React from 'react'
import '../../assets/stylesheets/application.css';

export const ReservedTokensItem = ({addr, dim, val, num}) => {
	return <div className={"reserved-tokens-item-container"}>
				<div className="reserved-tokens-item-container-inner">
	              <span className="reserved-tokens-item reserved-tokens-item-left">{addr}</span>
	              <span className="reserved-tokens-item reserved-tokens-item-middle">{dim}</span>
	              <span className="reserved-tokens-item reserved-tokens-item-right">{val}</span>
	            </div>
            	<div className="reserved-tokens-item-empty">
            	</div>
            </div>
}