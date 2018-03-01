export const defaultState = {
  contracts: {
    token: {},
    crowdsale: {addr:[], abiConstructor:[]},
    pricingStrategy: {addr:[], abiConstructor:[]},
    multisig: {},
    nullFinalizeAgent: {addr:[], abiConstructor:[]},
    finalizeAgent: {addr:[], abiConstructor:[]},
    tokenTransferProxy: {}
  },
  token: {
    name: '',
    ticker: '',
    supply: 0,
    decimals: '',
    reservedTokens: [],
    reservedTokensElements: [],
    reservedTokensInput: {dim: "tokens"}
  },
  crowdsale: [{
    startTime: '',
    endTime: '',
    walletAddress: '',
    supply: '',
    whitelist: [],
    whitelistElements: [],
    whitelistInput: {}
  }],
  pricingStrategy: [{rate: ''}],
  blockTimeGeneration: 17,
  compilerVersion: "0.4.11",
  optimized: true,
  contractName: "MintedTokenCappedCrowdsaleExt",
  contractType: "white-list-with-cap",
  contractTypes: {
    standard: "standard",
    capped: "capped",
    whitelistwithcap: "white-list-with-cap"
  }
}

export const defaultTiers = [{
  startTime: '',
  endTime: '',
  walletAddress: '',
  supply: '',
  whitelist: [],
  whitelistElements: [],
  whitelistInput: {}
}]

export const CONTRACT_TYPES = {
  standard: "standard",
  capped: "capped",
  whitelistwithcap: "white-list-with-cap"
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
  MINCAP: 'Value must be positive and decimals should not exceed the amount of decimals specified'
}

//descriptions of input fields
export const DESCRIPTION = {
  TOKEN_TICKER: 'The five letter ticker for your token.',
  CROWDSALE_SETUP_NAME: `Name of a tier, e.g. PrePreCrowdsale, PreCrowdsale, Crowdsale with bonus A, Crowdsale with bonus B, etc. We simplified that and will increment a number after each tier.`,
  ALLOW_MODIFYING: `Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`,
  START_TIME: `Date and time when the tier starts. Can't be in the past from the current moment.`,
  END_TIME: `Date and time when the tier ends. Can be only in the future.`,
  RATE: `Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`,
  SUPPLY: `How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`
}

export const TEXT_FIELDS = {
  NAME: 'Name',
  TICKER: 'Ticker',
  SUPPLY: 'Supply',
  DECIMALS: 'Decimals',
  RATE: 'Rate',
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
  GAS_PRICE: 'Gas Price'
}

