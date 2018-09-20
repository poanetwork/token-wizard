import localStorageMock from '../../src/stores/localStorageMock'

describe(`localStorageMock`, () => {
  let localStorageMockObject

  beforeEach(() => {
    localStorageMockObject = new localStorageMock()
  })

  afterEach(() => {
    localStorageMockObject.clear()
  })

  it(`Should properly initialize an element`, () => {
    // Given
    const item = 'item1'
    const valueNot = 'valueNot'
    const value = 'value'

    // When
    localStorageMockObject.setItem(item, value)

    // Then
    const itemReturned = localStorageMockObject.getItem(item)
    expect(itemReturned).toBe(value)
    expect(itemReturned).not.toBe(valueNot)
  })

  it(`Should properly not return a non existing element`, () => {
    // Given
    const item = 'item1'
    const value = 'value'

    // When
    localStorageMockObject.setItem(item, value)
    localStorageMockObject.clear()

    // Then
    const itemReturned = localStorageMockObject.getItem(item)
    expect(itemReturned).not.toBe(value)
  })

  it(`Should properly remove an element`, () => {
    // Given
    const item = 'item1'
    const value = 'value'

    // When
    localStorageMockObject.setItem(item, value)
    localStorageMockObject.removeItem(item)

    // Then
    const itemReturned = localStorageMockObject.getItem(item)
    expect(itemReturned).not.toBe(value)
  })
})
