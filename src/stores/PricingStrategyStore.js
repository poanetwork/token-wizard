import { observable, action } from 'mobx';

class PricingStrategyStore {

	@observable strategies;
	
	constructor(strategies = []) {
    this.strategies = strategies;
  }

  @action addStrategy = (strategy) => {
    this.strategies.push(strategy)
	}
	
	@action setStrategyProperty = (value, property, index) => {
		let newStrategy = {...this.strategies[index]}
		newStrategy[property] = value
    this.strategies[index] = newStrategy;
	}
	
	@action removeStrategy = (index) => {
		this.strategies.splice(index,1)
	}

}

const pricingStrategyStore = new PricingStrategyStore();

export default pricingStrategyStore;
export { PricingStrategyStore };
