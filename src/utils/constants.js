export const REACT_PREFIX = 'REACT_APP_'

export const EXCEPTIONS = {
  storageException: 'StorageException(bytes32,string)',
  applicationException: 'ApplicationException(address, bytes32, bytes)'
}

export const CROWDSALE_STRATEGIES = {
  MINTED_CAPPED_CROWDSALE: 'white-list-with-cap',
  DUTCH_AUCTION: 'dutch-auction'
}

export const CROWDSALE_STRATEGIES_DISPLAYNAMES = {
  MINTED_CAPPED_CROWDSALE: 'Whitelist with Cap',
  DUTCH_AUCTION: 'Dutch Auction'
}

export const VALIDATION_TYPES = {
  VALID: 'VALIDATED',
  EMPTY: 'EMPTY',
  INVALID: 'INVALID'
}
const { VALID, EMPTY } = VALIDATION_TYPES

export const defaultTier = {
  tier: '',
  rate: '',
  supply: '',
  startTime: '',
  endTime: '',
  walletAddress: '',
  updatable: 'off',
  whitelist: [],
  minCap: '0'
}

export const defaultTierValidations = {
  tier: VALID,
  rate: EMPTY,
  supply: EMPTY,
  startTime: VALID,
  endTime: VALID,
  updatable: VALID
}

export const TRUNC_TO_DECIMALS = {
  DECIMALS18: -18
}

//todo: should be updated for 2.0
export const DEPLOYMENT_VALUES = {
  GAS_REQUIRED: {
    DEFAULT: 8044737,
    WHITELIST: 96040,
    RESERVED_TOKEN: 42220,
    BUY: 400000
  },
  TX_REQUIRED: {
    DEFAULT: 3,
    WHITELIST: 1,
    RESERVED_TOKEN: 1
  }
}

export const MAX_GAS_PRICE = 4374900

export const GAS_PRICE = {
  SLOW: {
    ID: 'slow',
    PRICE: 5000000000,
    DESCRIPTION: 'Safe and Cheap'
  },
  NORMAL: {
    ID: 'normal',
    PRICE: 10000000000,
    DESCRIPTION: 'Normal'
  },
  FAST: {
    ID: 'fast',
    PRICE: 15000000000,
    DESCRIPTION: 'Fast and Expensive'
  },
  INSTANT: {
    ID: 'instant',
    PRICE: 45000000000,
    DESCRIPTION: 'Instantaneous and Expensive'
  },
  CUSTOM: {
    ID: 'custom',
    PRICE: 0,
    DESCRIPTION: 'Custom'
  },
  API: {
    URL: 'https://gasprice.poa.network'
  }
}
export const UNKNOWN = 'Unknown'
export const CHAINS = {
  UNKNOWN: 'Unknown',
  MAINNET: 'Mainnet',
  MORDEN: 'Morden',
  ROPSTEN: 'Ropsten',
  RINKEBY: 'Rinkeby',
  KOVAN: 'Kovan',
  SOKOL: 'Sokol',
  CORE: 'Core_POA'
}

export const NAVIGATION_STEPS = {
  CROWDSALE_STRATEGY: 'Crowdsale Strategy',
  TOKEN_SETUP: 'Token Setup',
  CROWDSALE_SETUP: 'Crowdsale Setup',
  PUBLISH: 'Publish',
  CROWDSALE_PAGE: 'Crowdsale Page'
}

