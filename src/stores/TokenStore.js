import { observable, computed, action } from 'mobx';

class TokenStore {

  @observable name;
	@observable ticker;
	@observable supply;
	@observable decimals;

	@action setProperty = (property, value) => {
		this[property] = value
	}

}

const token = new TokenStore();

export default token;
export { TokenStore };