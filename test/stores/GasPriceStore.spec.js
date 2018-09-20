import GasPriceStore from '../../src/stores/GasPriceStore'
import { GAS_PRICE } from '../../src/utils/constants'
import { gweiToWei, weiToGwei } from '../../src/utils/utils'

jest.mock('../../src/utils/api')

describe('GasPriceStore', () => {
  let gas

  beforeEach(() => {
    gas = new GasPriceStore()
  })

  it('should instantiates store properly', () => {
    expect(gas.slow).toBeDefined()
    expect(gas.slow.id).toEqual(GAS_PRICE.SLOW.ID)
    expect(gas.slow.price).toEqual(GAS_PRICE.SLOW.PRICE)

    expect(gas.standard).toBeDefined()
    expect(gas.standard.id).toEqual(GAS_PRICE.NORMAL.ID)
    expect(gas.standard.price).toEqual(GAS_PRICE.NORMAL.PRICE)

    expect(gas.fast).toBeDefined()
    expect(gas.fast.id).toEqual(GAS_PRICE.FAST.ID)
    expect(gas.fast.price).toEqual(GAS_PRICE.FAST.PRICE)

    expect(gas.instant).toBeDefined()
    expect(gas.instant.id).toEqual(GAS_PRICE.INSTANT.ID)
    expect(gas.instant.price).toEqual(GAS_PRICE.INSTANT.PRICE)

    expect(gas.custom).toBeDefined()
    expect(gas.custom.id).toEqual(GAS_PRICE.CUSTOM.ID)
    expect(gas.custom.price).toEqual(GAS_PRICE.CUSTOM.PRICE)

    expect(gas.block_number).toBeUndefined()
    expect(gas.block_time).toBeUndefined()
    expect(gas.health).toBeUndefined()
  })

  it('should return gasPrices collection', () => {
    expect(gas.gasPrices[0]).toEqual({
      id: GAS_PRICE.SLOW.ID,
      price: GAS_PRICE.SLOW.PRICE,
      description: gas.slowDescription
    })
    expect(gas.gasPrices[1]).toEqual({
      id: GAS_PRICE.NORMAL.ID,
      price: GAS_PRICE.NORMAL.PRICE,
      description: gas.standardDescription
    })
    expect(gas.gasPrices[2]).toEqual({
      id: GAS_PRICE.FAST.ID,
      price: GAS_PRICE.FAST.PRICE,
      description: gas.fastDescription
    })
    expect(gas.gasPrices[3]).toEqual({
      id: GAS_PRICE.CUSTOM.ID,
      price: GAS_PRICE.CUSTOM.PRICE,
      description: gas.customDescription
    })
  })

  it('should return gasPrices collection in Gwei', () => {
    expect(gas.gasPricesInGwei[0]).toEqual({
      id: GAS_PRICE.SLOW.ID,
      price: weiToGwei(GAS_PRICE.SLOW.PRICE),
      description: gas.slowDescription
    })
    expect(gas.gasPricesInGwei[1]).toEqual({
      id: GAS_PRICE.NORMAL.ID,
      price: weiToGwei(GAS_PRICE.NORMAL.PRICE),
      description: gas.standardDescription
    })
    expect(gas.gasPricesInGwei[2]).toEqual({
      id: GAS_PRICE.FAST.ID,
      price: weiToGwei(GAS_PRICE.FAST.PRICE),
      description: gas.fastDescription
    })
    expect(gas.gasPricesInGwei[3]).toEqual({
      id: GAS_PRICE.CUSTOM.ID,
      price: weiToGwei(GAS_PRICE.CUSTOM.PRICE),
      description: gas.customDescription
    })
  })

  it('should updates values with mocked data', () => {
    const gasPrice = require('../../src/utils/__mocks__/gasPrice.json')

    return gas.updateValues().then(() => {
      expect(gas.slow.price).toEqual(gweiToWei(gasPrice.slow))
      expect(gas.standard.price).toEqual(gweiToWei(gasPrice.standard))
      expect(gas.fast.price).toEqual(gweiToWei(gasPrice.fast))
      expect(gas.instant.price).toEqual(gweiToWei(gasPrice.instant))
      expect(gas.custom.price).toEqual(GAS_PRICE.CUSTOM.PRICE)

      expect(gas.block_number).toEqual(gasPrice.block_number)
      expect(gas.block_time).toEqual(gasPrice.block_time)
      expect(gas.health).toEqual(gasPrice.health)

      expect(gas.instantDescription).toEqual('Instantaneous and Expensive (40 GWei)')
    })
  })

  it('should remain unchanged if a second call fails', () => {
    const gasPrice = require('../../src/utils/__mocks__/gasPrice.json')

    return gas
      .updateValues()
      .then(() => gas.updateValues('nonExisting'))
      .catch(err => {
        expect(err).toEqual('no data')
        expect(gas.slow.price).toEqual(gweiToWei(gasPrice.slow))
        expect(gas.standard.price).toEqual(gweiToWei(gasPrice.standard))
        expect(gas.fast.price).toEqual(gweiToWei(gasPrice.fast))
        expect(gas.instant.price).toEqual(gweiToWei(gasPrice.instant))
        expect(gas.custom.price).toEqual(GAS_PRICE.CUSTOM.PRICE)

        expect(gas.block_number).toEqual(gasPrice.block_number)
        expect(gas.block_time).toEqual(gasPrice.block_time)
        expect(gas.health).toEqual(gasPrice.health)
      })
  })

  it('should apply custom value', () => {
    const CUSTOM_PRICE = 74.21

    gas.setProperty('custom', CUSTOM_PRICE)

    expect(gas.custom.price).toEqual(gweiToWei(CUSTOM_PRICE))
  })

  it('should preserve custom value after update', () => {
    const CUSTOM_PRICE = 74.21

    gas.setProperty('custom', CUSTOM_PRICE)

    return gas.updateValues().then(() => {
      expect(gas.custom.price).toEqual(gweiToWei(CUSTOM_PRICE))
    })
  })
})
