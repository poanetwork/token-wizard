import React from 'react'
import '../../assets/stylesheets/application.css';

export const DisplayField = ({side, type, value, title, description }) => {
	return <div className={side}>
        <p className="label">{title}</p>
        <p className="value">{value}</p>
        <p className="description">
          {description}
        </p>
      </div>
}

