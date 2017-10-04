import { observable, computed, action } from 'mobx';

class ReservedTokens {

	@observable tokens;
	
	constructor(tokens = []) {
    this.tokens = tokens;
  }

  @action addToken = (token) => {
    this.tokens.push(token)
	}
	
	@action setTokenProperty = (index, property, value) => {
		let newToken = {...this.tokens[index]}
		newToken[property] = value
    this.tokens[index] = newToken;
	}
	
	@action removeToken = (index) => {
		this.tokens.splice(index,1)
	}

}

const reservedTokens = new ReservedTokens();

export default reservedTokens;
export { ReservedTokens };