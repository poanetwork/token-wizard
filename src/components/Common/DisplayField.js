import React from 'react'
import '../../assets/stylesheets/application.css';

export const DisplayField = ({side, type, value, title }) => {
	return <div className={side}>
        <p className="label">{title}</p>
        <p className="value">{value}</p>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
}

