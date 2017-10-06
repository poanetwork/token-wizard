import { observable, action } from 'mobx';

class CrowdsaleBlockListStore {

	@observable crowdsaleBlockList;
	
	constructor(crowdsaleBlockList = []) {
    this.crowdsaleBlockList = crowdsaleBlockList;
  }

  @action addCrowdsaleBlock = (crowdsaleBlock) => {
    this.crowdsaleBlockList.push(crowdsaleBlock)
	}
	
	@action setCrowdsaleBlockProperty = (index, property, value) => {
		let newCrowdsaleBlock = {...this.crowdsaleBlockList[index]}
		newCrowdsaleBlock[property] = value
    this.crowdsaleBlockList[index] = newCrowdsaleBlock;
	}
	
	@action removeCrowdsaleBlock = (index) => {
		this.crowdsaleBlockList.splice(index,1)
	}

}

const crowdsaleBlockListStore = new CrowdsaleBlockListStore();

export default crowdsaleBlockListStore;
export { CrowdsaleBlockListStore };
