import { observable, computed, action } from 'mobx';

class ReservedTokensInput {

	@observable dim;
	@observable addr;
	@observable val;

  @action setProperty = (property, value) => {
    this[property] = value
	}

}

const reservedTokensInput = new ReservedTokensInput();

export default reservedTokensInput;
export { ReservedTokensInput };