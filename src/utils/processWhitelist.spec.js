import processWhitelist from './processWhitelist'

describe('processWhitelist function', () => {
  it('should call the callback for each whitelist item', () => {
    // Given
    const rows = [
      ['0x1111111111111111111111111111111111111111', '1', '10'],
      ['0x2222222222222222222222222222222222222222', '1', '10'],
      ['0x3333333333333333333333333333333333333333', '1', '10']
    ]
    const cb = jest.fn()

    // When
    processWhitelist(rows, cb)

    // Then
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb.mock.calls[0]).toEqual([{ addr: rows[0][0], min: rows[0][1], max: rows[0][2] }])
    expect(cb.mock.calls[1]).toEqual([{ addr: rows[1][0], min: rows[1][1], max: rows[1][2] }])
    expect(cb.mock.calls[2]).toEqual([{ addr: rows[2][0], min: rows[2][1], max: rows[2][2] }])
  })

  it('should ignore items that don\t have 3 elements', () => {
    // Given
    const rows = [
      ['1', '10'],
      ['0x2222222222222222222222222222222222222222', '10'],
      ['0x3333333333333333333333333333333333333333', '1'],
      ['0x4444444444444444444444444444444444444444'],
      [],
      ['0x4444444444444444444444444444444444444444', '1', '10', '100'],
    ]
    const cb = jest.fn()

    // When
    processWhitelist(rows, cb)

    // Then
    expect(cb).toHaveBeenCalledTimes(0)
  })

  it('should return the number of times the callback was called', () => {
    // Given
    const rows = [
      ['0x1111111111111111111111111111111111111111', '1', '10'],
      ['0x2222222222222222222222222222222222222222', '1', '10'],
      ['0x3333333333333333333333333333333333333333', '1', '10']
    ]
    const cb = jest.fn()

    // When
    const { called } = processWhitelist(rows, cb)

    // Then
    expect(called).toBe(3)
  })

  it('should ignore invalid numbers', () => {
    // Given
    const rows = [
      ['0x1111111111111111111111111111111111111111', 'foo', '10'],
      ['0x2222222222222222222222222222222222222222', '1', 'bar'],
      ['0x3333333333333333333333333333333333333333', '', '10'],
      ['0x4444444444444444444444444444444444444444', '1', '']
    ]
    const cb = jest.fn()

    // When
    const { called } = processWhitelist(rows, cb)

    // Then
    expect(called).toBe(0)
  })

  it('should ignore invalid addresses', () => {
    // Given
    const rows = [
      ['0x123456789012345678901234567890123456789', '1', '10'], // 41 characters
      ['0x12345678901234567890123456789012345678901', '1', '10'], // 43 characters
      ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9CG', '1', '10'], // invalid character
      ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9c1', '1', '10'] // invalid checksum
    ]
    const cb = jest.fn()

    // When
    const { called } = processWhitelist(rows, cb)

    // Then
    expect(called).toBe(0)
  })
})
