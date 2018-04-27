import { observable, action } from 'mobx';
import autosave from './autosave'

class ContractStore {

  @observable registryStorage;
  @observable initRegistry;
  @observable scriptExec;
  @observable initCrowdsaleMintedCapped;
  @observable crowdsaleConsoleMintedCapped;
  @observable crowdsaleBuyTokensMintedCapped;
  @observable initCrowdsaleDutchAuction;
  @observable crowdsaleConsoleDutchAuction;
  @observable crowdsaleBuyTokensDutchAuction;

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
