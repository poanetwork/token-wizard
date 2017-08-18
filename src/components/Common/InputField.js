import React from 'react'
import '../../assets/stylesheets/application.css';
import { VALIDATION_TYPES } from '../../utils/constants'
const { INVALID } = VALIDATION_TYPES

export const InputField = ({side, type, value, onChange, title, valid, errorMessage }) => {
	const error = valid === INVALID ? errorMessage : ''
	return <div className={side}>
		<label className="label">{title}</label>
		<input type={type} className="input" value={value} onChange={onChange}/>
		<p className="description">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
		</p>
		<p className='errorMessage'>{error}</p>
	</div>
}