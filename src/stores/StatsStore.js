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
  @observable totalContributorsAmount
  @observable mintedCappedEthRaised
  @observable dutchAuctionEthRaised
  @observable mintedCappedCrowdsales
  @observable dutchAuctionCrowdsales
  @observable mintedCappedContributorsAmount
  @observable dutchAuctionContributorsAmount
  @observable mintedCappedPercentageOfFinalized
  @observable dutchAuctionPercentageOfFinalized
  @observable mintedCappedPercentageOfMultiTiers
  @observable mintedCappedMaxTiersAmount
  @observable mintedCappedMaxEthRaised
  @observable dutchAuctionMaxEthRaised
  @observable mintedCappedOngoingCrowdsales
  @observable mintedCappedFutureCrowdsales
  @observable mintedCappedPastCrowdsales
  @observable dutchAuctionOngoingCrowdsales
  @observable dutchAuctionFutureCrowdsales
  @observable dutchAuctionPastCrowdsales

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
    this.totalContributorsAmount = 0
    this.mintedCappedEthRaised = 0
    this.dutchAuctionEthRaised = 0
    this.mintedCappedCrowdsales = 0
    this.dutchAuctionCrowdsales = 0
    this.mintedCappedContributorsAmount = 0
    this.dutchAuctionContributorsAmount = 0
    this.mintedCappedPercentageOfFinalized = 0
    this.dutchAuctionPercentageOfFinalized = 0
    this.mintedCappedPercentageOfMultiTiers = 0
    this.mintedCappedMaxTiersAmount = 0
    this.mintedCappedMaxEthRaised = 0
    this.dutchAuctionMaxEthRaised = 0
    this.mintedCappedOngoingCrowdsales = 0
    this.mintedCappedFutureCrowdsales = 0
    this.mintedCappedPastCrowdsales = 0
    this.dutchAuctionOngoingCrowdsales = 0
    this.dutchAuctionFutureCrowdsales = 0
    this.dutchAuctionPastCrowdsales = 0
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
