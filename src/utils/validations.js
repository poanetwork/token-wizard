import Web3 from 'web3'
import { VALIDATION_MESSAGES } from './constants'

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

export const isPositive = (errorMsg = 'Please enter a valid number greater than 0') => (value) => {
  const isValid = value > 0
  return isValid ? undefined : errorMsg
}

export const isNonNegative = (errorMsg = 'Please enter a valid number greater or equal than 0') => (value) => {
  const isValid = value >= 0
  return isValid ? undefined : errorMsg
}

export const isAddress = (errorMsg = 'Please enter a valid address') => (value) => {
  const isValid = Web3.utils.isAddress(value)
  return isValid ? undefined : errorMsg
}

export const isRequired = (errorMsg = 'This field is required') => (value) => {
  const isValid = !!value
  return isValid ? undefined : errorMsg
}
