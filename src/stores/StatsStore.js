import { action, observable } from 'mobx'

class StatsStore {
  @observable totalEthRaised
  @observable totalCrowdsales
  @observable percentageOfWhitelisted
  @observable percentageOfFinalized
  @observable percentageOfMultiTiers
  @observable percentageOfReserved
  @observable totalInvolvedContributorsAmount
  @observable maxTiersAmount
  @observable maxEthRaised

  constructor() {
    this.totalEthRaised = 0
    this.totalCrowdsales = 0
    this.percentageOfWhitelisted = 0
    this.percentageOfFinalized = 0
    this.percentageOfMultiTiers = 0
    this.percentageOfReserved = 0
    this.totalInvolvedContributorsAmount = 0
    this.maxTiersAmount = 0
    this.maxEthRaised = 0
  }

  @action
  setProperty = (property, value) => {
    if (!this.hasOwnProperty(property)) {
      throw new Error(`${property} is not declared as a property`)
    }
    this[property] = value
  }
}

export default StatsStore
