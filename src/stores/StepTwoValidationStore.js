import { observable, action } from 'mobx';
import autosave from './autosave'

class StepTwoValidationStore {

  @observable name;
  @observable ticker;
  @observable decimals;

  constructor() {
    this.name = 'EMPTY'
    this.ticker = 'EMPTY'
    this.decimals = 'EMPTY'

    autosave(this, 'StepTwoValidationStore')
  }

  @action property = (property, value) => {
    this[property] = value
  }
}

export default StepTwoValidationStore;
