import {
  calculateGasLimit,
  attachToContract,
  getNetWorkNameById,
  getNetworkVersion,
  sendTXToContract,
  getRegistryAddress
} from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'
import { DOWNLOAD_NAME } from '../../utils/constants'
import { isObservableArray } from 'mobx'
import { generalStore, deploymentStore, contractStore, web3Store } from '../../stores'

function setTier (abi, addr, tier) {
  console.log('###setTier for Pricing Strategy:###')

  return attachToContract(abi, addr)
    .then(pricingStrategyContract => {
      console.log('attach to pricingStrategy contract')

      if (!pricingStrategyContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const opts = { gasPrice: generalStore.gasPrice }
      const method = pricingStrategyContract.methods.setTier(tier)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
    })
}

//for mintable token
function setMintAgent (abi, addr, acc) {
  console.log('###setMintAgent:###')

  return attachToContract(abi, addr)
    .then(tokenContract => {
      console.log('attach to token contract')

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const opts = { gasPrice: generalStore.gasPrice }
      const method = tokenContract.methods.setMintAgent(acc, true)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
    })
}

function addWhiteList (round, tierStore, token, abi, addr) {
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

  return attachToContract(abi, addr)
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

      const opts = { gasPrice: generalStore.gasPrice }
      const method = crowdsaleContract.methods.setEarlyParticipantWhitelistMultiple(addrs, statuses, minCaps, maxCaps)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
    })
}

function updateJoinedCrowdsales (abi, addr, joinedContractAddresses) {
  console.log('###updateJoinedCrowdsales:###')

  return attachToContract(abi, addr)
    .then(crowdsaleContract => {
      console.log('attach to crowdsale contract')

      if (!crowdsaleContract) {
        noContractAlert()
        return Promise.reject('no contract available')
      }

      console.log('input:', joinedContractAddresses)

      const opts = { gasPrice: generalStore.gasPrice }
      const method = crowdsaleContract.methods.updateJoinedCrowdsalesMultiple(joinedContractAddresses)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
    })
}

function setFinalizeAgent (abi, addr, finalizeAgentAddr) {
  console.log('###setFinalizeAgent:###')

  return attachToContract(abi, addr)
    .then(crowdsaleContract => {
      console.log('attach to crowdsale contract')

      if (!crowdsaleContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const opts = { gasPrice: generalStore.gasPrice }
      const method = crowdsaleContract.methods.setFinalizeAgent(finalizeAgentAddr)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
    })
}

function setReleaseAgent (abi, addr, finalizeAgentAddr) {
  console.log('###setReleaseAgent:###')

  return attachToContract(abi, addr)
    .then(tokenContract => {
      console.log('attach to token contract')

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const opts = { gasPrice: generalStore.gasPrice }
      const method = tokenContract.methods.setReleaseAgent(finalizeAgentAddr)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
    })
}

export function setReservedTokensListMultiple (abi, addr, token, reservedTokenStore) {
  console.log('###setReservedTokensListMultiple:###')

  return attachToContract(abi, addr)
    .then(tokenContract => {
      console.log('attach to token contract')

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('no contract available')
      }

      let map = {}
      let addrs = []
      let inTokens = []
      let inPercentageUnit = []
      let inPercentageDecimals = []

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

      let keys = Object.keys(map)

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

      const opts = { gasPrice: generalStore.gasPrice }
      const method = tokenContract.methods
        .setReservedTokensListMultiple(addrs, inTokens, inPercentageUnit, inPercentageDecimals)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('setReservedTokens'))
    })
}

export function transferOwnership (abi, addr, finalizeAgentAddr) {
  console.log('###transferOwnership:###')

  return attachToContract(abi, addr)
    .then(tokenContract => {
      console.log('attach to token contract')

      if (!tokenContract) {
        noContractAlert()
        return Promise.reject('No contract available')
      }

      const opts = { gasPrice: generalStore.gasPrice }
      const method = tokenContract.methods.transferOwnership(finalizeAgentAddr)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('transferOwnership'))
    })
}

