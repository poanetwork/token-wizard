import { observable, action } from 'mobx'
import { GAS_PRICE } from '../utils/constants'
import autosave from './autosave'

class GeneralStore {
  @observable networkID
  @observable gasPrice = GAS_PRICE.FAST.PRICE

  constructor() {
    this.reset()
    autosave(this, 'GeneralStore')
  }

  @action
  setProperty = (property, value) => {
    this[property] = value
  }

  @action
  setGasPrice = gasPrice => {
    this.gasPrice = gasPrice
  }

  @action
  reset = () => {
    this.networkID = undefined
    this.gasPrice = GAS_PRICE.FAST.PRICE
  }
}

export default GeneralStore
