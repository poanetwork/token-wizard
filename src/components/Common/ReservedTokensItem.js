import React from 'react'
import '../../assets/stylesheets/application.css';

export const ReservedTokensItem = ({isLast, addr, dim, val}) => {
	return <div className={isLast?"reserved-tokens-item-container reserved-tokens-item-container-last":"reserved-tokens-item-container"}>
				<div className="reserved-tokens-item-container-inner">
	              <span className="reserved-tokens-item reserved-tokens-item-left">{addr}</span>
	              <span className="reserved-tokens-item reserved-tokens-item-middle">{dim}</span>
	              <span className="reserved-tokens-item reserved-tokens-item-right">{val}</span>
	            </div>
            	<div className="reserved-tokens-item-empty">
            	</div>
            </div>
}