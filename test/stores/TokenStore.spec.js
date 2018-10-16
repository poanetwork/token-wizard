import TokenStore from '../../src/stores/TokenStore'
import CrowdsaleStore from '../../src/stores/CrowdsaleStore'
import {
  defaultTokenValues,
  defaultTokenValidations,
  CROWDSALE_STRATEGIES,
  VALIDATION_TYPES
} from '../../src/utils/constants'

const { DUTCH_AUCTION, MINTED_CAPPED_CROWDSALE } = CROWDSALE_STRATEGIES
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES

describe(`TokenStore`, () => {
  let tokenStore
  let crowdsaleStore

  beforeEach(() => {
    tokenStore = new TokenStore()
    crowdsaleStore = new CrowdsaleStore()
  })

  afterEach(() => {
    tokenStore.reset()
    crowdsaleStore.reset()
  })

  it(`should tokenStore to be empty for MINTED CAPPED `, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    const isEmpty = tokenStore.checkIsEmptyMinted

    // Then
    expect(isEmpty).toBeTruthy()
  })

  it(`should tokenStore to be empty FOR DUTCH`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    const isEmpty = tokenStore.checkIsEmptyDutch

    // Then
    expect(isEmpty).toBeTruthy()
  })

  it(`should set token on tokenStore MINTED`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      reservedTokensInput: []
    }
    const validations = []
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)
    tokenStore.setToken(token, validations)

    // When
    const tokenResponse = tokenStore.tokenMintedStructure

    // Then
    expect(typeof tokenResponse).toBe('object')
    expect(tokenResponse).toHaveProperty('name')
    expect(tokenResponse).toHaveProperty('ticker')
    expect(tokenResponse).toHaveProperty('decimals')
    expect(tokenResponse).toHaveProperty('reservedTokensInput')
    expect(tokenResponse.name).toBe(token.name)
    expect(tokenResponse.ticker).toBe(token.ticker)
    expect(tokenResponse.decimals).toBe(token.decimals)
    expect(tokenResponse.reservedTokensInput.length).toBe(0)
  })

  it(`should set token on tokenStore DUTCH`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = []
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    tokenStore.setToken(token, validations)

    // Then
    const tokenResponse = tokenStore.tokenDutchStructure

    // Then
    expect(typeof tokenResponse).toBe('object')
    expect(tokenResponse).toHaveProperty('name')
    expect(tokenResponse).toHaveProperty('ticker')
    expect(tokenResponse).toHaveProperty('decimals')
    expect(tokenResponse).toHaveProperty('supply')
    expect(tokenResponse.name).toBe(token.name)
    expect(tokenResponse.ticker).toBe(token.ticker)
    expect(tokenResponse.decimals).toBe(token.decimals)
    expect(tokenResponse.supply).toBe(token.supply)
  })

  it(`should check if token is valid FALSE`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000,
      reservedTokensInput: []
    }
    const validations = {
      name: VALID,
      ticker: VALID,
      decimals: VALID,
      supply: VALID,
      reservedTokensInput: INVALID
    }
    crowdsaleStore.setProperty('strategy', DUTCH_AUCTION)

    // When
    tokenStore.setToken(token, validations)
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeFalsy()
  })

  it(`should check if token is valid TRUE`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: VALID,
      ticker: VALID,
      decimals: VALID,
      supply: VALID
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeTruthy()
  })

  it(`should check if token is valid`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }

    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, null)
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeUndefined()
  })

  it(`should check if token is valid with add token setup`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    tokenStore.addTokenSetup()

    // When
    const tokenResult = tokenStore.tokenMintedStructure

    // Then
    expect(tokenResult).toEqual({ decimals: '18', name: '', reservedTokensInput: { dim: 'tokens' }, ticker: '' })
  })

  it(`should check if token is valid with update validity I`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: VALID,
      ticker: VALID,
      decimals: VALID,
      supply: VALID
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    tokenStore.updateValidity('name', INVALID)
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeFalsy()
  })

  it(`should check if token is valid with update validity II`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: VALID,
      ticker: VALID,
      decimals: VALID,
      supply: VALID
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    tokenStore.updateValidity('name', VALID)
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeTruthy()
  })

  it(`should check if token is valid with update validity III`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: VALID,
      ticker: VALID,
      decimals: VALID,
      supply: INVALID
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    tokenStore.updateValidity('supply', VALID)
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeTruthy()
  })

  it(`should check if token is valid with update validity IV`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: VALID,
      ticker: VALID,
      decimals: VALID,
      supply: INVALID
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    tokenStore.updateValidity('supply', INVALID)
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeFalsy()
  })

  it(`should check if token is invalid I`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: VALID,
      ticker: VALID,
      decimals: VALID,
      supply: VALID
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    tokenStore.invalidateToken()
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeTruthy()
  })

  it(`should check if token is invalid II`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: EMPTY,
      ticker: EMPTY,
      decimals: EMPTY,
      supply: VALID
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    tokenStore.invalidateToken()
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeFalsy()
  })

  it(`should check if token is invalid III`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }
    const validations = {
      name: EMPTY,
      ticker: EMPTY,
      decimals: EMPTY,
      supply: EMPTY
    }
    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, validations)
    tokenStore.invalidateToken()
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(isTokenValid).toBeFalsy()
  })

  it(`should check if token is invalid IV`, () => {
    // Given
    const token = {
      name: 'test',
      ticker: 'test',
      decimals: 18,
      supply: 1000
    }

    crowdsaleStore.setProperty('strategy', MINTED_CAPPED_CROWDSALE)

    // When
    tokenStore.setToken(token, null)
    const functionReturn = tokenStore.invalidateToken()
    const isTokenValid = tokenStore.isTokenValid

    // Then
    expect(functionReturn).toBeUndefined()
    expect(isTokenValid).toBeUndefined()
  })
})
