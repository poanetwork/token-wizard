import React from 'react'
import '../../assets/stylesheets/application.css';

export const InputField = ({side, type, value, onChange, title }) => {
	return <div className={side}>
		<label className="label">{title}</label>
		<input type={type} className="input" value={value} onChange={onChange}/>
		<p className="description">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veni.
		</p>
	</div>
}