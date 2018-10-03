import GeneralStore from '../../src/stores/GeneralStore'

describe(`GeneralStore`, () => {
  let generalStore

  beforeEach(() => {
    generalStore = new GeneralStore()
  })

  afterEach(() => {
    generalStore.reset()
  })

  it(`Should properly exist property`, () => {
    // Given
    const testCases = [
      { property: 'networkID', value: '1' },
      { property: 'gasPrice', value: '1' },
      { property: 'gasTypeSelected', value: '1' },
      { property: 'burnExcess', value: '1' }
    ]

    testCases.forEach(({ property, value }) => {
      // When
      generalStore.setProperty(property, value)

      // Then
      expect(generalStore[property]).toBe(value)
    })
  })

  it(`Should not exist property`, () => {
    // Given
    const testCases = [
      { property: 'wrong1', value: '1' },
      { property: 'wrong2', value: '1' },
      { property: 'wrong3', value: '1' },
      { property: 'wrong4', value: '1' }
    ]

    testCases.forEach(({ property, value }) => {
      // When
      const invalidProperty = () => generalStore.setProperty(property, value)

      // Then
      expect(invalidProperty).toThrow(`${property} is not declared as a property`)
    })
  })

  it(`Should not exist property`, () => {
    // Given
    const property = 'wrong1'
    const value = 1

    // When
    const invalidProperty = () => generalStore.setProperty(property, value)

    // Then
    expect(invalidProperty).toThrow(`${property} is not declared as a property`)
  })

  it(`Should properly set gasPrice`, () => {
    // Given
    const gasPrice = 1

    // When
    generalStore.setGasPrice(gasPrice)

    // Then
    expect(generalStore['gasPrice']).toBe(gasPrice)
  })

  it(`Should properly set gasTypeSelected`, () => {
    // Given
    const gasTypeSelected = 1

    // When
    generalStore.setGasTypeSelected(gasTypeSelected)

    // Then
    expect(generalStore['gasTypeSelected']).toBe(gasTypeSelected)
    expect(generalStore.getGasTypeSelected).toBe(gasTypeSelected)
  })

  it(`Should properly set burnExcess`, () => {
    // Given
    const burnExcess = 1

    // When
    generalStore.setBurnExcess(burnExcess)

    // Then
    expect(generalStore['burnExcess']).toBe(burnExcess)
  })
})
