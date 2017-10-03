import { observable, computed, action } from 'mobx';

class PricingStrategies {

	@observable strategies;
	
	constructor(strategies = []) {
    this.strategies = strategies;
  }

  @action addStrategy = (strategy) => {
    this.strategies.push(strategy)
	}
	
	@action setStrategyProperty = (index, property, value) => {
		let newStrategy = {...this.strategies[index]}
		newStrategy[property] = value
    this.strategies[index] = newStrategy;
	}
	
	@action removeStrategy = (index) => {
		this.strategies.splice(index,1)
	}

}

const pricingStrategies = new PricingStrategies();

export default pricingStrategies;
export { PricingStrategies };