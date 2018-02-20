import { VALIDATION_TYPES, TOAST } from './constants'
import queryString from 'query-string'
import { CrowdsaleConfig } from '../components/Common/config'

const { VALID, INVALID } = VALIDATION_TYPES

export function getQueryVariable(variable) {
  return queryString.parse(window.location.search)[variable]
}

export function setFlatFileContentToState(file) {
  return fetchFile(file)
}

export function fetchFile(path) {
  return new Promise((resolve, reject) => {
    const rawFile = new XMLHttpRequest()

    rawFile.addEventListener('error', reject)
    rawFile.open('GET', path, true)
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
        let allText = rawFile.responseText
        resolve(allText)
      }
    }
    rawFile.send(null)
  })
}

export const findConstructor = (abi) => {
  let abiConstructor

  abi.forEach(abiObj => {
    if (abiObj.type === "constructor") {
      console.log(abiObj);
      console.log(abiObj.inputs);
      abiConstructor = abiObj.inputs;
    }
  })

  return abiConstructor
}

export const floorToDecimals = (n, input) => {
  return toFixed(Math.floor10(input, n)).toString()
}

const decimalAdjust = (type, inputNumber, exp) => {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](inputNumber);
  }
  inputNumber = +inputNumber;
  exp = +exp;
  let checkForNaN = isNaN(inputNumber) || !(typeof exp === 'number' && exp % 1 === 0);
  if (checkForNaN) {
    return NaN;
  }
  inputNumber = inputNumber.toString().split('e');
  inputNumber = Math[type](+(inputNumber[0] + 'e' + (inputNumber[1] ? (+inputNumber[1] - exp) : -exp)));
  inputNumber = inputNumber.toString().split('e');
  return +(inputNumber[0] + 'e' + (inputNumber[1] ? (+inputNumber[1] + exp) : exp));
}

if (!Math.floor10) {
  Math.floor10 = (value, exp) => decimalAdjust('floor', value, exp)
}

const getTimeAsNumber = (time) => new Date(time).getTime()

export const getOldState = (props, defaultState) => (props && props.location && props.location.query && props.location.query.state) || defaultState

export const getStepClass = (step, activeStep) => step === activeStep ? "step-navigation step-navigation_active" : "step-navigation"

export const stepsAreValid = (steps) => {
  let newSteps = Object.assign({}, steps)
  if (newSteps[0] !== undefined) {
    delete newSteps[0]
  }
  return Object.values(newSteps).length > 3 && Object.values(newSteps).every(step => step === VALID)
}

export const validateTier = (tier) => typeof tier === 'string' && tier.length > 0 && tier.length < 30

export const validateName = (name) => typeof name === 'string' && name.length > 0 && name.length < 30

export const validateSupply = (supply) =>  isNaN(Number(supply)) === false && Number(supply) > 0

export const validateDecimals = (decimals) => /^$|^([0-9]|[1][0-8])$/.test(decimals)

export const validateTicker = (ticker) => typeof ticker === 'string' && ticker.length <= 5 && ticker.length > 0

export const validateTime = (time) => getTimeAsNumber(time) > Date.now()

export const validateLaterTime = (laterTime, previousTime) => getTimeAsNumber(laterTime) > getTimeAsNumber(previousTime)

export const validateLaterOrEqualTime = (laterTime, previousTime) => getTimeAsNumber(laterTime) >= getTimeAsNumber(previousTime)

export const validateRate = (rate) => isNaN(Number(rate)) === false && Number(rate) > 0

export const validateAddress = (address) => {
  if(!address || address.length !== 42 ) {
    return false
  }
  return true
}

const inputFieldValidators = {
  tier: validateTier,
  name: validateName,
  ticker: validateTicker,
  decimals: validateDecimals,
  supply: validateSupply,
  startTime: validateTime,
  endTime: validateTime,
  walletAddress: validateAddress,
  rate: validateRate
}

const isNotWhiteListTierObject = (value) => !(typeof value === 'object' && value.hasOwnProperty('whitelist') === true && value.hasOwnProperty('tier') === true)

// still thinks that we do not have an array... we do
export const validateValue = (value, property) => {
  if (!isNaN(property)
    || property === 'reservedTokensInput'
    || property === 'reservedTokens'
    || property === 'reservedTokensElements') return VALID;
  let validationFunction, valueIsValid;
  if(isNotWhiteListTierObject(value)) {
    validationFunction = inputFieldValidators[property]
    if (validationFunction)
      valueIsValid = validationFunction(value)
  } else if (inputFieldValidators[property]){
    validationFunction = inputFieldValidators[property]
    if (validationFunction)
      valueIsValid = validationFunction(value[property])
  }
  return  valueIsValid === true ? VALID : INVALID
}

export const getNewValue = (value, property) => property === "startTime" || property === "endTime" ? getTimeAsNumber(value) : value

export const allFieldsAreValid = (parent, state) => {
  let newState = { ...state }
  let properties = []
  let values = []
  if( Object.prototype.toString.call( newState[parent] ) === '[object Array]' ) {
    if (newState[parent].length > 0) {
      for (let i = 0; i < newState[parent].length; i++) {
        Object.keys(newState[parent][i]).forEach(property => { // eslint-disable-line no-loop-func
          values.push(newState[parent][i][property])
          properties.push(property);
        })
      }
    }
  } else {
    properties = Object.keys(newState[parent])
  }
  let iterator = 0
  let validationValues = properties.map(property => {
    if (property === 'startBlock' || property === 'endBlock' || property === 'updatable' || property.toLowerCase().indexOf("whitelist") > -1) {
      iterator++
      return VALID
    }
    let value
    if( Object.prototype.toString.call( newState[parent] ) === '[object Array]' ) {
      if (newState[parent].length > 0)
        value = values[iterator]
    } else {
      value = newState[parent][property]
    }
    iterator++
    if (parent === "token" && property === "supply") return VALID
    return validateValue(value, property)
  })

  return validationValues.find(value => value === INVALID) === undefined
}

export function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1], 10);
    if (e) {
      x *= Math.pow(10,e-1);
      x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1], 10);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10,e);
      x += (new Array(e+1)).join('0');
    }
  }
  return x;
}

export function defaultCompanyEndDate(startDate) {
  let endDate = new Date(startDate).setDate(new Date(startDate).getDate() + 4);
  endDate = new Date(endDate).setUTCHours(0);
  return new Date(endDate).toISOString().split(".")[0];
}

export const toast = {
  msg: {},
  showToaster: function ({ type = TOAST.TYPE.INFO, message = '', options = {} }) {
    if (!message) {
      return
    }

    this.msg[ type ](message, options)
  }
}

export const gweiToWei = x => parseInt(x * 1000000000, 10)

export const weiToGwei = x => x / 1000000000

export const displayHeaderAndFooterInIframe = () => {
  const insideAnIframe = window.self !== window.top
  return insideAnIframe ? CrowdsaleConfig.showHeaderAndFooterInIframe : true
}

export const countDecimalPlaces = num => {
  /*
    (?:
      \.
      (\d+)  First captured group: decimals after the point but before the e
    )?
    (?:
      [eE]
      ([+-]?\d+)  Second captured group: exponent used to adjust the count
    )?
    $
  */
  const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)

  if (!match[0] && !match[1] && !match[2]) return 0

  const digitsAfterDecimal = match[1] ? match[1].length : 0
  const adjust = match[2] ? +match[2] : 0

  return Math.max(0, digitsAfterDecimal - adjust)
}

