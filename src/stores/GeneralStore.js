import { observable, action } from 'mobx';
import { GAS_PRICE } from '../utils/constants';
import autosave from './autosave'

class GeneralStore {

  @observable networkId;
  @observable gasPrice = GAS_PRICE.FAST.PRICE;

  constructor() {
    autosave(this, 'GeneralStore')
  }

  @action setProperty = (property, value) => {
    this[property] = value
  }

  @action setGasPrice = (gasPrice) => {
    this.gasPrice = gasPrice
  }
}

export default GeneralStore;
