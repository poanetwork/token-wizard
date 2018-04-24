export const CROWDSALE_STRATEGIES = {
  MINTED_CAPPED_CROWDSALE: "white-list-with-cap",
  DUTCH_AUCTION: "dutch-auction"
}

export const VALIDATION_TYPES = {
  VALID: "VALIDATED",
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

export const DEPLOYMENT_VALUES = {
  GAS_REQUIRED: {
    DEFAULT: 8044737,
    WHITELIST: 96040,
    RESERVED_TOKEN: 42220

  },
  TX_REQUIRED: {
    DEFAULT: 13,
    WHITELIST: 1,
    RESERVED_TOKEN: 1
  }
}

export const MAX_GAS_PRICE = 4016260

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
export const UNKNOWN = "Unknown"
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
  CROWDSALE_CONTRACT: 'Crowdsale Contract',
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
  EDITED_START_TIME: 'Please enter a valid date later than now, less than end time and later than the end time of the previous tier',
  RATE: 'Please enter a valid number greater than 0',
  MINCAP: 'Value must be positive, decimals should not exceed the amount of decimals specified and min cap should be less or equal than the supply of some tier',
  POSITIVE: 'Please enter a valid number greater than 0',
  NON_NEGATIVE: 'Please enter a valid number greater or equal than 0',
  ADDRESS: 'Please enter a valid address',
  REQUIRED: 'This field is required',
  DECIMAL_PLACES: 'Decimals should not exceed the amount of decimals specified',
  LESS_OR_EQUAL: 'Should be less or equal than the specified value',
  GREATER_OR_EQUAL: 'Should be greater or equal than the specified value',
  INTEGER: 'Should be integer',
  DATE_IN_FUTURE: 'Should be set in the future',
  DATE_IS_PREVIOUS: 'Should be previous than specified time',
  DATE_IS_SAME_OR_LATER: 'Should be same or later than specified time',
  DATE_IS_LATER: 'Should be later than specified time',
  DATE_IS_SAME_OR_PREVIOUS: 'Should be same or previous than specified time',
  PATTERN: 'Should match the specified pattern',
}

//descriptions of input fields
export const DESCRIPTION = {
  TOKEN_TICKER: 'The five letter ticker for your token.',
  CROWDSALE_SETUP_NAME: `Name of a tier, e.g. PrePreCrowdsale, PreCrowdsale, Crowdsale with bonus A, Crowdsale with bonus B, etc. We simplified that and will increment a number after each tier.`,
  ALLOW_MODIFYING: `Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`,
  START_TIME: `Date and time when the tier starts. Can't be in the past from the current moment.`,
  START_TIME_DUTCH_AUCTION: `Date and time when the crowdsale starts. Can't be in the past from the current moment.`,
  END_TIME: `Date and time when the tier ends. Can be only in the future.`,
  END_TIME_DUTCH_AUCTION: `Date and time when the crowdsale ends. Can be only in the future.`,
  RATE: `Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`,
  SUPPLY: `How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`,
  SUPPLY_DUTCH_AUCTION: `How many tokens will be sold on crowdsale`,
  TOKEN_SUPPLY: `The total supply of the token`
}

export const TEXT_FIELDS = {
  NAME: 'Name',
  TICKER: 'Ticker',
  SUPPLY: 'Supply',
  TOKEN_SUPPLY: 'Supply',
  DECIMALS: 'Decimals',
  RATE: 'Rate',
  MIN_RATE: 'Min Rate',
  MAX_RATE: 'Max Rate',
  WALLET_ADDRESS: 'Wallet Address',
  START_TIME: 'Start Time',
  END_TIME: 'End Time',
  CROWDSALE_SETUP_NAME: 'Crowdsale setup name',
  ADDRESS: 'Address',
  MIN: 'Min',
  MAX: 'Max',
  MINCAP: 'Investor min cap',
  DIMENSION: 'Dimension',
  VALUE: 'Value',
  MAX_CAP: 'Max cap',
  ALLOWMODIFYING: 'Allow modifying',
  ENABLE_WHITELISTING: 'Enable whitelisting',
  GAS_PRICE: 'Gas Price',
  STRATEGY: 'Crowdsale Type'
}

export const intitialStepTwoValidations = {
  validations: {
    name: EMPTY,
    decimals: EMPTY,
    ticker: EMPTY
  }
}

export const initialStepTwoValues = {
  token: {
    name: '',
    supply: 0,
    ticker: '',
    decimals: '',
    reservedTokens: [],
    reservedTokensElements: [],
    reservedTokensInput: {dim: "tokens"}
  }
}

export const intitialStepThreeValidations = {
  validations: [{
    tier: VALID,
    startTime: VALID,
    endTime: VALID,
    walletAddress: EMPTY,
    supply: VALID,
    rate: EMPTY
  }]
}

export const initialStepThreeValues = {
  crowdsale: [{
    tier: '',
    startTime: '',
    endTime: '',
    walletAddress: '',
    supply: ''
  }]
}

export const FILE_CONTENTS = {
  common: [
    { field: 'name', value: 'Token name: ', parent: 'tokenStore' },
    { field: 'ticker', value: 'Token ticker: ', parent: 'tokenStore' },
    { field: 'decimals', value: 'Token decimals: ', parent: 'tokenStore' },
    { field: 'walletAddress', value: 'Multisig wallet address: ', parent: 'tierStore' },
    { value: '*****************************', parent: 'none', fileValue: '' },
    { field: 'rate', value: 'Crowdsale rate: ', parent: 'tierStore' },
    { field: 'startTime', value: 'Crowdsale start time: ', parent: 'tierStore' },
    { field: 'endTime', value: 'Crowdsale end time: ', parent: 'tierStore' },
    { value: '*****************************', parent: 'none', fileValue: '' }
  ],
  files: {
    order: [
      'crowdsale'
    ],
    crowdsale: {
      name: 'MintedCappedCrowdsale',
      txt: [
        { value: 'Auth_os application name: ', parent: 'none', fileValue: 'MintedCappedCrowdsale' },
        { field: 'execID', value: 'Auth_os execution ID: ', parent: 'crowdsale' },
        { value: '*****************************', parent: 'none', fileValue: '' }
      ]
    }
  }
}

export const DOWNLOAD_NAME = 'tokenwizard'
export const DOWNLOAD_TYPE = {
  text: 'text/plain',
  blob: 'blob'
}

export const INVESTMENT_OPTIONS = {
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

export const TX_STEP_DESCRIPTION = {
  crowdsaleCreate: "Create Crowdsale instance",
  token: "Initialize Token",
  //registerCrowdsaleAddress: "Associate Crowdsale address to current account",
  setReservedTokens: "Register addresses for Reserved Tokens",
  updateGlobalMinContribution: "Update global minimum contribution",
  createCrowdsaleTiers: "Add tiers to Crowdsale",
  whitelist: "Register whitelisted addresses",
  crowdsaleInit: "Initialize Crowdsale",
}
