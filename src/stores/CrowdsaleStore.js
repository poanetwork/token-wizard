import { action, observable, computed } from 'mobx'
import autosave from './autosave'
import { CROWDSALE_STRATEGIES, REACT_PREFIX } from '../utils/constants'

class CrowdsaleStore {
  @observable crowdsales
  @observable strategy
  @observable maximumSellableTokens
  @observable maximumSellableTokensInWei
  @observable supply
  @observable endTime
  @observable selected

  constructor() {
    this.reset()
    autosave(this, 'CrowdsaleStore')
  }

  @computed
  get appName() {
    if (this.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE)
      return process.env[`${REACT_PREFIX}MINTED_CAPPED_APP_NAME`]
    else if (this.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION) return process.env[`${REACT_PREFIX}DUTCH_APP_NAME`]
    return ''
  }

  @computed
  get appNameHash() {
    if (this.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE)
      return process.env[`${REACT_PREFIX}MINTED_CAPPED_APP_NAME_HASH`]
    else if (this.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION)
      return process.env[`${REACT_PREFIX}DUTCH_APP_NAME_HASH`]
    return ''
  }

  @computed
  get proxyName() {
    if (this.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE) {
      return 'MintedCappedProxy'
    } else if (this.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION) {
      return 'DutchProxy'
    }
    return ''
  }

  @computed
  get crowdsaleDeployInterface() {
    const mintedCappedCrowdsaleDeployInterface = [
      'address',
      'uint256',
      'bytes32',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bool',
      'bool',
      'address'
    ]
    const dutchAuctionCrowdsaleDeployInterface = [
      'address',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bool',
      'address',
      'bool'
    ]
    if (this.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE) return mintedCappedCrowdsaleDeployInterface
    else if (this.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION) return dutchAuctionCrowdsaleDeployInterface
    return []
  }

  @computed
  get isDutchAuction() {
    if (this.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE) return false
    else if (this.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION) return true
    return false
  }

  @computed
  get isMintedCappedCrowdsale() {
    if (this.strategy === CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE) return true
    else if (this.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION) return false
    return false
  }

  @computed
  get contractTargetSuffix() {
    switch (this.strategy) {
      case CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE:
        return 'MintedCapped'
      case CROWDSALE_STRATEGIES.DUTCH_AUCTION:
        return 'Dutch'
      default:
        return ''
    }
  }

  @action
  reset = () => {
    this.crowdsales = []
    this.selected = {
      updatable: false,
      initialTiersValues: []
    }
    this.strategy = undefined
    this.maximumSellableTokens = undefined
    this.maximumSellableTokensInWei = undefined
    this.supply = undefined
    this.endTime = undefined
  }

  @action
  setCrowdsales = crowdsales => {
    this.crowdsales = crowdsales
  }

  @action
  setProperty = (property, value) => {
    this[property] = value
  }

  @action
  setSelectedProperty = (property, value) => {
    const currentCrowdsale = Object.assign({}, this.selected)

    currentCrowdsale[property] = value
    this.selected = currentCrowdsale
  }

  @action
  addInitialTierValues = initialValues => {
    this.selected.initialTiersValues.push(initialValues)
  }
}

export default CrowdsaleStore
