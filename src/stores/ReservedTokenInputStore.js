import { observable, action } from 'mobx';

class ReservedTokenInputStore {

  @observable dim;
  @observable addr;
  @observable val;

  constructor() {
    this.addr = '';
    this.dim = 'tokens';
    this.val = '';
  }

  @action setProperty = (property, value) => {
    this[property] = value;
  }

  @action clearInput = () => {
    this['dim'] = 'tokens';
    this['addr'] = '';
    this['val'] = '';
  }
}

const reservedTokenInputStore = new ReservedTokenInputStore();

export default reservedTokenInputStore;
export { ReservedTokenInputStore };
