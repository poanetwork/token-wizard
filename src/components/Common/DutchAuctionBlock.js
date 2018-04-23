import React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import { InputField2 } from './InputField2'
import { WhitelistInputBlock } from './WhitelistInputBlock'
import {
  composeValidators,
  isDateInFuture,
  isDateLaterThan,
  isDatePreviousThan,
  isDateSameOrLaterThan,
  isDateSameOrPreviousThan,
  isInteger,
  isLessOrEqualThan,
  isPositive,
  isRequired,
  isMaxLength,
} from '../../utils/validations'
import { DESCRIPTION, TEXT_FIELDS } from '../../utils/constants'

const {
  ALLOWMODIFYING,
  CROWDSALE_SETUP_NAME,
  START_TIME,
  END_TIME,
  RATE,
  SUPPLY
} = TEXT_FIELDS

const inputErrorStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: '12px',
  width: '100%',
  height: '20px',
}

export const DutchAuctionBlock = ({ fields, ...props }) => {

  return (
    null
  )
}
