import React from 'react';
import '../../assets/stylesheets/application.css';
import {VALIDATION_TYPES} from '../../utils/constants';
const {INVALID} = VALIDATION_TYPES;

export const InputField = props => {
  const errorStyle = {
    color: 'red',
    fontWeight: 'bold',
    fontSize: '12px',
    width: '100%',
    height: '10px',
  };

  const error = props.valid === INVALID ? props.errorMessage : '';

  return (
    <div className={props.side}>
      <label className="label">{props.title}</label>
      <input
        disabled={props.disabled}
        type={props.type}
        className="input"
        onBlur={props.onBlur}
        value={props.value}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
        onPaste={props.onPaste}
      />
      <p className="description">{props.description}</p>
      { props.pristine ? null : <p style={errorStyle}>{error}</p> }
    </div>
  );
};
