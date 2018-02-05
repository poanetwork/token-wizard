import { VALIDATION_TYPES, TRUNC_TO_DECIMALS, TOAST } from './constants'
import { contractStore, tokenStore, tierStore, web3Store } from '../stores'
import queryString from 'query-string'
const { VALID, INVALID } = VALIDATION_TYPES

export function getQueryVariable(variable) {
  return queryString.parse(window.location.search)[variable]
}

export function setFlatFileContentToState(file) {
  return fetchFile(file)
}

export function getWhiteListWithCapCrowdsaleAssets() {
  const contractsRoute = './contracts/'
  const crowdsaleFilename = 'CrowdsaleWhiteListWithCap'
  const binAbi = ['bin', 'abi']

  const crowdsaleFiles = ['sol', ...binAbi].map(ext => `${contractsRoute}${crowdsaleFilename}_flat.${ext}`)
  const tokenFiles = binAbi.map(ext => `${contractsRoute}${crowdsaleFilename}Token_flat.${ext}`)
  const pricingFiles = binAbi.map(ext => `${contractsRoute}${crowdsaleFilename}PricingStrategy_flat.${ext}`)
  const finalizeFiles = binAbi.map(ext => `${contractsRoute}FinalizeAgent_flat.${ext}`)
  const nullFiles = binAbi.map(ext => `${contractsRoute}NullFinalizeAgent_flat.${ext}`)
  const registryFiles = binAbi.map(ext => `${contractsRoute}Registry_flat.${ext}`)

  const states = crowdsaleFiles.concat(tokenFiles, pricingFiles, finalizeFiles, nullFiles, registryFiles)
    .map(setFlatFileContentToState)

  return Promise.all(states)
    .then(state => {
      contractStore.setContractProperty('crowdsale', 'src', state[0])
      contractStore.setContractProperty('crowdsale', 'bin', state[1])
      contractStore.setContractProperty('crowdsale', 'abi', JSON.parse(state[2]))
      contractStore.setContractProperty('token', 'bin', state[3])
      contractStore.setContractProperty('token', 'abi', JSON.parse(state[4]))
      contractStore.setContractProperty('pricingStrategy', 'bin', state[5])
      contractStore.setContractProperty('pricingStrategy', 'abi', JSON.parse(state[6]))
      contractStore.setContractProperty('finalizeAgent', 'bin', state[7])
      contractStore.setContractProperty('finalizeAgent', 'abi', JSON.parse(state[8]))
      contractStore.setContractProperty('nullFinalizeAgent', 'bin', state[9])
      contractStore.setContractProperty('nullFinalizeAgent', 'abi', JSON.parse(state[10]))
      contractStore.setContractProperty('registry', 'bin', state[11])
      contractStore.setContractProperty('registry', 'abi', JSON.parse(state[12]))
      return contractStore
    })
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

export const getconstructorParams = (abiConstructor, vals, crowdsaleNum, isCrowdsale) => {
  let params = {"types": [], "vals": []};
  if (!abiConstructor) return params;

  for (let j = 0; j < abiConstructor.length; j++) {
    let inp = abiConstructor[j];
    params.types.push(inp.type);
    if (vals.length > 0) {
      params.vals.push(vals[j]);
    } else {
      switch(inp.name) {
        case "_start":
          params.vals.push(toFixed(new Date(tierStore.tiers[crowdsaleNum].startTime).getTime() / 1000).toString());
          break;
        case "_end":
          params.vals.push(toFixed(new Date(tierStore.tiers[crowdsaleNum].endTime).getTime() / 1000).toString());
          break;
        case "_rate":
          params.vals.push(tierStore.tiers[crowdsaleNum].rate);
          break;
        case "_multisigWallet":
          //params.vals.push(contractStore.multisig.addr);
          params.vals.push(tierStore.tiers[0].walletAddress);
          break;
        case "_pricingStrategy":
          params.vals.push(contractStore.pricingStrategy.addr[crowdsaleNum]);
          break;
        case "_token":
          params.vals.push(contractStore.token.addr);
          break;
        case "_crowdsale":
          params.vals.push(contractStore.crowdsale.addr[crowdsaleNum]);
          break;
        case "_name": {
          if (isCrowdsale) {
            params.vals.push(tierStore.tiers[crowdsaleNum].tier);
          } else {
            params.vals.push(tokenStore.name);
          }
        } break;
        case "_symbol":
          params.vals.push(tokenStore.ticker);
          break;
        case "_decimals":
          params.vals.push(tokenStore.decimals);
          break;
        case "_globalMinCap":
          params.vals.push(tierStore.tiers[0].whitelistEnabled !== 'yes' ? tokenStore.globalmincap ? toFixed(tokenStore.globalmincap * 10 ** tokenStore.decimals).toString() : 0 : 0)
          break;
        case "_initialSupply":
          params.vals.push(tokenStore.supply);
          break;
        case "_maximumSellableTokens":
          params.vals.push(toFixed(tierStore.tiers[crowdsaleNum].supply * 10**tokenStore.decimals).toString());
          break;
        case "_minimumFundingGoal":
          params.vals.push(0);
          break;
        case "_mintable":
          params.vals.push(true);
          break;
        case "_oneTokenInWei":
          let oneTokenInETHRaw = toFixed(1 / tierStore.tiers[crowdsaleNum].rate).toString()
          let oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, oneTokenInETHRaw)
          params.vals.push(web3Store.web3.utils.toWei(oneTokenInETH, "ether"));
          break;
        case "_isUpdatable":
          params.vals.push(tierStore.tiers[crowdsaleNum].updatable ? tierStore.tiers[crowdsaleNum].updatable==="on" ? true : false : false);
          break;
        case "_isWhiteListed":
          params.vals.push(tierStore.tiers[0].whitelistEnabled ? tierStore.tiers[0].whitelistEnabled === "yes" : false)
          break;
        default:
          params.vals.push("");
          break;
      }
    }
  }
  return params;
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

export const validateDecimals = (decimals) => isNaN(Number(decimals)) === false && Number(decimals) >= 0 && Number(decimals) <= 18

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
