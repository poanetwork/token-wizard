import TierStore from './TierStore'

describe('TierStore', () => {
  describe('maxSupply', () => {
    const testCases = [{
      tiers: [],
      expected: 0
    }, {
      tiers: [5],
      expected: 5
    }, {
      tiers: [5, 10],
      expected: 10
    }, {
      tiers: [10, 5],
      expected: 10
    }, {
      tiers: [10, 10],
      expected: 10
    }]

    testCases.forEach(({ tiers, expected }) => {
      it(`should get the max supply for tiers ${JSON.stringify(tiers)}`, () => {
        const tierStore = new TierStore()

        tierStore.emptyList()
        tiers.forEach(tier => tierStore.addTier({
          supply: tier
        }))

        const result = tierStore.maxSupply

        expect(result).toEqual(expected)
      })
    })
  })
})
