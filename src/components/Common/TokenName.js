import React from 'react'
import { composeValidators, isRequired, isMaxLength, isMatchingPattern } from '../../utils/validations'
import { TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'

export const TokenName = ({ errorStyle }) => (
  <Field
    validate={(value) => {
      const errors = composeValidators(
        isRequired(),
        isMaxLength()(30),
        isMatchingPattern('Name should have at least one character')(/.*\S.*/)
      )(value)

      if (errors) return errors.shift()
    }}
    component={InputField2}
    side="left"
    name="name"
    type="text"
    description="The name of your token. Will be used by Etherscan and other tokenbrowsers. Be afraid of trademarks."
    label={TEXT_FIELDS.NAME}
    errorStyle={errorStyle}
  />
)
