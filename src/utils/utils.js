import { TOAST } from './constants'
import queryString from 'query-string'
import { CrowdsaleConfig } from '../components/Common/config'

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

export const validateTier = (tier) => typeof tier === 'string' && tier.length > 0 && tier.length < 30

export const validateName = (name) => typeof name === 'string' && name.length > 0 && name.length < 30

export const validateSupply = (supply) =>  isNaN(Number(supply)) === false && Number(supply) > 0

export const validateTicker = (ticker) => /^[a-z0-9]{1,5}$/i.test(ticker)

export const validateTime = (time) => getTimeAsNumber(time) > Date.now()

export const validateLaterTime = (laterTime, previousTime) => getTimeAsNumber(laterTime) > getTimeAsNumber(previousTime)

export const validateLaterOrEqualTime = (laterTime, previousTime) => getTimeAsNumber(laterTime) >= getTimeAsNumber(previousTime)

export const validateRate = (rate) => isNaN(Number(rate)) === false && Number(rate) > 0

export const validateAddress = (address) => !(!address || address.length !== 42)

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

