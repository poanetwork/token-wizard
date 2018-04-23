import {
  composeValidators,
  isAddress,
  isDateInFuture,
  isDateLaterThan,
  isDatePreviousThan,
  isDateSameOrLaterThan,
  isDateSameOrPreviousThan,
  isDecimalPlacesNotGreaterThan,
  isGreaterOrEqualThan,
  isInteger,
  isLessOrEqualThan,
  isMatchingPattern,
  isMaxLength,
  isNonNegative,
  isPositive,
  isRequired,
  validateTierEndDate,
  validateTierStartDate,
  validateWhitelistMax,
  validateWhitelistMin,
} from './validations'
import { VALIDATION_MESSAGES } from './constants'
import MockDate from 'mockdate'

describe('validateWhitelistMin', () => {
  const testCases = [
    { value: { min: '0', max: '1', decimals: '0' }, expected: undefined },
    { value: { min: '0', max: '10', decimals: '0' }, expected: undefined },
    { value: { min: '5', max: '11', decimals: '5' }, expected: undefined },
    { value: { min: '10', max: '10', decimals: '0' }, expected: undefined },
    { value: { min: '10', max: '10', decimals: '7' }, expected: undefined },
    { value: { min: '5', max: '11.123456', decimals: '3' }, expected: undefined },
    { value: { min: '5.123', max: '11.123456', decimals: '3' }, expected: undefined },
    { value: { min: '5.123456', max: '11.123456', decimals: '3' }, expected: 'Decimals should not exceed 3 places' },
    { value: { min: '5.123456', max: '11.123', decimals: '3' }, expected: 'Decimals should not exceed 3 places' },
    { value: { min: '25.123456', max: '11.123', decimals: '3' }, expected: 'Decimals should not exceed 3 places' },
    { value: { min: '25.123', max: '11.123', decimals: '3' }, expected: 'Should be less or equal than max' },
    { value: { min: '5', max: '3', decimals: '0' }, expected: 'Should be less or equal than max' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected ? 'fail' : 'pass'
    const { min, max, decimals } = testCase.value

    it(`Should ${action} for { min: '${min}', max: '${max}', decimals: '${decimals}' }`, () => {
      expect(validateWhitelistMin({ ...testCase.value })).toBe(testCase.expected)
    })
  })
})

describe('validateWhitelistMax', () => {
  const testCases = [
    { value: { min: '0', max: '1', decimals: '0' }, expected: undefined },
    { value: { min: '0', max: '10', decimals: '0' }, expected: undefined },
    { value: { min: '5', max: '11', decimals: '5' }, expected: undefined },
    { value: { min: '10', max: '10', decimals: '0' }, expected: undefined },
    { value: { min: '10', max: '10', decimals: '7' }, expected: undefined },
    { value: { min: '5.123456', max: '11', decimals: '3' }, expected: undefined },
    { value: { min: '5.123345', max: '11.123', decimals: '3' }, expected: undefined },
    { value: { min: '5.123456', max: '11.123456', decimals: '3' }, expected: 'Decimals should not exceed 3 places' },
    { value: { min: '5.123', max: '11.123456', decimals: '3' }, expected: 'Decimals should not exceed 3 places' },
    { value: { min: '25.123', max: '11.123456', decimals: '3' }, expected: 'Decimals should not exceed 3 places' },
    { value: { min: '25.123', max: '11.123', decimals: '3' }, expected: 'Should be greater or equal than min' },
    { value: { min: '5', max: '3', decimals: '0' }, expected: 'Should be greater or equal than min' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected ? 'fail' : 'pass'
    const { min, max, decimals } = testCase.value

    it(`Should ${action} for { min: '${min}', max: '${max}', decimals: '${decimals}' }`, () => {
      expect(validateWhitelistMax({ ...testCase.value })).toBe(testCase.expected)
    })
  })
})

