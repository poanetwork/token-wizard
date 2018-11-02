import {
  isAddress,
  isInteger,
  isLessOrEqualThan,
  isGreaterOrEqualThan,
  isNonNegative,
  isDecimalPlacesNotGreaterThan,
  isRequired
} from './validations'

export const processCsv = ({ rows }, tierStore, tierIndex) => {
  let called = 0
  let whitelistAddressLengthError = false
  let whitelistSupplyLengthError = false
  for (let row of rows) {
    let validLength = tierStore.validateWhitelistedAddressLength(tierIndex)
    if (!validLength) {
      whitelistAddressLengthError = true
      break
    }

    let [addr, min, max] = row

    let validSupply = typeof isLessOrEqualThan()(tierStore.tiers[tierIndex].supply)(max) === undefined
    if (validSupply) {
      whitelistSupplyLengthError = true
      break
    }

    if (addr && min && max) {
      tierStore.addWhitelistItem({ addr, min, max }, tierIndex)
      called++
    }
  }

  return {
    called: called,
    whitelistAddressLengthError: whitelistAddressLengthError,
    whitelistSupplyLengthError: whitelistSupplyLengthError
  }
}

export const errorsCsv = (data, decimals, tierStore, num) => {
  let errors = []

  // Check for empty
  if (data.length === 0) {
    errors.push('Empty CSV file. Nothing was imported.')
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const line = i + 1

    // Check for higher or less length of rows
    if (row.length > 3 || row.length < 3) {
      const columnLabel = row.length > 1 ? 'columns' : 'column'
      errors.push(`The line number ${line} have ${row.length} ${columnLabel}, must have 3 columns.`)
    }

    // Check for valid address
    let [address, min, max] = row
    const minTitle = min ? min : 'empty'
    const maxTitle = max ? max : 'empty'

    if (isAddress()(address) !== undefined) {
      errors.push(`The line number ${line} has an incorrect address. Actual value is ${address}.`)
    }

    // Check for min is integer
    if (isInteger()(min) !== undefined) {
      errors.push(`The line number ${line} has an incorrect minCap, must be a integer. Actual value is ${minTitle}.`)
    } else if (isRequired()(min) !== undefined) {
      // Check for min is required
      errors.push(`The line number ${line} need a minCap.`)
    }

    // Check for max is integer
    if (isInteger()(max) !== undefined) {
      errors.push(`The line number ${line} has an incorrect maxCap, must be a integer. Actual value is ${maxTitle}.`)
    } else if (isRequired()(max) !== undefined) {
      // Check for max is required
      errors.push(`The line number ${line} need a maxCap.`)
    }

    if (isInteger()(min) === undefined && isNonNegative()(min) !== undefined) {
      errors.push(`The line number ${line} has a negative value for minCap. Actual value is ${minTitle}.`)
    }

    if (isInteger()(max) === undefined && isNonNegative()(max) !== undefined) {
      errors.push(`The line number ${line} has a negative value for maxCap. Actual value is ${maxTitle}.`)
    }

    if (isDecimalPlacesNotGreaterThan()(decimals)(min) !== undefined) {
      errors.push(`The line number ${line} has a wrong decimal places for minCap. Actual value is ${minTitle}.`)
    }

    if (isDecimalPlacesNotGreaterThan()(decimals)(max) !== undefined) {
      errors.push(`The line number ${line} has a wrong decimal places for maxCap. Actual value is ${maxTitle}.`)
    }

    if (
      isInteger()(min) === undefined &&
      isInteger()(max) === undefined &&
      isLessOrEqualThan()(max)(min) !== undefined
    ) {
      errors.push(`The line number ${line} has a greather minCap than maxCap. Actual value is ${minTitle}.`)
    }

    if (
      isInteger()(min) === undefined &&
      isInteger()(max) === undefined &&
      isGreaterOrEqualThan()(min)(max) !== undefined
    ) {
      errors.push(`The line number ${line} has a less maxCap than minCap. Actual value is ${maxTitle}.`)
    }

    // Check for max cap exceeds
    if (isInteger()(max) === undefined && isLessOrEqualThan()(tierStore.tiers[num].supply)(max) !== undefined) {
      errors.push(`The line number ${line} has a maxCap that exceeds the total supply. Actual value is ${maxTitle}.`)
    }
  }

  return {
    errors: errors
  }
}
