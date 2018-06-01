import { observable, action } from 'mobx';

class ContributeStore {

  @observable tokensToContribute;

  @action setProperty = (property, value) => {
    this[property] = value
  }
}

export default ContributeStore;
