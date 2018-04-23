import React from 'react'
import { composeValidators, isMatchingPattern, isRequired, isMaxLength } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'

export const TokenTicker = ({ errorStyle }) => (
  <Field
    validate={(value) => {
      const errors = composeValidators(
        isRequired(),
        isMaxLength('Please enter a valid ticker between 1-5 characters')(5),
        isMatchingPattern('Only alphanumeric characters')(/^[a-zA-Z0-9]*$/)
      )(value)

      if (errors) return errors.shift()
    }}
    component={InputField2}
    parse={(value) => value || ''}
    side="right"
    name="ticker"
    type="text"
    description={`${DESCRIPTION.TOKEN_TICKER} There are 11,881,376 combinations for 26 english letters. Be hurry.`}
    label={TEXT_FIELDS.TICKER}
    errorStyle={errorStyle}
  />
)
