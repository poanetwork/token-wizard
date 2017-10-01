import { observable, computed, action } from 'mobx';

class stepTwoValidations {

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

const stepTwoValidations = new StepTwoValidations();

export default stepTwoValidations;
export { StepTwoValidations };