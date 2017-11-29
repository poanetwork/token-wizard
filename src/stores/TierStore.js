import { observable, action, computed } from 'mobx';
import { VALIDATION_TYPES, defaultTiers } from '../utils/constants'
import { validateName, validateTime, validateSupply, validateRate, validateAddress } from '../utils/utils'
const { VALID, INVALID, EMPTY } = VALIDATION_TYPES
class TierStore {

  @observable tiers;
  @observable validTiers;
  @observable globalMinCap;

	constructor(tiers = defaultTiers) {
		this.tiers = tiers;
		this.validTiers = [{
			name: 'VALIDATED',
			walletAddress: 'VALIDATED',
			rate: 'EMPTY',
			supply: 'EMPTY',
			startTime: 'VALIDATED',
			endTime: 'VALIDATED',
			updatable: "VALIDATED"
		}]
	}

	@action setGlobalMinCap = (minCap) => {
		this.globalmincap = minCap
	}

  @action addTier = (tier) => {
		this.tiers.push(tier)
		console.log('tier', tier)
		console.log('this.tiers', this.tiers)
	}

  @action addTierValidations = (validations) => {
    this.validTiers.push(validations)
  }

  @action setTierProperty = (value, property, index) => {
    console.log('value, property, index', value, property, index)
    let newTier = {...this.tiers[index]}
    newTier[property] = value
    console.log('newTier[property]', newTier[property])
    console.log('this.tiers[index]', this.tiers[index])
    this.tiers[index] = newTier;
  }

  @action removeTier = (index) => {
    this.tiers.splice(index,1)
  }

  @action emptyList = () => {
    this.tiers = []
  }

  @action validateTiers = (property, index) => {
    switch (property){
      case 'name':
        this.validTiers[index][property] = validateName(this.tiers[index][property]) ? VALID : INVALID
        return
        case 'walletAddress':
        this.validTiers[index][property] = validateAddress(this.tiers[index][property]) ? VALID : INVALID
        return
      case 'supply':
        this.validTiers[index][property] = validateSupply(this.tiers[index][property]) ? VALID : INVALID
        return
      case 'rate':
        this.validTiers[index][property] = validateRate(this.tiers[index][property]) ? VALID : INVALID
        return
      case 'startTime':
      case 'endTime':
        this.validTiers[index][property] = validateTime(this.tiers[index][property]) ? VALID: INVALID
        return
    }
  }

  @computed get areTiersValid() {
    if (!this.validTiers) {
      return;
    }

    const isValid = this.validTiers.every((tier, index) => Object.keys(tier).every((key) => {
      console.log('key', key, this.validTiers[index][key])
      if (this.validTiers[index][key] === VALID) {
        return true;
      } else {
        return false;
      }
    }))
    console.log('isValid', isValid)
    return isValid
  }

  @action invalidateToken = () => {
    if (!this.validTiers) {
      return;
    }
    this.validTiers.every((tier, index) => {
      Object.keys(tier).forEach(key => {
        if (this.validTiers[index][key] === 'EMPTY') {
          this.validTiers[index][key] = 'INVALID';
        }
      });
    });
  }

  @action removeWhiteListItem = (whitelistNum, crowdsaleNum) => {
    let whitelist = this.tiers[crowdsaleNum].whitelist.slice()
    whitelist[whitelistNum].deleted = true
    this.setTierProperty(whitelist, 'whitelist', crowdsaleNum)
  }
}

const tierStore = new TierStore();

export default tierStore;
export { TierStore };
