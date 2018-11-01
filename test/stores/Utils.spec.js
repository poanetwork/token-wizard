import { getCrowdsaleAssets } from '../../src/stores/utils'
import ContractStore from '../../src/stores/ContractStore'

jest.mock('../../src/utils/fetchFile')

describe(`Utils in the store`, () => {
  it(`should get properties from contractStore`, async () => {
    // Given
    await getCrowdsaleAssets(3)
    const contractStore = new ContractStore()
    // When
    const { DutchProxy, MintedCappedProxy } = contractStore

    // Then
    expect(typeof DutchProxy).toBe('object')
    expect(typeof MintedCappedProxy).toBe('object')
    expect(DutchProxy).toHaveProperty('abi')
    expect(MintedCappedProxy).toHaveProperty('abi')
    expect(typeof DutchProxy.abi).toBe('object')
    expect(typeof MintedCappedProxy.abi).toBe('object')
  })
})
