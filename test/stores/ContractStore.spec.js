import ContractStore from '../../src/stores/ContractStore'

describe('ContractStore', () => {
  const genericContractObject = {
    addr: '0x1234567890123456789012345678901234567890',
    abi: '{"key": "value"}',
    bin: '0000012301231230123012301230120310230123012',
    src: 'pragma ^0.4.24'
  }
  let contractStore

  beforeEach(() => {
    contractStore = new ContractStore()
  })

  it(`Should properly set contract content`, () => {
    // Given
    const mintedCappedProxyObject = genericContractObject

    // When
    contractStore.setContract('MintedCappedProxy', mintedCappedProxyObject)

    // Then
    expect(contractStore.MintedCappedProxy).toEqual(mintedCappedProxyObject)
  })

  it(`Should fail to set a Contract if it's not already declared in the Store as an observable`, () => {
    // Given
    const mintedCappedProxyObject = genericContractObject

    // When
    const invalidContractName = 'NonExistentProperty'
    const setInvalidContract = () => contractStore.setContract(invalidContractName, mintedCappedProxyObject)

    // Then
    expect(setInvalidContract).toThrow(`${invalidContractName} is not declared as an observable property`)
  })

  it(`should properly update/set contract's property`, () => {
    // Given
    const mintedCappedProxyObject = genericContractObject
    const newAddress = '0x123'
    debugger
    contractStore.setContract('MintedCappedProxy', mintedCappedProxyObject)

    // When
    contractStore.setContractProperty('MintedCappedProxy', 'addr', newAddress)

    // Then
    expect(contractStore.MintedCappedProxy.addr).toBe(newAddress)
  })
})