export const VALIDATION_MESSAGES = {
  TIER: 'Please enter a valid tier name between 1-30 characters',
  NAME: 'Please enter a valid name between 1-30 characters',
  TICKER: 'Please enter a valid Ticker that is less or equal than five characters',
  SUPPLY: 'Please enter a valid number greater than 0',
  DECIMALS: 'Please enter a number between zero and 18',
  WALLET_ADDRESS: 'Please enter a valid address',
  START_TIME: 'Please enter a valid date later than now',
  END_TIME: 'Please enter a valid date later than start time',
  MULTIPLE_TIERS_START_TIME: 'Please enter a valid date not less than the end time of the previous tier',
  EDITED_END_TIME: 'Please enter a valid date later than start time and previous than start time of next tier',
  EDITED_START_TIME:
    'Please enter a valid date later than now, less than end time and later than the end time of the previous tier',
  RATE: 'Please enter a valid number greater than 0',
  MIN_CAP:
    'Value must be positive, decimals should not exceed the amount of decimals specified and min cap should be less or equal than the supply of some tier',
  POSITIVE: 'Please enter a valid number greater than 0',
  NON_NEGATIVE: 'Please enter a valid number greater or equal than 0',
  ADDRESS: 'Please enter a valid address',
  REQUIRED: 'This field is required',
  DECIMAL_PLACES: 'Decimals should not exceed the amount of decimals specified',
  LESS: 'Should be less than the specified value',
  LESS_OR_EQUAL: 'Should be less or equal than the specified value',
  GREATER: 'Should be greater than the specified value',
  GREATER_OR_EQUAL: 'Should be greater or equal than the specified value',
  INTEGER: 'Should be integer',
  DATE_IN_FUTURE: 'Should be set in the future',
  DATE_IS_PREVIOUS: 'Should be previous than specified time',
  DATE_IS_SAME_OR_LATER: 'Should be same or later than specified time',
  DATE_IS_LATER: 'Should be later than specified time',
  DATE_IS_SAME_OR_PREVIOUS: 'Should be same or previous than specified time',
  PATTERN: 'Should match the specified pattern',
  DECIMAL_PLACES_9: 'Should not have more than 9 decimals',
  NUMBER_GREATER_THAN: 'Should be greater than 0.1',
  NUMBER_GREATER_OR_EQUAL_THAN: 'Should be greater or equal than 0.1'
}

//descriptions of input fields
export const DESCRIPTION = {
  TOKEN_TICKER: 'The five letter ticker for your token.',
  CROWDSALE_SETUP_NAME: `Name of a tier, e.g. PrePreCrowdsale, PreCrowdsale, Crowdsale with bonus A, Crowdsale with bonus B, etc. We simplified that and will increment a number after each tier.`,
  ALLOW_MODIFYING: `If it's enabled, a creator of the crowdsale can modify crowdsale duration after publishing.`,
  START_TIME: `Date and time when the tier starts. Can't be in the past from the current moment.`,
  START_TIME_DUTCH_AUCTION: `Date and time when the crowdsale starts. Can't be in the past from the current moment.`,
  END_TIME: `Date and time when the tier ends. Can be only in the future.`,
  END_TIME_DUTCH_AUCTION: `Date and time when the crowdsale ends. Can be only in the future.`,
  RATE: `Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`,
  SUPPLY: `How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`,
  SUPPLY_DUTCH_AUCTION: `How many tokens will be sold on crowdsale`,
  TOKEN_SUPPLY: `The total supply of the token`,
  MIN_CAP: `Minimum amount of tokens to buy. Not the minimal amount for every transaction: if minCap is 1
               and a user already has 1 token from a previous transaction, they can buy any amount they want.`,
  ENABLE_WHITELIST: `Enables whitelisting. If disabled, anyone can participate in the crowdsale.`,
  WALLET: `Where the money goes after contributors transactions. Immediately after each transaction. We
                        recommend to setup a multisig wallet with hardware based signers.`,
  CROWDSALE_SETUP: `The most important and exciting part of the crowdsale process. Here you can
              define parameters of your crowdsale campaign.`,
  BURN_EXCESS: `Whether the unsold tokens will be burnt on finalization, or be sent to the team wallet`
}

