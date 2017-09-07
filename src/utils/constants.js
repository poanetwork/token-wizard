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
		supply: '0'
	},
	crowdsale: [{
		whitelist: [], 
		whiteListElements: [], 
		whiteListInput: {}
	}],
	pricingStrategy: [{}],
	blockTimeGeneration: 17,
	contractType: "white-list-with-cap",
	contractTypes: {
		standard: "standard",
		capped: "capped",
		whitelistwithcap: "white-list-with-cap"
	}
}

export const NAVIGATION_STEPS = {
	CROWDSALE_CONTRACT: 'Crowdsale Contract',
	TOKEN_SETUP: 'Token Setup',
	CROWDSALE_SETUP: 'Crowdsale Setup',
	PUBLISH: 'Publish',
	CROWDSALE_PAGE: 'Crowdsale Page'
}


export const VALIDATION_MESSAGES = {
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
		supply: EMPTY,
		decimals: EMPTY,
		ticker: EMPTY
	}
}

export const initialStepTwoValues = {
	token: {
		name: '',
		supply: '0',
		ticker: '',
		decimals: '',
		reservedTokens: [],
		reservedTokensElements: [],
		reservedTokensInput: {dim: "tokens"}
	}
}

export const intitialStepThreeValidations = {
	validations: {
		startTime: VALID,
		endTime: VALID,
		walletAddress: EMPTY,
		supply: VALID,
		rate: EMPTY
	}
}

export const initialStepThreeValues = {
	crowdsale: [{
		startTime: '',
		endTime: '',
		walletAddress: '',
		supply: '',
		rate: ''
	}]
}

export const PDF_CONTENTS = [
	{ field: 'name', value: 'Name: ', parent: 'token', x: 10, y: 10 },
	{ field: 'ticker', value: 'Ticker: ', parent: 'token', x: 10, y: 20 },
	{ field: 'supply', value: 'Supply: ', parent: 'token', x: 10, y: 30 },
	{ field: 'decimals', value: 'Decimals: ', parent: 'token', x: 10, y: 40 },
	{ field: 'startTime', value: 'Start Time: ', parent: 'crowdsale', x: 10, y: 50 },
	{ field: 'endTime', value: 'End Time: ', parent: 'crowdsale', x: 10, y: 60 },
	{ field: 'walletAddress', value: 'Wallet Address: ', parent: 'crowdsale', x: 10, y: 70 },
	{ field: 'rate', value: 'Rate: ', parent: 'pricingStrategy', x: 10, y: 80 },
	{ value: 'Compiler Version: ', parent: 'none', pdfValue: '0.4.11', x: 10, y: 90 },
	{ field: 'src', value: 'Source Contract: ', parent: 'contracts', x: 10, y: 10 },
	{ field: 'abi', value: 'ABI Contract: ', parent: 'contracts', x: 10, y: 10 },
	{ field: 'abiConstructor', value: 'ABI Parameters: ', parent: 'contracts', x: 10, y: 10 }
]