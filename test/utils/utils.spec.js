import { countDecimalPlaces, acceptPositiveIntegerOnly, truncateStringInTheMiddle } from '../../src/utils/utils'

describe('countDecimalPlaces', () => {
  let testsValues = [
    { value: '1.123', expected: 3 },
    { value: '1.12', expected: 2 },
    { value: '1.', expected: 0 },
    { value: '1', expected: 0 },
    { value: '.123', expected: 3 },
    { value: 0.123, expected: 3 },
    { value: '1e-3', expected: 3 },
    { value: '1e-2', expected: 2 },
    { value: '1.2e-2', expected: 3 },
    { value: '1.e-2', expected: 2 },
    { value: '1.23123e2', expected: 3 },
    { value: '123.123e+2', expected: 1 },
    { value: 123.123e2, expected: 1 },
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
  ]
  testsValues.forEach(testCase => {
    it(`Should count decimals for ${testCase.value}`, () => {
      expect(countDecimalPlaces(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('acceptPositiveIntegerOnly', () => {
  let testsValues = [
    { value: '', expected: '' },
    { value: 'a', expected: '' },
    { value: function() {}, expected: '' },
    { value: undefined, expected: '' },
    { value: false, expected: '' },
    { value: 'e', expected: '' },
    { value: '.', expected: '' },
    { value: 'as123', expected: '' },
    { value: '-123', expected: '' },
    { value: '123', expected: '123' },
    { value: '12e1', expected: '12' },
    { value: 22 * 2, expected: '44' },
    { value: 35.3 * 2, expected: '70' }
  ]
  testsValues.forEach(testCase => {
    const action = testCase.expected === '' ? 'fail' : 'pass'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(acceptPositiveIntegerOnly(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('truncateStringInTheMiddle', () => {
  let testsValues = [
    {
      value: '1111111111111111111111111111111111111111111111111111111111111111111111',
      expected: '111111111111111111111111...1111111111111111111111111'
    },
    {
      value: '11111111111111111111111111111111111111111111111111',
      expected: '11111111111111111111111111111111111111111111111111'
    },
    {
      value: '222222222222222222222222222222222222222222222222222',
      expected: '222222222222222222222222...2222222222222222222222222'
    },
    {
      value: '0x6f44df24c7ff88c99a94e9e488e31ba321c3bf10ac90770cfa94faa421c6c17e',
      expected: '0x6f44df24c7ff88c99a94e9...0ac90770cfa94faa421c6c17e'
    },
    { value: 'a', expected: 'a' },
    { value: undefined, expected: undefined },
    { value: false, expected: false },
    { value: 'e', expected: 'e' },
    { value: '.', expected: '.' },
    { value: 'as123', expected: 'as123' },
    { value: '-123', expected: '-123' },
    { value: '123', expected: '123' },
    { value: '12e1', expected: '12e1' },
    { value: 22 * 2, expected: 44 },
    { value: 35.3 * 2, expected: 70.6 }
  ]
  testsValues.forEach(testCase => {
    const action = testCase.expected === '' ? 'fail' : 'pass'

    it(`Should ${action} for '${testCase.value}'`, () => {
      expect(truncateStringInTheMiddle(testCase.value)).toBe(testCase.expected)
    })
  })
})
