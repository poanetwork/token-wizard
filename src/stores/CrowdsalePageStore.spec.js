import CrowdsalePageStore from './CrowdsalePageStore'
import MockDate from 'mockdate'

const currentTime = '2018-03-12T11:00:00'

describe('CrowdsalePageStore', () => {
  let tiers
  let sortedTiers
  let ticks
  let crowdsalePageStore
  beforeEach(() => {
    crowdsalePageStore = new CrowdsalePageStore()
    MockDate.set(currentTime)

    tiers = [
      { startDate: 1523563542000, endDate: 1552421142000 },
      { startDate: 1520888742000, endDate: 1520971542000 },
      { startDate: 1521489942000, endDate: 1523563542000 },
      { startDate: 1520885142000, endDate: 1520888742000 }
    ]
    sortedTiers = [
      { startDate: 1520885142000, endDate: 1520888742000 },
      { startDate: 1520888742000, endDate: 1520971542000 },
      { startDate: 1521489942000, endDate: 1523563542000 },
      { startDate: 1523563542000, endDate: 1552421142000 }
    ]
    ticks = [
      { type: 'start', time: 1520885142000, order: 1 },
      { type: 'end', time: 1520888742000, order: 1 },
      { type: 'end', time: 1520971542000, order: 2 },
      { type: 'start', time: 1521489942000, order: 3 },
      { type: 'end', time: 1523563542000, order: 3 },
      { type: 'end', time: 1552421142000, order: 4 },
    ]
  })

  it('Should sort tiers in ascending order', () => {
    crowdsalePageStore.setProperty('tiers', tiers)
    crowdsalePageStore.sortTiers()
    crowdsalePageStore.tiers.forEach((tier, index) => {
      expect(tier.startDate).toBe(sortedTiers[index].startDate)
      expect(tier.endDate).toBe(sortedTiers[index].endDate)
    })
  })

  it('Should add tiers to collection and sort them', () => {
    tiers.forEach(tier => crowdsalePageStore.addTier(tier))
    crowdsalePageStore.tiers.forEach((tier, index) => {
      expect(tier.startDate).toBe(sortedTiers[index].startDate)
      expect(tier.endDate).toBe(sortedTiers[index].endDate)
    })
  })

  it('Should build ticks from tiers collection', () => {
    tiers.forEach(tier => crowdsalePageStore.addTier(tier))
    crowdsalePageStore.ticks.forEach((tick, index) => {
      expect(tick.type).toBe(ticks[index].type)
      expect(tick.time).toBe(ticks[index].time)
      expect(tick.order).toBe(ticks[index].order)
    })
  })

  it('Should discard past ticks already closed', () => {
    MockDate.set('2018-03-13T12:00:00')

    tiers.forEach(tier => crowdsalePageStore.addTier(tier))
    expect(crowdsalePageStore.ticks.length).toBe(4)

    const activeTicks = ticks.slice(2)
    crowdsalePageStore.ticks.forEach((tick, index) => {
      expect(tick.type).toBe(activeTicks[index].type)
      expect(tick.time).toBe(activeTicks[index].time)
      expect(tick.order).toBe(activeTicks[index].order)
    })
  })

  it('Should mutate ticks collection on extract', () => {
    tiers.forEach(tier => crowdsalePageStore.addTier(tier))

    expect(crowdsalePageStore.ticks.length).toBe(6)
    crowdsalePageStore.extractNextTick()
    expect(crowdsalePageStore.ticks.length).toBe(5)
  })

  it('Should return the nearest tick in collection', () => {
    tiers.forEach(tier => crowdsalePageStore.addTier(tier))

    const nextTick = crowdsalePageStore.extractNextTick()
    expect(nextTick.type).toBe(ticks[0].type)
    expect(nextTick.time).toBe(ticks[0].time)
    expect(nextTick.order).toBe(ticks[0].order)
  })
})
