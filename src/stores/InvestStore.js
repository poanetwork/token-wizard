import { observable, action } from 'mobx';

class InvestStore {

  @observable tokensToInvest;

  @action setProperty = (property, value) => {
    this[property] = value
  }
}

export default InvestStore;
