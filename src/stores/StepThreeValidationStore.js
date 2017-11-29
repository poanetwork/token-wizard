import { observable, action } from 'mobx';

class StepThreeValidationStore {

	@observable validationsList 

	constructor() {
		this[0] = {}
		this[0].name = 'EMPTY'
		this[0].walletAddress = 'EMPTY'
		this[0].rate = 'EMPTY'
		this[0].supply = 'EMPTY'
		this[0].startTime = 'VALIDATED'
		this[0].endTime = 'VALIDATED'
		this[0].updatable = "VALIDATED"
	}

	@action changeProperty = (index, property, value) => {
		this[index][property] = value
	}

	@action addValidationItem = (item) => {
		this.validationsList.push(item)
	}


}

const stepThreeValidationStore = new StepThreeValidationStore();

export default stepThreeValidationStore;
export { StepThreeValidationStore };
