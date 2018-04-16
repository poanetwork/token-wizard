import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { isPositive } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const CrowdsaleSupply = ({ ...props }) => (
  <Field
    component={InputField2}
    validate={props.disabled ? undefined : isPositive()}
    type="text"
    label={TEXT_FIELDS.SUPPLY}
    description={DESCRIPTION.SUPPLY}
    {...props}
  />
)
