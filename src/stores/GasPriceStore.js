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

  constructor () {
    this.slow = {
      id: GAS_PRICE.SLOW.ID,
      price: GAS_PRICE.SLOW.PRICE,
    }

    this.standard = {
      id: GAS_PRICE.NORMAL.ID,
      price: GAS_PRICE.NORMAL.PRICE,
    }

    this.fast = {
      id: GAS_PRICE.FAST.ID,
      price: GAS_PRICE.FAST.PRICE,
    }

    this.instant = {
      id: GAS_PRICE.INSTANT.ID,
      price: GAS_PRICE.INSTANT.PRICE,
    }

    this.custom = {
      id: GAS_PRICE.CUSTOM.ID,
      price: GAS_PRICE.CUSTOM.PRICE
    }

    autosave(this, 'GasPriceStore')
  }

  @action setProperty = (property, value) => {
    if (this.hasOwnProperty(property)) {
      if (property === 'standard' || property === 'slow' || property === 'fast' || property === 'instant' || property === 'custom') {
        this[property].price = gweiToWei(value)
      } else {
        this[property] = value
      }
    }
  }

  @action updateValues = (param) => {
    return gasPriceValues(param)
      .then(oracle => {
        for (let key in oracle) {
          if (oracle.hasOwnProperty(key)) {
            this.setProperty(key, oracle[key])
          }
        }
        return Promise.resolve()
      })
  }

  @computed
  get slowDescription () {
    return `${GAS_PRICE.SLOW.DESCRIPTION} (${weiToGwei(this.slow.price)} GWei)`
  }

  @computed
  get standardDescription () {
    return `${GAS_PRICE.NORMAL.DESCRIPTION} (${weiToGwei(this.standard.price)} GWei)`
  }

  @computed
  get fastDescription () {
    return `${GAS_PRICE.FAST.DESCRIPTION} (${weiToGwei(this.fast.price)} GWei)`
  }

  @computed
  get instantDescription () {
    return `${GAS_PRICE.INSTANT.DESCRIPTION} (${weiToGwei(this.instant.price)} GWei)`
  }

  @computed
  get customDescription () {
    return GAS_PRICE.CUSTOM.DESCRIPTION
  }
}

export default GasPriceStore
