import Web3Store from '../../src/stores/Web3Store'
import Web3 from 'web3'

describe(`Web3Store`, () => {
  const infuraToken = '194540d7c13c4d9789cd7d682c248cd0'

  beforeEach(() => {
    process.env.REACT_APP_INFURA_TOKEN = infuraToken
  })

  describe(`Web3Store without infura`, () => {
    it(`should webStore set a property I`, () => {
      // Given
      const curAddress = 'testcuraddress'
      const web3Store = new Web3Store()
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
      const web3Store = new Web3Store()
      web3Store.setProperty('curAddress', curAddress1)
      web3Store.setProperty('curAddress', curAddress2)

      // When
      const web3StoreCurAddress = web3Store.curAddress

      // Then
      expect(typeof web3StoreCurAddress).toBe('string')
      expect(web3StoreCurAddress).not.toBe(curAddress1)
      expect(web3StoreCurAddress).toBe(curAddress2)
    })

    it(`should set web3 in the web3store I`, () => {
      // Given

      // Set infura token
      global.web3 = new Web3(new Web3.providers.HttpProvider('https://sokol.poa.network'))

      // When
      const web3Store = new Web3Store()
      const cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)
          return web3
        }
      }
      web3Store.getWeb3(cb, 1)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe('https://sokol.poa.network')
    })

    it(`should set web3 in the web3store II`, () => {
      // Given

      // Set infura token
      global.web3 = new Web3(new Web3.providers.HttpProvider(`https://Mainnet.infura.io/${infuraToken}`))

      // When
      const web3Store = new Web3Store()
      const cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)
          return web3
        }
      }
      web3Store.getWeb3(cb, 1)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Mainnet.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store III`, () => {
      // Given

      // Set infura token
      global.web3 = new Web3(new Web3.providers.HttpProvider(`https://Morden.infura.io/${infuraToken}`))

      // When
      const web3Store = new Web3Store()
      const cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)
          return web3
        }
      }
      web3Store.getWeb3(cb, 2)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Morden.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store IV`, () => {
      // Given

      // Set infura token
      global.web3 = new Web3(new Web3.providers.HttpProvider(`https://Ropsten.infura.io/${infuraToken}`))

      // When
      const web3Store = new Web3Store()
      const cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)
          return web3
        }
      }
      web3Store.getWeb3(cb, 3)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Ropsten.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store V`, () => {
      // Given

      // Set infura token
      global.web3 = new Web3(new Web3.providers.HttpProvider(`https://Rinkeby.infura.io/${infuraToken}`))

      // When
      const web3Store = new Web3Store()
      const cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)
          return web3
        }
      }
      web3Store.getWeb3(cb, 4)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Rinkeby.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store VI`, () => {
      // Given

      // Set infura token
      global.web3 = new Web3(new Web3.providers.HttpProvider(`https://Kovan.infura.io/${infuraToken}`))

      // When
      const web3Store = new Web3Store()
      const cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)
          return web3
        }
      }
      web3Store.getWeb3(cb, 42)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Kovan.infura.io/${infuraToken}`)
    })
  })

  describe(`Web3Store infura`, () => {
    let web3Store, cb

    beforeEach(() => {
      process.env.NODE_ENV = 'test'
      web3Store = new Web3Store()
      cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)
          return web3
        }
      }
      web3Store.setProperty('web3', undefined)
      delete global.web3
    })

    it(`should set web3 in the web3store with infura I`, () => {
      // Given

      // When
      web3Store.getWeb3(cb, 42)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Kovan.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store with infura II`, () => {
      // Given

      // When
      web3Store.getWeb3(cb, 4)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Rinkeby.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store with infura III`, () => {
      // Given

      // When
      web3Store.getWeb3(cb, 3)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Ropsten.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store with infura IV`, () => {
      // Given

      // When
      web3Store.getWeb3(cb, 2)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Morden.infura.io/${infuraToken}`)
    })

    it(`should set web3 in the web3store with infura V`, () => {
      // Given

      // When
      web3Store.getWeb3(cb, 1)

      // Then
      expect(typeof web3Store.web3).toBe('object')
      expect(web3Store.web3.currentProvider.host).toBe(`https://Mainnet.infura.io/${infuraToken}`)
    })
  })

  describe(`Web3Store Ethereum`, () => {
    beforeEach(() => {})

    it(`should set web3 with ethereum`, () => {
      let ethereum = require('../helpers/web3-fake-provider')
      // Fake ethereum provider
      global.ethereum = new ethereum()

      let web3Store = new Web3Store()
      let cb = (web3, status) => {
        if (web3) {
          web3Store.setProperty('web3', web3)

          // Then
          expect(typeof web3Store.web3).toBe('object')
          const currentProvider = web3Store.web3.currentProvider
          expect(typeof currentProvider).toBe(`object`)

          return web3
        }
      }

      // When
      web3Store.getWeb3(cb, 1)
    })
  })
})
