import { observable, computed, action } from 'mobx';

class ReservedTokenInputStore {

	@observable dim;
	@observable addr;
	@observable val;

  @action setProperty = (property, value) => {
    this[property] = value
	}

}

const reservedTokensInput = new ReservedTokenInputStore();

export default reservedTokensInput;
export { ReservedTokenInputStore };