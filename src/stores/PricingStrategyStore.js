import { observable, action } from 'mobx';
import autosave from './autosave'

class PricingStrategyStore {

  @observable strategies;

  constructor(strategies = []) {
    this.strategies = strategies;

    autosave(this, 'PricingStrategyStore')
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

export default PricingStrategyStore;
