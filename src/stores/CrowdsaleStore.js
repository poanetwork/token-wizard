import { action, observable, computed } from 'mobx'
import autosave from './autosave'
import { CROWDSALE_STRATEGIES } from '../utils/constants'

class CrowdsaleStore {
  @observable crowdsales
  @observable strategy
  @observable maximumSellableTokens
  @observable maximumSellableTokensInWei
  @observable supply
  @observable endTime
  @observable selected

  constructor () {
    this.reset()
    autosave(this, 'CrowdsaleStore')
  }

  @computed
  get isDutchAuction () {
    if (this.strategy == CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE) return false;
    else if (this.strategy == CROWDSALE_STRATEGIES.DUTCH_AUCTION) return true;
    return false;
  }

  @computed
  get isMintedCappedCrowdsale () {
    if (this.strategy == CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE) return true;
    else if (this.strategy == CROWDSALE_STRATEGIES.DUTCH_AUCTION) return false;
    return false;
  }

  @computed
  get contractTargetSuffix() {
    switch (this.strategy) {
      case CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE:
        return "MintedCapped"
      case CROWDSALE_STRATEGIES.DUTCH_AUCTION:
        return "DutchAuction"
      default:
        return "MintedCapped"
    }
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

export default CrowdsaleStore