export const PUBLISH_DESCRIPTION = {
  TOKEN_TOTAL_SUPPLY: 'Total token initial supply.',
  TOKEN_NAME: 'The name of your token. Will be used by Etherscan and other token browsers.',
  TOKEN_DECIMALS: 'How your token is divisible.',
  GLOBAL_MIN_CAP: 'Global Min Cap for all contributors for the 1st contribution transaction.',
  WALLET_ADDRESS: "Where the money goes after contributors' transactions.",
  CROWDSALE_START_TIME: 'Date and time when the crowdsale starts.',
  CROWDSALE_END_TIME: 'Date and time when the crowdsale ends.',
  TIER_START_TIME: 'Date and time when the tier starts.',
  TIER_END_TIME: 'Date and time when the tier ends.',
  HARD_CAP: 'How many tokens will be sold on this tier.',
  ENABLE_WHITELISTING: 'Is whitelist enabled on this tier?'
}

export const TEXT_FIELDS = {
  NAME: 'Name',
  TICKER: 'Ticker',
  CROWDSALE_SUPPLY: 'Crowdsale Supply',
  TOKEN_SUPPLY: 'Token Supply',
  SUPPLY_SHORT: 'Supply',
  DECIMALS: 'Decimals',
  RATE: 'Rate',
  CURRENT_RATE: 'Current Rate',
  MIN_RATE: 'Min Rate',
  MAX_RATE: 'Max Rate',
  WALLET_ADDRESS: 'Wallet Address',
  CROWDSALE_START_TIME: 'Crowdsale Start time',
  CROWDSALE_END_TIME: 'Crowdsale End time',
  START_TIME: 'Start Time',
  END_TIME: 'End Time',
  CROWDSALE_SETUP_NAME: 'Crowdsale setup name',
  ADDRESS: 'Address',
  MIN: 'Min',
  MAX: 'Max',
  GLOBAL_MIN_CAP: 'Global Min Cap',
  MIN_CAP: 'Contributor min cap',
  DIMENSION: 'Dimension',
  VALUE: 'Value',
  MAX_CAP: 'Max cap',
  ALLOW_MODIFYING: 'Allow modifying',
  ENABLE_WHITELISTING: 'Enable whitelisting',
  GAS_PRICE: 'Gas Price',
  STRATEGY: 'Crowdsale Type',
  BURN_EXCESS: 'Burn Excess'
}

export const defaultTokenValidations = {
  name: EMPTY,
  ticker: EMPTY,
  decimals: EMPTY
}

export const defaultTokenValues = {
  name: '',
  ticker: '',
  decimals: '18',
  supply: 0,
  reservedTokens: [],
  reservedTokensElements: [],
  reservedTokensInput: { dim: 'tokens' }
}

export const intitialStepThreeValidations = {
  validations: [
    {
      tier: VALID,
      startTime: VALID,
      endTime: VALID,
      walletAddress: EMPTY,
      supply: VALID,
      rate: EMPTY
    }
  ]
}

export const initialStepThreeValues = {
  crowdsale: [
    {
      tier: '',
      startTime: '',
      endTime: '',
      walletAddress: '',
      supply: ''
    }
  ]
}

export const CONTRIBUTION_OPTIONS = {
  METAMASK: 'metamask',
  QR: 'qr'
}
export const TOAST = {
  TYPE: {
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'warning'
  },
  MESSAGE: {
    TRANSACTION_FAILED: 'Transaction has failed, please retry',
    CONTRACT_DOWNLOAD_FAILED: 'Contract Download failed',
    CONTRACT_DOWNLOAD_SUCCESS: 'A file with contracts and metadata downloaded on your computer',
    FINALIZE_FAIL: 'Was not able to finalize Crowdsale. Please be sure that Crowdsale has ended already',
    DISTRIBUTE_FAIL: 'Was not able to distribute reserved tokens'
  },
  DEFAULT_OPTIONS: {
    position: 'top right',
    offset: 80,
    time: 10000
  }
}

/**
 * Mobx status save contracts to localstorage
 * @type {{PENDING: string, SUCCESS: string, FAILURE: string}}
 */
export const DOWNLOAD_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILURE: 'failure'
}

/**
 * Limit for reserved addresses, validated in the contract
 * @type {number}
 */
export const LIMIT_RESERVED_ADDRESSES = 20

/**
 * Limit for whitelisted addresses
 * @type {number}
 */
export const LIMIT_WHITELISTED_ADDRESSES = 50
