import { isAddress, validateWhitelistMin, validateWhitelistMax } from './validations'

/**
 * Execute a callback with each valid whitelist item in the given list
 *
 * @param {Object} whitelistInformation
 * @param {Array} whitelistInformation.rows Array of whitelist items. Each element in the array has the structure
 * `[address, min, max]`, for example: `['0x1234567890123456789012345678901234567890', '1', '10']`
 * @param {Number} whitelistInformation.decimals Amount of decimals allowed for the min and max values
 * @param {Function} cb The function to be called with each valid item
 * @param {Function} cbValidation The function to be called to validate length
 * @returns {Object} Object with a `called` property, indicating the number of times the callback was called
 */
export default function({ rows, decimals }, cb, cbValidation) {
  let called = 0
  let whitelistedAddressLengthError = false
  for (let row of rows) {
    let validLength = cbValidation()
    if (!validLength) {
      whitelistedAddressLengthError = true
      break
    }

    if (row.length !== 3) {
      continue
    }

    const [addr, min, max] = row

    if (
      isAddress()(addr) ||
      validateWhitelistMin({ min, max, decimals }) ||
      validateWhitelistMax({ min, max, decimals })
    ) {
      continue
    }

    cb({ addr, min, max })
    called++
  }

  return {
    called: called,
    whitelistedAddressLengthError: whitelistedAddressLengthError
  }
}
