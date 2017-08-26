export const defaultState = { 
	contracts: { 
		token: {}, 
		crowdsale: {addr:[]},
		pricingStrategy: {addr:[]},
		multisig: {},
		finalizeAgent: {},
		tokenTransferProxy: {}
	}, 
	token: {},
	crowdsale: [{whitelist:[], whiteListInput: {}}],
	pricingStrategy: [{}],
	blockTimeGeneration: 17,
	contractType: "",
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
	MAX_CAP: 'Max cap'
}

export const VALIDATION_TYPES = {
	VALID: "VALIDATED",
	EMPTY: 'EMPTY',
	INVALID: 'INVALID'
}