import { observable, computed, action } from 'mobx';

class Token {

  @observable name;
	@observable ticker;
	@observable supply;
	@observable decimals;

	@action setProperty = (property, value) => {
		this[property] = value
	}

}

const token = new Token();

export default token;
export { Token };