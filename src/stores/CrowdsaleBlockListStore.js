import { observable, action } from 'mobx';

class CrowdsaleBlockListStore {

  @observable blockList;
  
  constructor(blockList = []) {
    this.blockList = blockList;
  }

  @action addCrowdsaleItem = (crowdsaleBlock) => {
    this.blockList.push(crowdsaleBlock)
  }
  
  @action setCrowdsaleItemProperty = (index, property, value) => {
    let newCrowdsaleItem = {...this.blockList[index]}
    newCrowdsaleItem[property] = value
    this.blockList[index] = newCrowdsaleItem;
  }
  
  @action removeCrowdsaleItem = (index) => {
    this.blockList.splice(index,1)
  }

	@action emptyList = () => {
		this.blockList = []
	}

}

const crowdsaleBlockListStore = new CrowdsaleBlockListStore();

export default crowdsaleBlockListStore;
export { CrowdsaleBlockListStore };
