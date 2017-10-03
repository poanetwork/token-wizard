import { observable, computed, action } from 'mobx';

class ReservedTokenInputStore {

	@observable dim;
	@observable addr;
	@observable val;

  @action setProperty = (property, value) => {
    this[property] = value
	}

}

const reservedTokenInputStore = new ReservedTokenInputStore();

export default reservedTokenInputStore;
export { ReservedTokenInputStore };