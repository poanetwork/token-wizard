import StatsStore from '../../src/stores/StatsStore'

describe('StatsStore', () => {
  let statsStore

  beforeEach(() => {
    statsStore = new StatsStore()
  })

  it(`Should not exist property for multiple cases`, () => {
    // Given
    const testCases = [
      { property: 'wrong1', value: '1' },
      { property: 'wrong2', value: '1' },
      { property: 'wrong3', value: '1' },
      { property: 'wrong4', value: '1' }
    ]

    testCases.forEach(({ property, value }) => {
      // When
      const invalidProperty = () => statsStore.setProperty(property, value)

      // Then
      it(`should ${property} for '${value}' throw an error in the statsStore`, () => {
        expect(invalidProperty).toThrow(`${property} is not declared as a property`)
      })
    })
  })

  it(`Should not exist property`, () => {
    // Given
    const property = 'wrong1'
    const value = 1

    // When
    const invalidProperty = () => statsStore.setProperty(property, value)

    // Then
    expect(invalidProperty).toThrow(`${property} is not declared as a property`)
  })

  it(`should return expected value for property`, () => {
    // When
    const testCases = [
      { property: 'totalEthRaised', value: 'totalEthRaised' },
      { property: 'totalCrowdsales', value: 'totalCrowdsales' },
      { property: 'percentageOfWhitelisted', value: 'percentageOfWhitelisted' },
      { property: 'percentageOfFinalized', value: 'percentageOfFinalized' },
      { property: 'percentageOfMultiTiers', value: 'percentageOfMultiTiers' },
      { property: 'percentageOfReserved', value: 'percentageOfReserved' },
      { property: 'totalInvolvedContributorsAmount', value: 'totalInvolvedContributorsAmount' },
      { property: 'maxTiersAmount', value: 'maxTiersAmount' },
      { property: 'maxEthRaised', value: 'maxEthRaised' }
    ]

    testCases.forEach(({ property, value }) => {
      // When
      statsStore.setProperty(property, value)

      // Then
      it(`should ${property} be '${value}'`, () => {
        expect(statsStore[property]).toBe(value)
      })
    })
  })
})
