import { observable, action } from 'mobx';

class CrowdsalePageStore {

	@observable maximumSellableTokens;
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

const crowdsalePageStore = new CrowdsalePageStore();

export default crowdsalePageStore;
export { CrowdsalePageStore };
