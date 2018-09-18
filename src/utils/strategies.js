import { CROWDSALE_STRATEGIES, CROWDSALE_STRATEGIES_DISPLAYNAMES } from './constants'

const { MINTED_CAPPED_CROWDSALE, DUTCH_AUCTION } = CROWDSALE_STRATEGIES

export const strategies = [
  {
    type: MINTED_CAPPED_CROWDSALE,
    display: CROWDSALE_STRATEGIES_DISPLAYNAMES.MINTED_CAPPED_CROWDSALE,
    description:
      'Modern crowdsale strategy with multiple tiers, whitelists, and limits. Recommended for every crowdsale.'
  },
  {
    type: DUTCH_AUCTION,
    display: CROWDSALE_STRATEGIES_DISPLAYNAMES.DUTCH_AUCTION,
    description: 'An auction with descending price.'
  }
]
