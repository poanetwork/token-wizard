import { observable, computed, action } from 'mobx';

class ReservedTokensInputStore {

	@observable dim;
	@observable addr;
	@observable val;

  @action setProperty = (property, value) => {
    this[property] = value
	}

}

const reservedTokensInput = new ReservedTokensInputStore();

export default reservedTokensInput;
export { ReservedTokensInputStore };