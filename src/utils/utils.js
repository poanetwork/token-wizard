import { VALIDATION_TYPES } from './constants'
import { contractStore, tokenStore, tierStore, web3Store } from '../stores'
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

export function getURLParam(key,target){
    var values = [];
    if(!target) {
      target = window.location.href;
    }

    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    var pattern = key + '=([^&#]+)';
    var o_reg = new RegExp(pattern,'ig');
    while (true) {
        var matches = o_reg.exec(target);
        if(matches && matches[1]) {
          values.push(matches[1]);
        }
        else {
          break;
        }
    }

    if (!values.length) {
      return null;   
    } else {
      return values.length == 1 ? values[0] : values;
    }

}

export function setFlatFileContentToState(file, cb) {
  readSolFile(file, function(content) {
    cb(content);
  });
}

export function getWhiteListWithCapCrowdsaleAssets(state, cb) {
    const contractName = "CrowdsaleWhitelistWithCap";
    let derivativesLength = 11;
    let derivativesIterator = 0;
    setFlatFileContentToState("./contracts/" + contractName + "_flat.sol", function(_src) {
      derivativesIterator++;
      state.contracts.crowdsale.src = _src;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.crowdsale.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.crowdsale.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "Token_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.token.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "Token_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.token.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "PricingStrategy_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.pricingStrategy.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "PricingStrategy_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.pricingStrategy.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    /*const tokenTransferProxyContractName = "TokenTransferProxy";
    setFlatFileContentToState("./contracts/" + tokenTransferProxyContractName + "_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.tokenTransferProxy.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + tokenTransferProxyContractName + "_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.tokenTransferProxy.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    const multisigContractName = "MultiSig";
    setFlatFileContentToState("./contracts/" + multisigContractName + "_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.multisig.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + multisigContractName + "_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.multisig.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });*/
    const finalizeAgentContractName = "FinalizeAgent";
    setFlatFileContentToState("./contracts/" + finalizeAgentContractName + "_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.finalizeAgent.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + finalizeAgentContractName + "_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.finalizeAgent.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    const nullFinalizeAgentContractName = "NullFinalizeAgent";
    setFlatFileContentToState("./contracts/" + nullFinalizeAgentContractName + "_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.nullFinalizeAgent.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + nullFinalizeAgentContractName + "_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.nullFinalizeAgent.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
}

export function getStandardCrowdsaleAssets(state, cb) {
    const contractName = "CrowdsaleStandard";
    var derivativesLength = 4;
    var derivativesIterator = 0;
    setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.crowdsale.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.crowdsale.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "Token_flat.bin", function(_bin) {
      derivativesIterator++;
      state.contracts.token.bin = _bin;

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
    setFlatFileContentToState("./contracts/" + contractName + "Token_flat.abi", function(_abi) {
      derivativesIterator++;
      state.contracts.token.abi = JSON.parse(_abi);

      if (derivativesIterator === derivativesLength) {
        cb(state);
      }
    });
}

function readSolFile(path, cb) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, true);
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

export const getconstructorParams = (abiConstructor, vals, crowdsaleNum) => {
    console.log(abiConstructor, vals, crowdsaleNum);
    let params = {"types": [], "vals": []};
    if (!abiConstructor) return params;
    for (let j = 0; j < abiConstructor.length; j++) {
        let inp = abiConstructor[j];
        params.types.push(inp.type);
        if (vals.length > 0) {
            params.vals.push(vals[j]);
        } else {
            switch(inp.name) {
                case "_startBlock": {
                    params.vals.push(tierStore.tiers[crowdsaleNum].startBlock);
                } break;
                case "_start": {
                    params.vals.push(new Date(tierStore.tiers[crowdsaleNum].startTime).getTime()/1000);
                } break;
                case "_endBlock": {
                    params.vals.push(tierStore.tiers[crowdsaleNum].endBlock);
                } break;
                case "_end": {
                    params.vals.push(new Date(tierStore.tiers[crowdsaleNum].endTime).getTime()/1000);
                } break;
                case "_rate": {
                    params.vals.push(tierStore.tiers[crowdsaleNum].rate);
                } break;
                case "_wallet":
                case "_beneficiary": {
                    params.vals.push(tierStore.tiers[crowdsaleNum].walletAddress);
                } break;
                case "_multisigWallet": {
                    //params.vals.push(state.contracts.multisig.addr);
                    params.vals.push(tierStore.tiers[0].walletAddress);
                } break;
                case "_pricingStrategy": {
                    params.vals.push(contractStore.pricingStrategy.addr[crowdsaleNum]);
                } break;
                case "_token": {
                    params.vals.push(contractStore.token.addr);
                } break;
                case "_crowdsale": {
                    params.vals.push(contractStore.crowdsale.addr[crowdsaleNum]);
                } break;
                case "_crowdsaleSupply": {
                    params.vals.push(tierStore.tiers[crowdsaleNum].supply);
                } break;
                case "_name": {
                    params.vals.push(tokenStore.name);
                } break;
                case "_symbol": {
                    params.vals.push(tokenStore.ticker);
                } break;
                case "_decimals": {
                    params.vals.push(tokenStore.decimals);
                } break;
                case "_globalMinCap": {
                  params.vals.push(tierStore.tiers[0].whitelistdisabled === "yes"?tokenStore.globalmincap?toFixed(tokenStore.globalmincap*10**tokenStore.decimals).toString():0:0);
                } break;
                case "_tokenSupply":
                case "_initialSupply": {
                    params.vals.push(tokenStore.supply);
                } break;
                case "_maximumSellableTokens": {
                  params.vals.push(toFixed(tierStore.tiers[crowdsaleNum].supply*10**tokenStore.decimals).toString());
                } break;
                case "_minimumFundingGoal": {
                  params.vals.push(0);
                } break;
                case "_mintable": {
                    params.vals.push(true);
                } break;
                case "_tranches": {
                    params.vals.push(tierStore.tiers[crowdsaleNum].tranches);
                } break;
                case "_secondsTimeLocked": {
                  params.vals.push(1)
                } break;
                case "_tokenTransferProxy": {
                  params.vals.push(contractStore.tokenTransferProxy.addr)
                } break;
                case "_required": {
                  params.vals.push(1)
                } break;
                case "_owners": {
                  let owners = [];
                  owners.push(tierStore.tiers[crowdsaleNum].walletAddress);
                  params.vals.push(owners)
                } break;
                case "_oneTokenInWei": {
                  //params.vals.push(state.pricingStrategy[crowdsaleNum].rate);
                  //params.vals.push(state.web3.toWei(1/state.pricingStrategy[crowdsaleNum].rate/10**tokenStore.decimals, "ether"));
                  params.vals.push(web3Store.web3.toWei(1/tierStore.tiers[crowdsaleNum].rate, "ether"));
                } break;
                case "_isUpdatable": {
                  params.vals.push(tierStore.tiers[crowdsaleNum].updatable?tierStore.tiers[crowdsaleNum].updatable=="on"?true:false:false);
                } break;
                case "_isWhiteListed": {
                  params.vals.push(tierStore.tiers[0].whitelistdisabled?tierStore.tiers[0].whitelistdisabled=="yes"?false:true:false);
                } break;
                default: {
                    params.vals.push("");
                } break;
            }
        }
    }
    return params;
}

const getTimeAsNumber = (time) => new Date(time).getTime()

export const getOldState = (props, defaultState) => props && props.location && props.location.query && props.location.query.state || defaultState

export const getStepClass = (step, activeStep) => step === activeStep ? "step-navigation step-navigation_active" : "step-navigation"

export const stepsAreValid = (steps) => {
    let newSteps = Object.assign({}, steps)
    newSteps[0] !== undefined ? delete newSteps[0] : ''
    return Object.values(newSteps).length > 3 && Object.values(newSteps).every(step => step === VALID)
}

export const validateTier = (tier) => typeof tier === 'string' && tier.length > 0 && tier.length < 30

export const validateName = (name) => typeof name === 'string' && name.length > 0 && name.length < 30

export const validateSupply = (supply) =>  isNaN(Number(supply)) === false && Number(supply) > 0

export const validateDecimals = (decimals) => isNaN(Number(decimals)) === false && decimals.length > 0

export const validateTicker = (ticker) => typeof ticker === 'string' && ticker.length < 4 && ticker.length > 0

export const validateTime = (time) => getTimeAsNumber(time) > Date.now() 

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

const inputFieldIsUnsubmitted = (currentValidation, newValidation) => currentValidation === EMPTY

const isNotWhiteListTierObject = (value) => !(typeof value === 'object' && value.hasOwnProperty('whitelist') === true && value.hasOwnProperty('tier') === true)

// still thinks that we do not have an array... we do
export const validateValue = (value, property) => {
  //console.log("'" + property + "'");
  //console.log("'" + value + "'");
    if (!isNaN(property)
      || property === 'reservedTokensInput'
      || property === 'reservedTokens'
      || property === 'reservedTokensElements') return VALID;
    //console.log('value of : ' + value + ' and property of : ' + property, Array.isArray(value), JSON.stringify(value))
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
    //console.log("valueIsValid: " + valueIsValid);
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
          Object.keys(newState[parent][i]).map(property => {
            values.push(newState[parent][i][property])
            properties.push(property);
          })
        }
      }
    } else {
      properties = Object.keys(newState[parent])
    }
    //console.log(newState);
    //console.log(properties);
    //console.log(properties.filter(property => property !== 'startBlock' && property !== 'endBlock' && property !== 'updatable' && property.toLowerCase().indexOf("whitelist") == -1 ));
    let iterator = 0
    let validationValues = properties/*.filter(property => property !== 'startBlock' && property !== 'endBlock' && property !== 'updatable' && property.toLowerCase().indexOf("whitelist") == -1 )*/.map(property => {
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
        //console.log("value: " + value, "property: " + property, "iterator: " + iterator);
        iterator++
        if (parent == "token" && property == "supply") return VALID
        return validateValue(value, property)
    })
    //console.log(validationValues);
    //console.log(values);
    
    return validationValues.find(value => value === INVALID) === undefined
}

export function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
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