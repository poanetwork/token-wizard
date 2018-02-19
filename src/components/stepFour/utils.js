import {
  attachToContract,
  calculateGasLimit,
  deployContract,
  getNetWorkNameById,
  getNetworkVersion,
  getRegistryAddress,
  sendTXToContract
} from '../../utils/blockchainHelpers'
import { noContractAlert, noContractDataAlert } from '../../utils/alerts'
import { countDecimalPlaces, floorToDecimals, toFixed } from '../../utils/utils'
import { CONTRACT_TYPES, DOWNLOAD_NAME, TRUNC_TO_DECIMALS } from '../../utils/constants'
import { isObservableArray } from 'mobx'
import {
  contractStore,
  deploymentStore,
  generalStore,
  reservedTokenStore,
  tierStore,
  tokenStore,
  web3Store
} from '../../stores'
import { getEncodedABIClientSide } from '../../utils/microservices'

export const setupContractDeployment = () => {
  if (!contractStore.safeMathLib) {
    noContractDataAlert()
    return Promise.reject('no contract data')
  }

  const tokenABI = contractStore.token.abi || []
  const tokenAddr = contractStore.token.addr || null
  const pricingStrategyABI = contractStore.pricingStrategy.abi || []

  const whenTokenABIConstructor = Promise.resolve(tokenAddr)
    .then(tokenAddr => {
      if (!tokenAddr) {
        return getEncodedABIClientSide(tokenABI, [], 0)
          .then(ABIEncoded => {
            console.log('token ABI Encoded params constructor:', ABIEncoded)
            contractStore.setContractProperty('token', 'abiConstructor', ABIEncoded)
          })
      }
    })

  const whenPricingStrategyContract = tierStore.tiers.map((value, index) => {
    return getEncodedABIClientSide(pricingStrategyABI, [], index)
      .then(ABIEncoded => {
        console.log('pricingStrategy ABI Encoded params constructor:', ABIEncoded)
        const newContract = contractStore.pricingStrategy.abiConstructor.concat(ABIEncoded)
        contractStore.setContractProperty('pricingStrategy', 'abiConstructor', newContract)
      })
  })

  return Promise.all([whenTokenABIConstructor, ...whenPricingStrategyContract])
}

export const buildDeploymentSteps = () => {
  const stepFnCorrelation = {
    safeMathLibrary: deploySafeMathLibrary,
    token: deployToken,
    pricingStrategy: deployPricingStrategy,
    crowdsale: deployCrowdsale,
    registerCrowdsaleAddress: registerCrowdsaleAddress,
    finalizeAgent: deployFinalizeAgent,
    tier: setTier,
    setReservedTokens: setReservedTokensListMultiple,
    updateJoinedCrowdsales: updateJoinedCrowdsales,
    setMintAgentCrowdsale: setMintAgentForCrowdsale,
    setMintAgentFinalizeAgent: setMintAgentForFinalizeAgent,
    whitelist: addWhitelist,
    setFinalizeAgent: setFinalizeAgent,
    setReleaseAgent: setReleaseAgent,
    transferOwnership: transferOwnership,
  }

  let list = []

  deploymentStore.txMap.forEach((steps, name) => {
    if (steps.length) {
      list = list.concat(stepFnCorrelation[name]())
    }
  })

  return list
}

export const deploySafeMathLibrary = () => {
  return [
    () => {
      const binSafeMathLib = contractStore.safeMathLib.bin || ''
      const abiSafeMathLib = contractStore.safeMathLib.abi || []

      console.log('***Deploy safeMathLib contract***')

      return deployContract(abiSafeMathLib, binSafeMathLib, [])
        .then(safeMathLibAddr => {
          contractStore.setContractProperty('safeMathLib', 'addr', safeMathLibAddr)

          try {
            Object.keys(contractStore)
              .filter(key => contractStore[key] !== undefined)
              .forEach(key => {
                if (contractStore[key].bin) {
                  const strToReplace = '__:SafeMathLibExt_______________________'
                  const newBin = window.reaplaceAll(strToReplace, safeMathLibAddr.substr(2), contractStore[key].bin)
                  contractStore.setContractProperty(key, 'bin', newBin)
                }
              })
            deploymentStore.setAsSuccessful('safeMathLibrary')
            return Promise.resolve()

          } catch (e) {
            return Promise.reject(e)
          }
        })
    }
  ]
}

const getTokenParams = token => {
  const whitelistWithGlobalMinCap = tierStore.tiers[0].whitelistEnabled !== 'yes' && tierStore.globalMinCap
  const minCap = whitelistWithGlobalMinCap ? toFixed(tierStore.globalMinCap * 10 ** token.decimals).toString() : 0

  return [
    token.name,
    token.ticker,
    parseInt(token.supply, 10),
    parseInt(token.decimals, 10),
    true,
    minCap
  ]
}

