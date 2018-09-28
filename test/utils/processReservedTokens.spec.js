import { processReservedTokens } from '../../src/utils/processReservedTokens'

describe('processReservedTokens function', () => {
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
    processReservedTokens({ rows, decimals: 2 }, cb)

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
      ['0x4444444444444444444444444444444444444444', 'percentage', '10', '100'],
      ['0x2589bd7D8A58Ac9A4aC01d68A7c63315ef184c63', 'tokens', '10'] //valid parameters
    ]

    const cb = jest.fn()

    // When
    processReservedTokens({ rows, decimals: 2 }, cb)

    // Then
    expect(cb).toHaveBeenCalledTimes(1)
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
    const { called } = processReservedTokens({ rows, decimals: 2 }, cb)

    // Then
    expect(called).toBe(4)
  })

  it('should ignore invalid numbers', () => {
    // Given
    const rows = [
      ['0x1111111111111111111111111111111111111111', 'tokens', 'foo'],
      ['0x2222222222222222222222222222222222222222', 'tokens', ''],
      ['0x2222222222222222222222222222222222222222', 'percentage', 'bar'],
      ['0x3333333333333333333333333333333333333333', 'percentage', ''],
      ['0x2589bd7D8A58Ac9A4aC01d68A7c63315ef184c63', 'tokens', '10'] //valid parameters
    ]
    const cb = jest.fn()

    // When
    const { called } = processReservedTokens({ rows, decimals: 2 }, cb)

    // Then
    expect(called).toBe(1)
  })

  it('should ignore invalid addresses', () => {
    // Given
    const rows = [
      ['0x123456789012345678901234567890123456789', 'tokens', '10'], // 41 characters
      ['0x12345678901234567890123456789012345678901', 'tokens', '10'], // 43 characters
      ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9CG', 'tokens', '10'], // invalid character
      ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9c1', 'tokens', '10'], // invalid checksum
      ['0x2589bd7D8A58Ac9A4aC01d68A7c63315ef184c63', 'tokens', '10'] //valid address
    ]
    const cb = jest.fn()

    // When
    const { called } = processReservedTokens({ rows, decimals: 2 }, cb)

    // Then
    expect(called).toBe(1)
  })

  it('should ignore invalid dimensions', () => {
    // Given
    const rows = [
      ['0x49d915966F1f2AdE697Ef7587615D2CF6A8A374e', 'tokenz', '10'],
      ['0x9F3cA66c22eAc286017b785ed63183859b4183DC', 'perzentage', '10'],
      ['0x871c98FFA5b44873aE2fa4BFD190Cd42F63907Da', 'units', '10'],
      ['0x6c8ca1fD00d18B69C2c14228ef3D2E4E1ce3316b', '', '10'],
      ['0x2589bd7D8A58Ac9A4aC01d68A7c63315ef184c63', 'tokens', '10'], //valid dimension
      ['0x9613130348aC610732A391063CD70b5a8c186EfC', 'percentage', '10'] //valid dimension

    ]
    const cb = jest.fn()

    // When
    processReservedTokens({ rows, decimals: 2 }, cb)

    // Then
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it(`should ignore tokens with more decimals than specified`, () => {
    // Given
    const rows = [
      ['0x49d915966F1f2AdE697Ef7587615D2CF6A8A374e', 'tokens', '10.1'],
      ['0x9F3cA66c22eAc286017b785ed63183859b4183DC', 'tokens', '10'],
      ['0x871c98FFA5b44873aE2fa4BFD190Cd42F63907Da', 'tokens', '10.123'],
      ['0x6c8ca1fD00d18B69C2c14228ef3D2E4E1ce3316b', 'tokens', '10.12']
    ]
    const cb = jest.fn()

    // When
    processReservedTokens({ rows, decimals: 2 }, cb)

    // Then
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb.mock.calls[0]).toEqual([{ addr: rows[0][0], dim: rows[0][1], val: rows[0][2] }])
    expect(cb.mock.calls[1]).toEqual([{ addr: rows[1][0], dim: rows[1][1], val: rows[1][2] }])
    expect(cb.mock.calls[2]).toEqual([{ addr: rows[3][0], dim: rows[3][1], val: rows[3][2] }])
  })

  it(`should ignore percentage with invalid values`, () => {
    // Given
    const rows = [
      ['0x49d915966F1f2AdE697Ef7587615D2CF6A8A374e', 'percentage', '10'],
      ['0x9F3cA66c22eAc286017b785ed63183859b4183DC', 'percentage', '-10'],
      ['0x871c98FFA5b44873aE2fa4BFD190Cd42F63907Da', 'percentage', ''],
      ['0x6c8ca1fD00d18B69C2c14228ef3D2E4E1ce3316b', 'percentage', '0.12']
    ]
    const cb = jest.fn()

    // When
    processReservedTokens({ rows, decimals:2 }, cb)

    // Then
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb.mock.calls[0]).toEqual([{ addr: rows[0][0], dim: rows[0][1], val: rows[0][2] }])
    expect(cb.mock.calls[1]).toEqual([{ addr: rows[3][0], dim: rows[3][1], val: rows[3][2] }])
  })
})
