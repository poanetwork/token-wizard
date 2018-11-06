import { action, computed, observable } from 'mobx'
import { GAS_PRICE } from '../utils/constants'
import { gweiToWei, weiToGwei } from '../utils/utils'
import { gasPriceValues } from '../utils/api'
import autosave from './autosave'

class GasPriceStore {
  @observable slow
  @observable standard
  @observable fast
  @observable instant
  @observable custom
  @observable block_number
  @observable block_time
  @observable health

  constructor() {
    this.reset()
    autosave(this, 'GasPriceStore')
  }

  @action
  setProperty = (property, value) => {
    if (this.hasOwnProperty(property)) {
      if (
        property === 'standard' ||
        property === 'slow' ||
        property === 'fast' ||
        property === 'instant' ||
        property === 'custom'
      ) {
        this[property].price = gweiToWei(value)
      } else {
        this[property] = value
      }
    }
  }

  @action
  updateValues = param => {
    return gasPriceValues(param).then(oracle => {
      for (let key in oracle) {
        if (oracle.hasOwnProperty(key)) {
          this.setProperty(key, oracle[key])
        }
      }
      return Promise.resolve()
    })
  }

  @computed
  get slowDescription() {
    return `${GAS_PRICE.SLOW.description} (${weiToGwei(this.slow.price)} GWei)`
  }

  @computed
  get standardDescription() {
    return `${GAS_PRICE.NORMAL.description} (${weiToGwei(this.standard.price)} GWei)`
  }

  @computed
  get fastDescription() {
    return `${GAS_PRICE.FAST.description} (${weiToGwei(this.fast.price)} GWei)`
  }

  @computed
  get instantDescription() {
    return `${GAS_PRICE.INSTANT.description} (${weiToGwei(this.instant.price)} GWei)`
  }

  @computed
  get customDescription() {
    return GAS_PRICE.CUSTOM.description
  }

  @computed
  get gasPrices() {
    return [
      { ...this.slow, description: this.slowDescription },
      { ...this.standard, description: this.standardDescription },
      { ...this.fast, description: this.fastDescription },
      { ...this.custom, description: this.customDescription }
    ]
  }

  @computed
  get gasPricesInGwei() {
    return this.gasPrices.map(gasPrice => ({
      ...gasPrice,
      price: weiToGwei(gasPrice.price)
    }))
  }

  @action
  reset = () => {
    this.slow = {
      id: GAS_PRICE.SLOW.id,
      price: GAS_PRICE.SLOW.price
    }

    this.standard = {
      id: GAS_PRICE.NORMAL.id,
      price: GAS_PRICE.NORMAL.price
    }

    this.fast = {
      id: GAS_PRICE.FAST.id,
      price: GAS_PRICE.FAST.price
    }

    this.instant = {
      id: GAS_PRICE.INSTANT.id,
      price: GAS_PRICE.INSTANT.price
    }

    this.custom = {
      id: GAS_PRICE.CUSTOM.id,
      price: GAS_PRICE.CUSTOM.price
    }

    this.block_number = undefined
    this.block_time = undefined
    this.health = undefined
  }
}

export default GasPriceStore
