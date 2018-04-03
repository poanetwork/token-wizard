import Web3 from 'web3'
import { BigNumber } from 'bignumber.js'
import { VALIDATION_MESSAGES } from './constants'
import { countDecimalPlaces, validateLaterOrEqualTime, validateLaterTime, validateTime } from './utils'

export const validators = (type, value) => {
  return {
    name: value && typeof value === 'string' && 1 <= value.length && value.length <= 30,
    ticker: /^[a-zA-Z0-9]{1,5}$/.test(value),
    decimals: (value === undefined || value === '') || (/^[0-9]+$/.test(value) && 0 <= value && value <= 18),
  }[type] || false
}

export const validateTokenName = (value) => {
  const isValid = validators('name', value)
  return isValid ? undefined : VALIDATION_MESSAGES.NAME
}

export const validateTicker = (value) => {
  const isValid = validators('ticker', value)
  return isValid ? undefined : VALIDATION_MESSAGES.TICKER
}

export const validateDecimals = (value) => {
  const isValid = validators('decimals', value)
  return isValid ? undefined : VALIDATION_MESSAGES.DECIMALS
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
  const isValid = !!value
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

export const isInFuture = (errorMsg = "Should be set in the future") => (value) => {
  const isValid = validateTime(value)
  return isValid ? undefined : errorMsg
}

export const isPreviousThan = (errorMsg = "Should be previous than same tier's End Time") => (later) => (value) => {
  const isValid = validateLaterTime(later, value)
  return isValid ? undefined : errorMsg
}

export const isSameOrLater = (errorMsg = "Should be same or later than previous tier's End Time") => (previous) => (value) => {
  const isValid = validateLaterOrEqualTime(value, previous)
  return isValid ? undefined : errorMsg
}

export const isInteger = (errorMsg = VALIDATION_MESSAGES.INTEGER) => (value) => {
  try {
    const isValid = new BigNumber(value).isInteger()
    return isValid ? undefined : errorMsg
  } catch (e) {
    return errorMsg
  }
}

export const composeValidators = (...validators) => (value) => validators.reduce((errors, validator) => {
  const validation = validator(value)

  if (validation) errors.push(validation)

  return errors
}, [])

