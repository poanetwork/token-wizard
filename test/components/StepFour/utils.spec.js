import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import {
  getVersionFlagByStore,
  getOptimizationFlagByStore,
  getPragmaVersion
} from '../../../src/components/StepFour/utils'
import { crowdsaleStore } from '../../../src/stores'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('StepFourUtils', () => {
  it(`should getVersionFlagByStore by Minted Capped `, () => {
    crowdsaleStore.strategy = CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE

    const result = getVersionFlagByStore(crowdsaleStore)

    expect(result).toBe('0.4.24')
  })

  it(`should getVersionFlagByStore by Dutch `, () => {
    crowdsaleStore.strategy = CROWDSALE_STRATEGIES.DUTCH_AUCTION

    const result = getVersionFlagByStore(crowdsaleStore)

    expect(result).toBe('0.4.24')
  })

  it(`should getVersionFlagByStore throw an error `, () => {
    crowdsaleStore.strategy = 'Throw Error!'

    const result = () => getVersionFlagByStore(crowdsaleStore)

    expect(result).toThrow()
  })

  it(`should getOptimizationFlagByStore by Minted Capped `, () => {
    crowdsaleStore.strategy = CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE

    const result = getOptimizationFlagByStore(crowdsaleStore)

    expect(result).toBe('Yes')
  })

  it(`should getOptimizationFlagByStore by Dutch `, () => {
    crowdsaleStore.strategy = CROWDSALE_STRATEGIES.DUTCH_AUCTION

    const result = getOptimizationFlagByStore(crowdsaleStore)

    expect(result).toBe('Yes')
  })

  it(`should getOptimizationFlagByStore throw an error `, () => {
    crowdsaleStore.strategy = 'Throw Error!'

    const result = () => getOptimizationFlagByStore(crowdsaleStore)

    expect(result).toThrow()
  })

  it(`should getPragmaVersionby by Minted Capped`, async () => {
    const result = await getPragmaVersion('MintedCapped')

    expect(result).toBe('0.4.24')
  })

  it(`should getPragmaVersionby by Dutch`, async () => {
    const result = await getPragmaVersion('Dutch')

    expect(result).toBe('0.4.24')
  })

  it(`should getPragmaVersionby throw an error `, async () => {
    let error
    try {
      await getPragmaVersion('Throw Error!')
    } catch (e) {
      error = e
    }
    expect(error).toEqual(new Error('Strategy not exist'))
  })
})
