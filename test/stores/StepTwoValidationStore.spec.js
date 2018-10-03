import StepTwoValidationStore from '../../src/stores/StepTwoValidationStore'

describe('StepTwoValidationStore', () => {
  let stepTwoValidationStore

  beforeEach(() => {
    stepTwoValidationStore = new StepTwoValidationStore()
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
      const invalidProperty = () => stepTwoValidationStore.setProperty(property, value)

      // Then
      expect(invalidProperty).toThrow(`${property} is not declared as a property`)
    })
  })

  it(`Should not exist property`, () => {
    // Given
    const property = 'wrong1'
    const value = 1

    // When
    const invalidProperty = () => stepTwoValidationStore.setProperty(property, value)

    // Then
    expect(invalidProperty).toThrow(`${property} is not declared as a property`)
  })

  it(`should return expected value for property`, () => {
    // When
    const testCases = [
      { property: 'name', value: 'totalEthRaised' },
      { property: 'ticker', value: 'totalCrowdsales' },
      { property: 'decimals', value: 'percentageOfWhitelisted' }
    ]

    testCases.forEach(({ property, value }) => {
      // When
      stepTwoValidationStore.setProperty(property, value)

      // Then
      expect(stepTwoValidationStore[property]).toBe(value)
    })
  })
})
