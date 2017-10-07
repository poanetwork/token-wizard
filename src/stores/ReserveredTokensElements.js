import { observable, computed, action } from 'mobx';

class ReservedTokensElements {

	@observable tokenElements;
	
	constructor(tokenElements = []) {
    this.tokenElements = tokenElements;
  }

  @action addToken = (token) => {
    this.tokenElements.push(token)
	}
	
	@action setTokenProperty = (index, property, value) => {
		let newToken = {...this.tokenElements[index]}
		newToken[property] = value
    this.tokenElements[index] = newToken;
	}
	
	@action removeElement = (index) => {
		this.tokenElements.splice(index,1)
	}


}

const reservedTokensElements = new ReservedTokensElements();

export default reservedTokensElements;
export { ReservedTokensElements };