import { observable, action } from 'mobx';
import { GAS_PRICE } from '../utils/constants';

class GeneralStore {

  @observable networkId;
  @observable gasPrice = GAS_PRICE.FAST.PRICE;

  @action setProperty = (property, value) => {
    this[property] = value
  }

  @action setGasPrice = (gasPrice) => {
    this.gasPrice = gasPrice
  }
}

const generalStore = new GeneralStore();

export default generalStore;
export { GeneralStore };
