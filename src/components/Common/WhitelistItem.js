import React from 'react'
import '../../assets/stylesheets/application.css';

export const WhitelistItem = ({isLast, addr, min, max}) => {
	return <div className={isLast?"white-list-item-container white-list-item-container-last":"white-list-item-container"}>
				<div className="white-list-item-container-inner">
	              <span className="white-list-item white-list-item-left">{addr}</span>
	              <span className="white-list-item white-list-item-middle">{min}</span>
	              <span className="white-list-item white-list-item-right">{max}</span>
	            </div>
            	<div className="white-list-item-empty">
            	</div>
            </div>
}