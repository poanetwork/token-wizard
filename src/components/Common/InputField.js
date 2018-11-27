import React from 'react'
import { FormControlTitle } from '../Common/FormControlTitle'
import { TextField } from '../Common/TextField'
import { VALIDATION_TYPES } from '../../utils/constants'
import { FormError } from '../Common/FormError'

const { INVALID } = VALIDATION_TYPES

export const InputField = props => {
  const error = props.valid === INVALID ? <FormError errorMessage={props.errorMessage} /> : ''

  return (
    <div className={`sw-InputField ${props.extraClassName ? props.extraClassName : ''}`}>
      <FormControlTitle title={props.title} description={props.description} />
      <TextField
        disabled={props.disabled}
        id={props.name}
        onBlur={props.onBlur}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
        onPaste={props.onPaste}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        style={props.style}
        type={props.type}
        value={props.value}
      />
      {props.pristine ? '' : error}
    </div>
  )
}
