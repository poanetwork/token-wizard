import Web3 from 'web3'

const isNumber = (number) => !isNaN(parseFloat(number))

/**
 * Execute a callback with each valid whitelist item in the given list
 *
 * @param {Array} rows Array of reserved tokens items. Each element in the array has the structure `[address, dim, val]`, for
 * example: `['0x1234567890123456789012345678901234567890', 'tokens', '10']`
 * @param {Function} cb The function to be called with each valid item
 * @returns {Object} Object with a `called` property, indicating the number of times the callback was called
 */
export default function (rows, cb) {
  let called = 0
  rows.forEach((row) => {
    if (row.length !== 3) return

    const [addr, dim, val] = row

    if (!Web3.utils.isAddress(addr) || !dim || !isNumber(val)) return

    // `dim` must be either 'tokens' or 'percentage'
    if (!['tokens', 'percentage'].includes(dim.toLowerCase())) return

    cb({ addr, dim, val })

    called++
  })

  return { called }
}

