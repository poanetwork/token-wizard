describe(`Index Store`, () => {
  it(`Should properly exist property`, () => {
    // Given
    const window = global

    // When
    const hasOwnProperty = window.hasOwnProperty('localStorage')
    const typeOfObject = typeof window.localStorage

    // Then
    expect(hasOwnProperty).toBe(true)
    expect(typeOfObject).toBe('object')
  })

  it(`Should exist property if is deleted`, () => {
    // Given
    const window = global

    delete window.localStorage

    require('../../src/stores/index')

    // When
    const hasOwnProperty = window.hasOwnProperty('localStorage')
    const typeOfObject = typeof window.localStorage

    // Then
    expect(hasOwnProperty).toBe(true)
    expect(typeOfObject).toBe('function')
  })
})
