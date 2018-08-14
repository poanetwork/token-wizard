import { observable, action, computed } from 'mobx'
import { GAS_PRICE } from '../utils/constants'
import autosave from './autosave'

class GeneralStore {
  @observable networkID
  @observable gasPrice = GAS_PRICE.FAST.PRICE
  @observable gasTypeSelected

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
  setGasTypeSelected = gasTypeSeleted => {
    this.gasTypeSelected = gasTypeSeleted
  }

  @action
  reset = () => {
    this.networkID = undefined
    this.gasPrice = GAS_PRICE.FAST.PRICE
    this.gasTypeSelected = GAS_PRICE.SLOW
  }

  // Getters
  @computed
  get getGasTypeSelected() {
    return this.gasTypeSelected
  }
}

export default GeneralStore
