import { VALIDATION_TYPES } from './constants'
import { getWeb3 } from '../utils/web3'
const { VALID, EMPTY, INVALID } = VALIDATION_TYPES

export function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

export function setFlatFileContentToState(file, cb) {
  readSolFile(file, function(content) {
    cb(content);
  });
}

export function defaultCompanyStartDate() {
    let curDate = new Date();
    curDate = curDate.setDate(curDate.getDate() + 1);
    curDate = new Date(curDate).setUTCHours(0);
    curDate = new Date(curDate).setMinutes(0);
    let curDateISO = new Date(curDate).toISOString();
    let targetDate = curDateISO.split(".")[0].substring(0, curDateISO.lastIndexOf(":"))
    return targetDate;
}

export function defaultCompanyEndDate(startDate) {
    let endDate = new Date(startDate).setDate(new Date(startDate).getDate() + 4);
    endDate = new Date(endDate).setUTCHours(0);
    return new Date(endDate).toISOString().split(".")[0];
}

function readSolFile(path, cb) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                cb(allText);
            }
        }
    };
    rawFile.send(null);
}

export const findConstructor = (abiCrowdsale) => {
    let abiConstructor
    abiCrowdsale.forEach(abiObj => {
        if (abiObj.type === "constructor") {
            console.log(abiObj);
            console.log(abiObj.inputs);
            abiConstructor = abiObj.inputs;
        }
    })
    return abiConstructor
}

export const getconstructorParams = (abiConstructor, state) => {
    let params = {"types": [], "vals": []};
    if (!abiConstructor) return params;
    for (let j = 0; j < abiConstructor.length; j++) {
        let inp = abiConstructor[j];
        params.types.push(inp.type);
        switch(inp.name) {
            case "_startBlock":
            case "_start": {
                params.vals.push(state.crowdsale.startBlock);
            } break;
            case "_endBlock":
            case "_end": {
                params.vals.push(state.crowdsale.endBlock);
            } break;
            case "_rate": {
                params.vals.push(state.pricingStrategy.rate);
            } break;
            case "_wallet":
            case "_multisigWallet": {
                params.vals.push(state.crowdsale.walletAddress);
            } break;
            case "_pricingStrategy": {
                params.vals.push(state.contracts.pricingStrategy.addr);//params.vals.push("0xfdb2e623113b12e4109018654e7598d70706e635");//params.vals.push(state.crowdsale.walletAddress); //todo
            } break;
            case "_token": {
                params.vals.push(state.contracts.token.addr);//params.vals.push("0x870d809780fb26a416a7187e8bb7f2e609684e56");//params.vals.push(state.crowdsale.walletAddress); //todo
            } break;
            case "_crowdsaleSupply": {
                params.vals.push(state.crowdsale.supply);
            } break;
            case "_name": {
                params.vals.push(state.token.name);
            } break;
            case "_symbol": {
                params.vals.push(state.token.ticker);
            } break;
            case "_decimals": {
                params.vals.push(state.token.decimals);
            } break;
            case "_tokenSupply":
            case "_minimumFundingGoal": 
            case "_initialSupply": {
                params.vals.push(state.token.supply);
            } break;
            case "_mintable": {
                params.vals.push(true);
            } break;
            case "_tranches": {
                params.vals.push(state.pricingStrategy.tranches);
            } break;
            default: {
                params.vals.push("");
            } break;
        }
    }
    return params;
}

const getTimeAsNumber = (time) => new Date(time).getTime()

export const getOldState = (props, defaultState) => props && props.location && props.location.query && props.location.query.state || defaultState

export const getStepClass = (step, activeStep) => step === activeStep ? "step-navigation step-navigation_active" : "step-navigation"

export const stepsAreValid = (steps) => Object.values(steps).every(step => step === VALID)

const validateName = (name) => typeof name === 'string' && name.length > 0 && name.length < 27

const validateSupply = (supply) =>  isNaN(Number(supply)) === false && supply.length > 0

const validateDecimals = (decimals) => isNaN(Number(decimals)) === false && decimals.length > 0

const validateTicker = (ticker) => typeof ticker === 'string' && ticker.length < 4 && ticker.length > 0

const validateTime = (time) => getTimeAsNumber(time) > Date.now() 

const validateRate = (rate) => isNaN(Number(rate)) === false && rate > 0

const validateAddress = (address) => {
    if(!address || address.length !== 42 ) {
        return false
    }
    return true
}

const inputFieldValidators = {
    name: validateName,
    ticker: validateTicker,
    decimals: validateDecimals,
    supply: validateSupply,
    startTime: validateTime,
    endTime: validateTime,
    walletAddress: validateAddress,
    rate: validateRate
}

const inputFieldIsUnsubmitted = (currentValidation, newValidation) => console.log('currentValidation, newValidation', currentValidation, newValidation) || currentValidation === EMPTY

export const validateValue = (value, property) => {
    let validationFunction = inputFieldValidators[property]
    // console.log('inputFieldValidators', inputFieldValidators, 'property', property)
    const valueIsValid = validationFunction(value)
    // console.log('validationFunction', validationFunction, 'valueIsValid', valueIsValid)
    return  valueIsValid === true ? VALID : INVALID
}

export const getValidationValue = (value, property, state) => {
    let currentValidation = state[`validations`][property]  
    let newValidation = validateValue(value, property)
    return inputFieldIsUnsubmitted(currentValidation, newValidation) ? EMPTY : newValidation
} 

export const getNewValue = (value, property) => property === "startTime" || property === "endTime" ? getTimeAsNumber(value) : value

export const allFieldsAreValid = (parent, state) => {
    let newState = { ...state }
    // console.log('validateAllFields', state)
    let properties = Object.keys(newState.validations)
    let values = properties.map(property => newState[parent][property])
    console.log('values.find(value => value === INVALID ) === undefined', values.find(value => value === INVALID ) === undefined)
    return values.find(value => value === INVALID ) === undefined
}