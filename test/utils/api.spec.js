import { gasPriceValues } from '../../src/utils/api'

// jest.mock('../../src/utils/api')

describe('Api spec', function() {
  it(`Should get gas price values`, () => {
    const gasPricevaluesPromised = async () => await gasPriceValues()

    expect(typeof gasPricevaluesPromised()).toBe('object')
  })
})
