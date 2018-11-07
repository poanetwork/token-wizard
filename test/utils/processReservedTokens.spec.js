import { processCsv, errorsCsv } from '../../src/utils/processReservedTokens'
import ReservedTokenStore from '../../src/stores/ReservedTokenStore'
import ContributeStore from '../../src/stores/ContributeStore'
import TokenStore from '../../src/stores/TokenStore'

describe('processReservedTokens', () => {
  describe('processReservedTokens function', () => {
    let reservedTokenStore

    beforeEach(() => {
      reservedTokenStore = new ReservedTokenStore()
    })

    afterEach(() => {
      reservedTokenStore.clearAll()
    })

    it('should call the callback for each valid reserved tokens item', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]
      const cb = jest.fn()

      // When
      processCsv({ rows, decimals: 2 }, cb, reservedTokenStore)

      // Then
      expect(cb).toHaveBeenCalledTimes(4)
      expect(cb.mock.calls[0]).toEqual([{ addr: rows[0][0], dim: rows[0][1], val: rows[0][2] }])
      expect(cb.mock.calls[1]).toEqual([{ addr: rows[1][0], dim: rows[1][1], val: rows[1][2] }])
      expect(cb.mock.calls[2]).toEqual([{ addr: rows[2][0], dim: rows[2][1], val: rows[2][2] }])
      expect(cb.mock.calls[3]).toEqual([{ addr: rows[3][0], dim: rows[3][1], val: rows[3][2] }])
    })

    it('should ignore items that dont have 3 elements', () => {
      // Given
      const rows = [
        ['1', '10'],
        ['0x2222222222222222222222222222222222222222', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens'],
        ['0x4444444444444444444444444444444444444444'],
        [],
        ['0x4444444444444444444444444444444444444444', 'percentage', '10'],
        ['0x2589bd7D8A58Ac9A4aC01d68A7c63315ef184c63', 'tokens', '10'] //valid parameters
      ]

      const cb = jest.fn()

      // When
      processCsv({ rows, decimals: 2 }, cb, reservedTokenStore)

      // Then
      expect(cb).toHaveBeenCalledTimes(2)
    })

    it('should return the number of times the callback was called', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]
      const cb = jest.fn()

      // When
      const { called } = processCsv({ rows, decimals: 2 }, cb, reservedTokenStore)

      // Then
      expect(called).toBe(4)
    })

    it('should not return an error if reserved limit is not reached because duplicated', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]
      const cb = newToken => {
        reservedTokenStore.addToken(newToken)
      }

      // When
      const { called, reservedTokenLengthError } = processCsv({ rows, decimals: 2 }, cb, reservedTokenStore)

      // Then
      expect(reservedTokenLengthError).toBeFalsy()
      expect(called).toBe(23)
    })

    it('should return an error if reserved limit is reached', () => {
      // Given
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333334', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333335', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333336', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333337', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333338', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333339', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333340', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333341', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333342', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333343', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333344', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333345', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333346', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333347', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333348', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333349', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333350', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333351', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333352', 'tokens', '10'],
        ['0x3333333333333333333333333333333333333353', 'tokens', '10']
      ]
      const cb = newToken => {
        reservedTokenStore.addToken(newToken)
      }

      // When
      const { called, reservedTokenLengthError } = processCsv({ rows, decimals: 2 }, cb, reservedTokenStore)

      // Then
      expect(reservedTokenLengthError).toBeTruthy()
      expect(called).toBe(20)
    })
  })

  describe('errorsCSV function', () => {
    it('should check output errors csv function #1', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'tokens', '10'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]

      expect(errorsCsv(rows, 18)).toBeInstanceOf(Object)
    })

    it('should check output errors csv function #2', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x22222222222222222222222222222222222222222', 'tokens22', '10'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #3', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x22222222222222222222222222222222222222222', 'tokens', '12121', '10'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #4', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x22222222222222222222222222222222222222222', 'tokens'],
        ['0x2222222222222222222222222222222222222222', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #5', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x1111111111111111111111111111111111111111', 'tokens', -10],
        ['0x1111111111111111111111111111111111111111', 'percentage', '10'],
        ['0x3333333333333333333333333333333333333333', 'tokens', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #6', () => {
      const rows = []

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #7', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x1111111111111111111111111111111111111111', 'percentage', '-10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #8', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x1111111111111111111111111111111111111111', 'percentage', '']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #9', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', ''],
        ['0x1111111111111111111111111111111111111111', 'percentage', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 18)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #10', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10.46768'],
        ['0x1111111111111111111111111111111111111111', 'percentage', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 2)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #11', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokens', '10'],
        ['0x1111111111111111111111111111111111111111', 'percentagezz', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 2)
      expect(errorsCsvFunction).toThrow()
    })

    it('should check output errors csv function #12', () => {
      const rows = [
        ['0x1111111111111111111111111111111111111111', 'tokenzz', '10'],
        ['0x1111111111111111111111111111111111111111', 'percentage', '10']
      ]

      const errorsCsvFunction = () => errorsCsv(rows, 2)
      expect(errorsCsvFunction).toThrow()
    })
  })
})
