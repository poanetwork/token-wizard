import { observable, action } from 'mobx';

class ContractStore {

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

const contractStore = new ContractStore();

export default contractStore;
export { ContractStore };
