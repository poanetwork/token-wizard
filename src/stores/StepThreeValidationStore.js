import { observable, action } from 'mobx';
import autosave from './autosave'

class StepThreeValidationStore {

  @observable validationsList

  constructor() {
    this[0] = {}
    this[0].name = 'EMPTY'
    this[0].walletAddress = 'EMPTY'
    this[0].rate = 'EMPTY'
    this[0].supply = 'EMPTY'
    this[0].startTime = 'VALIDATED'
    this[0].endTime = 'VALIDATED'
    this[0].updatable = "VALIDATED"

    autosave(this, 'StepThreeValidationStore')
  }

  @action changeProperty = (index, property, value) => {
    this[index][property] = value
  }

  @action addValidationItem = (item) => {
    this.validationsList.push(item)
  }
}

export default StepThreeValidationStore;