describe('isMaxLength', () => {
  const testCases = [
    { value: '123456789012354678901234567890', errorMessage: undefined, comparedTo: 30, expected: undefined },
    { value: 'ABC', errorMessage: undefined, comparedTo: 30, expected: undefined },
    { value: '', errorMessage: undefined, comparedTo: 30, expected: undefined },
    { value: 'ABCDEF', errorMessage: undefined, comparedTo: 3, expected: VALIDATION_MESSAGES.NAME },
    { value: 'ABCDEF', errorMessage: 'Personalized error message', comparedTo: 3, expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isMaxLength(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isMatchingPattern', () => {
  const testCases = [
    { value: '123456789012354678901234567890', errorMessage: undefined, comparedTo: /^[0-9]*$/, expected: undefined },
    { value: '123456789012354678901234567890', errorMessage: undefined, comparedTo: /^[0-9]{1,30}$/, expected: undefined },
    { value: '1', errorMessage: undefined, comparedTo: /^[0-9]{1,30}$/, expected: undefined },
    { value: 'ABC', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]*$/, expected: undefined },
    { value: 'ABC123', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]*$/, expected: undefined },
    { value: 'ABC123abc', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]*$/, expected: undefined },
    { value: 'ABC123abc', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]{1,10}$/, expected: undefined },
    { value: 'A1a', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]{1,10}$/, expected: undefined },
    { value: '', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]*$/, expected: undefined },
    { value: '', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]+$/, expected: VALIDATION_MESSAGES.PATTERN },
    { value: '@', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]$/, expected: VALIDATION_MESSAGES.PATTERN },
    { value: 'ABCDEF', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]{1,5}$/, expected: VALIDATION_MESSAGES.PATTERN },
    { value: 'ABC@D', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]{1,5}$/, expected: VALIDATION_MESSAGES.PATTERN },
    { value: 'ñandú', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]{1,5}$/, expected: VALIDATION_MESSAGES.PATTERN },
    { value: 'ñandú', errorMessage: undefined, comparedTo: /^[a-zA-Z0-9]{1,5}$/, expected: VALIDATION_MESSAGES.PATTERN },
    { value: 'ñandú', errorMessage: 'Personalized error message', comparedTo: /^[a-zA-Z0-9]{1,5}$/, expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isMatchingPattern(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isPositive', () => {
  const testCases = [
    { value: '1.01', errorMessage: undefined, expected: undefined },
    { value: '5', errorMessage: undefined, expected: undefined },
    { value: '1e4', errorMessage: undefined, expected: undefined },
    { value: '100', errorMessage: undefined, expected: undefined },
    { value: '0.1', errorMessage: undefined, expected: undefined },
    { value: Number.MIN_VALUE, errorMessage: undefined, expected: undefined },
    { value: '0', errorMessage: undefined, expected: VALIDATION_MESSAGES.POSITIVE },
    { value: '-1', errorMessage: undefined, expected: VALIDATION_MESSAGES.POSITIVE },
    { value: '-0.1', errorMessage: undefined, expected: VALIDATION_MESSAGES.POSITIVE },
    { value: '-100', errorMessage: undefined, expected: VALIDATION_MESSAGES.POSITIVE },
    { value: '-100', errorMessage: 'Personalized error message', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isPositive(testCase.errorMessage)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isNonNegative', () => {
  const testCases = [
    { value: '1.01', errorMessage: undefined, expected: undefined },
    { value: '5', errorMessage: undefined, expected: undefined },
    { value: '1e4', errorMessage: undefined, expected: undefined },
    { value: '100', errorMessage: undefined, expected: undefined },
    { value: '0.1', errorMessage: undefined, expected: undefined },
    { value: Number.MIN_VALUE, errorMessage: undefined, expected: undefined },
    { value: '0', errorMessage: undefined, expected: undefined },
    { value: '-1', errorMessage: undefined, expected: VALIDATION_MESSAGES.NON_NEGATIVE },
    { value: '-0.1', errorMessage: undefined, expected: VALIDATION_MESSAGES.NON_NEGATIVE },
    { value: '-100', errorMessage: undefined, expected: VALIDATION_MESSAGES.NON_NEGATIVE },
    { value: '-100', errorMessage: 'Personalized error message', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isNonNegative(testCase.errorMessage)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isAddress', () => {
  const testCases = [
    { value: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', errorMessage: undefined, expected: undefined },
    { value: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1', errorMessage: undefined, expected: undefined },
    { value: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0', errorMessage: undefined, expected: undefined },
    { value: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b', errorMessage: undefined, expected: undefined },
    { value: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d', errorMessage: undefined, expected: undefined },
    { value: '', errorMessage: undefined, expected: VALIDATION_MESSAGES.ADDRESS },
    { value: '0xe11ba2b4d45eaED5996cd0823791e0c93114882d', errorMessage: undefined, expected: VALIDATION_MESSAGES.ADDRESS },
    { value: '0x123', errorMessage: undefined, expected: VALIDATION_MESSAGES.ADDRESS },
    { value: '0x123', errorMessage: 'Personalized error message', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isAddress(testCase.errorMessage)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isRequired', () => {
  const testCases = [
    { value: '1', errorMessage: undefined, expected: undefined },
    { value: 'a', errorMessage: undefined, expected: undefined },
    { value: '0', errorMessage: undefined, expected: undefined },
    { value: 'undefined', errorMessage: undefined, expected: undefined },
    { value: 'null', errorMessage: undefined, expected: undefined },
    { value: 'false', errorMessage: undefined, expected: undefined },
    { value: 0, errorMessage: undefined, expected: undefined },
    { value: false, errorMessage: undefined, expected: undefined },
    { value: undefined, errorMessage: undefined, expected: VALIDATION_MESSAGES.REQUIRED },
    { value: null, errorMessage: undefined, expected: VALIDATION_MESSAGES.REQUIRED },
    { value: '', errorMessage: undefined, expected: VALIDATION_MESSAGES.REQUIRED },
    { value: '', errorMessage: 'Personalized error message', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isRequired(testCase.errorMessage)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isDecimalPlacesNotGreaterThan', () => {
  const testCases = [
    { value: '1', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '1.1', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '1.12', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '1.123', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '1.1234', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '1.12345', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '1.123456', errorMessage: undefined, comparedTo: '5', expected: VALIDATION_MESSAGES.DECIMAL_PLACES },
    { value: '1.1234567', errorMessage: undefined, comparedTo: '5', expected: VALIDATION_MESSAGES.DECIMAL_PLACES },
    { value: '1.1234567', errorMessage: 'Personalized error message', comparedTo: '5', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isDecimalPlacesNotGreaterThan(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isLessOrEqualThan', () => {
  const testCases = [
    { value: '1', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '1.1', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '2', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '3', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '4', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '5', errorMessage: undefined, comparedTo: undefined, expected: undefined },
    { value: '1000000000000000000', errorMessage: undefined, comparedTo: '1e18', expected: undefined },
    { value: '999999999999999999', errorMessage: undefined, comparedTo: '1e18', expected: undefined },
    { value: 'not-a-number', errorMessage: undefined, comparedTo: '1e18', expected: VALIDATION_MESSAGES.LESS_OR_EQUAL },
    { value: '10000000000000000001', errorMessage: undefined, comparedTo: '1e18', expected: VALIDATION_MESSAGES.LESS_OR_EQUAL },
    { value: '5.1', errorMessage: undefined, comparedTo: '5', expected: VALIDATION_MESSAGES.LESS_OR_EQUAL },
    { value: '6', errorMessage: undefined, comparedTo: '5', expected: VALIDATION_MESSAGES.LESS_OR_EQUAL },
    { value: '6', errorMessage: 'Personalized error message', comparedTo: '5', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isLessOrEqualThan(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isGreaterOrEqualThan', () => {
  const testCases = [
    { value: '10', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '10.1', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '20', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '30', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '40', errorMessage: undefined, comparedTo: '5', expected: undefined },
    { value: '50', errorMessage: undefined, comparedTo: undefined, expected: undefined },
    { value: '0.1', errorMessage: undefined, comparedTo: '0.1', expected: undefined },
    { value: '0.1234', errorMessage: undefined, comparedTo: '0.1', expected: undefined },
    { value: 'not-a-number', errorMessage: undefined, comparedTo: '0.1', expected: VALIDATION_MESSAGES.GREATER_OR_EQUAL },
    { value: '0.0001', errorMessage: undefined, comparedTo: '0.1', expected: VALIDATION_MESSAGES.GREATER_OR_EQUAL },
    { value: '0', errorMessage: undefined, comparedTo: '0.1', expected: VALIDATION_MESSAGES.GREATER_OR_EQUAL },
    { value: '-10', errorMessage: undefined, comparedTo: '0.1', expected: VALIDATION_MESSAGES.GREATER_OR_EQUAL },
    { value: '-10', errorMessage: 'Personalized error message', comparedTo: '0.1', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isGreaterOrEqualThan(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('isInteger', () => {
  const testCases = [
    { value: '1', errorMessage: undefined, expected: undefined },
    { value: '1.', errorMessage: undefined, expected: undefined },
    { value: '2', errorMessage: undefined, expected: undefined },
    { value: '1000000000000000000', errorMessage: undefined, expected: undefined },
    { value: '5.1', errorMessage: undefined, expected: VALIDATION_MESSAGES.INTEGER },
    { value: '1e-4', errorMessage: undefined, expected: VALIDATION_MESSAGES.INTEGER },
    { value: '.12', errorMessage: undefined, expected: VALIDATION_MESSAGES.INTEGER },
    { value: 'abc', errorMessage: undefined, expected: VALIDATION_MESSAGES.INTEGER },
    { value: '0.12', errorMessage: undefined, expected: VALIDATION_MESSAGES.INTEGER },
    { value: '0.12', errorMessage: 'Personalized error message', expected: 'Personalized error message' },
  ]

  testCases.forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(isInteger(testCase.errorMessage)(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('Date/Time validations', () => {
  const TIMESTAMPS = {
    CURRENT_TIME: 1520852400000,
    PLUS_5_MINUTES: 1520852700000,
    PLUS_10_DAYS: 1521716400000,
    MINUS_5_MINUTES: 1520852100000,
    MINUS_10_DAYS: 1519988400000,
  }

  const getKeyByValue = (value) => Object.keys(TIMESTAMPS).find(key => TIMESTAMPS[key] === value)

  beforeEach(() => {
    MockDate.set(TIMESTAMPS.CURRENT_TIME)
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('isDateInFuture', () => {
    const testCases = [
      { value: TIMESTAMPS.PLUS_5_MINUTES, errorMessage: undefined, expected: undefined },
      { value: TIMESTAMPS.CURRENT_TIME, errorMessage: undefined, expected: VALIDATION_MESSAGES.DATE_IN_FUTURE },
      { value: TIMESTAMPS.MINUS_5_MINUTES, errorMessage: undefined, expected: VALIDATION_MESSAGES.DATE_IN_FUTURE },
      {
        value: TIMESTAMPS.CURRENT_TIME,
        errorMessage: 'Personalized error message',
        expected: 'Personalized error message'
      },
    ]

    testCases.forEach(testCase => {
      const action = testCase.expected === undefined ? 'pass' : 'fail'

      it(`Should ${action} for '${getKeyByValue(testCase.value)}'`, () => {
        expect(isDateInFuture(testCase.errorMessage)(testCase.value)).toBe(testCase.expected)
      })
    })
  })

  describe('isDatePreviousThan', () => {
    const testCases = [
      {
        value: TIMESTAMPS.MINUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: undefined
      },
      {
        value: TIMESTAMPS.PLUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.PLUS_10_DAYS,
        expected: undefined
      },
      {
        value: TIMESTAMPS.PLUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: VALIDATION_MESSAGES.DATE_IS_PREVIOUS
      },
      {
        value: TIMESTAMPS.PLUS_10_DAYS,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.MINUS_10_DAYS,
        expected: VALIDATION_MESSAGES.DATE_IS_PREVIOUS
      },
      {
        value: TIMESTAMPS.CURRENT_TIME,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: VALIDATION_MESSAGES.DATE_IS_PREVIOUS
      },
      {
        value: TIMESTAMPS.CURRENT_TIME,
        errorMessage: 'Personalized error message',
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: 'Personalized error message'
      },
    ]

    testCases.forEach(testCase => {
      const action = testCase.expected === undefined ? 'pass' : 'fail'

      it(`Should ${action} for '${getKeyByValue(testCase.value)} compared to ${getKeyByValue(testCase.comparedTo)}'`, () => {
        expect(isDatePreviousThan(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
      })
    })
  })

  describe('isDateSameOrLaterThan', () => {
    const testCases = [
      {
        value: TIMESTAMPS.PLUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: undefined
      },
      {
        value: TIMESTAMPS.PLUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.MINUS_10_DAYS,
        expected: undefined
      },
      {
        value: TIMESTAMPS.CURRENT_TIME,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: undefined
      },
      {
        value: TIMESTAMPS.MINUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: VALIDATION_MESSAGES.DATE_IS_SAME_OR_LATER
      },
      {
        value: TIMESTAMPS.MINUS_10_DAYS,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.PLUS_10_DAYS,
        expected: VALIDATION_MESSAGES.DATE_IS_SAME_OR_LATER
      },
      {
        value: TIMESTAMPS.MINUS_10_DAYS,
        errorMessage: 'Personalized error message',
        comparedTo: TIMESTAMPS.PLUS_10_DAYS,
        expected: 'Personalized error message'
      },
    ]

    testCases.forEach(testCase => {
      const action = testCase.expected === undefined ? 'pass' : 'fail'

      it(`Should ${action} for '${getKeyByValue(testCase.value)} compared to ${getKeyByValue(testCase.comparedTo)}'`, () => {
        expect(isDateSameOrLaterThan(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
      })
    })
  })

  describe('isDateLaterThan', () => {
    const testCases = [
      {
        value: TIMESTAMPS.PLUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: undefined
      },
      {
        value: TIMESTAMPS.PLUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.MINUS_10_DAYS,
        expected: undefined
      },
      {
        value: TIMESTAMPS.CURRENT_TIME,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: VALIDATION_MESSAGES.DATE_IS_LATER
      },
      {
        value: TIMESTAMPS.MINUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: VALIDATION_MESSAGES.DATE_IS_LATER
      },
      {
        value: TIMESTAMPS.MINUS_10_DAYS,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.PLUS_10_DAYS,
        expected: VALIDATION_MESSAGES.DATE_IS_LATER
      },
      {
        value: TIMESTAMPS.MINUS_10_DAYS,
        errorMessage: 'Personalized error message',
        comparedTo: TIMESTAMPS.PLUS_10_DAYS,
        expected: 'Personalized error message'
      },
    ]

    testCases.forEach(testCase => {
      const action = testCase.expected === undefined ? 'pass' : 'fail'

      it(`Should ${action} for '${getKeyByValue(testCase.value)} compared to ${getKeyByValue(testCase.comparedTo)}'`, () => {
        expect(isDateLaterThan(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
      })
    })
  })

  describe('isDateSameOrPreviousThan', () => {
    const testCases = [
      {
        value: TIMESTAMPS.MINUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: undefined
      },
      {
        value: TIMESTAMPS.MINUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.PLUS_10_DAYS,
        expected: undefined
      },
      {
        value: TIMESTAMPS.CURRENT_TIME,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: undefined
      },
      {
        value: TIMESTAMPS.PLUS_5_MINUTES,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.CURRENT_TIME,
        expected: VALIDATION_MESSAGES.DATE_IS_SAME_OR_PREVIOUS
      },
      {
        value: TIMESTAMPS.PLUS_10_DAYS,
        errorMessage: undefined,
        comparedTo: TIMESTAMPS.MINUS_10_DAYS,
        expected: VALIDATION_MESSAGES.DATE_IS_SAME_OR_PREVIOUS
      },
      {
        value: TIMESTAMPS.PLUS_10_DAYS,
        errorMessage: 'Personalized error message',
        comparedTo: TIMESTAMPS.MINUS_10_DAYS,
        expected: 'Personalized error message'
      },
    ]

    testCases.forEach(testCase => {
      const action = testCase.expected === undefined ? 'pass' : 'fail'

      it(`Should ${action} for '${getKeyByValue(testCase.value)} compared to ${getKeyByValue(testCase.comparedTo)}'`, () => {
        expect(isDateSameOrPreviousThan(testCase.errorMessage)(testCase.comparedTo)(testCase.value)).toBe(testCase.expected)
      })
    })
  })
})

describe('composeValidators', () => {
  it('Should return an array of errors', () => {
    const listOfErrors = composeValidators(
      isRequired(),
      isNonNegative(),
    )(-123)

    expect(Array.isArray(listOfErrors)).toBeTruthy()
  })

  it('Should return "undefined" if there is no error', () => {
    const listOfErrors = composeValidators(
      isRequired(),
      isNonNegative(),
    )(123)

    expect(listOfErrors).toBeUndefined()
  })
})

describe('validateTierStartDate', () => {
  const TIMESTAMPS = {
    CURRENT_TIME: 1520852400000,
    PLUS_5_MINUTES: 1520852700000,
    PLUS_10_DAYS: 1521716400000,
    MINUS_5_MINUTES: 1520852100000,
    MINUS_10_DAYS: 1519988400000,
  }

  afterEach(() => {
    MockDate.reset()
  })

  it('should fail if startTime is previous than current time', () => {
    const values = {
      tiers: [
        {
          startTime: TIMESTAMPS.CURRENT_TIME,
          endTime: TIMESTAMPS.PLUS_5_MINUTES,
        },
        {
          startTime: TIMESTAMPS.PLUS_5_MINUTES,
          endTime: TIMESTAMPS.PLUS_10_DAYS,
        },
      ]
    }

    MockDate.set(TIMESTAMPS.PLUS_5_MINUTES)

    const validationResult = validateTierStartDate(0)(values.tiers[0].startTime, values)

    expect(validationResult).toEqual([VALIDATION_MESSAGES.DATE_IN_FUTURE])
  })

  it('should fail if startTime is same or later than same tier\'s endTime', () => {
    const values = {
      tiers: [
        {
          startTime: TIMESTAMPS.PLUS_5_MINUTES,
          endTime: TIMESTAMPS.PLUS_5_MINUTES,
        },
        {
          startTime: TIMESTAMPS.PLUS_5_MINUTES,
          endTime: TIMESTAMPS.PLUS_10_DAYS,
        },
      ]
    }

    MockDate.set(TIMESTAMPS.CURRENT_TIME)

    const validationResult = validateTierStartDate(0)(values.tiers[0].startTime, values)

    expect(validationResult).toEqual(["Should be previous than same tier's End Time"])
  })

  it('should fail if startTime is before than previous tier\'s endTime', () => {
    const values = {
      tiers: [
        {
          startTime: TIMESTAMPS.MINUS_5_MINUTES,
          endTime: TIMESTAMPS.PLUS_5_MINUTES,
        },
        {
          startTime: TIMESTAMPS.CURRENT_TIME,
          endTime: TIMESTAMPS.PLUS_10_DAYS,
        },
      ]
    }

    MockDate.set(TIMESTAMPS.MINUS_5_MINUTES)

    const validationResult = validateTierStartDate(1)(values.tiers[1].startTime, values)

    expect(validationResult).toEqual(["Should be same or later than previous tier's End Time"])
  })
})

describe('validateTierEndDate', () => {
  const TIMESTAMPS = {
    CURRENT_TIME: 1520852400000,
    PLUS_5_MINUTES: 1520852700000,
    PLUS_10_DAYS: 1521716400000,
    MINUS_5_MINUTES: 1520852100000,
    MINUS_10_DAYS: 1519988400000,
  }

  afterEach(() => {
    MockDate.reset()
  })

  it('should fail if endTime is previous than current time', () => {
    const values = {
      tiers: [
        {
          startTime: TIMESTAMPS.MINUS_5_MINUTES,
          endTime: TIMESTAMPS.CURRENT_TIME,
        },
        {
          startTime: TIMESTAMPS.PLUS_5_MINUTES,
          endTime: TIMESTAMPS.PLUS_10_DAYS,
        },
      ]
    }

    MockDate.set(TIMESTAMPS.PLUS_5_MINUTES)

    const validationResult = validateTierEndDate(0)(values.tiers[0].endTime, values)

    expect(validationResult).toEqual([VALIDATION_MESSAGES.DATE_IN_FUTURE])
  })

  it('should fail if endTime is same or previous than same tier\'s startTime', () => {
    const values = {
      tiers: [
        {
          startTime: TIMESTAMPS.PLUS_5_MINUTES,
          endTime: TIMESTAMPS.CURRENT_TIME,
        },
        {
          startTime: TIMESTAMPS.PLUS_5_MINUTES,
          endTime: TIMESTAMPS.PLUS_10_DAYS,
        },
      ]
    }

    MockDate.set(TIMESTAMPS.MINUS_5_MINUTES)

    const validationResult = validateTierEndDate(0)(values.tiers[0].endTime, values)

    expect(validationResult).toEqual(["Should be later than same tier's Start Time"])
  })

  it('should fail if endTime is after than next tier\'s startTime', () => {
    const values = {
      tiers: [
        {
          startTime: TIMESTAMPS.MINUS_5_MINUTES,
          endTime: TIMESTAMPS.PLUS_5_MINUTES,
        },
        {
          startTime: TIMESTAMPS.CURRENT_TIME,
          endTime: TIMESTAMPS.PLUS_10_DAYS,
        },
      ]
    }

    MockDate.set(TIMESTAMPS.MINUS_5_MINUTES)

    const validationResult = validateTierEndDate(0)(values.tiers[1].endTime, values)

    expect(validationResult).toEqual(["Should be same or previous than next tier's Start Time"])
  })
})
