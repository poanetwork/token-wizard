import { action, observable } from 'mobx'
import { GAS_PRICE } from '../utils/constants'
import { gweiToWei, weiToGwei } from '../utils/utils'
import { gasPriceValues } from '../utils/api'

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
    this.slow.description = function () {
      return `${GAS_PRICE.SLOW.DESCRIPTION} (${weiToGwei(this.price)} GWei)`
    }

    this.standard = {
      id: GAS_PRICE.NORMAL.ID,
      price: GAS_PRICE.NORMAL.PRICE,
    }
    this.standard.description = function () {
      return `${GAS_PRICE.NORMAL.DESCRIPTION} (${weiToGwei(this.price)} GWei)`
    }

    this.fast = {
      id: GAS_PRICE.FAST.ID,
      price: GAS_PRICE.FAST.PRICE,
    }
    this.fast.description = function () {
      return `${GAS_PRICE.FAST.DESCRIPTION} (${weiToGwei(this.price)} GWei)`
    }

    this.instant = {
      id: GAS_PRICE.INSTANT.ID,
      price: GAS_PRICE.INSTANT.PRICE,
    }
    this.instant.description = function () {
      return `${GAS_PRICE.INSTANT.DESCRIPTION} (${weiToGwei(this.price)} GWei)`
    }

    this.custom = {
      id: GAS_PRICE.CUSTOM.ID,
      price: GAS_PRICE.CUSTOM.PRICE,
      description: () => GAS_PRICE.CUSTOM.DESCRIPTION
    }
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
}

const gasPriceStore = new GasPriceStore()

export default gasPriceStore
export { GasPriceStore }
