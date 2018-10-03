import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { validateTierMinCap } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const MinCap = ({ index, decimals, ...props }) => (
  <Field
    component={InputField2}
    description={DESCRIPTION.MIN_CAP}
    label={props.label || TEXT_FIELDS.MIN_CAP}
    type="text"
    validate={props.disabled ? undefined : validateTierMinCap(decimals)(index)}
    {...props}
  />
)
