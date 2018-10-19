import React from 'react'
import { isPositive } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { acceptPositiveIntegerOnly } from '../../utils/utils'

export const TokenSupply = () => (
  <Field
    component={InputField2}
    description={DESCRIPTION.TOKEN_SUPPLY}
    label={TEXT_FIELDS.SUPPLY_SHORT}
    min="0"
    name="supply"
    parse={acceptPositiveIntegerOnly}
    placeholder="Enter here"
    type="number"
    validate={isPositive()}
  />
)
