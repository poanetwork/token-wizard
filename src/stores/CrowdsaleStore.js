import { action, observable } from 'mobx'

class CrowdsaleStore {
  @observable crowdsales
  @observable maximumSellableTokens
  @observable maximumSellableTokensInWei
  @observable supply
  @observable selected

  constructor (crowdsales = []) {
    this.crowdsales = crowdsales
    this.selected = {
      updatable: true
    }
  }

  @action setCrowdsales = (crowdsales) => {
    this.crowdsales = crowdsales
  }

  @action setProperty = (property, value) => {
    this[property] = value
  }

  @action setSelectedProperty = (property, value) => {
    let currentCrowdsale = Object.assign({}, this.selected)
    currentCrowdsale[property] = value
    this.selected = currentCrowdsale
  }
}

const crowdsaleStore = new CrowdsaleStore()

export default crowdsaleStore
export { CrowdsaleStore }
