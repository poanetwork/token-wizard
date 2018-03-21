import React from 'react'
import { validateDecimals } from '../../utils/validations'
import { TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'

export const TokenDecimals = ({ disabled, errorStyle }) => (
  <Field
    validate={validateDecimals}
    component={InputField2}
    parse={(value) => /^[0-9]*$/.test(value) ? value : ''}
    side="left"
    name="decimals"
    type="text"
    description="Refers to how divisible a token can be, from 0 (not at all divisible) to 18 (pretty much continuous)."
    label={TEXT_FIELDS.DECIMALS}
    disabled={disabled}
    errorStyle={errorStyle}
  />
)
