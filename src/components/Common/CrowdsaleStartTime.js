import React from 'react'
import { Field } from 'react-final-form'
import { InputField2 } from './InputField2'
import { validateTierStartDate } from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

export const CrowdsaleStartTime = ({ index, ...props }) => (
  <Field
    component={InputField2}
    description={props.description || DESCRIPTION.START_TIME}
    label={TEXT_FIELDS.START_TIME}
    type="datetime-local"
    validate={props.disabled ? undefined : validateTierStartDate(index)}
    {...props}
  />
)
