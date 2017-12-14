import {
  attachToContract,
  getNetWorkNameById,
  getNetworkVersion,
  sendTXToContract
} from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'
import { DOWNLOAD_NAME } from '../../utils/constants'
import { isObservableArray } from 'mobx'
import { web3Store, generalStore } from '../../stores'

function setLastCrowdsale(web3, abi, addr, lastCrowdsale, gasLimit) {
  console.log('###setLastCrowdsale for Pricing Strategy:###')

  return attachToContract(web3, abi, addr)
    .then(pricingStrategyContract => {
      console.log('attach to pricingStrategy contract')

      if (!pricingStrategyContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const method = pricingStrategyContract.methods.setLastCrowdsale(lastCrowdsale).send({
        gasLimit: gasLimit,
        gasPrice: generalStore.gasPrice
      })

      return sendTXToContract(web3, method)
    })
}

//for mintable token
function setMintAgent (web3, abi, addr, acc, gasLimit) {
  console.log('###setMintAgent:###')

  return attachToContract(web3, abi, addr)
    .then(tokenContract => {
      console.log('attach to token contract')

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const method = tokenContract.methods.setMintAgent(acc, true).send({
        gasLimit: gasLimit,
        gasPrice: generalStore.gasPrice
      })

      return sendTXToContract(web3, method)
    })
}

function addWhiteList (round, web3, tierStore, token, abi, addr) {
  console.log('###whitelist:###')
  let whitelist = []

  for (let i = 0; i <= round; i++) {
    const tier = tierStore.tiers[i]
    const whitelistInput = tier.whitelistInput

    for (let j = 0; j < tier.whitelist.length; j++) {
      let itemIsAdded = false

      for (let k = 0; k < whitelist.length; k++) {
        if (whitelist[k].addr === tier.whitelist[j].addr) {
          itemIsAdded = true
          break
        }
      }

      if (!itemIsAdded) {
        whitelist.push.apply(whitelist, tier.whitelist)
      }
    }

    if (whitelistInput.addr && whitelistInput.min && whitelistInput.max) {
      let itemIsAdded = false

      for (let k = 0; k < whitelist.length; k++) {
        if (whitelist[k].addr === whitelistInput.addr) {
          itemIsAdded = true
          break
        }
      }

      if (!itemIsAdded) {
        whitelist.push({
          'addr': whitelistInput.addr,
          'min': whitelistInput.min,
          'max': whitelistInput.max
        })
      }
    }
  }

  console.log('whitelist:', whitelist)

  if (whitelist.length === 0) {
    return Promise.resolve()
  }

  return attachToContract(web3, abi, addr)
    .then(crowdsaleContract => {
      console.log('attach to crowdsale contract')

      if (!crowdsaleContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      let addrs = []
      let statuses = []
      let minCaps = []
      let maxCaps = []

      for (let i = 0; i < whitelist.length; i++) {
        if (!whitelist[i].deleted) {
          addrs.push(whitelist[i].addr)
          statuses.push(true)
          minCaps.push(whitelist[i].min * 10 ** token.decimals ? toFixed((whitelist[i].min * 10 ** token.decimals).toString()) : 0)
          maxCaps.push(whitelist[i].max * 10 ** token.decimals ? toFixed((whitelist[i].max * 10 ** token.decimals).toString()) : 0)
        }
      }

      console.log('addrs:', addrs)
      console.log('statuses:', minCaps)
      console.log('maxCaps:', maxCaps)

      const method = crowdsaleContract.methods.setEarlyParicipantsWhitelist(addrs, statuses, minCaps, maxCaps).send({
        gasPrice: generalStore.gasPrice
      })

      return sendTXToContract(web3, method)
    })
}

function updateJoinedCrowdsales(web3, abi, addr, joinedContractAddresses, gasLimit) {
  console.log('###updateJoinedCrowdsales:###')

  return attachToContract(web3, abi, addr)
    .then(crowdsaleContract => {
      console.log('attach to crowdsale contract')

      if (!crowdsaleContract) {
        noContractAlert()
        return Promise.reject('no contract available')
      }

      console.log('input:', joinedContractAddresses)

      let method = crowdsaleContract.methods.updateJoinedCrowdsalesMultiple(joinedContractAddresses).send({
        gasLimit: gasLimit,
        gasPrice: generalStore.gasPrice
      })

      return sendTXToContract(web3, method)
    })
}

function setFinalizeAgent (web3, abi, addr, finalizeAgentAddr, gasLimit) {
  console.log('###setFinalizeAgent:###')

  return attachToContract(web3, abi, addr)
    .then(crowdsaleContract => {
      console.log('attach to crowdsale contract')

      if (!crowdsaleContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const method = crowdsaleContract.methods.setFinalizeAgent(finalizeAgentAddr).send({
        gasLimit: gasLimit,
        gasPrice: generalStore.gasPrice
      })

      return sendTXToContract(web3, method)
    })
}

function setReleaseAgent (web3, abi, addr, finalizeAgentAddr, gasLimit) {
  console.log('###setReleaseAgent:###')

  return attachToContract(web3, abi, addr)
    .then(tokenContract => {
      console.log('attach to token contract')

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const method = tokenContract.methods.setReleaseAgent(finalizeAgentAddr).send({
        gasLimit: gasLimit,
        gasPrice: generalStore.gasPrice
      })

      return sendTXToContract(web3, method)
    })
}

export function setReservedTokensListMultiple(web3, abi, addr, token, reservedTokenStore) {
  console.log("###setReservedTokensListMultiple:###");

  return attachToContract(web3, abi, addr)
    .then(tokenContract => {
      console.log("attach to token contract");

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('no contract available')
      }

      let map = {};
      let addrs = []
      let inTokens = []
      let inPercentageUnit = []
      let inPercentageDecimals = [];

      const reservedTokens = reservedTokenStore.tokens

      for (let i = 0; i < reservedTokens.length; i++) {
        if (!reservedTokens[i].deleted) {
          const val = reservedTokens[i].val
          const addr = reservedTokens[i].addr
          const obj = map[addr] ? map[addr] : {}

          if (reservedTokens[i].dim === 'tokens') {
            obj.inTokens = val * 10 ** token.decimals
          } else {
            obj.inPercentageDecimals = countDecimals(val)
            obj.inPercentageUnit = val * 10 ** obj.inPercentageDecimals
          }
          map[addr] = obj
        }
      }

      let keys = Object.keys(map);

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let obj = map[key]

        addrs.push(key)
        inTokens.push(obj.inTokens ? toFixed(obj.inTokens.toString()) : 0)
        inPercentageUnit.push(obj.inPercentageUnit ? obj.inPercentageUnit : 0)
        inPercentageDecimals.push(obj.inPercentageDecimals ? obj.inPercentageDecimals : 0)
      }

      if (addrs.length === 0 && inTokens.length === 0 && inPercentageUnit.length === 0) {
        if (inPercentageDecimals.length === 0) return Promise.resolve()
      }

      let method = tokenContract.methods
        .setReservedTokensListMultiple(addrs, inTokens, inPercentageUnit, inPercentageDecimals)
        .send({gasPrice: generalStore.gasPrice})

      return sendTXToContract(web3, method)
    })
}

export function transferOwnership (web3, abi, addr, finalizeAgentAddr, gasLimit) {
  console.log('###transferOwnership:###')

  return attachToContract(web3, abi, addr)
    .then(tokenContract => {
      console.log('attach to token contract')

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const method = tokenContract.methods.transferOwnership(finalizeAgentAddr).send({
        gasLimit: gasLimit,
        gasPrice: generalStore.gasPrice
      })

      return sendTXToContract(web3, method)
    })
}

export function setLastCrowdsaleRecursive (web3, abi, pricingStrategyAddrs, lastCrowdsale, gasLimit) {
  return pricingStrategyAddrs.reduce((promise, pricingStrategyAddr) => {
    return promise.then(() => setLastCrowdsale(web3, abi, pricingStrategyAddr, lastCrowdsale, gasLimit))
  }, Promise.resolve())
}

export function  setMintAgentRecursive (web3, abi, addr, crowdsaleAddrs, gasLimit) {
  return crowdsaleAddrs.reduce((promise, crowdsaleAddr) => {
    return promise.then(() => setMintAgent(web3, abi, addr, crowdsaleAddr, gasLimit))
  }, Promise.resolve())
}

export function updateJoinedCrowdsalesRecursive (web3, abi, addrs, gasLimit) {
  return addrs.reduce((promise, addr) => {
    return promise.then(() => updateJoinedCrowdsales(web3, abi, addr, addrs, gasLimit))
  }, Promise.resolve())
}

export function addWhiteListRecursive (web3, tierStore, token, abi, crowdsaleAddrs) {
  return crowdsaleAddrs.reduce((promise, crowdsaleAddr, index) => {
    return promise.then(() => addWhiteList(index, web3, tierStore, token, abi, crowdsaleAddr))
  }, Promise.resolve())
}

export function setFinalizeAgentRecursive (web3, abi, addrs, finalizeAgentAddrs, gasLimit) {
  return finalizeAgentAddrs.reduce((promise, finalizeAgentAddr, index) => {
    return promise.then(() => setFinalizeAgent(web3, abi, addrs[index], finalizeAgentAddr, gasLimit))
  }, Promise.resolve())
}

export function setReleaseAgentRecursive (web3, abi, addr, finalizeAgentAddrs, gasLimit) {
  return finalizeAgentAddrs.reduce((promise, finalizeAgentAddr) => {
    return promise.then(() => setReleaseAgent(web3, abi, addr, finalizeAgentAddr, gasLimit))
  }, Promise.resolve())
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

export const handleContractsForFile = (content, index, contractStore, tierStore) => {
  const title = content.value
  const { field } = content
  let fileContent = ''

  if (field !== 'src' && field !== 'abi' && field !== 'addr') {
    const contractField = contractStore[content.child][field]
    let fileBody

    if (isObservableArray(contractField)) {
      fileBody = contractField[index]

      if (!!fileBody) {
        fileContent = title + ' for ' + tierStore.tiers[index].tier + ':**** \n\n' + fileBody
      }
    } else if (!!contractField) {
      fileContent = title + ':**** \n\n' + contractField
    }
  } else {
    fileContent = addSrcToFile(content, index, contractStore, tierStore)
  }

  return fileContent
}

const addSrcToFile = (content, index, contractStore, tierStore) => {
  const title = content.value
  const { field } = content
  const contractField = contractStore[content.child][field]
  let fileContent = ''

  if (isObservableArray(contractField) && field !== 'abi') {
    fileContent = title + ' for ' + tierStore.tiers[index].tier + ': ' + contractField[index]
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
    web3Store.getWeb3((web3) => {
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
