import React from 'react';
import '../../assets/stylesheets/application.css';

export const DisplayField = props => {
  return (
    <div className={props.side}>
      <div className="display-container">
        <p className="label">{props.title}</p>
        <p className="value">{props.value}</p>
        <p className="description">{props.description}</p>
      </div>
      <div className="copy-field-container">
        <btn className="copy" data-clipboard-action="copy" data-clipboard-text={props.value} />
      </div>
    </div>
  );
};
