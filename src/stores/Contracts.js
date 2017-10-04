import { observable, computed, action } from 'mobx';

class Contracts {

  @observable token;
	@observable crowdsale;
	@observable pricingStrategy;
	@observable multisig;
	@observable nullFinalizeAgent;
	@observable finalizeAgent;
	@observable tokenTransferProxy;
	@observable safeMathLib;

  @action setContract = (contractName, contractObj) => {
    this[contractName] = contractObj;
	}
	
	@action setContractProperty = (contractName, property, value) => {
		let newContract = Object.assign({}, this[contractName])
		newContract[property] = value
    this[contractName] = newContract;
  }

}

const contracts = new Contracts();

export default contracts;
export { Contracts };