import { observable, action, computed } from 'mobx';
import { validateName, validateTicker, validateDecimals } from '../utils/utils'
import { VALIDATION_TYPES } from '../utils/constants'
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES;

class TokenStore {

  @observable name;
	@observable ticker;
	@observable supply;
	@observable decimals;

	@action setProperty = (property, value) => {
		this[property] = value;
  }
	
	@computed get validName() {
		if (this.name == null) {
			return EMPTY;
		} else if (validateName(this.name)) {
			return VALID;
		} else {
			return INVALID;
		}
	}

	@computed get validTicker() {
		if (this.ticker == null) {
			return EMPTY;
		} else if (validateTicker(this.ticker)) {
			return VALID;
		} else {
			return INVALID;
		}
	}

	@computed get validDecimals() {
		if (this.decimals == null) {
			return EMPTY;
		} else if (validateDecimals(this.decimals)) {
			return VALID;
		} else {
			return INVALID;
		}
	}
}

const tokenStore = new TokenStore();

export default tokenStore;
export { TokenStore };
