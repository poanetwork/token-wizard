import { observable, action } from 'mobx';

class TierStore {

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

const tierStore = new TierStore();

export default tierStore;
export { TierStore };
