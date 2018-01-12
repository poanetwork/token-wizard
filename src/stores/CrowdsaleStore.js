import { action, observable } from 'mobx'

class CrowdsaleStore {
  @observable crowdsales
  @observable maximumSellableTokens
  @observable maximumSellableTokensInWei
  @observable supply
  @observable selected

  constructor () {
    this.reset()
  }

  @action reset = () => {
    this.crowdsales = []
    this.selected = {
      updatable: false,
      initialTiersValues: []
    }
  }

  @action setCrowdsales = (crowdsales) => {
    this.crowdsales = crowdsales
  }

  @action setProperty = (property, value) => {
    this[property] = value
  }

  @action setSelectedProperty = (property, value) => {
    const currentCrowdsale = Object.assign({}, this.selected)

    currentCrowdsale[property] = value
    this.selected = currentCrowdsale
  }

  @action addInitialTierValues = (initialValues) => {
    this.selected.initialTiersValues.push(initialValues)
  }
}

const crowdsaleStore = new CrowdsaleStore()

export default crowdsaleStore
export { CrowdsaleStore }
