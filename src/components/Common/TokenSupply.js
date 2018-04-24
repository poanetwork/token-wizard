import React from 'react'
import { composeValidators, isNonNegative, isRequired } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { acceptPositiveIntegerOnly } from '../../utils/utils'

export const TokenSupply = ({ errorStyle }) => (
  <Field
    validate={(value) => {
      const errors = composeValidators(
        isRequired(),
        isNonNegative()
      )(value)

      if (errors) return errors.shift()
    }}
    component={InputField2}
    parse={acceptPositiveIntegerOnly}
    side="right"
    name="supply"
    type="text"
    description={DESCRIPTION.TOKEN_SUPPLY}
    label={TEXT_FIELDS.TOKEN_SUPPLY}
    errorStyle={errorStyle}
  />
)
