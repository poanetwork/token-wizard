import { observable, action, computed } from 'mobx'
import { defaultTokenValues, defaultTokenValidations, VALIDATION_TYPES } from '../utils/constants'
import autosave from './autosave'
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES

class TokenStore {
  @observable name
  @observable ticker
  @observable supply
  @observable decimals
  @observable validToken
  @observable reservedTokensInput

  constructor() {
    this.reset()
    autosave(this, 'TokenStore')
  }

  @action
  reset = () => {
    this.name = undefined
    this.ticker = undefined
    this.decimals = undefined
    this.supply = 0
    this.validToken = {
      name: EMPTY,
      ticker: EMPTY,
      decimals: EMPTY
    }
    this.reservedTokensInput = {}
  }

  @action
  setToken = (token, validations) => {
    this.name = token.name
    this.ticker = token.ticker
    this.decimals = token.decimals
    this.supply = token.supply
    this.validToken = validations
    this.reservedTokensInput = token.reservedTokensInput
  }

  @action
  setProperty = (property, value) => {
    this[property] = value
  }

  @action
  updateValidity = (property, validity) => {
    this.validToken[property] = validity
  }

  @action
  invalidateToken = () => {
    if (!this.validToken) {
      return
    }

    Object.keys(this.validToken).forEach(key => {
      if (this.validToken[key] === EMPTY) {
        this.validToken[key] = INVALID
      }
    })
  }

  @action
  addTokenSetup = () => {
    const newToken = Object.assign({}, defaultTokenValues)
    const newTokenValidations = Object.assign({}, defaultTokenValidations)

    this.setToken(newToken, newTokenValidations)
  }

  @action
  checkIsEmptyMinted = () => {
    // The decimal field is not checked, because it has a default value
    return !this.name && !this.ticker
  }

  @action
  checkIsEmptyDutch = () => {
    // The decimal field is not checked, because it has a default value
    return !this.name && !this.ticker && !this.supply
  }

  @action
  isEmpty = crowdsaleStore => {
    if (crowdsaleStore.isDutchAuction) {
      return this.checkIsEmptyDutch()
    } else {
      return this.checkIsEmptyMinted()
    }
  }

  @action
  getTokenMinted = () => {
    return {
      name: this.name,
      ticker: this.ticker,
      decimals: this.decimals,
      reservedTokensInput: this.reservedTokensInput
    }
  }

  @action
  getTokenDutch = () => {
    return {
      name: this.name,
      ticker: this.ticker,
      decimals: this.decimals,
      supply: this.supply
    }
  }

  @action
  getToken = crowdsaleStore => {
    if (crowdsaleStore.isDutchAuction) {
      return this.getTokenDutch()
    } else {
      return this.getTokenMinted()
    }
  }

  // Getters
  @computed
  get isTokenValid() {
    if (!this.validToken) {
      return
    }

    const validKeys = Object.keys(this.validToken).filter(key => {
      if (this.validToken[key] === VALID) {
        return true
      } else {
        return false
      }
    })
    return validKeys.length === Object.keys(this.validToken).length
  }
}

export default TokenStore
