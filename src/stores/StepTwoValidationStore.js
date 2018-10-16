import { observable, action } from 'mobx'
import autosave from './autosave'

class StepTwoValidationStore {
  @observable name
  @observable ticker
  @observable decimals

  constructor() {
    this.name = 'EMPTY'
    this.ticker = 'EMPTY'
    this.decimals = 'EMPTY'

    autosave(this, 'StepTwoValidationStore')
  }

  @action
  setProperty = (property, value) => {
    if (!this.hasOwnProperty(property)) {
      throw new Error(`${property} is not declared as a property`)
    }
    this[property] = value
  }
}

export default StepTwoValidationStore
