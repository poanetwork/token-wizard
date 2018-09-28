import { composeValidators, isAddress, isDecimalPlacesNotGreaterThan, isPositive, isRequired } from './validations'
import { reservedTokenStore } from '../stores'
import logdown from 'logdown'
import Web3 from 'web3'

const logger = logdown('TW:processReservedTokens')

/**
 * Execute a callback with each valid whitelist item in the given list
 *
 * @param {Object} reservedTokensInformation
 * @param {Array} reservedTokensInformation.rows Array of whitelist items. Each element in the array has the structure
 * `[address, dim, val]`, for example: `['0x1234567890123456789012345678901234567890', '1', '10']`
 * @param {Number} reservedTokensInformation.decimals Amount of decimals allowed for the dim and val values
 * @param {Function} cb The function to be called with each valid item
 * @returns {Object} Object with a `called` property, indicating the number of times the callback was called
 */
export const processReservedTokens = ({ rows, decimals }, cb) => {
  let called = 0
  let reservedTokenLengthError = false
  for (let row of rows) {
    if (row.length !== 3) {
      continue
    }

    let validLength = reservedTokenStore.validateLength
    if (!validLength) {
      reservedTokenLengthError = true
      break
    }

    let valueErrors = undefined
    let [addr, dim, val] = row
    dim = dim.trim().toLowerCase()
    val = val.trim()

    // `dim` must be either 'tokens' or 'percentage'
    if (dim === 'tokens') {
      valueErrors = composeValidators(
        isRequired(),
        isPositive(),
        isDecimalPlacesNotGreaterThan(`Decimals should not exceed ${decimals} places`)(decimals)
      )(val)
    } else if (dim === 'percentage') {
      valueErrors = composeValidators(isRequired(), isPositive())(val)
    } else {
      logger.error(`unrecognized dimension '${dim}'`)
      continue
    }

    if (isAddress()(addr) || valueErrors) {
      continue
    }

    cb({ addr, dim, val })

    called++
  }

  return {
    called: called,
    reservedTokenLengthError: reservedTokenLengthError
  }
}

export const errorsCsv = data => {
  let errorRowLength = []
  let errorAddress = []

  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    if (row.length < 3) {
      const errorRow = {
        line: i + 1,
        columns: row.length
      }
      errorRowLength.push(errorRow)
    }

    if (row[0] && !Web3.utils.isAddress(row[0])) {
      const errorRow = {
        line: i + 1,
        address: row[0]
      }
      errorAddress.push(errorRow)
    }
  }

  return {
    errorRowLength: errorRowLength,
    errorAddress: errorAddress
  }
}
