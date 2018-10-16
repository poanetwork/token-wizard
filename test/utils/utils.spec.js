import {
  acceptPositiveIntegerOnly,
  countDecimalPlaces,
  objectKeysToLowerCase,
  removeTrailingNUL,
  toBigNumber,
  truncateStringInTheMiddle,
  validateSupply,
  validateTier,
  navigateTo,
  downloadFile,
  uniqueElementsBy
} from '../../src/utils/utils'

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

describe('removeTrailingNUL', () => {
  const testCases = [
    { value: 'My Token\x00\x00\x00   ', expected: 'My Token\x00\x00\x00   ' },
    { value: 'My Token\x00\x00\x00', expected: 'My Token' },
    { value: '\x00My Token\x00\x00\x00', expected: '\x00My Token' },
    { value: 'My Token', expected: 'My Token' }
  ]

  testCases.forEach(testCase => {
    it(`should only remove trailing NULs for ${JSON.stringify(testCase.value)}`, () => {
      expect(removeTrailingNUL(testCase.value)).toBe(testCase.expected)
    })
  })
})

describe('toBigNumber', () => {
  it(`should force a 0 BigNumber instance to be returned for an invalid argument`, () => {
    // Given
    const invalidValue = 'invalid value'

    // When
    const bn = toBigNumber(invalidValue)

    // Then
    expect(bn._isBigNumber).toBeTruthy()
    expect(bn.toFixed()).toBe('0')
  })

  it(`should return undefined if its not forced`, () => {
    // Given
    const invalidValue = 'invalid value'

    // When
    const bn = toBigNumber(invalidValue, false)

    // Then
    expect(bn).toBeUndefined()
  })

  it(`should return a BigNumber instance for '1e123'`, () => {
    // Given
    const stringNumericValue = '1e123'

    // When
    const bn = toBigNumber(stringNumericValue)

    // Then
    expect(bn._isBigNumber).toBeTruthy()
  })

  it(`should return a BigNumber instance for a number 2.231`, () => {
    // Given
    const numericValue = 2.231

    // When
    const bn = toBigNumber(numericValue)

    // Then
    expect(bn._isBigNumber).toBeTruthy()
  })
})

describe('objectKeysToLowerCase', () => {
  it(`should return an object with all keys in lower case`, () => {
    // Given
    const collection = [
      {
        KEY_UPPERCASED: ['thing', 'Another thing'],
        KEY_Mixed: 'a value'
      },
      ['this is a mixed thing', { KEY: 'will it cast this key as well?' }],
      {
        ANOTHER_KEY: 'text'
      }
    ]
    const expectedResult = [
      {
        key_uppercased: ['thing', 'Another thing'],
        key_mixed: 'a value'
      },
      ['this is a mixed thing', { key: 'will it cast this key as well?' }],
      { another_key: 'text' }
    ]

    // When
    const collectionToLowercase = objectKeysToLowerCase(collection)

    // Then
    expect(collectionToLowercase).toEqual(expectedResult)
  })
})

describe('validateTier', () => {
  const testCases = [
    { value: 'really long string that will not pass the validation', expected: false },
    { value: 'short string', expected: true },
    { value: '01234567890123456789012345678', expected: true },
    { value: '012345678901234567890123456789', expected: false },
    { value: '0123456789012345678901234567890', expected: false },
    { value: '', expected: false }
  ]

  testCases.forEach(({ value, expected }) => {
    const action = expected ? 'pass' : 'fail'

    it(`should ${action} for '${value}'`, () => {
      expect(validateTier(value)).toBe(expected)
    })
  })
})

describe('validateSupply', () => {
  const testCases = [
    { value: 123, expected: true },
    { value: 0, expected: false },
    { value: '0', expected: false },
    { value: '', expected: false },
    { value: 'abc', expected: false },
    { value: '0xf4', expected: true },
    { value: '0x0', expected: false }
  ]

  testCases.forEach(({ value, expected }) => {
    const action = expected ? 'pass' : 'fail'

    it(`should ${action} for '${value}'`, () => {
      expect(validateSupply(value)).toBe(expected)
    })
  })
})

describe('navigateTo', () => {
  const history = { push: jest.fn() }

  const testCases = [
    { history: history, location: 'stepOne', params: '', expected: true },
    { history: history, location: 'manage', params: '1', expected: true },
    { history: null, location: 'stepOne', params: '', expected: false },
    { history: history, location: null, params: '', expected: false }
  ]

  testCases.forEach(({ history, location, params, expected }) => {
    const action = expected ? 'pass' : 'fail'

    it(`should ${action} for location '${location}'`, () => {
      if (expected) {
        expect(navigateTo({ history, location, params })).toBe(expected)
      } else {
        const navigateAndThrow = () => {
          navigateTo({ history, location, params })
        }
        expect(navigateAndThrow).toThrow()
      }
    })
  })
})

describe('uniqueElementBy', () => {
  const testCases = [
    {
      value: [
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', 'tokens', '3.1'],
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', 'tokens', '4.2']
      ],
      expected: 1
    },
    {
      value: [
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc1', 'tokens', '3.1'],
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', 'tokens', '4.2']
      ],
      expected: 2
    },
    {
      value: [
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc1', 'tokens', '3.1'],
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', 'tokens', '4.2'],
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc', 'tokens', '4.2']
      ],
      expected: 2
    },
    {
      value: [
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc1', 'tokens', '3.1'],
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc2', 'tokens', '4.2'],
        ['0x95ced938f7991cd0dfcb48f0a06a40fa1af46ebc3', 'tokens', '4.2']
      ],
      expected: 3
    }
  ]

  testCases.forEach(({ value, expected }, index) => {
    it(`should test uniqueElementBy function #${index}`, () => {
      const results = uniqueElementsBy(value, (a, b) => a[0] === b[0] && a[1] === b[1])
      expect(results.length).toBe(expected)
    })
  })
})
