import { observable, action } from 'mobx';
import autosave from './autosave'

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

  constructor() {
    autosave(this, 'ContractStore')
  }

  @action setContract = (contractName, contractObj) => {
    this[contractName] = contractObj;
  }

  @action setContractProperty = (contractName, property, value) => {
    let newContract = Object.assign({}, this[contractName])
    newContract[property] = value
    this[contractName] = newContract;
  }
}

export default ContractStore;
