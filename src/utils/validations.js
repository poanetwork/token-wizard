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


