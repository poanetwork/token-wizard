import { validators, validateTokenName, validateTicker, validateDecimals } from './validations'
import { VALIDATION_MESSAGES } from './constants'

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
    { value: undefined , expected: undefined },
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

describe('validators', () => {
  it('Should return false if validator does not exist', () => {
    expect(validators('nonExistent', '')).toBeFalsy()
  })
})
