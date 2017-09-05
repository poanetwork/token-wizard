import React from 'react'
import '../../assets/stylesheets/application.css';

export const RadioInputField = ({side, disabled, defaultValue, onChange, title, items, vals }) => {
	return <div className={side}>
		<label className="label">{title}</label>
		<div className="reserved-tokens-radio-container">
			<div className="reserved-tokens-radio-container-item">
				<input disabled={disabled} type='radio' name="reserved-tokens-dim" className="input-radio" value={vals[0]} onChange={onChange}/> {items[0]}
			</div>
			<div className="reserved-tokens-radio-container-item">
				<input disabled={disabled} type='radio' name="reserved-tokens-dim" className="input-radio" value={vals[1]} onChange={onChange}/> {items[1]}
			</div>
		</div>
		<p className="description">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
		</p>
	</div>
}