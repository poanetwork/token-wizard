import { observable, computed, action } from 'mobx';

class stepThreeValidations {

  @observable name;
	@observable walletAddress;
	@observable rate;
	@observable supply;
	@observable startTime;
	@observable endTime;
	@observable updatable;

	constructor() {
		this.name = 'EMPTY'
		this.walletAddress = 'EMPTY'
		this.rate = 'EMPTY'
		this.supply = 'EMPTY'
		this.startTime = 'VALIDATED'
		this.endTime = 'VALIDATED'
		this.updatable = "VALIDATED"
	}

	@action property = (property, value) => {
		this[property] = value
	}

}

const stepThreeValidations = new StepThreeValidations();

export default stepThreeValidations;
export { StepThreeValidations };