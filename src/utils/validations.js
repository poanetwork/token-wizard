import Web3 from 'web3'
import { BigNumber } from 'bignumber.js'
import { VALIDATION_MESSAGES } from './constants'
import { countDecimalPlaces, validateLaterOrEqualTime, validateLaterTime, validateTime } from './utils'

export const validateWhitelistMin = ({ min, max, decimals }) => {
  const listOfErrors = composeValidators(
    isRequired(),
    isNonNegative(),
    isDecimalPlacesNotGreaterThan(`Decimals should not exceed ${decimals} places`)(decimals),
    isLessOrEqualThan('Should be less or equal than max')(max)
  )(min)

  return listOfErrors ? listOfErrors.shift() : undefined
}

export const validateWhitelistMax = ({ min, max, decimals }) => {
  const listOfErrors = composeValidators(
    isRequired(),
    isNonNegative(),
    isDecimalPlacesNotGreaterThan(`Decimals should not exceed ${decimals} places`)(decimals),
    isGreaterOrEqualThan('Should be greater or equal than min')(min)
  )(max)

  return listOfErrors ? listOfErrors.shift() : undefined
}

export const isMaxLength = (errorMsg = VALIDATION_MESSAGES.NAME) => (maxLength = 256) => (value) => {
  const isValid = typeof value === 'string' && value.length <= maxLength
  return isValid ? undefined : errorMsg
}

export const isMatchingPattern = (errorMsg = VALIDATION_MESSAGES.PATTERN) => (regex = /.*/) => (value) => {
  const isValid = regex.test(value)
  return isValid ? undefined : errorMsg
}

export const isPositive = (errorMsg = VALIDATION_MESSAGES.POSITIVE) => (value) => {
  const isValid = value > 0
  return isValid ? undefined : errorMsg
}

export const isNonNegative = (errorMsg = VALIDATION_MESSAGES.NON_NEGATIVE) => (value) => {
  const isValid = value >= 0
  return isValid ? undefined : errorMsg
}

export const isAddress = (errorMsg = VALIDATION_MESSAGES.ADDRESS) => (value) => {
  const isValid = Web3.utils.isAddress(value)
  return isValid ? undefined : errorMsg
}

export const isRequired = (errorMsg = VALIDATION_MESSAGES.REQUIRED) => (value) => {
  const isValid = value !== '' && value !== null && value !== undefined
  return isValid ? undefined : errorMsg
}

export const isDecimalPlacesNotGreaterThan = (errorMsg = VALIDATION_MESSAGES.DECIMAL_PLACES) => (decimalsCount) => (value) => {
  const isValid = countDecimalPlaces(value) <= decimalsCount
  return isValid ? undefined : errorMsg
}

export const isLessOrEqualThan = (errorMsg = VALIDATION_MESSAGES.LESS_OR_EQUAL) => (maxValue = Infinity) => (value) => {
  try {
    const max = new BigNumber(String(maxValue))
    const isValid = max.gte(value)
    return isValid ? undefined : errorMsg
  } catch (e) {
    return errorMsg
  }
}

export const isGreaterOrEqualThan = (errorMsg = VALIDATION_MESSAGES.GREATER_OR_EQUAL) => (minValue = Number.MIN_VALUE) => (value) => {
  try {
    const min = new BigNumber(String(minValue))
    const isValid = min.lte(value)
    return isValid ? undefined : errorMsg
  } catch (e) {
    return errorMsg
  }
}

export const isInteger = (errorMsg = VALIDATION_MESSAGES.INTEGER) => (value) => {
  try {
    const isValid = new BigNumber(value).isInteger()
    return isValid ? undefined : errorMsg
  } catch (e) {
    return errorMsg
  }
}

export const isDateInFuture = (errorMsg = VALIDATION_MESSAGES.DATE_IN_FUTURE) => (value) => {
  const isValid = validateTime(value)
  return isValid ? undefined : errorMsg
}

export const isDatePreviousThan = (errorMsg = VALIDATION_MESSAGES.DATE_IS_PREVIOUS) => (later) => (value) => {
  const isValid = validateLaterTime(later, value)
  return isValid ? undefined : errorMsg
}

export const isDateSameOrLaterThan = (errorMsg = VALIDATION_MESSAGES.DATE_IS_SAME_OR_LATER) => (previous) => (value) => {
  const isValid = validateLaterOrEqualTime(value, previous)
  return isValid ? undefined : errorMsg
}

export const isDateLaterThan = (errorMsg = VALIDATION_MESSAGES.DATE_IS_LATER) => (previous) => (value) => {
  const isValid = validateLaterTime(value, previous)
  return isValid ? undefined : errorMsg
}

export const isDateSameOrPreviousThan = (errorMsg = VALIDATION_MESSAGES.DATE_IS_SAME_OR_PREVIOUS) => (later) => (value) => {
  const isValid = validateLaterOrEqualTime(later, value)
  return isValid ? undefined : errorMsg
}

export const composeValidators = (...validators) => (value) => {
  const errors = validators.reduce((errors, validator) => {
    const validation = validator(value)

    if (validation) errors.push(validation)

    return errors
  }, [])

  return errors.length ? errors : undefined
}

export const validateTierStartDate  = (index) => (value, values) => {
  const listOfValidations = [
    isRequired(),
    isDateInFuture(),
    isDatePreviousThan("Should be previous than same tier's End Time")(values.tiers[index].endTime),
  ]

  if (index > 0) {
    listOfValidations.push(isDateSameOrLaterThan("Should be same or later than previous tier's End Time")(values.tiers[index - 1].endTime))
  }

  return composeValidators(...listOfValidations)(value)
}

export const validateTierEndDate  = (index) => (value, values) => {
  const listOfValidations = [
    isRequired(),
    isDateInFuture(),
    isDateLaterThan("Should be later than same tier's Start Time")(values.tiers[index].startTime),
  ]

  if (index < values.tiers.length - 1) {
    listOfValidations.push(isDateSameOrPreviousThan("Should be same or previous than next tier's Start Time")(values.tiers[index + 1].startTime))
  }

  return composeValidators(...listOfValidations)(value)
}
