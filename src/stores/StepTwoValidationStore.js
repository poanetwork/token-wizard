import { observable, computed, action } from 'mobx';

class stepTwoValidationStore {

  @observable name;
	@observable ticker;
	@observable decimals;

	constructor() {
		this.name = 'EMPTY'
		this.ticker = 'EMPTY'
		this.decimals = 'EMPTY'
	}

	@action property = (property, value) => {
		this[property] = value
	}

}

const stepTwoValidations = new StepTwoValidationStore();

export default stepTwoValidations;
export { StepTwoValidationStore };