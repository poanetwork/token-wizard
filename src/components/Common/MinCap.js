import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import {
  composeValidators,
  isDecimalPlacesNotGreaterThan,
  isLessOrEqualThan,
  isNonNegative
} from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const MinCap = ({ ...props }) => (
  <Field
    component={InputField2}
    validate={(value) => {
      const errors = composeValidators(
        isNonNegative(),
        isDecimalPlacesNotGreaterThan(`Decimals should not exceed ${props.decimals} places`)(props.decimals),
        isLessOrEqualThan(`Should be less or equal than tier's supply (${props.supply})`)(props.supply)
      )(value)

      if (errors) return errors.shift()
    }}
    type="number"
    label={props.label || TEXT_FIELDS.MIN_CAP}
    description={DESCRIPTION.MIN_CAP}
    {...props}
  />
)
