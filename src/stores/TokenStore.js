import { observable, action, computed } from 'mobx';
import { validateName, validateTicker, validateDecimals } from '../utils/utils'
import { VALIDATION_TYPES } from '../utils/constants'
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES;

class TokenStore {

  @observable name;
  @observable ticker;
  @observable supply;
  @observable decimals;
  @observable validToken;
  @observable reservedTokensInput;

  constructor() {
    this.validToken = {
      'name': EMPTY,
      'ticker': EMPTY,
      'decimals': EMPTY
    };
    this.supply = 0
    this.reservedTokensInput = {}
  }

  @action setProperty = (property, value) => {
    this[property] = value;
  }
  
  @action validateTokens = (property) => {
    if (property === 'name') {
      this.validToken[property] = validateName(this.name) ? VALID : INVALID;
    } else if (property === 'ticker') {
      this.validToken[property] = validateTicker(this.ticker) ? VALID : INVALID;
    } else {
      this.validToken[property] = validateDecimals(this.decimals) ? VALID : INVALID;
    }
  }

  @action invalidateToken = () => {
    if (!this.validToken) {
      return;
    }

    Object.keys(this.validToken).forEach(key => {
      if (this.validToken[key] === EMPTY) {
        this.validToken[key] = INVALID;
      }
    });
  }
  
  // Getters 
  @computed get isTokenValid() {
    if (!this.validToken) {
      return;
    }
    
    const validKeys = Object.keys(this.validToken).filter((key) => {
      if (this.validToken[key] === VALID) {
        return true;
      } else {
        return false;
      }
    });
    return validKeys.length === Object.keys(this.validToken).length
  }
}

const tokenStore = new TokenStore();

export default tokenStore;
export { TokenStore };
