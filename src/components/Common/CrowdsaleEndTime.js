import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { validateTierEndDate } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const CrowdsaleEndTime = ({ index, ...props }) => (
  <Field
    component={InputField2}
    validate={props.disabled ? undefined : validateTierEndDate(index)}
    type="datetime-local"
    label={TEXT_FIELDS.END_TIME}
    description={DESCRIPTION.END_TIME}
    {...props}
  />
)
