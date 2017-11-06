export const defaultState = { 
	contracts: { 
		token: {}, 
		crowdsale: {addr:[], abiConstructor:[]},
		pricingStrategy: {addr:[], abiConstructor:[]},
		multisig: {},
		nullFinalizeAgent: {addr:[]},
		finalizeAgent: {addr:[]},
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
		whiteListElements: [], 
		whiteListInput: {}
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

export const TRUNC_TO_DECIMALS = {
	DECIMALS18: -18
}

export const GAS_PRICE = 5000000000

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
	TICKER: 'Please enter a valid Ticker that is less than three characters',
	SUPPLY: 'Please enter a valid number greater than 0',
	DECIMALS: 'Please enter a number greater than or equal to zero',
	WALLET_ADDRESS: 'Please enter a valid address',
	START_TIME: 'Please enter a valid date later than now',
	END_TIME: 'Please enter a valid date later than start time',
	RATE: 'Please enter a valid number greater than 0'
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
	DISABLEWHITELISTING: 'Disable whitelisting'
}

export const VALIDATION_TYPES = {
	VALID: "VALIDATED",
	EMPTY: 'EMPTY',
	INVALID: 'INVALID'
}
const { VALID, EMPTY, INVALID } = VALIDATION_TYPES

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

export const FILE_CONTENTS = [
	{ field: 'name', value: 'Token name: ', parent: 'token', x: 10, y: 10 },
	{ field: 'ticker', value: 'Token ticker: ', parent: 'token', x: 10, y: 10 },
	{ field: 'decimals', value: 'Token decimals: ', parent: 'token', x: 10, y: 10 },
	{ field: 'walletAddress', value: 'Multisig wallet address: ', parent: 'crowdsale', x: 10, y: 10 },
	{ value: '*****************************', parent: 'none', fileValue: '', x: 10, y: 10 },
	{ field: 'rate', value: 'Crowdsale rate: ', parent: 'pricingStrategy', x: 10, y: 10 },
	{ field: 'startTime', value: 'Crowdsale start time: ', parent: 'crowdsale', x: 10, y: 10 },
    { field: 'endTime', value: 'Crowdsale end time: ', parent: 'crowdsale', x: 10, y: 10 },
	{ value: 'Compiler Version: ', parent: 'none', fileValue: '0.4.11', x: 10, y: 10 },
	{ value: 'Is optimization enabled?: ', parent: 'none', fileValue: 'true', x: 10, y: 10 },
	{ value: '*****************************', parent: 'none', fileValue: '', x: 10, y: 10 },
	{ value: 'SafeMathLib library name: ', parent: 'none', fileValue: 'SafeMathLibExt', x: 10, y: 10 },
	{ field: 'addr', value: 'SafeMathLib library address: ', parent: 'contracts', child: 'safeMathLib', x: 10, y: 10 },
	{ value: 'Crowdsale contract name: ', parent: 'none', fileValue: 'MintedTokenCappedCrowdsaleExt', x: 10, y: 10 },
	{ field: 'addr', value: 'Crowdsale contract address', parent: 'contracts', child: 'crowdsale', x: 10, y: 10 },
	{ value: 'Token contract name: ', parent: 'none', fileValue: 'CrowdsaleTokenExt', x: 10, y: 10 },
	{ field: 'addr', value: 'Token contract address: ', parent: 'contracts', child: 'token', x: 10, y: 10 },
	{ value: 'Pricing strategy contract name: ', parent: 'none', fileValue: 'FlatPricingExt', x: 10, y: 10 },
	{ field: 'addr', value: 'Pricing strategy contract address', parent: 'contracts', child: 'pricingStrategy', x: 10, y: 10 },
	{ value: 'Null finalize agent contract name: ', parent: 'none', fileValue: 'NullFinalizeAgentExt', x: 10, y: 10 },
	{ value: 'Finalize agent contract name: ', parent: 'none', fileValue: 'ReservedTokensFinalizeAgent', x: 10, y: 10 },
	{ field: 'addr', value: 'Finalize agent contract address', parent: 'contracts', child: 'finalizeAgent', x: 10, y: 10 },
	{ value: '*****************************', parent: 'none', fileValue: '', x: 10, y: 10 },
	{ field: 'src', value: '****SafeMathLib contract source:**** \n \n', parent: 'contracts', child: 'safeMathLib', x: 10, y: 10 },
	{ field: 'abi', value: '****SafeMathLib contract ABI:**** \n \n', parent: 'contracts', child: 'safeMathLib', x: 10, y: 10 },
	{ field: 'src', value: '****Crowdsale contract source:**** \n \n', parent: 'contracts', child: 'crowdsale', x: 10, y: 10 },
	{ field: 'abi', value: '****Crowdsale contract ABI:**** \n \n', parent: 'contracts', child: 'crowdsale', x: 10, y: 10 },
	{ field: 'abiConstructor', value: '****Crowdsale contract ABI encoded constructor arguments', parent: 'contracts', child: 'crowdsale', x: 10, y: 10 },
	{ field: 'src', value: '****Token contract source:**** \n \n', parent: 'contracts', child: 'token', x: 10, y: 10 },
	{ field: 'abi', value: '****Token contract ABI:**** \n \n', parent: 'contracts', child: 'token', x: 10, y: 10 },
	{ field: 'abiConstructor', value: '****Token contract ABI encoded constructor arguments', parent: 'contracts', child: 'token', x: 10, y: 10 },
	{ field: 'src', value: '****Pricing strategy contract source:**** \n \n', parent: 'contracts', child: 'pricingStrategy', x: 10, y: 10 },
	{ field: 'abi', value: '****Pricing strategy contract ABI:**** \n \n', parent: 'contracts', child: 'pricingStrategy', x: 10, y: 10 },
	{ field: 'abiConstructor', value: '****Pricing strategy contract ABI encoded constructor arguments', parent: 'contracts', child: 'pricingStrategy', x: 10, y: 10 },
	{ field: 'src', value: '****Finalize agent contract source:**** \n \n', parent: 'contracts', child: 'finalizeAgent', x: 10, y: 10 },
	{ field: 'abi', value: '****Finalize agent contract ABI:**** \n \n', parent: 'contracts', child: 'finalizeAgent', x: 10, y: 10 },
	{ field: 'abiConstructor', value: '****Finalize agent contract ABI encoded constructor arguments', parent: 'contracts', child: 'finalizeAgent', x: 10, y: 10 }
]

export const DOWNLOAD_NAME = 'contractInfo'
export const DOWNLOAD_TYPE = 'text/plain'

export const TOAST = {
	TYPE: {
		ERROR: 'error',
		INFO: 'info',
		SUCCESS: 'warning'
	},
	MESSAGE: {
		USER_REJECTED_TRANSACTION: 'User Rejected Transaction',
		CONTRACT_DOWNLOAD_FAILED: 'Contract Download failed',
		CONTRACT_DOWNLOAD_SUCCESS: 'A file with contracts and metadata downloaded on your computer'},
	DEFAULT_OPTIONS: {
		position: 'top right',
		offset: '80px 14',
		time: 10000
	}
}