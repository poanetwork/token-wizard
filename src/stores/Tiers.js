import { observable, computed, action } from 'mobx';

class Tiers {

	@observable tiers;
	
	constructor(tiers = []) {
    this.tiers = tiers;
  }

  @action addTier = (tier) => {
    this.tiers.push(tier)
	}
	
	@action setTierProperty = (index, property, value) => {
		let newTier = {...this.tiers[index]}
		newTier[property] = value
    this.tiers[index] = newTier;
	}
	
	@action removeTier = (index) => {
		this.tiers.splice(index,1)
	}

}

const tiers = new Tiers();

export default tiers;
export { Tiers };