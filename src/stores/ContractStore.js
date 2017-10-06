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
  @observable contractType;
  @observable tierCrowdsaleList;

  constructor() {
    this.contractType = CONTRACT_TYPES.whitelistwithcap;
    this.tierCrowdsaleList = [{
      startTime: '',
      endTime: '',
      walletAddress: '',
      supply: '',
      whitelist: [], 
      whiteListElements: [], 
      whiteListInput: {}
    }];
  }

  @action setTierCrowdsaleList = (key, property, value, extendedProp=null) => {
    if (extendedProp) {
      this.tierCrowdsaleList[key].property[extendedProp] = value;      
    } else {
      this.tierCrowdsaleList[key].property = value;      
    }
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
