import { observable, action, computed } from 'mobx'
import { defaultTier, defaultTierValidations, VALIDATION_TYPES, LIMIT_WHITELISTED_ADDRESSES } from '../utils/constants'
import { validateTime, validateSupply, validateLaterTime, validateLaterOrEqualTime, validateTier } from '../utils/utils'
import autosave from './autosave'
import { defaultCompanyEndDate, defaultCompanyStartDate } from '../components/stepThree/utils'
import logdown from 'logdown'

const logger = logdown('TW:stores:Tier')

const { VALID, INVALID } = VALIDATION_TYPES

class TierStore {
  @observable tiers
  @observable validTiers

  constructor() {
    this.reset()
    autosave(this, 'TierStore')
  }

  @action
  reset = () => {
    this.tiers = []
    this.validTiers = []
  }

  @action
  addTier = (tier, validations) => {
    this.tiers.push(tier)
    this.validTiers.push(validations)
  }

  @action
  setTierProperty = (value, property, index) => {
    let newTier = { ...this.tiers[index] }
    newTier[property] = value
    this.tiers[index] = newTier
  }

  @action
  removeTier = index => {
    this.tiers.splice(index, 1)
  }

  @action
  emptyList = () => {
    this.tiers = []
  }

  @action
  emptyTierValidationsList = () => {
    this.validTiers = []
  }

  @action
  validateTiers = (property, index) => {
    switch (property) {
      case 'tier':
        this.validTiers[index][property] = validateTier(this.tiers[index][property]) ? VALID : INVALID
        break
      case 'supply':
        this.validTiers[index][property] = validateSupply(this.tiers[index][property]) ? VALID : INVALID
        break
      case 'startTime':
        if (index > 0) {
          this.validTiers[index][property] = validateLaterOrEqualTime(
            this.tiers[index][property],
            this.tiers[index - 1].endTime
          )
            ? VALID
            : INVALID
        } else {
          this.validTiers[index][property] = validateTime(this.tiers[index][property]) ? VALID : INVALID
        }
        break
      case 'endTime':
        this.validTiers[index][property] = validateLaterTime(this.tiers[index][property], this.tiers[index].startTime)
          ? VALID
          : INVALID
        break
      default:
      // do nothing
    }
  }

  @action
  updateRate = (value, validity, tierIndex) => {
    this.tiers[tierIndex].rate = value
    this.validTiers[tierIndex].rate = validity
  }

  @action
  updateMinRate = (value, validity, tierIndex) => {
    this.tiers[tierIndex].minRate = value
    this.validTiers[tierIndex].minRate = validity
  }

  @action
  updateMaxRate = (value, validity, tierIndex) => {
    this.tiers[tierIndex].maxRate = value
    this.validTiers[tierIndex].maxRate = validity
  }

  @action
  updateWalletAddress = (value, validity) => {
    if (this.tiers.length > 0) {
      this.tiers[0].walletAddress = value
    } else {
      this.tiers.push({ walletAddress: value })
    }

    if (this.validTiers.length > 0) {
      this.validTiers[0].walletAddress = validity
    } else {
      this.validTiers.push({ walletAddress: validity })
    }
  }

  @action
  updateBurnExcess = (value, validity) => {
    if (this.tiers.length > 0) {
      this.tiers[0].burnExcess = value
    } else {
      this.tiers.push({ burnExcess: value })
    }

    if (this.validTiers[0].length > 0) {
      this.validTiers[0].burnExcess = validity
    } else {
      this.validTiers.push({ burnExcess: validity })
    }
  }

