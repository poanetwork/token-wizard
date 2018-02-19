import { countDecimalPlaces } from './utils'

describe('countDecimalPlaces', () => {
  it('Should count decimals with dot notation', () => {
    expect(countDecimalPlaces('1.123')).toBe(3)
    expect(countDecimalPlaces('1.12')).toBe(2)
    expect(countDecimalPlaces('1.')).toBe(0)
    expect(countDecimalPlaces('1')).toBe(0)
    expect(countDecimalPlaces('.123')).toBe(3)
  })

  it('Should count decimals with scientific notation', () => {
    expect(countDecimalPlaces('1e-3')).toBe(3)
    expect(countDecimalPlaces('1e-2')).toBe(2)
    expect(countDecimalPlaces('1.2e-2')).toBe(3)
    expect(countDecimalPlaces('1.e-2')).toBe(2)
    expect(countDecimalPlaces('1.23123e2')).toBe(3)
    expect(countDecimalPlaces('123.123e+2')).toBe(1)
    expect(countDecimalPlaces('.2e-2')).toBe(3)
  })

  it('Should return zero when parameter is an integer', () => {
    expect(countDecimalPlaces('1')).toBe(0)
    expect(countDecimalPlaces('123')).toBe(0)
    expect(countDecimalPlaces('0')).toBe(0)
    expect(countDecimalPlaces('-123')).toBe(0)
  })

  it('Should return zero when parameter is not a valid number', () => {
    expect(countDecimalPlaces('abc')).toBe(0)
    expect(countDecimalPlaces('e')).toBe(0)
    expect(countDecimalPlaces('')).toBe(0)
    expect(countDecimalPlaces(null)).toBe(0)
    expect(countDecimalPlaces(false)).toBe(0)
    expect(countDecimalPlaces(undefined)).toBe(0)
  })
})
