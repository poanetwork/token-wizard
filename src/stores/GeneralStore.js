import { observable, action } from 'mobx';

class GeneralStore {

  @observable networkId;
  
  @action setProperty = (property, value) => {
		this[property] = value
  }

}

const generalStore = new GeneralStore();

export default generalStore;
export { GeneralStore };