export const deployToken = () => {
  return [
    () => {
      const abiToken = contractStore.token.abi || []
      const binToken = contractStore.token.bin || ''
      const paramsToken = getTokenParams(tokenStore)

      return deployContract(abiToken, binToken, paramsToken)
        .then(tokenAddr => contractStore.setContractProperty('token', 'addr', tokenAddr))
        .then(() => deploymentStore.setAsSuccessful('token'))
    }
  ]
}

const getPricingStrategyParams = tier => {
  const oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, 1 / tier.rate)

  return [
    web3Store.web3.utils.toWei(oneTokenInETH, 'ether')
  ]
}

export const deployPricingStrategy = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const abiPricingStrategy = contractStore.pricingStrategy.abi || []
      const binPricingStrategy = contractStore.pricingStrategy.bin || ''
      const abiCrowdsale = contractStore.crowdsale.abi || []

      const paramsPricingStrategy = getPricingStrategyParams(tier)

      return deployContract(abiPricingStrategy, binPricingStrategy, paramsPricingStrategy)
        .then(pricingStrategyAddr => contractStore.pricingStrategy.addr.concat(pricingStrategyAddr))
        .then(newPricingStrategy => contractStore.setContractProperty('pricingStrategy', 'addr', newPricingStrategy))
        .then(() => getEncodedABIClientSide(abiCrowdsale, [], index, true))
        .then(ABIEncoded => contractStore.crowdsale.abiConstructor.concat(ABIEncoded))
        .then(newContract => contractStore.setContractProperty('crowdsale', 'abiConstructor', newContract))
        .then(() => deploymentStore.setAsSuccessful('pricingStrategy'))
    }
  })
}

const getCrowdSaleParams = index => {
  const { walletAddress, whitelistEnabled } = tierStore.tiers[0]
  const { updatable, supply, tier, startTime, endTime } = tierStore.tiers[index]

  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())

  return [
    tier,
    contractStore.token.addr,
    contractStore.pricingStrategy.addr[index],
    walletAddress,
    formatDate(startTime),
    formatDate(endTime),
    toFixed('0'),
    toFixed(parseInt(supply, 10) * 10 ** parseInt(tokenStore.decimals, 10)).toString(),
    updatable === 'on',
    whitelistEnabled === 'yes'
  ]
}

export const deployCrowdsale = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const { whitelistwithcap } = CONTRACT_TYPES

      return getNetworkVersion()
        .then(networkID => contractStore.setContractProperty('crowdsale', 'networkID', networkID))
        .then(() => {
          const abiCrowdsale = contractStore.crowdsale.abi || []
          const binCrowdsale = contractStore.crowdsale.bin || ''
          const paramsCrowdsale = contractStore.contractType === whitelistwithcap ? getCrowdSaleParams(index) : undefined

          return deployContract(abiCrowdsale, binCrowdsale, paramsCrowdsale)
        })
        .then(crowdsaleAddr => {
          console.log('***Deploy crowdsale contract***', index, crowdsaleAddr)

          const newCrowdsaleAddr = contractStore.crowdsale.addr.concat(crowdsaleAddr)
          contractStore.setContractProperty('crowdsale', 'addr', newCrowdsaleAddr)
        })
        .then(() => deploymentStore.setAsSuccessful('crowdsale'))
    }
  })
}

