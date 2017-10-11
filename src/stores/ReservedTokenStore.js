import { observable, action } from 'mobx';

class ReservedTokenStore {

  @observable tokens;
  
  constructor(tokens = []) {
    this.tokens = tokens;
  }

  @action addToken = (token) => {
    this.tokens.push(token);
  }
  
  @action setTokenProperty = (index, property, value) => {
    let newToken = {...this.tokens[index]};
    newToken[property] = value;
    this.tokens[index] = newToken;
  }
  
  @action removeToken = (index) => {
    this.tokens.splice(index,1);
  }

  @action findToken = (inputToken) => {
    this.tokens.find((token) => {
      return inputToken.dim === token.dim && inputToken.addr === token.addr && inputToken.val === token.val;
    });
  }
}

const reservedTokenStore = new ReservedTokenStore();

export default reservedTokenStore;
export { ReservedTokenStore };
