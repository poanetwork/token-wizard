import { observable, action } from 'mobx';
import { CONTRACT_TYPES } from '../utils/constants';

class ContractStore {

  @observable token;
  @observable crowdsale;
  @observable pricingStrategy;
  @observable multisig;
  @observable nullFinalizeAgent;
  @observable finalizeAgent;
  @observable tokenTransferProxy;
  @observable safeMathLib;
  @observable registry;
  @observable contractType;

  constructor() {
    this.contractType = CONTRACT_TYPES.whitelistwithcap;
  }

  @action setContract = (contractName, contractObj) => {
    this[contractName] = contractObj;
  }

  @action setContractType = (contractType) => {
    this.contractType = contractType;
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