export function registerCrowdsaleAddress () {
  console.log('###registerCrowdsaleAddress:###')
  const { web3 } = web3Store
  const toJS = x => JSON.parse(JSON.stringify(x))

  const registryAbi = contractStore.registry.abi
  const crowdsaleAddress = contractStore.crowdsale.addr[0]

  const whenRegistryAddress = getRegistryAddress()

  const whenAccount = web3.eth.getAccounts()
    .then((accounts) => accounts[0])

  return Promise.all([whenRegistryAddress, whenAccount])
    .then(([registryAddress, account]) => {
      const registry = new web3.eth.Contract(toJS(registryAbi), registryAddress)


      const opts = { gasPrice: generalStore.gasPrice, from: account }
      const method = registry.methods.add(crowdsaleAddress)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
    })

    .then(() => deploymentStore.setAsSuccessful('registerCrowdsaleAddress'))
}

export function setTierRecursive (abi, pricingStrategyAddrs, tiers) {
  return pricingStrategyAddrs.reduce((promise, pricingStrategyAddr, index) => {
    return promise
      .then(() => setTier(abi, pricingStrategyAddr, tiers[index]))
      .then(() => deploymentStore.setAsSuccessful('tier'))
  }, Promise.resolve())
}

export function setMintAgentRecursive (abi, addr, crowdsaleAddrs, txName) {
  return crowdsaleAddrs.reduce((promise, crowdsaleAddr) => {
    return promise
      .then(() => setMintAgent(abi, addr, crowdsaleAddr))
      .then(() => deploymentStore.setAsSuccessful(txName))
  }, Promise.resolve())
}

export function updateJoinedCrowdsalesRecursive (abi, addrs) {
  return addrs.reduce((promise, addr) => {
    return promise
      .then(() => updateJoinedCrowdsales(abi, addr, addrs))
      .then(() => deploymentStore.setAsSuccessful('updateJoinedCrowdsales'))
  }, Promise.resolve())
}

export function addWhiteListRecursive (tierStore, token, abi, crowdsaleAddrs) {
  return crowdsaleAddrs.reduce((promise, crowdsaleAddr, index) => {
    return promise
      .then(() => addWhiteList(index, tierStore, token, abi, crowdsaleAddr))
      .then(() => deploymentStore.setAsSuccessful('whitelist'))
  }, Promise.resolve())
}

export function setFinalizeAgentRecursive (abi, addrs, finalizeAgentAddrs) {
  return finalizeAgentAddrs.reduce((promise, finalizeAgentAddr, index) => {
    return promise
      .then(() => setFinalizeAgent(abi, addrs[index], finalizeAgentAddr))
      .then(() => deploymentStore.setAsSuccessful('setFinalizeAgent'))
  }, Promise.resolve())
}

export function setReleaseAgentRecursive (abi, addr, finalizeAgentAddrs) {
  return finalizeAgentAddrs.reduce((promise, finalizeAgentAddr) => {
    return promise
      .then(() => setReleaseAgent(abi, addr, finalizeAgentAddr))
      .then(() => deploymentStore.setAsSuccessful('setReleaseAgent'))
  }, Promise.resolve())
}

export const handlerForFile = (content, type) => {
  const checkIfTime = content.field === 'startTime' || content.field === 'endTime'
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

export function scrollToBottom () {
  window.scrollTo(0, document.body.scrollHeight)
}

export function getDownloadName (tokenAddress) {
  return new Promise(resolve => {
    const whenNetworkName = getNetworkVersion()
      .then((networkId) => {
        let networkName = getNetWorkNameById(networkId)

        if (!networkName) {
          networkName = String(networkId)
        }

        return networkName
      })
      .then((networkName) => `${DOWNLOAD_NAME}_${networkName}_${tokenAddress}`)

    resolve(whenNetworkName)
  })
}

var countDecimals = function (inputFloat) {
  if (Math.floor(inputFloat) === parseFloat(inputFloat)) return 0
  return inputFloat.toString().split('.')[1].length || 0
}
