import Web3Store from '../../src/stores/Web3Store'
import Web3 from 'web3'

describe(`Web3Store`, () => {
  let web3Store

  beforeEach(() => {
    web3Store = new Web3Store()
  })

  it(`should webStore set a property I`, () => {
    // Given
    const curAddress = 'testcuraddress'
    web3Store.setProperty('curAddress', curAddress)

    // When
    const web3StoreCurAddress = web3Store.curAddress

    // Then
    expect(typeof web3StoreCurAddress).toBe('string')
    expect(web3StoreCurAddress).toBe(curAddress)
  })

  it(`should webStore set a property II`, () => {
    // Given
    const curAddress1 = 'testcuraddress1'
    const curAddress2 = 'testcuraddress2'
    web3Store.setProperty('curAddress', curAddress1)
    web3Store.setProperty('curAddress', curAddress2)

    // When
    const web3StoreCurAddress = web3Store.curAddress

    // Then
    expect(typeof web3StoreCurAddress).toBe('string')
    expect(web3StoreCurAddress).not.toBe(curAddress1)
    expect(web3StoreCurAddress).toBe(curAddress2)
  })

  it(`should set web3 in the web3store THEN I`, () => {
    // Given
    const cb = jest.fn()

    // Set infura token
    process.env.REACT_APP_INFURA_TOKEN = 'kEpzZR9fIyO3a8gTqJcI'
    global.web3 = new Web3(new Web3.providers.HttpProvider('https://sokol.poa.network'))

    // When
    web3Store.getWeb3(cb, 1)

    // Then
    expect(typeof web3Store.web3).toBe('object')
  })

  it(`should set web3 in the web3store THEN II`, () => {
    // Given
    const cb = jest.fn()

    // Set infura token
    process.env.REACT_APP_INFURA_TOKEN = 'kEpzZR9fIyO3a8gTqJcI'
    global.web3 = new Web3(new Web3.providers.HttpProvider('https://Mainnet.infura.io/kEpzZR9fIyO3a8gTqJcI'))

    // When
    const web3 = web3Store.getWeb3(cb, 1)

    // Then
    expect(typeof web3).toBe('object')
    expect(web3.currentProvider.host).toBe('https://Mainnet.infura.io/kEpzZR9fIyO3a8gTqJcI')
  })

  it(`should set web3 in the web3store THEN III`, () => {
    // Given
    const cb = jest.fn()

    // Set infura token
    process.env.REACT_APP_INFURA_TOKEN = 'kEpzZR9fIyO3a8gTqJcI'
    web3Store.web3 = new Web3(new Web3.providers.HttpProvider('https://Morden.infura.io/kEpzZR9fIyO3a8gTqJcI'))

    // When
    const web3 = web3Store.getWeb3(cb, 2)

    // Then
    expect(typeof web3).toBe('object')
    expect(web3.currentProvider.host).toBe('https://Morden.infura.io/kEpzZR9fIyO3a8gTqJcI')
  })

  it(`should set web3 in the web3store THEN IV`, () => {
    // Given
    const cb = jest.fn()

    // Set infura token
    process.env.REACT_APP_INFURA_TOKEN = 'kEpzZR9fIyO3a8gTqJcI'
    web3Store.web3 = new Web3(new Web3.providers.HttpProvider('https://Ropsten.infura.io/kEpzZR9fIyO3a8gTqJcI'))

    // When
    const web3 = web3Store.getWeb3(cb, 3)

    // Then
    expect(typeof web3).toBe('object')
    expect(web3.currentProvider.host).toBe('https://Ropsten.infura.io/kEpzZR9fIyO3a8gTqJcI')
  })

  it(`should set web3 in the web3store THEN V`, () => {
    // Given
    const cb = jest.fn()

    // Set infura token
    process.env.REACT_APP_INFURA_TOKEN = 'kEpzZR9fIyO3a8gTqJcI'
    web3Store.web3 = new Web3(new Web3.providers.HttpProvider('https://Rinkeby.infura.io/kEpzZR9fIyO3a8gTqJcI'))

    // When
    const web3 = web3Store.getWeb3(cb, 4)

    // Then
    expect(typeof web3).toBe('object')
    expect(web3.currentProvider.host).toBe('https://Rinkeby.infura.io/kEpzZR9fIyO3a8gTqJcI')
  })

  it(`should set web3 in the web3store THEN VI`, () => {
    // Given
    const cb = jest.fn()

    // Set infura token
    process.env.REACT_APP_INFURA_TOKEN = 'kEpzZR9fIyO3a8gTqJcI'
    web3Store.web3 = new Web3(new Web3.providers.HttpProvider('https://Kovan.infura.io/kEpzZR9fIyO3a8gTqJcI'))

    // When
    const web3 = web3Store.getWeb3(cb, 42)

    // Then
    expect(typeof web3).toBe('object')
    expect(web3.currentProvider.host).toBe('https://Kovan.infura.io/kEpzZR9fIyO3a8gTqJcI')
  })

  it(`should set web3 in the web3store ELSE I`, async () => {
    // Given
    const cb = jest.fn()
    const web3 = new Web3(new Web3.providers.HttpProvider('https://sokol.poa.network'))
    global.web3 = web3

    // When
    const web3FromStore = web3Store.getWeb3(cb)
    const isListening = await web3FromStore.eth.net.isListening()

    // Then
    expect(typeof web3FromStore).toBe('object')
    expect(isListening).toBeTruthy()
  })
})
