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

	constructor() {
		this.validToken = {
			'name': EMPTY,
			'ticker': EMPTY,
			'decimals': EMPTY
		}
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
		Object.keys(this.validToken).forEach(key => {
			if (this.validToken[key] === EMPTY) {
				this.validToken[key] = INVALID;
			}
		});
	}
	
	// Getters 
	@computed get isTokenValid() {
		return Object.keys(this.validToken).filter((key) => {
			if (this.validToken[key] === VALID) {
				return true;
			} else {
				return false;
			}
		});
	}


	// @computed get validName() {
	// 	if (this.name == null) {
	// 		return EMPTY;
	// 	} else if (validateName(this.name)) {
	// 		return VALID;
	// 	} else {
	// 		return INVALID;
	// 	}
	// }

	// @computed get validTicker() {
	// 	if (this.ticker == null) {
	// 		return EMPTY;
	// 	} else if (validateTicker(this.ticker)) {
	// 		return VALID;
	// 	} else {
	// 		return INVALID;
	// 	}
	// }

	// @computed get validDecimals() {
	// 	if (this.decimals == null) {
	// 		return EMPTY;
	// 	} else if (validateDecimals(this.decimals)) {
	// 		return VALID;
	// 	} else {
	// 		return INVALID;
	// 	}
	// }

	// // Setters 
	// set validateTicker(value) {
	// 	this.validToken['ticker'] = value;
	// }

	// set validateName(value) {
	// 	this.validToken['name'] = value;
	// }

	// set validateDecimals(value) {
	// 	this.validToken['decimals'] = value;
	// }
}

const tokenStore = new TokenStore();

export default tokenStore;
export { TokenStore };
