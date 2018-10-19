import React from 'react'
import { composeValidators, isLessOrEqualThan, isNonNegative, isRequired } from '../../utils/validations'
import { TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { acceptPositiveIntegerOnly } from '../../utils/utils'

export const TokenDecimals = ({ disabled }) => (
  <Field
    validate={value => {
      const errors = composeValidators(
        isRequired(),
        isNonNegative(),
        isLessOrEqualThan('Should not be greater than 18')(18)
      )(value)

      if (errors) return errors.shift()
    }}
    component={InputField2}
    description="Refers to how divisible a token can be, from 0 (not at all divisible) to 18 (pretty much continuous)."
    disabled={disabled}
    label={TEXT_FIELDS.DECIMALS}
    max="18"
    min="0"
    name="decimals"
    parse={acceptPositiveIntegerOnly}
    placeholder="Enter here"
    type="number"
  />
)
