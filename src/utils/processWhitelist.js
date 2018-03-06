import Web3 from 'web3'

const isNumber = (number) => !isNaN(parseFloat(number))

/**
 * Execute a callback with each valid whitelist item in the given list
 *
 * @param {Array} rows Array of whitelist items. Each element in the array has the structure `[address, min, max]`, for
 * example: `['0x1234567890123456789012345678901234567890', '1', '10']`
 * @param {Function} cb The function to be called with each valid item
 * @returns {Object} Object with a `called` property, indicating the number of times the callback was called
 */
export default function (rows, cb) {
  let called = 0
  rows.forEach((row) => {
    if (row.length !== 3) return

    const [addr, min, max] = row

    if (!Web3.utils.isAddress(addr) || !isNumber(min) || !isNumber(max)) return

    cb({ addr, min, max })

    called++
  })

  return { called }
}

