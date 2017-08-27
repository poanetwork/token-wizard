import React from 'react'
import '../../assets/stylesheets/application.css';
import { VALIDATION_TYPES } from '../../utils/constants'
const { INVALID } = VALIDATION_TYPES

export const InputField = ({side, disabled, type, value, onChange, onBlur, title, valid, errorMessage }) => {
	const errorStyle={
		color: 'red',
		fontWeight: 'bold',
		fontSize: '12px',
		width: '100%',
		height: '10px'
	}
	const error = valid === INVALID ? errorMessage : ''
	return <div className={side}>
		<label className="label">{title}</label>
		<input disabled={disabled} type={type} className="input" onBlur={onBlur} value={value} onChange={onChange}/>
		<p className="description">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
		</p>
		<p style={errorStyle}>{error}</p>
	</div>
}