import processWhitelist from '../../src/utils/processWhitelist'
import TierStore from '../../src/stores/TierStore'
import { defaultTier, defaultTierValidations, LIMIT_WHITELISTED_ADDRESSES } from '../../src/utils/constants'
import { isLessOrEqualThan } from '../../src/utils/validations'

describe('processWhitelist function', () => {
  it('should call the callback for each whitelist item', () => {
    // Given
    const rows = [
      ['0x49d915966F1f2AdE697Ef7587615D2CF6A8A374e', '1', '10'],
      ['0x9F3cA66c22eAc286017b785ed63183859b4183DC', '1', '10'],
      ['0x871c98FFA5b44873aE2fa4BFD190Cd42F63907Da', '1', '10']
    ]
    const cb = jest.fn()
    const cbValidation = jest.fn()
    const cbSupplyValidation = jest.fn()

    cbValidation.mockReturnValue(true)
    cbSupplyValidation.mockReturnValue(undefined)

    // When
    processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

    // Then
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb.mock.calls[0]).toEqual([{ addr: rows[0][0], min: rows[0][1], max: rows[0][2] }])
    expect(cb.mock.calls[1]).toEqual([{ addr: rows[1][0], min: rows[1][1], max: rows[1][2] }])
    expect(cb.mock.calls[2]).toEqual([{ addr: rows[2][0], min: rows[2][1], max: rows[2][2] }])
  })

  it("should ignore items that don't have 3 elements", () => {
    // Given
    const rows = [
      ['1', '10'],
      ['0x2222222222222222222222222222222222222222', '10'],
      ['0x3333333333333333333333333333333333333333', '1'],
      ['0x4444444444444444444444444444444444444444'],
      [],
      ['0x4444444444444444444444444444444444444444', '1', '10', '100'],
      ['0x49d915966F1f2AdE697Ef7587615D2CF6A8A374e', '1', '10'] //valid value
    ]
    const cb = jest.fn()
    const cbValidation = jest.fn()
    const cbSupplyValidation = jest.fn()

    cbValidation.mockReturnValue(true)
    cbSupplyValidation.mockReturnValue(undefined)

    // When
    processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

    // Then
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should return the number of times the callback was called', () => {
    // Given
    const rows = [
      ['0x1111111111111111111111111111111111111111', '1', '10'],
      ['0x2222222222222222222222222222222222222222', '1', '10'],
      ['0x3333333333333333333333333333333333333333', '1', '10']
    ]
    const cb = jest.fn()
    const cbValidation = jest.fn()
    const cbSupplyValidation = jest.fn()

    cbValidation.mockReturnValue(true)
    cbSupplyValidation.mockReturnValue(undefined)

    // When
    const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

    // Then
    expect(called).toBe(3)
  })

  it('should ignore invalid numbers', () => {
    // Given
    const rows = [
      ['0x1111111111111111111111111111111111111111', 'foo', '10'],
      ['0x2222222222222222222222222222222222222222', '1', 'bar'],
      ['0x3333333333333333333333333333333333333333', '', '10'],
      ['0x4444444444444444444444444444444444444444', '1', ''],
      ['0x49d915966F1f2AdE697Ef7587615D2CF6A8A374e', '1', '10'] //valid value
    ]
    const cb = jest.fn()
    const cbValidation = jest.fn()
    const cbSupplyValidation = jest.fn()

    cbValidation.mockReturnValue(true)
    cbSupplyValidation.mockReturnValue(undefined)

    // When
    const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

    // Then
    expect(called).toBe(1)
  })

  it('should ignore invalid addresses', () => {
    // Given
    const rows = [
      ['0x123456789012345678901234567890123456789', '1', '10'], // 41 characters
      ['0x12345678901234567890123456789012345678901', '1', '10'], // 43 characters
      ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9CG', '1', '10'], // invalid character
      ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9c1', '1', '10'], // invalid checksum
      ['0x49d915966F1f2AdE697Ef7587615D2CF6A8A374e', '1', '10'] //valid value
    ]
    const cb = jest.fn()
    const cbValidation = jest.fn()
    const cbSupplyValidation = jest.fn()

    cbValidation.mockReturnValue(true)
    cbSupplyValidation.mockReturnValue(undefined)

    // When
    const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

    // Then
    expect(called).toBe(1)
  })

  it('should reject invalid decimals', () => {
    // Given
    const rows = [
      ['0x4444444444444444444444444444444444444444', '10.123456', '10.123456'],
      ['0x9F3cA66c22eAc286017b785ed63183859b4183DC', '10', '10.123456'],
      ['0x1111111111111111111111111111111111111111', '10', '10.1'],
      ['0x3333333333333333333333333333333333333333', '10.1234', '10'],
      ['0x2222222222222222222222222222222222222222', '10.12', '10.123']
     ]
    const cb = jest.fn()
    const cbValidation = jest.fn()
    const cbSupplyValidation = jest.fn()

    cbValidation.mockReturnValue(true)
    cbSupplyValidation.mockReturnValue(undefined)

    // When
    const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

    // Then
    expect(called).toBe(2)
  })

  it('should reject min > max', () => {
    // Given
    const rows = [
      ['0x1111111111111111111111111111111111111111', '15', '10.1'],
      ['0x2222222222222222222222222222222222222222', '10.13', '10.123'],
      ['0x3333333333333333333333333333333333333333', '100', '99.999999999999999999'],
      ['0x3333333333333333333333333333333333333333', '11', '11'],
      ['0x3333333333333333333333333333333333333333', '10.124', '11'],
      ['0x4444444444444444444444444444444444444444', '10.124', '10.125']
    ]
    const cb = jest.fn()
    const cbValidation = jest.fn()
    const cbSupplyValidation = jest.fn()

    cbValidation.mockReturnValue(true)
    cbSupplyValidation.mockReturnValue(undefined)

    // When
    const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

    // Then
    expect(called).toBe(3)
  })

  describe('TierStore interaction', () => {
    let tierStore

    beforeEach(() => {
      tierStore = new TierStore()
      tierStore.addTier(defaultTier, defaultTierValidations)
    })

    afterEach(() => {
      tierStore.reset()
    })

    it(`should add up to LIMIT_WHITELISTED_ADDRESSES`, () => {
      // Given
      const { rows } = require('./helpers/whitelist-addresses')

      const cb = jest.fn(item => {
        tierStore.addWhitelistItem(item, 0)
      })
      const cbValidation = jest.fn(() => tierStore.validateWhitelistedAddressLength(0))
      const cbSupplyValidation = jest.fn()
      cbSupplyValidation.mockReturnValue(undefined)

      // When
      const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

      // Then
      expect(called).toBe(LIMIT_WHITELISTED_ADDRESSES)
    })

    it(`should add all valid addresses if addresses count is less than LIMIT_WHITELISTED_ADDRESSES`, () => {
      // Given
      const addressCount = 24
      const rows = require('./helpers/whitelist-addresses').rows.slice(0, addressCount)

      const cb = jest.fn(item => {
        tierStore.addWhitelistItem(item, 0)
      })
      const cbValidation = jest.fn(() => tierStore.validateWhitelistedAddressLength(0))
      const cbSupplyValidation = jest.fn()
      cbSupplyValidation.mockReturnValue(undefined)

      // When
      const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

      // Then
      expect(called).toBe(addressCount)
    })

    it(`should add addresses whose maxCap is not greater than 1000`, () => {
      // Given
      tierStore.setTierProperty(1000, 'supply', 0)

      const { rows } = require('./helpers/whitelist-addresses')
      const { supply } = tierStore.tiers[0]
      const lessOrEqualThanSupply = isLessOrEqualThan()(supply)
      const validAddressesCount = rows.filter(([addr, min, max]) => lessOrEqualThanSupply(max) === undefined).length

      const cb = jest.fn(item => tierStore.addWhitelistItem(item, 0))
      const cbValidation = jest.fn(() => tierStore.validateWhitelistedAddressLength(0))
      const cbSupplyValidation = jest.fn(max => lessOrEqualThanSupply(max))

      // When
      const { called } = processWhitelist({ rows, decimals: 3 }, cb, cbValidation, cbSupplyValidation)

      // Then
      expect(called).toBe(validAddressesCount)
    })
  })
})