  @action
  validateEditedTier = (property, index) => {
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

  @action
  validateEditedEndTime = index => {
    if (this.tiers.length) {
      if (index < this.tiers.length - 1) {
        this.validTiers[index].endTime = validateLaterOrEqualTime(
          this.tiers[index + 1].startTime,
          this.tiers[index].endTime
        )
          ? VALID
          : INVALID
      }
    }
  }

  @computed
  get individuallyValidTiers() {
    if (!this.validTiers) return

    return this.validTiers.map((tier, index) => Object.keys(tier).every(key => this.validTiers[index][key] === VALID))
  }

  @computed
  get areTiersValid() {
    if (!this.validTiers) {
      return
    }

    const isValid = this.validTiers.every((tier, index) => {
      return Object.keys(tier).every(key => {
        logger.log('key', key, this.validTiers[index][key])
        return this.validTiers[index][key] === VALID
      })
    })

    logger.log('isValid', isValid)

    return isValid
  }

  @action
  invalidateToken = () => {
    if (!this.validTiers) {
      return
    }
    this.validTiers.forEach((tier, index) => {
      Object.keys(tier).forEach(key => {
        if (this.validTiers[index][key] === 'EMPTY') {
          this.validTiers[index][key] = 'INVALID'
        }
      })
    })
  }

  @action
  addWhitelistItem = ({ addr, min, max }, crowdsaleNum) => {
    const { whitelist } = this.tiers[crowdsaleNum]
    const newItem = { addr, min, max }
    const _addr = addr.toLowerCase()
    const isAdded = whitelist.find(item => item.addr.toLowerCase() === _addr)

    if (this.deployedContract) {
      const storedIndex = whitelist.findIndex(item => item.addr.toLowerCase() === _addr && item.stored)
      const duplicatedIndex = whitelist.findIndex(
        item => item.addr.toLowerCase() === _addr && !item.stored && item.duplicated
      )

      if (duplicatedIndex > -1) return

      if (storedIndex > -1) {
        whitelist[storedIndex].duplicated = true
        newItem.duplicated = true
      }
    } else if (isAdded) return

    whitelist.push(newItem)
    this.sortWhitelist(crowdsaleNum)
  }

  @action
  sortWhitelist = crowdsaleNum => {
    this.tiers[crowdsaleNum].whitelist = this.tiers[crowdsaleNum].whitelist.sort((prev, curr) => {
      const currentAddress = curr.addr.toLowerCase()
      const previousAddress = prev.addr.toLowerCase()

      return currentAddress > previousAddress ? -1 : currentAddress === previousAddress ? (curr.stored ? 1 : -1) : 1
    })
  }

  @action
  removeWhitelistItem = (whitelistNum, crowdsaleNum) => {
    const removedItem = this.tiers[crowdsaleNum].whitelist.splice(whitelistNum, 1)[0]

    if (this.deployedContract && removedItem.duplicated) {
      const removedAddr = removedItem.addr.toLowerCase()
      const storedIndex = this.tiers[crowdsaleNum].whitelist.findIndex(item => item.addr.toLowerCase() === removedAddr)

      if (storedIndex > -1) this.tiers[crowdsaleNum].whitelist[storedIndex].duplicated = false
    }
  }

  @action
  emptyWhitelist = crowdsaleNum => {
    const whitelist = this.tiers[crowdsaleNum].whitelist

    for (let i = whitelist.length - 1; i >= 0; i--) {
      if (!whitelist[i].stored) {
        this.removeWhitelistItem(i, crowdsaleNum)
      }
    }
  }

  isWhitelistEmpty(crowdsaleNum) {
    const whitelist = this.tiers[crowdsaleNum].whitelist

    return whitelist.every(address => address.stored)
  }

  @action
  addCrowdsale = (walletAddress = '') => {
    const num = this.tiers.length
    const newTier = Object.assign({}, defaultTier)
    const newTierValidations = Object.assign({}, defaultTierValidations)

    newTier.tier = `Tier ${num + 1}`
    newTier.whitelistEnabled = 'no'

    if (num === 0) {
      newTier.walletAddress = walletAddress
    }

    this.addTier(newTier, newTierValidations)
    this.setTierDates(num)
  }

  @action
  setTierDates = num => {
    const defaultStartTime = 0 === num ? defaultCompanyStartDate() : this.tierEndTime(num - 1)
    const defaultEndTime =
      0 === num ? defaultCompanyEndDate(defaultStartTime) : defaultCompanyEndDate(this.tierEndTime(num - 1))

    const startTime = this.tiers[num].startTime || defaultStartTime
    const endTime = this.tiers[num].endTime || defaultEndTime

    this.setTierProperty(startTime, 'startTime', num)
    this.setTierProperty(endTime, 'endTime', num)
  }

  tierEndTime(index) {
    return this.tiers[index].endTime
  }

  @computed
  get maxSupply() {
    return this.tiers.map(tier => +tier.supply).reduce((a, b) => Math.max(a, b), 0)
  }

  @computed
  get deployedContract() {
    return this.tiers.some(tier => tier.whitelist.some(item => item.stored))
  }

  @computed
  get modifiedStoredWhitelist() {
    return this.tiers.some(tier => tier.whitelist.some(item => !item.stored))
  }

  /**
   * Validate whitelisted for a given tier
   * @param tierIndex
   * @returns {boolean}
   */
  validateWhitelistedAddressLength(tierIndex) {
    return this.tiers[tierIndex].whitelist.length < LIMIT_WHITELISTED_ADDRESSES
  }

  getTiers(crowdsaleStore) {
    if (crowdsaleStore.isDutchAuction) {
      return JSON.parse(JSON.stringify(this.tiers))[0]
    } else {
      return JSON.parse(JSON.stringify(this.tiers))
    }
  }
}

export default TierStore
