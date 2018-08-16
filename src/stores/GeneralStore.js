import { observable, action, computed } from 'mobx'
import { GAS_PRICE } from '../utils/constants'
import autosave from './autosave'

class GeneralStore {
  @observable networkID
  @observable gasPrice = GAS_PRICE.FAST.PRICE
  @observable gasTypeSelected
  @observable burnExcess

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
  setBurnExcess = burnExcess => {
    this.burnExcess = burnExcess
  }

  @action
  reset = () => {
    this.networkID = undefined
    this.gasPrice = GAS_PRICE.FAST.PRICE
    this.gasTypeSelected = GAS_PRICE.SLOW
    this.burnExcess = 'no'
  }

  // Getters
  @computed
  get getGasTypeSelected() {
    return this.gasTypeSelected || GAS_PRICE.SLOW
  }
}

export default GeneralStore
