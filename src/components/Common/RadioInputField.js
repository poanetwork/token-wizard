import React from 'react'
import '../../assets/stylesheets/application.css';

export const RadioInputField = ({side, disabled, selected, type, value, onChange, title, errorMessage }) => {
	return <div className={side}>
		<label className="label">{title}</label>
		<div className="reserved-tokens-radio-container">
			<div className="reserved-tokens-radio-container-item">
				<input disabled={disabled} type='radio' name="reserved-tokens-dim" className="input-radio" value="tokens" onChange={onChange} selected={selected}/> tokens
			</div>
			<div className="reserved-tokens-radio-container-item">
				<input disabled={disabled} type='radio' name="reserved-tokens-dim" className="input-radio" value="percentage" onChange={onChange} selected={selected}/> percentage
			</div>
		</div>
		<p className="description">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
		</p>
	</div>
}