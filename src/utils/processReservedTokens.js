import { isAddress, isDecimalPlacesNotGreaterThan, isPositive, isRequired } from './validations'
import { CSVError } from './errors'

export const processCsv = ({ rows }, cb, reservedTokenStore) => {
  let called = 0
  let reservedTokenLengthError = false
  for (let row of rows) {
    let validLength = reservedTokenStore.validateLength
    if (!validLength) {
      reservedTokenLengthError = true
      break
    }

    let [addr, dim, val] = row
    if (addr && dim && val) {
      dim = dim.trim().toLowerCase()
      val = val.trim()
      cb({ addr, dim, val })

      called++
    }
  }

  return {
    called: called,
    reservedTokenLengthError: reservedTokenLengthError
  }
}

export const errorsCsv = (data, decimals) => {
  let errorLessRowLength = []
  let errorHigherRowLength = []
  let errorAddress = []
  let errorEmpty = []
  let errorDim = []
  let errorDimValue = []

  // Check for empty
  if (data.length === 0) {
    const errorRow = {
      rows: 0
    }
    errorEmpty.push(errorRow)
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    // Check for higher length of rows
    if (row.length > 3) {
      const errorRow = {
        line: i + 1,
        columns: row.length
      }
      errorHigherRowLength.push(errorRow)
    }

    // Check for less length of row
    if (row.length < 3) {
      const errorRow = {
        line: i + 1,
        columns: row.length
      }
      errorLessRowLength.push(errorRow)
    }

    // Check for valid address
    let [address, dim, val] = row
    if (isAddress()(address) !== undefined) {
      const errorRow = {
        line: i + 1,
        address: address
      }
      errorAddress.push(errorRow)
    }

    if (dim) {
      dim = dim.trim().toLowerCase()
    }

    if (val) {
      val = val.trim()
    }

    // `dim` must be either 'tokens' or 'percentage'
    if (dim && !['tokens', 'percentage'].includes(dim)) {
      const errorRow = {
        line: i + 1,
        dim: dim
      }
      errorDim.push(errorRow)
    }

    // `dim` must be either 'tokens' or 'percentage'
    if (dim === 'tokens') {
      let errorRow = {
        line: i + 1,
        dim: dim,
        value: val,
        type: 'tokens'
      }
      if (isRequired()(val)) {
        errorRow.validationType = 'required'
        errorDimValue.push(errorRow)
      }
      if (isPositive()(val)) {
        errorRow.validationType = 'positive'
        errorDimValue.push(errorRow)
      }
      if (isDecimalPlacesNotGreaterThan()(decimals)(val)) {
        errorRow.validationType = 'decimalPlacesNotGreaterThan'
        errorDimValue.push(errorRow)
      }
    }

    if (dim === 'percentage') {
      let errorRow = {
        line: i + 1,
        dim: dim,
        value: val,
        type: 'percentage'
      }
      if (isRequired()(val)) {
        errorRow.validationType = 'required'
        errorDimValue.push(errorRow)
      }
      if (isPositive()(val)) {
        errorRow.validationType = 'positive'
        errorDimValue.push(errorRow)
      }
    }
  }

  if (errorEmpty && errorEmpty.length > 0) {
    throw new CSVError({
      code: 100,
      body: errorEmpty
    })
  }

  if (errorLessRowLength && errorLessRowLength.length > 0) {
    throw new CSVError({
      code: 101,
      body: errorLessRowLength
    })
  }

  if (errorHigherRowLength && errorHigherRowLength.length > 0) {
    throw new CSVError({
      code: 102,
      body: errorHigherRowLength
    })
  }

  if (errorAddress && errorAddress.length > 0) {
    throw new CSVError({
      code: 103,
      body: errorAddress
    })
  }

  if (errorDim && errorDim.length > 0) {
    throw new CSVError({
      code: 104,
      body: errorDim
    })
  }

  if (errorDimValue && errorDimValue.length > 0) {
    throw new CSVError({
      code: 105,
      body: errorDimValue
    })
  }

  return {
    errorEmpty: errorEmpty,
    errorLessRowLength: errorLessRowLength,
    errorHigherRowLength: errorHigherRowLength,
    errorAddress: errorAddress,
    errorDim: errorDim,
    errorDimValue: errorDimValue
  }
}
