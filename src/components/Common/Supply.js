import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { isPositive } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const Supply = ({ ...props }) => {
  return (
    <Field
      component={InputField2}
      description={props.description || DESCRIPTION.SUPPLY}
      label={props.label || TEXT_FIELDS.SUPPLY_SHORT}
      onChange={props.onChange}
      placeholder="Enter here"
      type="text"
      val={props.value || null}
      validate={props.disabled ? undefined : isPositive()}
      {...props}
    />
  )
}
