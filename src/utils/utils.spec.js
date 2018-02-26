import { countDecimalPlaces, validateDecimals, validateTicker, validateMinCap } from './utils'

describe('countDecimalPlaces', () => {
  [
    { value: '1.123', expected: 3 },
    { value: '1.12', expected: 2 },
    { value: '1.', expected: 0 },
    { value: '1', expected: 0 },
    { value: '.123', expected: 3 },
    { value: .123, expected: 3 },
    { value: '1e-3', expected: 3 },
    { value: '1e-2', expected: 2 },
    { value: '1.2e-2', expected: 3 },
    { value: '1.e-2', expected: 2 },
    { value: '1.23123e2', expected: 3 },
    { value: '123.123e+2', expected: 1 },
    { value: 123.123e+2, expected: 1 },
    { value: '.2e-2', expected: 3 },
    { value: '1', expected: 0 },
    { value: '123', expected: 0 },
    { value: '0', expected: 0 },
    { value: '-123', expected: 0 },
    { value: 'abc', expected: 0 },
    { value: 'e', expected: 0 },
    { value: '', expected: 0 },
    { value: null, expected: 0 },
    { value: false, expected: 0 },
    { value: undefined, expected: 0 }
  ].forEach(testCase => {
    it(`Should count decimals for ${testCase.value}`, () => {
      expect(countDecimalPlaces(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('validateDecimals', () => {
  [
    { value: '', expected: true },
    { value: '0', expected: true },
    { value: '9', expected: true },
    { value: '10', expected: true },
    { value: '18', expected: true },
    { value: '19', expected: false },
    { value: '-1', expected: false },
    { value: '0.5', expected: false },
    { value: '3.5', expected: false },
    { value: '1e10', expected: false }
  ].forEach(testCase => {
    const action = testCase.expected ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(validateDecimals(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('validateTicker', () => {
  [
    {value: '', expected: false},
    {value: '\u2615\u2691', expected: false},
    {value: 'ABcd1e', expected: false},
    {value: 'A-Z', expected: false},
    {value: 'a_1', expected: false},
    {value: 'oh!', expected: false},
    {value: '????', expected: false},
    {value: '1-1A_!', expected: false},
    {value: 'ABC', expected: true},
    {value: '12345', expected: true},
    {value: 'aa', expected: true},
    {value: 'abCD1', expected: true},
  ].forEach(testCase => {
    const action = testCase.expected ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(validateTicker(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('validateMinCap', () => {
  [
    { value: '', expected: true },
    { value: '0', expected: true },
    { value: '00', expected: true },
    { value: '1', expected: true },
    { value: '001', expected: true },
    { value: '150', expected: true },
    { value: '999', expected: true },
    { value: '-10', expected: false },
    { value: .123, expected: false },
    { value: '1.12', expected: false },
    { value: '1.', expected: false },
    { value: '1e10', expected: false },
    { value: '+1', expected: false },
    { value: null, expected: false },
    { value: false, expected: false },
    { value: undefined, expected: false }
  ].forEach(testCase => {
    const action = testCase.expected ? 'pass' : 'fail'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(validateMinCap(testCase.value)).toBe(testCase.expected)
    })
  })
})
