import TierStore from '../../src/stores/TierStore'
import { LIMIT_WHITELISTED_ADDRESSES, VALIDATION_TYPES } from '../../src/utils/constants'
import { errorsCsv, processCsv } from '../../src/utils/processWhitelist'
import { isLessOrEqualThan } from '../../src/utils/validations'

const { VALID } = VALIDATION_TYPES

describe('processWhitelist', () => {
  let tierStore
  const tierIndex = 0
  const validations = {
    tier: VALID,
    walletAddress: VALID,
    rate: VALID,
    supply: VALID,
    startTime: VALID,
    endTime: VALID,
    updatable: VALID
  }
  const tiers = [
    {
      whitelist: [],
      walletAddress: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      startTime: '2018-04-13T16:07',
      endTime: '2018-04-17T00:00',
      updatable: true,
      tier: 'Tier 1',
      whitelistEnabled: 'yes',
      supply: '132',
      rate: '123',
      minCap: '0'
    },
    {
      whitelist: [],
      walletAddress: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      startTime: '2018-04-17T00:00',
      endTime: '2018-04-21T00:00',
      updatable: false,
      tier: 'Tier 2',
      whitelistEnabled: 'yes',
      supply: '156',
      rate: '55',
      minCap: '0'
    }
  ]

  describe('processWhitelist function', () => {
    beforeEach(() => {
      tierStore = new TierStore()
      tierStore.addTier(tiers[0], validations)
    })

    afterEach(() => {
      tierStore.reset()
    })

    it('should call the callback for each valid whitelist item', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10']
      ]

      // When
      const { called } = processCsv({ rows }, tierStore, tierIndex)

      // Then
      expect(called).toBe(3)
      expect(tierStore.tiers[0].whitelist[0]).toEqual({ addr: rows[0][0], min: rows[0][1], max: rows[0][2] })
      expect(tierStore.tiers[0].whitelist[1]).toEqual({ addr: rows[1][0], min: rows[1][1], max: rows[1][2] })
      expect(tierStore.tiers[0].whitelist[2]).toEqual({ addr: rows[2][0], min: rows[2][1], max: rows[2][2] })
    })

    it('should ignore items that dont have 3 elements', () => {
      // Given
      const rows = [
        ['1', '10'],
        ['0x2222222222222222222222222222222222222222', '10'],
        ['0x3333333333333333333333333333333333333333', '1'],
        ['0x4444444444444444444444444444444444444444'],
        [],
        ['0x4444444444444444444444444444444444444444', '1', '10', '100'],
        ['0x2589bd7D8A58Ac9A4aC01d68A7c63315ef184c63', '1', '10'] //valid parameters
      ]

      // When
      const { called } = processCsv({ rows, decimals: 2 }, tierStore, tierIndex)

      // Then
      expect(called).toBe(2)
    })

    it('should return the number of times the callback was called', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10']
      ]

      // When
      const { called } = processCsv({ rows, decimals: 2 }, tierStore, tierIndex)

      // Then
      expect(called).toBe(4)
    })

    it('should not return an error if whitelisted limit is not reached because duplicated', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10']
      ]

      // When
      const { called, whitelistAddressLengthError, whitelistSupplyLengthError } = processCsv(
        { rows, decimals: 2 },
        tierStore,
        tierIndex
      )

      // Then
      expect(whitelistAddressLengthError).toBeFalsy()
      expect(whitelistSupplyLengthError).toBeFalsy()
      expect(called).toBe(23)
    })

    it('should return an error if whitelisted limit is reached', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x3333333333333333333333333333333333333334', '1', '10'],
        ['0x3333333333333333333333333333333333333335', '1', '10'],
        ['0x3333333333333333333333333333333333333336', '1', '10'],
        ['0x3333333333333333333333333333333333333337', '1', '10'],
        ['0x3333333333333333333333333333333333333338', '1', '10'],
        ['0x3333333333333333333333333333333333333339', '1', '10'],
        ['0x3333333333333333333333333333333333333340', '1', '10'],
        ['0x3333333333333333333333333333333333333341', '1', '10'],
        ['0x3333333333333333333333333333333333333342', '1', '10'],
        ['0x3333333333333333333333333333333333333343', '1', '10'],
        ['0x3333333333333333333333333333333333333344', '1', '10'],
        ['0x3333333333333333333333333333333333333345', '1', '10'],
        ['0x3333333333333333333333333333333333333346', '1', '10'],
        ['0x3333333333333333333333333333333333333347', '1', '10'],
        ['0x3333333333333333333333333333333333333348', '1', '10'],
        ['0x3333333333333333333333333333333333333349', '1', '10'],
        ['0x3333333333333333333333333333333333333350', '1', '10'],
        ['0x3333333333333333333333333333333333333351', '1', '10'],
        ['0x3333333333333333333333333333333333333352', '1', '10'],
        ['0x3333333333333333333333333333333333333353', '1', '10'],
        ['0x3333333333333333333333333333333333333354', '1', '10'],
        ['0x3333333333333333333333333333333333333355', '1', '10'],
        ['0x3333333333333333333333333333333333333356', '1', '10'],
        ['0x3333333333333333333333333333333333333357', '1', '10'],
        ['0x3333333333333333333333333333333333333358', '1', '10'],
        ['0x3333333333333333333333333333333333333359', '1', '10'],
        ['0x3333333333333333333333333333333333333360', '1', '10'],
        ['0x3333333333333333333333333333333333333361', '1', '10'],
        ['0x3333333333333333333333333333333333333362', '1', '10'],
        ['0x3333333333333333333333333333333333333363', '1', '10'],
        ['0x3333333333333333333333333333333333333364', '1', '10'],
        ['0x3333333333333333333333333333333333333365', '1', '10'],
        ['0x3333333333333333333333333333333333333366', '1', '10'],
        ['0x3333333333333333333333333333333333333367', '1', '10'],
        ['0x3333333333333333333333333333333333333368', '1', '10'],
        ['0x3333333333333333333333333333333333333369', '1', '10'],
        ['0x3333333333333333333333333333333333333370', '1', '10'],
        ['0x3333333333333333333333333333333333333371', '1', '10'],
        ['0x3333333333333333333333333333333333333372', '1', '10'],
        ['0x3333333333333333333333333333333333333373', '1', '10'],
        ['0x3333333333333333333333333333333333333374', '1', '10'],
        ['0x3333333333333333333333333333333333333375', '1', '10'],
        ['0x3333333333333333333333333333333333333376', '1', '10'],
        ['0x3333333333333333333333333333333333333377', '1', '10'],
        ['0x3333333333333333333333333333333333333378', '1', '10'],
        ['0x3333333333333333333333333333333333333379', '1', '10'],
        ['0x3333333333333333333333333333333333333380', '1', '10'],
        ['0x3333333333333333333333333333333333333381', '1', '10'],
        ['0x3333333333333333333333333333333333333382', '1', '10'],
        ['0x3333333333333333333333333333333333333383', '1', '10'],
        ['0x3333333333333333333333333333333333333384', '1', '10'],
        ['0x3333333333333333333333333333333333333385', '1', '10'],
        ['0x3333333333333333333333333333333333333386', '1', '10'],
        ['0x3333333333333333333333333333333333333387', '1', '10'],
        ['0x3333333333333333333333333333333333333388', '1', '10'],
        ['0x3333333333333333333333333333333333333389', '1', '10'],
        ['0x3333333333333333333333333333333333333390', '1', '10'],
        ['0x3333333333333333333333333333333333333391', '1', '10'],
        ['0x3333333333333333333333333333333333333392', '1', '10'],
        ['0x3333333333333333333333333333333333333393', '1', '10']
      ]

      // When
      const { called, whitelistAddressLengthError } = processCsv({ rows, decimals: 2 }, tierStore, tierIndex)

      // Then
      expect(whitelistAddressLengthError).toBeTruthy()
      expect(called).toBe(51)
    })
  })

  describe('errorsCSV function', () => {
    beforeEach(() => {
      tierStore = new TierStore()
      tierStore.addTier(tiers[0], validations)
    })

    afterEach(() => {
      tierStore.reset()
    })

    it('should check output errors csv function #1', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x2222222222222222222222222222222222222222', '1', '10'],
        ['0x3333333333333333333333333333333333333333', '1', '10']
      ]

      expect(errorsCsv(rows, 18, tierStore, tierIndex)).toBeInstanceOf(Object)
    })

    it('should check output errors csv function #2', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '20', '10'],
        ['0x693d436da2c3C11341149522E5F6d0390B363197', '1', '10'],
        ['0x2bD96eA633e8BcB468732c68B2CD632BfF4D79Db', '1', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 has a greather minCap than maxCap. Current value is ${rows[1][1]}.`)
      expect(errors[1]).toBe(`Line #2 has a less maxCap than minCap. Current value is ${rows[1][2]}.`)
      expect(errors.length).toBe(2)
    })

    it('should check output errors csv function #3', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '12121', '10'],
        ['0x693d436da2c3C11341149522E5F6d0390B363197', '1', '10'],
        ['0x2bD96eA633e8BcB468732c68B2CD632BfF4D79Db', '1', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 have 4 columns, must have 3 columns.`)
      expect(errors[1]).toBe(`Line #2 has a maxCap that exceeds the total supply. Current value is ${rows[1][2]}.`)
      expect(errors.length).toBe(2)
    })

    it('should check output errors csv function #4', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1'],
        ['0x693d436da2c3C11341149522E5F6d0390B363197', '1', '10'],
        ['0x2bD96eA633e8BcB468732c68B2CD632BfF4D79Db', '1', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 have 2 columns, must have 3 columns.`)
      expect(errors[1]).toBe(`Line #2 has an incorrect maxCap, must be an integer. Current value is empty.`)
      expect(errors.length).toBe(2)
    })

    it('should check output errors csv function #5', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', -10],
        ['0x693d436da2c3C11341149522E5F6d0390B363197', '1', '10'],
        ['0x2bD96eA633e8BcB468732c68B2CD632BfF4D79Db', '1', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 has a negative value for maxCap. Current value is ${rows[1][2]}.`)
      expect(errors[1]).toBe(`Line #2 has a greather minCap than maxCap. Current value is ${rows[1][1]}.`)
      expect(errors[2]).toBe(`Line #2 has a less maxCap than minCap. Current value is ${rows[1][2]}.`)
      expect(errors.length).toBe(3)
    })

    it('should check output errors csv function #6', () => {
      const rows = []

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Empty CSV file. Nothing was imported.`)
      expect(errors.length).toBe(1)
    })

    it('should check output errors csv function #7', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '-10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 has a negative value for maxCap. Current value is ${rows[1][2]}.`)
      expect(errors[1]).toBe(`Line #2 has a greather minCap than maxCap. Current value is ${rows[1][1]}.`)
      expect(errors[2]).toBe(`Line #2 has a less maxCap than minCap. Current value is ${rows[1][2]}.`)
      expect(errors.length).toBe(3)
    })

    it('should check output errors csv function #8', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 has an incorrect maxCap, must be an integer. Current value is empty.`)
      expect(errors.length).toBe(1)
    })

    it('should check output errors csv function #9', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', ''],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #1 has an incorrect maxCap, must be an integer. Current value is empty.`)
      expect(errors.length).toBe(1)
    })

    it('should check output errors csv function #10', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10.46768'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #1 has an incorrect maxCap, must be an integer. Current value is ${rows[0][2]}.`)
      expect(errors.length).toBe(1)
    })

    it('should check output errors csv function #11', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', 'lklk', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 has an incorrect minCap, must be an integer. Current value is ${rows[1][1]}.`)
      expect(errors.length).toBe(1)
    })

    it('should check output errors csv function #12', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', 'token123zz', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '10']
      ]
      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #1 has an incorrect minCap, must be an integer. Current value is ${rows[0][1]}.`)
      expect(errors.length).toBe(1)
    })

    it('should check output errors csv function #13', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B91988asdasdas4A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '10']
      ]
      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #1 has an incorrect address. Current value is ${rows[0][0]}.`)
      expect(errors.length).toBe(1)
    })

    it('should check output errors csv function #14', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', '1', '10']
      ]
      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #1 have 1 column, must have 3 columns.`)
      expect(errors[1]).toBe(`Line #1 has an incorrect minCap, must be an integer. Current value is empty.`)
      expect(errors[2]).toBe(`Line #1 has an incorrect maxCap, must be an integer. Current value is empty.`)
      expect(errors.length).toBe(3)
    })

    it('should check output errors csv function #15', () => {
      const rows = [
        ['0x66f537cCD03f21c58172602B919884A442A3c313', '1', '10'],
        ['0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87', -1, '10'],
        ['0x693d436da2c3C11341149522E5F6d0390B363197', '1', '10'],
        ['0x2bD96eA633e8BcB468732c68B2CD632BfF4D79Db', '1', '10']
      ]

      const { errors } = errorsCsv(rows, 18, tierStore, tierIndex)
      expect(errors[0]).toBe(`Line #2 has a negative value for minCap. Current value is ${rows[1][1]}.`)
      expect(errors.length).toBe(1)
    })

    it(`should add up to LIMIT_WHITELISTED_ADDRESSES`, () => {
      // Given
      const { rows } = require('./helpers/whitelist-addresses')

      // When
      const { called } = processCsv({ rows, decimals: 3 }, tierStore, tierIndex)

      // Then
      expect(called).toBe(LIMIT_WHITELISTED_ADDRESSES)
    })

    it(`should add all valid addresses if addresses count is less than LIMIT_WHITELISTED_ADDRESSES`, () => {
      // Given
      const addressCount = 24
      const rows = require('./helpers/whitelist-addresses').rows.slice(0, addressCount)

      // When
      const { called } = processCsv({ rows, decimals: 3 }, tierStore, tierIndex)

      // Then
      expect(called).toBe(addressCount)
    })
  })
})
