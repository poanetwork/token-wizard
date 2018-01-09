import { observable, action } from 'mobx';

class TierCrowdsaleListStore {

  @observable crowdsaleList;

  constructor(crowdsaleList = []) {
    this.crowdsaleList = crowdsaleList;
  }

  @action addCrowdsaleItem = (crowdsaleItem) => {
    this.crowdsaleList.push(crowdsaleItem)
  }

  @action setCrowdsaleItemProperty = (index, property, value) => {
    let newCrowdsaleItem = {...this.crowdsaleList[index]}
    newCrowdsaleItem[property] = value
    this.crowdsaleList[index] = newCrowdsaleItem;
  }

  @action removeCrowdsaleItem = (index) => {
    this.crowdsaleList.splice(index,1)
  }

}

const tierCrowdsaleListStore = new TierCrowdsaleListStore();

export default tierCrowdsaleListStore;
export { TierCrowdsaleListStore };