function registerCrowdsaleAddress () {
  return [
    () => {
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
  ]
}

const getNullFinalizeAgentParams = index => {
  return [
    contractStore.crowdsale.addr[index]
  ]
}

const getFinalizeAgentParams = index => {
  return [
    contractStore.token.addr,
    contractStore.crowdsale.addr[index]
  ]
}

export const deployFinalizeAgent = () => {
  return tierStore.tiers.map((tier, index, tiers) => {
    return () => {
      let abi, bin, paramsFinalizeAgent

      if (index === tiers.length - 1) {
        paramsFinalizeAgent = getFinalizeAgentParams(index)
        abi = contractStore.finalizeAgent.abi || []
        bin = contractStore.finalizeAgent.bin || ''
      } else {
        paramsFinalizeAgent = getNullFinalizeAgentParams(index)
        abi = contractStore.nullFinalizeAgent.abi || []
        bin = contractStore.nullFinalizeAgent.bin || ''
      }

      return getEncodedABIClientSide(abi, [], index)
        .then(ABIEncoded => {
          console.log('finalizeAgent ABI encoded params constructor:', ABIEncoded)

          const newAbi = contractStore.finalizeAgent.abiConstructor.concat(ABIEncoded)
          contractStore.setContractProperty('finalizeAgent', 'abiConstructor', newAbi)
        })
        .then(() => deployContract(abi, bin, paramsFinalizeAgent))
        .then(finalizeAgentAddr => {
          console.log('***Deploy finalize agent contract***', finalizeAgentAddr)

          const newAddr = contractStore.finalizeAgent.addr.concat(finalizeAgentAddr)
          contractStore.setContractProperty('finalizeAgent', 'addr', newAddr)
        })
        .then(() => deploymentStore.setAsSuccessful('finalizeAgent'))
    }
  })
}

export const setTier = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      console.log('###setTier for Pricing Strategy:###')

      const pricingStrategyAddr = contractStore.pricingStrategy.addr[index]
      const pricingStrategyABI = contractStore.pricingStrategy.abi.slice()
      const tierAddr = contractStore.crowdsale.addr[index]

      return attachToContract(pricingStrategyABI, pricingStrategyAddr)
        .then(pricingStrategyContract => {
          console.log('attach to pricingStrategy contract')

          const opts = { gasPrice: generalStore.gasPrice }
          const method = pricingStrategyContract.methods.setTier(tierAddr)

          return method.estimateGas(opts)
            .then(estimatedGas => {
              opts.gasLimit = calculateGasLimit(estimatedGas)
              return sendTXToContract(method.send(opts))
            })
        })
        .then(() => deploymentStore.setAsSuccessful('tier'))
    }
  })

}

export const setMintAgentForCrowdsale = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const abi = contractStore.token.abi.slice()
      const addr = contractStore.token.addr
      const acc = contractStore.crowdsale.addr[index]

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
        .then(() => deploymentStore.setAsSuccessful('setMintAgentCrowdsale'))
    }
  })
}

export const setMintAgentForFinalizeAgent = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const abi = contractStore.token.abi.slice()
      const addr = contractStore.token.addr
      const acc = contractStore.finalizeAgent.addr[index]

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
        .then(() => deploymentStore.setAsSuccessful('setMintAgentFinalizeAgent'))
    }
  })
}

export const addWhitelist = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const round = index
      const abi = contractStore.crowdsale.abi.slice()
      const addr = contractStore.crowdsale.addr[index]

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
              minCaps.push(whitelist[i].min * 10 ** tokenStore.decimals ? toFixed((whitelist[i].min * 10 ** tokenStore.decimals).toString()) : 0)
              maxCaps.push(whitelist[i].max * 10 ** tokenStore.decimals ? toFixed((whitelist[i].max * 10 ** tokenStore.decimals).toString()) : 0)
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
        .then(() => deploymentStore.setAsSuccessful('whitelist'))
    }

  })
}

export const updateJoinedCrowdsales = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const joinedContractAddresses = contractStore.crowdsale.addr
      const abi = contractStore.crowdsale.abi.slice()

      console.log('###updateJoinedCrowdsales:###')

      return attachToContract(abi, joinedContractAddresses[index])
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
        .then(() => deploymentStore.setAsSuccessful('updateJoinedCrowdsales'))
    }
  })
}

export const setFinalizeAgent = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const abi = contractStore.crowdsale.abi.slice()
      const finalizeAgentAddr = contractStore.finalizeAgent.addr[index]
      const crowdsaleAddr = contractStore.crowdsale.addr[index]

      console.log('###setFinalizeAgent:###')

      return attachToContract(abi, crowdsaleAddr)
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
        .then(() => deploymentStore.setAsSuccessful('setFinalizeAgent'))
    }
  })
}

export const setReleaseAgent = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const abi = contractStore.token.abi.slice()
      const addr = contractStore.token.addr
      const finalizeAgentAddr = contractStore.finalizeAgent.addr[index]

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
        .then(() => deploymentStore.setAsSuccessful('setReleaseAgent'))
    }
  })
}

export const setReservedTokensListMultiple = () => {
  return [() => {
    const abi = contractStore.token.abi.slice()
    const addr = contractStore.token.addr

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
              obj.inTokens = val * 10 ** tokenStore.decimals
            } else {
              obj.inPercentageDecimals = countDecimalPlaces(val)
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
      })
      .then(() => deploymentStore.setAsSuccessful('setReservedTokens'))
  }]
}

export const transferOwnership = () => {
  return [() => {
    const abi = contractStore.token.abi.slice()
    const addr = contractStore.token.addr
    const finalizeAgentAddr = tierStore.tiers[0].walletAddress

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
      })
      .then(() => deploymentStore.setAsSuccessful('transferOwnership'))
  }]
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
