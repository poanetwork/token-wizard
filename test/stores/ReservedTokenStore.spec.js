import ReservedTokenStore from '../../src/stores/ReservedTokenStore'

describe('ReservedTokenStore', function() {
  let reservedTokenStore
  const tokens = [
    {
      addr: '0x66f537cCD03f21c58172602B919884A442A3c313',
      dim: 'percentage',
      val: '90'
    },
    {
      addr: '0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x693d436da2c3C11341149522E5F6d0390B363197',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x67737e0046b05D2553ad1021A02d957D9c854C00',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x20372dffd12d7b012FF44c9DBae70E5e1aE47C73',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x2BCDBBd0Df231e9C35F3a27a4b9F4E631DD6f8AB',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0xc4C92D54E2136d7A72F4f738B3FA69Df7b479821',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x2bD96eA633e8BcB468732c68B2CD632BfF4D79Db',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x848822D9101ecF8731B09CF52d4a034123FF7F97',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x866623622b19D8603F54d0aF23236759DCeB48d9',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x46fe103Be22C370E2D4143e6b61D1769017b48F0',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x063376DDB05d9e0E0D3761D0D962f9d31F9F6035',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0xc6fD167492BeDf4B4f83e84FeCf9483027565650',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x1595F0a0dE18aE149081aA28b2F51aa5619e3523',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0xb51454306fAa9A3Cf0505a22dff85d5b4EC13B3F',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x7A317D210de8201C8623a0f35d44Eb34D8115B45',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x91c93F00F32898269336734Fe0611C1E9CB12d0A',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x61B748ccD326dEF03dE119d74c81391050dFe021',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0x24952775eE2c842ea624991a0A422f1B0AcecA84',
      dim: 'tokens',
      val: '90'
    },
    {
      addr: '0xB848714c08acC2D32511C5F93F7BCcd43112F3cb',
      dim: 'tokens',
      val: '90'
    }
  ]

  beforeEach(() => {
    reservedTokenStore = new ReservedTokenStore([])
  })

  afterEach(() => {
    reservedTokenStore.reset()
  })

  it(`should validate length FALSE`, () => {
    // Given
    for (let token of tokens) {
      reservedTokenStore.addToken(token)
    }

    const tokenToAdd = {
      addr: '0x08C9f711d326CaCB341DDBb406BB67475817DAd3',
      dim: 'tokens',
      val: '90'
    }
    reservedTokenStore.addToken(tokenToAdd)

    // When
    const validateLength = reservedTokenStore.validateLength

    // Then
    expect(validateLength).toBeFalsy()
  })

  it(`should validate length TRUE`, () => {
    // Given
    for (let token of tokens) {
      reservedTokenStore.addToken(token)
    }
    reservedTokenStore.removeToken(0)

    // When
    const validateLength = reservedTokenStore.validateLength

    // Then
    expect(validateLength).toBeTruthy()
  })

  it(`should  set a token property`, () => {
    // Given
    for (let token of tokens) {
      reservedTokenStore.addToken(token)
    }

    const index = 1
    const property = 'address'
    const value = 'OXtest'

    // When
    reservedTokenStore.setTokenProperty(index, property, value)
    const addressProperty = reservedTokenStore.tokens[index][property]

    // Then
    expect(addressProperty).toEqual(value)
  })

  it(`should maintain the length if you add an existing token`, () => {
    // Given
    for (let token of tokens) {
      reservedTokenStore.addToken(token)
    }

    const token = {
      addr: '0x66f537cCD03f21c58172602B919884A442A3c313',
      dim: 'percentage',
      val: '90'
    }

    // When
    const beforeLength = reservedTokenStore.tokens.length
    reservedTokenStore.addToken(token)
    const afterLength = reservedTokenStore.tokens.length

    // Then
    expect(beforeLength).toEqual(afterLength)
  })

  it(`should find or not a token in the collection`, () => {
    // Given
    for (let token of tokens) {
      reservedTokenStore.addToken(token)
    }

    const tokenFound = {
      addr: '0x66f537cCD03f21c58172602B919884A442A3c313',
      dim: 'percentage',
      val: '90'
    }

    const tokenNotFound = {
      addr: '0x66f537cCD03f21c58172602B919884A442A3c313AAA',
      dim: 'percentage',
      val: '90'
    }

    // When
    const tokenFoundResult = reservedTokenStore.findToken(tokenFound)
    const tokenNotFoundResult = reservedTokenStore.findToken(tokenNotFound)

    // Then
    expect(tokenFoundResult).toBeTruthy()
    expect(tokenNotFoundResult).toBeFalsy()
  })

  it(`should apply decimals and get undefined`, () => {
    // Given
    for (let token of tokens) {
      reservedTokenStore.addToken(token)
    }

    // When
    const decimalsTokensUndefinedOne = reservedTokenStore.applyDecimalsToTokens(20)
    const decimalsTokensUndefinedTwo = reservedTokenStore.applyDecimalsToTokens(-10)

    // Then
    expect(decimalsTokensUndefinedOne).toBeUndefined()
    expect(decimalsTokensUndefinedTwo).toBeUndefined()
  })

  it(`should apply decimals`, () => {
    // Given
    for (let token of tokens) {
      reservedTokenStore.addToken(token)
    }
    const decimalsDefault = 10

    // When
    reservedTokenStore.applyDecimalsToTokens(decimalsDefault)

    // Then
    for (let i = 0; i < reservedTokenStore.tokens.length; i++) {
      if (reservedTokenStore.tokens[i].val) {
        // Check if val is decimal with 10 digits
        const value = reservedTokenStore.tokens[i].val
        const decimalsValue = (value.split('.')[1] || []).length
        expect(decimalsValue).toEqual(decimalsDefault)
      }
    }
  })
})
