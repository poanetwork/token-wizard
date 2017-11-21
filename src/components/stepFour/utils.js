import {
  attachToContract,
  checkTxMined,
  getWeb3,
  getNetworkVersion,
  getNetWorkNameById,
  sendTXToContract
} from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'
import { GAS_PRICE, DOWNLOAD_NAME } from '../../utils/constants'

function setLastCrowdsale(web3, abi, addr, lastCrowdsale, gasLimit, cb) {
  console.log("###setLastCrowdsale for Pricing Strategy:###");
  attachToContract(web3, abi, addr, function(err, pricingStrategyContract) {
    console.log("attach to pricingStrategy contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!pricingStrategyContract) return noContractAlert();

    let method = pricingStrategyContract.methods.setLastCrowdsale(lastCrowdsale).send({gasLimit: gasLimit, gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

//for mintable token
function setMintAgent(web3, abi, addr, acc, gasLimit, cb) {
  console.log("###setMintAgent:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    let method = tokenContract.methods.setMintAgent(acc, true).send({gasLimit: gasLimit, gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

function addWhiteList(round, web3, crowdsale, token, abi, addr, cb) {
  console.log("###whitelist:###");
  let whitelist = [];
  for (let i = 0; i <= round; i++) {
    console.log(crowdsale[i]);
    console.log(crowdsale[i].whitelist);

    for (let j = 0; j < crowdsale[i].whitelist.length; j++) {
      let itemIsAdded = false;
      for (let k = 0; k < whitelist.length; k++) {
        if (whitelist[k].addr == crowdsale[i].whitelist[j].addr) {
          itemIsAdded = true;
          break;
        }
      }
      if (!itemIsAdded) {
        whitelist.push.apply(whitelist, crowdsale[i].whitelist);
      }
    }

    if (crowdsale[i].whiteListInput.addr && crowdsale[i].whiteListInput.min && crowdsale[i].whiteListInput.max) {
      let itemIsAdded = false;
      for (let k = 0; k < whitelist.length; k++) {
        if (whitelist[k].addr == crowdsale[i].whiteListInput.addr) {
          itemIsAdded = true;
          break;
        }
      }
      if (!itemIsAdded) {
        whitelist.push({
          "addr": crowdsale[i].whiteListInput.addr,
          "min": crowdsale[i].whiteListInput.min,
          "max": crowdsale[i].whiteListInput.max
        });
      }
    }
  }
  console.log("whitelist: ");
  console.log(whitelist);

  if (whitelist.length === 0) {
    return cb();
  }
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (!crowdsaleContract) return noContractAlert();

    let addrs = [];
    let statuses = [];
    let minCaps = [];
    let maxCaps = [];

    for (let i = 0; i < whitelist.length; i++) {
      if (!whitelist[i].deleted) {
        addrs.push(whitelist[i].addr);
        statuses.push(true);
        minCaps.push(whitelist[i].min*10**token.decimals?toFixed((whitelist[i].min*10**token.decimals).toString()):0);
        maxCaps.push(whitelist[i].max*10**token.decimals?toFixed((whitelist[i].max*10**token.decimals).toString()):0);
      }
    }

    console.log("addrs:");
    console.log(addrs);
    console.log("statuses:");
    console.log(statuses);
    console.log("minCaps:");
    console.log(minCaps);
    console.log("maxCaps:");
    console.log(maxCaps);

    let method = crowdsaleContract.methods.setEarlyParicipantsWhitelist(addrs, statuses, minCaps, maxCaps).send({gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

function updateJoinedCrowdsales(web3, abi, addr, joinedCntrctAddrs, gasLimit, cb) {
  console.log("###updateJoinedCrowdsales:###");
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!crowdsaleContract) return noContractAlert();

    console.log("input: ");
    console.log(joinedCntrctAddrs);

    let method = crowdsaleContract.methods.updateJoinedCrowdsalesMultiple(joinedCntrctAddrs).send({gasLimit: gasLimit, gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

function setFinalizeAgent(web3, abi, addr, finalizeAgentAddr, gasLimit, cb) {
  console.log("###setFinalizeAgent:###");
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!crowdsaleContract) return noContractAlert();

    let method = crowdsaleContract.methods.setFinalizeAgent(finalizeAgentAddr).send({gasLimit: gasLimit, gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

function setReleaseAgent(web3, abi, addr, finalizeAgentAddr, gasLimit, cb) {
  console.log("###setReleaseAgent:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    let method = tokenContract.methods.setReleaseAgent(finalizeAgentAddr).send({gasLimit: gasLimit, gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

export function setReservedTokensListMultiple(web3, abi, addr, token, cb) {
  console.log("###setReservedTokensListMultiple:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    let map = {};
    let addrs = [], inTokens = [], inPercentageUnit = [], inPercentageDecimals = [];

    if (token.reservedTokensInput.addr && token.reservedTokensInput.dim && token.reservedTokensInput.val) {
      token.reservedTokens.push({
          "addr": token.reservedTokensInput.addr,
          "dim": token.reservedTokensInput.dim,
          "val": token.reservedTokensInput.val
      });
    }

    console.log("token.reservedTokens: ");
    console.log(token.reservedTokens);

    for (let i = 0; i < token.reservedTokens.length; i++) {
      if (!token.reservedTokens[i].deleted) {
        let val = token.reservedTokens[i].val
        let addr = token.reservedTokens[i].addr
        let obj = map[addr]?map[addr]:{}
        if (token.reservedTokens[i].dim === "tokens")
          obj.inTokens = val * 10**token.decimals
        else {
          obj.inPercentageDecimals = countDecimals(val)
          obj.inPercentageUnit = val * 10**obj.inPercentageDecimals
        }
        map[addr] = obj
      }
    }

    let keys = Object.keys(map);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let obj = map[key]
      addrs.push(key)
      inTokens.push(obj.inTokens?toFixed(obj.inTokens.toString()):0)
      inPercentageUnit.push(obj.inPercentageUnit?obj.inPercentageUnit:0)
      inPercentageDecimals.push(obj.inPercentageDecimals?obj.inPercentageDecimals:0)
    }

    if (addrs.length === 0 && inTokens.length === 0 && inPercentageUnit.length === 0 && inPercentageDecimals.length === 0) return cb()

    console.log("addrs: " + addrs)
    console.log("inTokens: " + inTokens)
    console.log("inPercentageUnit: " + inPercentageUnit)
    console.log("inPercentageDecimals: " + inPercentageDecimals)

    let method = tokenContract.methods.setReservedTokensListMultiple(addrs, inTokens, inPercentageUnit, inPercentageDecimals).send({gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

export function transferOwnership(web3, abi, addr, finalizeAgentAddr, gasLimit, cb) {
  console.log("###transferOwnership:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) {
      console.log(err)
      return cb();
    }
    if (!tokenContract) return noContractAlert();

    let method = tokenContract.methods.transferOwnership(finalizeAgentAddr).send({gasLimit: gasLimit, gasPrice: GAS_PRICE})
    sendTXToContract(web3, method, cb)
  });
}

export function setLastCrowdsaleRecursive (i, web3, abi, pricingStrategyAddrs, lastCrowdsale, gasLimit, cb) {
  setLastCrowdsale(web3, abi, pricingStrategyAddrs[i], lastCrowdsale, gasLimit, (err) => {
    i++;
    if (i < pricingStrategyAddrs.length) {
      setLastCrowdsaleRecursive(i, web3, abi, pricingStrategyAddrs, lastCrowdsale, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export function  setMintAgentRecursive (i, web3, abi, addr, crowdsaleAddrs, gasLimit, cb) {
  setMintAgent(web3, abi, addr, crowdsaleAddrs[i], gasLimit, (err) => {
    i++;
    if (i < crowdsaleAddrs.length) {
      setMintAgentRecursive(i, web3, abi, addr, crowdsaleAddrs, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export function updateJoinedCrowdsalesRecursive (i, web3, abi, addrs, gasLimit, cb) {
  if (addrs.length === 0) return cb();
  updateJoinedCrowdsales(web3, abi, addrs[i], addrs, gasLimit, (err) => {
    i++;
    if (i < addrs.length) {
      updateJoinedCrowdsalesRecursive(i, web3, abi, addrs, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export function addWhiteListRecursive (i, web3, crowdsale, token, abi, crowdsaleAddrs, cb) {
  addWhiteList(i, web3, crowdsale, token, abi, crowdsaleAddrs[i], (err) => {
    i++;
    if (i < crowdsaleAddrs.length) {
      addWhiteListRecursive(i, web3, crowdsale, token, abi, crowdsaleAddrs, cb);
    } else {
      cb(err);
    }
  })
}

export function setFinalizeAgentRecursive (i, web3, abi, addrs, finalizeAgentAddrs, gasLimit, cb) {
  setFinalizeAgent(web3, abi, addrs[i], finalizeAgentAddrs[i], gasLimit, (err) => {
    i++;
    if (i < finalizeAgentAddrs.length) {
      setFinalizeAgentRecursive(i, web3, abi, addrs, finalizeAgentAddrs, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export function setReleaseAgentRecursive (i, web3, abi, addr, finalizeAgentAddrs, gasLimit, cb) {
  setReleaseAgent(web3, abi, addr, finalizeAgentAddrs[i], gasLimit, (err) => {
    i++;
    if (i < finalizeAgentAddrs.length) {
      setReleaseAgentRecursive(i, web3, abi, addr, finalizeAgentAddrs, gasLimit, cb);
    } else {
      cb(err);
    }
  })
}

export const handlerForFile = (content, type) => {
  const checkIfTime = content.field === "startTime" || content.field === "endTime"
  let suffix = ''

  if (checkIfTime) {
    let timezoneOffset = (new Date()).getTimezoneOffset() / 60
    let operator = timezoneOffset > 0 ? '-' : '+'
    suffix = ` (GMT ${operator} ${Math.abs(timezoneOffset)})`
  }

  return `${content.value}${type[content.field]}${suffix}`
}

export const handleConstantForFile = content => {
  return `${content.value}${content.fileValue}`
}

export const handleContractsForFile = (content, state, index) => {
  const title = content.value
  const { field } = content
  let fileContent = ''

  if (field !== 'src' && field !== 'abi' && field !== 'addr') {
    const contractField = state.contracts[content.child][field]
    let fileBody

    if (Array.isArray(contractField)) {
      fileBody = contractField[index]

      if (!!fileBody) {
          fileContent = title + ' for ' + state.crowdsale[index].tier + ':**** \n\n' + fileBody
      }
    } else if (!!contractField) {
      fileContent = title + ':**** \n\n' + contractField
    }
  } else {
    fileContent = addSrcToFile(content, state, index)
  }

  return fileContent
}

const addSrcToFile = (content, state, index) => {
  const title = content.value
  const { field } = content
  const contractField = state.contracts[content.child][field]
  let fileContent = ''

  if (Array.isArray(contractField) && field !== 'abi') {
      fileContent = title + ' for ' + state.crowdsale[index].tier + ': ' + contractField[index]
  } else {
    if (field !== 'src') {
      const body = field === 'abi' ? JSON.stringify(contractField) : contractField
      fileContent = title + body
    } else {
      fileContent = contractField
    }
  }

  return fileContent
}

export const download = ({ data = {}, filename = '', type = '', zip = '' }) => {
  let file = !zip ? new Blob([data], { type: type }) : zip

  if (window.navigator.msSaveOrOpenBlob) { // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  } else { // Others
    let a = document.createElement('a')
    let url = URL.createObjectURL(file)

    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

export function scrollToBottom() {
  window.scrollTo(0,document.body.scrollHeight);
}

export function getDownloadName (tokenAddress) {
  return new Promise((resolve, reject) => {
    getWeb3((web3) => {
      const whenNetworkName = getNetworkVersion(web3)
        .then((networkId) => {
          let networkName = getNetWorkNameById(networkId);

          if (!networkName) {
            networkName = String(networkId);
          }

          return networkName;
        })
        .then((networkName) => `${DOWNLOAD_NAME}_${networkName}_${tokenAddress}`);

      resolve(whenNetworkName);
    });
  });
}

var countDecimals = function (inputFloat) {
  if(Math.floor(inputFloat) === parseFloat(inputFloat)) return 0;
  return inputFloat.toString().split(".")[1].length || 0;
}