export const VALIDATION_TYPES = {
  VALID: "VALIDATED",
  EMPTY: 'EMPTY',
  INVALID: 'INVALID'
}
const { VALID, EMPTY } = VALIDATION_TYPES

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
    { value: 'Compiler Version: ', parent: 'none', fileValue: '0.4.11' },
    { value: 'Is optimization enabled?: ', parent: 'none', fileValue: 'true' },
    { value: '*****************************', parent: 'none', fileValue: '' }
  ],
  files: {
    order: [
      'safeMathLib',
      'token',
      'pricingStrategy',
      'crowdsale',
      'nullFinalizeAgent',
      'finalizeAgent'
    ],
    safeMathLib: {
      name: 'SafeMathLibExt',
      txt: [
        { value: 'SafeMathLib library name: ', parent: 'none', fileValue: 'SafeMathLibExt' },
        { field: 'addr', value: 'SafeMathLib library address: ', parent: 'contracts', child: 'safeMathLib' },
        { value: '*****************************', parent: 'none', fileValue: '' },
        { field: 'abi', value: '****SafeMathLib contract ABI:**** \n\n', parent: 'contracts', child: 'safeMathLib' }
      ],
      sol: {
        field: 'src',
        value: '****SafeMathLib contract source:**** \n\n',
        parent: 'contracts',
        child: 'safeMathLib'
      }

    },
    token: {
      name: 'CrowdsaleTokenExt',
      txt: [
        { value: 'Token contract name: ', parent: 'none', fileValue: 'CrowdsaleTokenExt' },
        { field: 'addr', value: 'Token contract address: ', parent: 'contracts', child: 'token' },
        { value: '*****************************', parent: 'none', fileValue: '' },
        { field: 'abi', value: '****Token contract ABI:**** \n\n', parent: 'contracts', child: 'token' },
        {
          field: 'abiConstructor',
          value: '****Token contract ABI encoded constructor arguments',
          parent: 'contracts',
          child: 'token'
        }
      ],
      sol: { field: 'src', value: '****Token contract source:**** \n\n', parent: 'contracts', child: 'token' }

    },
    pricingStrategy: {
      name: 'FlatPricingExt',
      txt: [
        { value: 'Pricing strategy contract name: ', parent: 'none', fileValue: 'FlatPricingExt' },
        { field: 'addr', value: 'Pricing strategy contract address', parent: 'contracts', child: 'pricingStrategy' },
        { value: '*****************************', parent: 'none', fileValue: '' },
        {
          field: 'abi',
          value: '****Pricing strategy contract ABI:**** \n\n',
          parent: 'contracts',
          child: 'pricingStrategy'
        },
        {
          field: 'abiConstructor',
          value: '****Pricing strategy contract ABI encoded constructor arguments',
          parent: 'contracts',
          child: 'pricingStrategy'
        }
      ],
      sol: {
        field: 'src',
        value: '****Pricing strategy contract source:**** \n\n',
        parent: 'contracts',
        child: 'pricingStrategy'
      }

    },
    crowdsale: {
      name: 'MintedTokenCappedCrowdsaleExt',
      txt: [
        { value: 'Crowdsale contract name: ', parent: 'none', fileValue: 'MintedTokenCappedCrowdsaleExt' },
        { field: 'addr', value: 'Crowdsale contract address', parent: 'contracts', child: 'crowdsale' },
        { value: '*****************************', parent: 'none', fileValue: '' },
        { field: 'abi', value: '****Crowdsale contract ABI:**** \n\n', parent: 'contracts', child: 'crowdsale' },
        {
          field: 'abiConstructor',
          value: '****Crowdsale contract ABI encoded constructor arguments',
          parent: 'contracts',
          child: 'crowdsale'
        }
      ],
      sol: { field: 'src', value: '****Crowdsale contract source:**** \n\n', parent: 'contracts', child: 'crowdsale' }

    },
    nullFinalizeAgent: {
      name: 'NullFinalizeAgentExt',
      txt: [
        { value: 'Null finalize agent contract name: ', parent: 'none', fileValue: 'NullFinalizeAgentExt' },
        {
          field: 'addr',
          value: 'Null finalize agent contract address',
          parent: 'contracts',
          child: 'finalizeAgent'
        },
        { value: '*****************************', parent: 'none', fileValue: '' },
        {
          field: 'abi',
          value: '****Null Finalize agent contract ABI:**** \n\n',
          parent: 'contracts',
          child: 'nullFinalizeAgent'
        },
        {
          field: 'abiConstructor',
          value: '****Null Finalize agent contract ABI encoded constructor arguments',
          parent: 'contracts',
          child: 'finalizeAgent'
        }
      ],
      sol: {
        field: 'src',
        value: '****Null Finalize agent contract source:**** \n\n',
        parent: 'contracts',
        child: 'nullFinalizeAgent'
      }

    },
    finalizeAgent: {
      name: 'ReservedTokensFinalizeAgent',
      txt: [
        { value: 'Finalize agent contract name: ', parent: 'none', fileValue: 'ReservedTokensFinalizeAgent' },
        { field: 'addr', value: 'Finalize agent contract address', parent: 'contracts', child: 'finalizeAgent' },
        { value: '*****************************', parent: 'none', fileValue: '' },
        {
          field: 'abi',
          value: '****Finalize agent contract ABI:**** \n\n',
          parent: 'contracts',
          child: 'finalizeAgent'
        },
        {
          field: 'abiConstructor',
          value: '****Finalize agent contract ABI encoded constructor arguments',
          parent: 'contracts',
          child: 'finalizeAgent'
        }
      ],
      sol: {
        field: 'src',
        value: '****Finalize agent contract source:**** \n\n',
        parent: 'contracts',
        child: 'finalizeAgent'
      }

    }
  }
}

export const DOWNLOAD_NAME = 'icowizard'
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
  safeMathLibrary: "Deploy SafeMathLibrary Contract",
  token: "Deploy Token Contract",
  pricingStrategy: "Deploy Pricing Strategy Contract",
  crowdsale: "Deploy Crowdsale Contract",
  registerCrowdsaleAddress: "Associate Crowdsale address to current account",
  finalizeAgent: "Deploy Finalize Agent Contract",
  tier: "Register tier address for Pricing strategy",
  setReservedTokens: "Register addresses for Reserved Tokens",
  updateJoinedCrowdsales: "Register Crowdsales addresses",
  setMintAgentCrowdsale: "Allow Crowdsale Contract to Mint Tokens",
  setMintAgentFinalizeAgent: "Allow Finalize Agent Contract to Mint Token",
  whitelist: "Register whitelisted addresses",
  setFinalizeAgent: "Register Finalize Agent Contract addresses",
  setReleaseAgent: "Register Token release addresses",
  transferOwnership: "Transfer ownership to wallet address"
}
