import { TOAST } from './constants'
import queryString from 'query-string'
import { CrowdsaleConfig } from '../components/Common/config'
import { BigNumber } from 'bignumber.js'
import logdown from 'logdown'
import Web3 from 'web3'

const logger = logdown('TW:utils:utils')

export function getQueryVariable(variable) {
  return queryString.parse(window.location.search)[variable]
}

export const isExecIDValid = execID => /^0x[a-f0-9]{64}$/i.test(execID)

export const getExecID = () => {
  const execID = getQueryVariable('exec-id')
  return isExecIDValid(execID) ? execID : null
}

/**
 * Get address from query param
 * @returns {null}
 */
export const getAddr = () => {
  const addr = getQueryVariable('addr')
  const addressIsValid = Web3.utils.isAddress(addr)
  logger.log('Obtain address from query:', addr)
  logger.log('Check if address is valid:', addressIsValid)
  return addressIsValid ? addr : null
}

export const isNetworkIDValid = networkID => /^[0-9]+$/.test(networkID)

export const getNetworkID = () => {
  const networkID = getQueryVariable('networkID')
  return isNetworkIDValid(networkID) ? networkID : null
}

export function setFlatFileContentToState(file) {
  return fetchFile(file)
}

export function fetchFile(path) {
  return new Promise((resolve, reject) => {
    const rawFile = new XMLHttpRequest()

    rawFile.addEventListener('error', reject)
    rawFile.open('GET', path, true)
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
        let allText = rawFile.responseText
        resolve(allText)
      }
    }
    rawFile.send(null)
  })
}

export const dateToTimestamp = date => new Date(date).getTime()

export const getStepClass = (step, activeStep) =>
  step === activeStep ? 'step-navigation step-navigation_active' : 'step-navigation'

export const validateTier = tier => typeof tier === 'string' && tier.length > 0 && tier.length < 30

export const validateSupply = supply => isNaN(Number(supply)) === false && Number(supply) > 0

export const validateTime = time => dateToTimestamp(time) > Date.now()

export const validateLaterTime = (laterTime, previousTime) => dateToTimestamp(laterTime) > dateToTimestamp(previousTime)

export const validateLaterOrEqualTime = (laterTime, previousTime) =>
  dateToTimestamp(laterTime) >= dateToTimestamp(previousTime)

export function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1], 10)
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1], 10)
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

export const toast = {
  msg: {},
  showToaster: function({ type = TOAST.TYPE.INFO, message = '', options = {} }) {
    if (!message) {
      return
    }

    this.msg[type](message, options)
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

export const acceptPositiveIntegerOnly = value => {
  if (typeof value === 'number') value = String(value)
  if (typeof value !== 'string') return ''

  return String(value).match(/^(\d*)/)[1]
}

export const removeTrailingNUL = ascii => ascii.replace(/\x00+/, '')

export const truncateStringInTheMiddle = (str, strLength = 50, strPositionStart = 24, strPositionEnd = 25) => {
  if (typeof str === 'string' && str.length > strLength) {
    return `${str.substr(0, strPositionStart)}...${str.substr(str.length - strPositionEnd, str.length)}`
  }
  return str
}

/**
 * Converts the value passed to a BigNumber instance
 * @param {*} value - A number representation
 * @param {boolean} [force=true] - If set to false will return 'undefined' when value is not a number or a string
 * representation of a number.
 * @returns {BigNumber|undefined}
 */
export const toBigNumber = (value, force = true) => {
  BigNumber.set({ DECIMAL_PLACES: 18 })

  if (isNaN(value) || value === '' || value === null) {
    if (force) {
      return new BigNumber(0)
    } else {
      return undefined
    }
  } else {
    return new BigNumber(value)
  }
}

/**
 * Sleep function like C
 * @param ms
 * @returns {Promise}
 */
export const sleep = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const objectKeysToLowerCase = input => {
  if (typeof input !== 'object') {
    return input
  }
  if (Array.isArray(input)) {
    return input.map(objectKeysToLowerCase)
  }
  return Object.keys(input).reduce((newObj, key) => {
    let val = input[key]
    let newVal = typeof val === 'object' ? objectKeysToLowerCase(val) : val
    newObj[key.toLowerCase()] = newVal
    return newObj
  }, {})
}
