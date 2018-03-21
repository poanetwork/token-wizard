import React from 'react'
import { validateTokenName } from '../../utils/validations'
import { TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'

export const TokenName = ({ errorStyle }) => (
  <Field
    validate={validateTokenName}
    component={InputField2}
    parse={(value) => value ? value.replace(/^\s+/, '') : value}
    side="left"
    name="name"
    type="text"
    description="The name of your token. Will be used by Etherscan and other tokenbrowsers. Be afraid of trademarks."
    label={TEXT_FIELDS.NAME}
    errorStyle={errorStyle}
  />
)
