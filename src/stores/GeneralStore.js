import { observable, action, computed } from 'mobx'
import { GAS_PRICE } from '../utils/constants'
import autosave from './autosave'

class GeneralStore {
  @observable networkID
  @observable gasPrice
  @observable gasTypeSelected
  @observable burnExcess

  constructor() {
    this.reset()
    autosave(this, 'GeneralStore')
  }

  @action
  setProperty = (property, value) => {
    if (!this.hasOwnProperty(property)) {
      throw new Error(`${property} is not declared as a property`)
    }
    this[property] = value
  }

  @action
  setGasPrice = gasPrice => {
    this.gasPrice = gasPrice
  }

  @action
  setGasTypeSelected = gasTypeSelected => {
    this.gasTypeSelected = gasTypeSelected
  }

  @action
  setBurnExcess = burnExcess => {
    this.burnExcess = burnExcess
  }

  @action
  reset = () => {
    this.networkID = undefined
    this.gasPrice = GAS_PRICE.SLOW.price
    this.gasTypeSelected = undefined
    this.burnExcess = 'no'
  }
}

export default GeneralStore
