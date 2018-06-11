import { observable, action } from 'mobx';
import autosave from './autosave'

class ContractStore {

  @observable abstractSorage;
  @observable registryIdx;
  @observable provider;
  @observable registryExec;
  @observable idxMintedCapped;
  @observable saleMintedCapped;
  @observable saleManagerMintedCapped;
  @observable tokenMintedCapped;
  @observable tokenManagerMintedCapped;
  @observable initCrowdsaleDutchAuction;
  @observable crowdsaleConsoleDutchAuction;
  @observable crowdsaleBuyTokensDutchAuction;
  @observable crowdsale;
  @observable tokenTransfer;
  @observable tokenTransferFrom;
  @observable tokenApprove;
  @observable tokenConsoleDutchAuction;

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
