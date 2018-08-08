import { observable, action } from 'mobx'
import autosave from './autosave'
import { computed } from 'mobx'
import { LIMIT_RESERVED_ADDRESSES } from '../utils/constants'

class ReservedTokenStore {
  @observable tokens

  constructor(tokens = []) {
    this.tokens = tokens

    autosave(this, 'ReservedTokenStore')
  }

  @action
  addToken = token => {
    const currentToken = this.tokens.find(t => t.addr === token.addr && t.dim === token.dim)

    if (currentToken) {
      const index = this.tokens.indexOf(currentToken)
      this.tokens[index] = token
    } else {
      this.tokens.push(token)
    }
  }

  @action
  setTokenProperty = (index, property, value) => {
    let newToken = { ...this.tokens[index] }
    newToken[property] = value
    this.tokens[index] = newToken
  }

  @action
  removeToken = index => {
    this.tokens.splice(index, 1)
  }

  @action
  clearAll = () => {
    this.tokens.splice(0)
  }

  findToken(inputToken) {
    return this.tokens.find(token => {
      if (
        inputToken['dim'] === token['dim'] &&
        inputToken['addr'] === token['addr'] &&
        inputToken['val'] === token['val']
      ) {
        return true
      }

      return false
    })
  }

  @computed
  get validateLength() {
    return this.tokens.length < LIMIT_RESERVED_ADDRESSES
  }

  @action
  reset = () => {
    this.tokens = []
  }

  @action
  applyDecimalsToTokens = (decimals = 0) => {
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.tokens && this.tokens[i] && this.tokens[i].val) {
        this.tokens[i].val = parseFloat(this.tokens[i].val).toFixed(decimals)
      }
    }
  }
}

export default ReservedTokenStore
