import { observable, action } from 'mobx';

class ContributeStore {

  @observable tokensToInvest;

  @action setProperty = (property, value) => {
    this[property] = value
  }
}

export default ContributeStore;
