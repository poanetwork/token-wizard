import { observable, action } from 'mobx';

class InvestStore {

  @observable tokensToInvest;

  @action setProperty = (property, value) => {
    this[property] = value
  }

}

const investStore = new InvestStore();

export default investStore;
export { InvestStore };
