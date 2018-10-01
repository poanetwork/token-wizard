import { observable, action } from 'mobx'
import { convertDateObjectToLocalTimezone } from '../utils/utils'

class CrowdsalePageStore {
  @observable maximumSellableTokens
  @observable maximumSellableTokensInWei
  @observable contributors
  @observable ethRaised
  @observable weiRaised
  @observable rate
  @observable startRate
  @observable endRate
  @observable tokensSold
  @observable tokenAmountOf
  @observable tiers = []
  @observable ticks = []

  @action
  setProperty = (property, value) => {
    this[property] = value
  }

  @action
  addTier = tier => {
    this.tiers.push(tier)
    this.sortTiers()
    this.buildTicksCollection()
  }

  @action
  sortTiers = () => {
    this.tiers = this.tiers.sort((previous, current) => (current.startDate >= previous.startDate ? -1 : 1))
  }

  @action
  buildTicksCollection = () => {
    // assumes that list is sorted
    this.ticks = this.tiers
      .reduce((ticks, tier, index) => {
        let startDate = tier.startDate
        let endDate = tier.endDate
        const previousTickIndex = ticks.findIndex(tick => tick.type === 'end' && tick.time === startDate)

        if (previousTickIndex === -1) {
          ticks.push({
            type: 'start',
            time: startDate,
            order: index + 1
          })
        }

        ticks.push({
          type: 'end',
          time: endDate,
          order: index + 1
        })

        return ticks
      }, [])
      .filter(tick => tick.time - Date.now() > 0)
  }

  @action
  extractNextTick = () => {
    return this.ticks.shift()
  }
}

export default CrowdsalePageStore
