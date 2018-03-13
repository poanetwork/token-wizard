import { observable, action, computed } from 'mobx';
import { VALIDATION_TYPES } from '../utils/constants'
import {
  validateTime,
  validateSupply,
  validateAddress,
  validateLaterTime,
  validateLaterOrEqualTime,
  validateTier
} from '../utils/utils'
import autosave from './autosave'
const { VALID, INVALID } = VALIDATION_TYPES

class TierStore {

  @observable tiers
  @observable validTiers
  @observable globalMinCap = ''

  constructor() {
    this.reset()
    autosave(this, 'TierStore')
  }

  @action reset = () => {
    this.tiers = []
    this.validTiers = []
  }

  @action setGlobalMinCap = (minCap) => {
    this.globalMinCap = minCap
  }

  @action addTier = (tier) => {
    this.tiers.push(tier)
  }

  @action addTierValidations = (validations) => {
    this.validTiers.push(validations)
  }

  @action setTierProperty = (value, property, index) => {
    let newTier = {...this.tiers[index]}
    newTier[property] = value
    this.tiers[index] = newTier;
  }

  @action removeTier = (index) => {
    this.tiers.splice(index,1)
  }

  @action emptyList = () => {
    this.tiers = []
  }

  @action emptyTierValidationsList = () => {
    this.validTiers = []
  }

  @action validateTiers = (property, index) => {
    switch (property){
      case 'tier':
        this.validTiers[index][property] = validateTier(this.tiers[index][property]) ? VALID : INVALID
        break
      case 'walletAddress':
        this.validTiers[index][property] = validateAddress(this.tiers[index][property]) ? VALID : INVALID
        break
      case 'supply':
        this.validTiers[index][property] = validateSupply(this.tiers[index][property]) ? VALID : INVALID
        break
      case 'startTime':
        if (index > 0) {
          this.validTiers[index][property] = validateLaterOrEqualTime(this.tiers[index][property], this.tiers[index - 1].endTime) ? VALID : INVALID
        } else {
          this.validTiers[index][property] = validateTime(this.tiers[index][property]) ? VALID: INVALID
        }
        break
      case 'endTime':
        this.validTiers[index][property] = validateLaterTime(this.tiers[index][property], this.tiers[index].startTime) ? VALID : INVALID
        break
      default:
        // do nothing
    }
  }

  @action updateRate = (value, validity, tierIndex) => {
    this.tiers[tierIndex].rate = value
    this.validTiers[tierIndex].rate = validity
  }

  @action validateEditedTier = (property, index) => {
    switch (property) {
      case 'endTime':
        let lessThanNextStart = true
        const laterTime = validateLaterTime(this.tiers[index][property], this.tiers[index].startTime)

        if (index < this.tiers.length - 1) {
          lessThanNextStart = validateLaterOrEqualTime(this.tiers[index + 1].startTime, this.tiers[index][property])
        }

        this.validTiers[index][property] = lessThanNextStart && laterTime ? VALID : INVALID
        break
      case 'startTime':
        let notLaterTime = true
        const previousToEndTime = validateLaterTime(this.tiers[index].endTime, this.tiers[index][property])
        const validTime = validateTime(this.tiers[index][property])

        if (index > 0) {
          notLaterTime = validateLaterOrEqualTime(this.tiers[index][property], this.tiers[index - 1].endTime)
        }

        this.validTiers[index][property] = notLaterTime && previousToEndTime && validTime ? VALID : INVALID
        break
      default:
        // Nothing
    }
  }

  @action validateEditedEndTime = index => {
    if (this.tiers.length) {
      if (index < this.tiers.length - 1) {
        this.validTiers[index].endTime = validateLaterOrEqualTime(this.tiers[index + 1].startTime, this.tiers[index].endTime) ? VALID : INVALID
      }
    }
  }

  @computed
  get individuallyValidTiers () {
    if (!this.validTiers) return

    return this.validTiers.map((tier, index) => Object.keys(tier).every(key => this.validTiers[index][key] === VALID))
  }

  @computed get areTiersValid() {
    if (!this.validTiers) {
      return;
    }

    const isValid = this.validTiers.every((tier, index) => {
      return Object.keys(tier)
        .every((key) => {
          console.log('key', key, this.validTiers[index][key])
          return this.validTiers[index][key] === VALID
        })
    })

    console.log('isValid', isValid)

    return isValid
  }

  @action invalidateToken = () => {
    if (!this.validTiers) {
      return;
    }
    this.validTiers.forEach((tier, index) => {
      Object.keys(tier).forEach(key => {
        if (this.validTiers[index][key] === 'EMPTY') {
          this.validTiers[index][key] = 'INVALID';
        }
      });
    });
  }

  @action addWhitelistItem = ({ addr, min, max }, crowdsaleNum) => {
    const { whitelist } = this.tiers[crowdsaleNum]
    const newItem = { addr, min, max }
    const _addr = addr.toLowerCase()
    const isAdded = whitelist.find(item => item.addr.toLowerCase() === _addr)

    if (this.deployedContract) {
      const storedIndex = whitelist.findIndex(item => item.addr.toLowerCase() === _addr && item.stored)
      const duplicatedIndex = whitelist.findIndex(item => item.addr.toLowerCase() === _addr && !item.stored && item.duplicated)

      if (duplicatedIndex > -1) return

      if (storedIndex > -1) {
        whitelist[storedIndex].duplicated = true
        newItem.duplicated = true
      }

    } else if (isAdded) return

    whitelist.push(newItem)
    this.sortWhitelist(crowdsaleNum)
  }

  @action sortWhitelist = (crowdsaleNum) => {
    this.tiers[crowdsaleNum].whitelist = this.tiers[crowdsaleNum].whitelist.sort((prev, curr) => {
      const currentAddress = curr.addr.toLowerCase()
      const previousAddress = prev.addr.toLowerCase()

      return currentAddress > previousAddress ? -1 : currentAddress === previousAddress ? curr.stored ? 1 : -1 : 1
    })
  }

  @action removeWhitelistItem = (whitelistNum, crowdsaleNum) => {
    const removedItem = this.tiers[crowdsaleNum].whitelist.splice(whitelistNum, 1)[0]

    if (this.deployedContract && removedItem.duplicated) {
      const removedAddr = removedItem.addr.toLowerCase()
      const storedIndex = this.tiers[crowdsaleNum].whitelist.findIndex(item => item.addr.toLowerCase() === removedAddr)

      if (storedIndex > -1) this.tiers[crowdsaleNum].whitelist[storedIndex].duplicated = false
    }
  }

  @computed get maxSupply () {
    return this.tiers.map(tier => +tier.supply).reduce((a, b) => Math.max(a, b), 0)
  }

  @computed get deployedContract () {
    return this.tiers.some(tier => tier.whitelist.some(item => item.stored))
  }

  @computed get modifiedStoredWhitelist () {
    return this.deployedContract && this.tiers.some(tier => tier.whitelist.some(item => !item.stored))
  }
}

export default TierStore;
