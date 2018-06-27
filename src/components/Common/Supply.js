import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { isPositive } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const Supply = ({ ...props }) => {
  return (
    <Field
      component={InputField2}
      validate={props.disabled ? undefined : isPositive()}
      type="text"
      label={props.label || TEXT_FIELDS.SUPPLY_SHORT}
      description={props.description || DESCRIPTION.SUPPLY}
      val={props.value || null}
      {...props}
    />
  )
}
