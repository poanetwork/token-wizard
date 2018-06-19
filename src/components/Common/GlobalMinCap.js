import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { composeValidators, isDecimalPlacesNotGreaterThan, isNonNegative } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const GlobalMinCap = ({ ...props }) => (
  <Field
    component={InputField2}
    validate={composeValidators(
      isNonNegative(),
      isDecimalPlacesNotGreaterThan()(props.decimals)
    )}
    type="number"
    label={props.label || TEXT_FIELDS.MIN_CAP}
    description={DESCRIPTION.MIN_CAP}
    {...props}
  />
)
