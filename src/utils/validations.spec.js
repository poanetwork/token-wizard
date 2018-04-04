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
  isNonNegative,
  isPositive,
  isRequired,
  validateDecimals,
  validateTicker,
  validateTokenName,
  validators
} from './validations'
import { VALIDATION_MESSAGES } from './constants'
import MockDate from 'mockdate'

describe('validateTokenName', () => {
  [
    { value: '', expected: VALIDATION_MESSAGES.NAME },
    { value: 'T', expected: undefined },
    { value: 'MyToken', expected: undefined },
    { value: '123456789012345678901234567890', undefined },
    { value: '1234567890123456789012345678901', expected: VALIDATION_MESSAGES.NAME },
    { value: 23, expected: VALIDATION_MESSAGES.NAME },
    { value: ['my', 'token'], expected: VALIDATION_MESSAGES.NAME },
    { value: { a: 1 }, expected: VALIDATION_MESSAGES.NAME },
  ].forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(validateTokenName(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('validateTicker', () => {
  [
    { value: '', expected: VALIDATION_MESSAGES.TICKER },
    { value: '\u2615\u2691', expected: VALIDATION_MESSAGES.TICKER },
    { value: 'ABcd1e', expected: VALIDATION_MESSAGES.TICKER },
    { value: 'A-Z', expected: VALIDATION_MESSAGES.TICKER },
    { value: 'a_1', expected: VALIDATION_MESSAGES.TICKER },
    { value: 'oh!', expected: VALIDATION_MESSAGES.TICKER },
    { value: '????', expected: VALIDATION_MESSAGES.TICKER },
    { value: '1-1A_!', expected: VALIDATION_MESSAGES.TICKER },
    { value: 'ABC', expected: undefined },
    { value: '12345', expected: undefined },
    { value: 'aa', expected: undefined },
    { value: 'abCD1', expected: undefined },
  ].forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(validateTicker(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('validateDecimals', () => {
  [
    { value: '100', expected: VALIDATION_MESSAGES.DECIMALS },
    { value: '-10', expected: VALIDATION_MESSAGES.DECIMALS },
    { value: '20', expected: VALIDATION_MESSAGES.DECIMALS },
    { value: '1.5', expected: VALIDATION_MESSAGES.DECIMALS },
    { value: '1.', expected: VALIDATION_MESSAGES.DECIMALS },
    { value: '1e1', expected: VALIDATION_MESSAGES.DECIMALS },
    { value: '--', expected: VALIDATION_MESSAGES.DECIMALS },
    { value: undefined, expected: undefined },
    { value: '', expected: undefined },
    { value: '0', expected: undefined },
    { value: '1', expected: undefined },
    { value: '10', expected: undefined },
    { value: '18', expected: undefined },
  ].forEach(testCase => {
    const action = testCase.expected === undefined ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(validateDecimals(testCase.value)).toBe(testCase.expected)
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
    { value: false, errorMessage: undefined, expected: VALIDATION_MESSAGES.REQUIRED },
    { value: undefined, errorMessage: undefined, expected: VALIDATION_MESSAGES.REQUIRED },
    { value: 0, errorMessage: undefined, expected: VALIDATION_MESSAGES.REQUIRED },
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

describe('validators', () => {
  it('Should return false if validator does not exist', () => {
    expect(validators('nonExistent', '')).toBeFalsy()
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

  it('Should return an empty array if there is no error', () => {
    const listOfErrors = composeValidators(
      isRequired(),
      isNonNegative(),
    )(123)

    expect(Array.isArray(listOfErrors)).toBeTruthy()
    expect(listOfErrors.length).toBe(0)
  })
})
