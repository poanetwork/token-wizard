import { observable, action } from 'mobx';

class CrowdsalePageStore {

  @observable maximumSellableTokens;
  @observable maximumSellableTokensInWei;
  @observable investors;
  @observable ethRaised;
  @observable weiRaised;
  @observable rate;
  @observable tokensSold;
  @observable tokenAmountOf;
  @observable startBlock
  @observable endDate;

  @action setProperty = (property, value) => {
    this[property] = value
  }
}

export default CrowdsalePageStore;
