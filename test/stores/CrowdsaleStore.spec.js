import CrowdsaleStore from '../../src/stores/CrowdsaleStore'
import { CROWDSALE_STRATEGIES, REACT_PREFIX } from '../../src/utils/constants'
import dotenv from 'dotenv'

const { MINTED_CAPPED_CROWDSALE, DUTCH_AUCTION } = CROWDSALE_STRATEGIES
dotenv.config({ path: '../../.env' })

describe('CrowdsaleStore', () => {
  let crowdsaleStore

  beforeEach(() => {
    crowdsaleStore = new CrowdsaleStore()
  })

  it(`should return MintedCapped App name`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    const currentAppName = crowdsaleStore.appName

    // Then
    expect(currentAppName).toBe(process.env[`${REACT_PREFIX}MINTED_CAPPED_APP_NAME`])
  })

  it(`should return DutchAuction App name`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    const currentAppName = crowdsaleStore.appName

    // Then
    expect(currentAppName).toBe(process.env[`${REACT_PREFIX}DUTCH_APP_NAME`])
  })

  it(`should return empty string for not defined App name`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', 'NonExistentStrategy')

    // When
    const currentAppName = crowdsaleStore.appName

    // Then
    expect(currentAppName).toBe('')
  })

  it(`should return MintedCapped App hash`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    const currentAppNameHash = crowdsaleStore.appNameHash

    // Then
    expect(currentAppNameHash).toBe(process.env[`${REACT_PREFIX}MINTED_CAPPED_APP_NAME_HASH`])
  })

  it(`should return DutchAuction App hash`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    const currentAppNameHash = crowdsaleStore.appNameHash

    // Then
    expect(currentAppNameHash).toBe(process.env[`${REACT_PREFIX}DUTCH_APP_NAME_HASH`])
  })

  it(`should return empty string for not defined App hash`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', 'NonExistentStrategy')

    // When
    const currentAppNameHash = crowdsaleStore.appNameHash

    // Then
    expect(currentAppNameHash).toBe('')
  })

  it(`should return MintedCapped Proxy name`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    const currentProxyName = crowdsaleStore.proxyName

    // Then
    expect(currentProxyName).toBe('MintedCappedProxy')
  })

  it(`should return DutchAuction Proxy name`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    const currentProxyName = crowdsaleStore.proxyName

    // Then
    expect(currentProxyName).toBe('DutchProxy')
  })

  it(`should return empty string for not defined Proxy name`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', 'NonExistentStrategy')

    // When
    const currentProxyName = crowdsaleStore.proxyName

    // Then
    expect(currentProxyName).toBe('')
  })

  it(`should return MintedCappedCrowdsale Deploy interface`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)
    const mintedCappedCrowdsaleDeployInterface = [
      'address',
      'uint256',
      'bytes32',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bool',
      'bool',
      'address'
    ]

    // When
    const currentCrowdsaleDeployInterface = crowdsaleStore.crowdsaleDeployInterface

    // Then
    expect(currentCrowdsaleDeployInterface).toEqual(mintedCappedCrowdsaleDeployInterface)
  })

  it(`should return DutchAuctionCrowdsale Deploy interface`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)
    const dutchAuctionCrowdsaleDeployInterface = [
      'address',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bool',
      'address',
      'bool'
    ]

    // When
    const currentCrowdsaleDeployInterface = crowdsaleStore.crowdsaleDeployInterface

    // Then
    expect(currentCrowdsaleDeployInterface).toEqual(dutchAuctionCrowdsaleDeployInterface)
  })

  it(`should return an empty array for not defined strategy`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', 'NotDefinedStrategy')

    // When
    const currentCrowdsaleDeployInterface = crowdsaleStore.crowdsaleDeployInterface

    // Then
    expect(currentCrowdsaleDeployInterface).toEqual([])
  })

  it(`should validate that current Strategy is Minted Capped`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    const isMinted = crowdsaleStore.isMintedCappedCrowdsale
    const isDutch = crowdsaleStore.isDutchAuction

    // Then
    expect(isMinted).toBe(true)
    expect(isDutch).toBe(false)
  })

  it(`should validate that current Strategy is Dutch Auction`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    const isMinted = crowdsaleStore.isMintedCappedCrowdsale
    const isDutch = crowdsaleStore.isDutchAuction

    // Then
    expect(isMinted).toBe(false)
    expect(isDutch).toBe(true)
  })

  it(`should validate that current Strategy is not supported`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', 'NonExistentStrategy')

    // When
    const isMinted = crowdsaleStore.isMintedCappedCrowdsale
    const isDutch = crowdsaleStore.isDutchAuction

    // Then
    expect(isMinted).toBe(false)
    expect(isDutch).toBe(false)
  })

  it(`should return MintedCapped suffix`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    const currentSuffix = crowdsaleStore.contractTargetSuffix

    // Then
    expect(currentSuffix).toBe('MintedCapped')
  })

  it(`should return DutchAuction suffix`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    const currentSuffix = crowdsaleStore.contractTargetSuffix

    // Then
    expect(currentSuffix).toBe('Dutch')
  })

  it(`should return empty string for not defined target suffix`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', 'NonExistentStrategy')

    // When
    const currentSuffix = crowdsaleStore.contractTargetSuffix

    // Then
    expect(currentSuffix).toBe('')
  })
})
