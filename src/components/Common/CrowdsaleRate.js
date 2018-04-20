import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { composeValidators, isInteger, isLessOrEqualThan, isPositive } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const CrowdsaleRate = ({ ...props }) => (
  <Field
    component={InputField2}
    validate={props.disabled ? undefined : composeValidators(
      isPositive(),
      isInteger(),
      isLessOrEqualThan('Should not be greater than 1 quintillion (10^18)')('1e18')
    )}
    type="text"
    label={TEXT_FIELDS.RATE}
    description={DESCRIPTION.RATE}
    {...props}
  />
)
