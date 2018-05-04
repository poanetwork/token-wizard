import {
  calculateGasLimit,
  getNetWorkNameById,
  getNetworkVersion,
  sendTXToContract,
  methodToExec,
  methodToInitAppInstanceFromRegistry,
  methodToInitAndFinalize,
  methodToInitAppInstance
} from '../../utils/blockchainHelpers'
//import { noContractAlert } from '../../utils/alerts'
import { countDecimalPlaces, toFixed } from '../../utils/utils'
import { DOWNLOAD_NAME, CROWDSALE_STRATEGIES } from '../../utils/constants'
import { isObservableArray } from 'mobx'
import {
  contractStore,
  crowdsaleStore,
  deploymentStore,
  generalStore,
  reservedTokenStore,
  tierStore,
  tokenStore,
  web3Store
} from '../../stores'
//import { getEncodedABIClientSide } from '../../utils/microservices'
import { BigNumber } from 'bignumber.js'
import { toBigNumber } from '../crowdsale/utils'

export const buildDeploymentSteps = (web3) => {
  let stepFnCorrelation
  switch (crowdsaleStore.strategy) {
    case CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE:
      stepFnCorrelation = {
        crowdsaleCreate: deployCrowdsale,
        token: initializeToken,
        setReservedTokens: setReservedTokensListMultiple,
        updateGlobalMinContribution: updateGlobalMinContribution,
        createCrowdsaleTiers: createCrowdsaleTiers,
        whitelist: addWhitelist,
        crowdsaleInit: initializeCrowdsale,
      }
      break;
    case CROWDSALE_STRATEGIES.DUTCH_AUCTION:
      stepFnCorrelation = {
        crowdsaleCreate: deployDutchAuctionCrowdsale,
        token: initializeToken,
        updateGlobalMinContribution: updateGlobalMinContribution,
        whitelist: addWhitelist,
        crowdsaleInit: initializeCrowdsale,
      }
      break;
    default:
      stepFnCorrelation = {}
      break;
  }

  let list = []

  deploymentStore.txMap.forEach((steps, name) => {
    if (steps.length) {
      list = list.concat(stepFnCorrelation[name]())
    }
  })

  return list
}

const getCrowdSaleParams = (account, methodInterface) => {
  const { web3 } = web3Store
  const { walletAddress, whitelistEnabled, updatable, supply, tier, startTime, endTime, rate } = tierStore.tiers[0]

  BigNumber.config({ DECIMAL_PLACES: 18 })
  console.log(tierStore.tiers[0])

  //tier 0 oneTokenInWEI
  const rateBN = new BigNumber(rate)
  const oneTokenInETH = rateBN.pow(-1).toFixed()
  const oneTokenInWEI = web3.utils.toWei(oneTokenInETH, 'ether')

  //tier 0 duration
  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())
  const duration = formatDate(endTime) - formatDate(startTime)
  const durationBN = toBigNumber(duration).toFixed()

  //is tier 0 whitelisted?
  const isWhitelisted = whitelistEnabled === 'yes'

  //is tier updatable
  const isUpdatable = updatable === 'on'

  // tie 0 name bytes32
  const tierNameBytes = web3.utils.fromAscii(tier)
  const encodedTierName = web3.eth.abi.encodeParameter("bytes32", tierNameBytes)

  //tier 0 supply
  const supplyBN = toBigNumber(supply).times(`1e${tokenStore.decimals}`).toFixed()

  let paramsCrowdsale = [
    walletAddress,
    formatDate(startTime),
    encodedTierName,
    oneTokenInWEI,
    durationBN,
    supplyBN,
    isWhitelisted,
    isUpdatable,
    account
  ]

  console.log("paramsCrowdsale:", paramsCrowdsale)

  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, paramsCrowdsale);
  return encodedParameters;
}

export const deployCrowdsale = () => {
  console.log("###deploy crowdsale###")
  const { web3 } = web3Store
  return [
    () => {
      return getNetworkVersion()
      .then((networkID) => {
        contractStore.setContractProperty('crowdsale', 'networkID', networkID)

        return web3.eth.getAccounts()
          .then((accounts) => accounts[0])
          .then((account) => {
            contractStore.setContractProperty('crowdsale', 'account', account)

            const methodInterface = ["address","uint256","bytes32","uint256","uint256","uint256","bool","bool","address"]

            let params = [ account, methodInterface ];

            const methodInterfaceStr = `init(${methodInterface.join(',')})`

            let method = methodToInitAppInstance(
              methodInterfaceStr,
              getCrowdSaleParams,
              params,
              process.env['REACT_APP_MINTED_CAPPED_CROWDSALE_APP_NAME']
            )
            /*const target = "initCrowdsaleMintedCapped"
            let method = methodToInitAppInstanceFromRegistry(
              methodInterfaceStr,
              target,
              getCrowdSaleParams,
              params
            )*/
            /*let method = methodToInitAndFinalize(
              methodInterfaceStr,
              target,
              getCrowdSaleParams,
              params
            )*/

            const opts = { gasPrice: generalStore.gasPrice, from: account }
            console.log("opts:", opts)

            return method.estimateGas(opts)
              .then(estimatedGas => {
                opts.gasLimit = calculateGasLimit(estimatedGas)
                return sendTXToContract(method.send(opts))
                  .then((receipt) => {
                    console.log("receipt:", receipt)
                    let logs = receipt.logs;
                    let events = receipt.events;
                    if (events) {
                      console.log("events:", events)
                      if (events.ApplicationFinalization) {
                        getExecutionIDFromEvent(events, "ApplicationFinalization");
                      } else if (events.AppInstanceCreated) {
                        getExecutionIDFromEvent(events, "AppInstanceCreated");
                      } else if (events.ApplicationInitialized) {
                        getExecutionIDFromEvent(events, "ApplicationInitialized");
                      }
                    } else if (logs) {
                      console.log("logs:")
                      console.log(logs)

                      let lastLog = logs.reduce(function(log, current) {
                        console.log(log)
                        console.log(current.topics)
                        console.log(current.logIndex)
                        if (!log) {
                          return log = current;
                        }
                        if (current.logIndex > log.logIndex) {
                          log = current;
                        }
                        return log
                      }, 0)
                      if (lastLog) {
                        if (lastLog.topics) {
                          if (lastLog.topics.length > 1) {
                            let execID = lastLog.topics[2]
                            console.log("exec_id", execID)
                            contractStore.setContractProperty('crowdsale', 'execID', execID)
                          }
                        }
                      }
                    }
                  })
                  .then(() => deploymentStore.setAsSuccessful('crowdsaleCreate'))
              })
          })
      })
    }
  ]
}

const getDutchAuctionCrowdSaleParams = (account, methodInterface) => {
  const { web3 } = web3Store
  const { walletAddress, supply, startTime, endTime, minRate, maxRate, whitelistEnabled } = tierStore.tiers[0]

  BigNumber.config({ DECIMAL_PLACES: 18 })
  console.log(tierStore.tiers[0])

  //Dutch Auction crowdsale minOneTokenInWEI
  const minRateBN = new BigNumber(minRate)
  const minOneTokenInETH = minRateBN.pow(-1).toFixed()
  const minOneTokenInWEI = web3.utils.toWei(minOneTokenInETH, 'ether')

  //Dutch Auction crowdsale maxOneTokenInWEI
  const maxRateBN = new BigNumber(maxRate)
  const maxOneTokenInETH = maxRateBN.pow(-1).toFixed()
  const maxOneTokenInWEI = web3.utils.toWei(maxOneTokenInETH, 'ether')

  //Dutch Auction crowdsale duration
  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())
  const duration = formatDate(endTime) - formatDate(startTime)
  const durationBN = toBigNumber(duration).toFixed()

  //token supply
  const tokenSupplyBN = toBigNumber(tokenStore.supply).times(`1e${tokenStore.decimals}`).toFixed()

  //Dutch Auction crowdsale supply
  const crowdsaleSupplyBN = toBigNumber(supply).times(`1e${tokenStore.decimals}`).toFixed()

  //is Dutch Auction crowdsale whitelisted?
  const isWhitelisted = whitelistEnabled === 'yes'

  let paramsCrowdsale = [
    walletAddress,
    tokenSupplyBN,
    crowdsaleSupplyBN,
    minOneTokenInWEI,
    maxOneTokenInWEI,
    durationBN,
    formatDate(startTime),
    isWhitelisted,
    account
  ]

  console.log("paramsCrowdsale:", paramsCrowdsale)

  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, paramsCrowdsale);
  return encodedParameters;
}

export const deployDutchAuctionCrowdsale = () => {
  console.log("###deploy Dutch Auction crowdsale###")
  const { web3 } = web3Store
  return [
    () => {
      return getNetworkVersion()
      .then((networkID) => {
        contractStore.setContractProperty('crowdsale', 'networkID', networkID)

        return web3.eth.getAccounts()
          .then((accounts) => accounts[0])
          .then((account) => {
            contractStore.setContractProperty('crowdsale', 'account', account)

            const methodInterface = ["address","uint256","uint256","uint256","uint256","uint256","uint256","bool","address"]

            let params = [ account, methodInterface ];

            const methodInterfaceStr = `init(${methodInterface.join(',')})`

            let method = methodToInitAppInstance(
              methodInterfaceStr,
              getDutchAuctionCrowdSaleParams,
              params,
              process.env['REACT_APP_DUTCH_CROWDSALE_APP_NAME']
            )
            /*const target = "initCrowdsaleDutchAuction"
            let method = methodToInitAppInstanceFromRegistry(
              methodInterfaceStr,
              target,
              getCrowdSaleParams,
              params
            )*/
            /*let method = methodToInitAndFinalize(
              methodInterfaceStr,
              target,
              getCrowdSaleParams,
              params
            )*/

            const opts = { gasPrice: generalStore.gasPrice, from: account }
            console.log("opts:", opts)

            return method.estimateGas(opts)
              .then(estimatedGas => {
                opts.gasLimit = calculateGasLimit(estimatedGas)
                return sendTXToContract(method.send(opts))
                  .then((receipt) => {
                    console.log("receipt:", receipt)
                    let logs = receipt.logs;
                    let events = receipt.events;
                    if (events) {
                      console.log("events:", events)
                      if (events.ApplicationFinalization) {
                        getExecutionIDFromEvent(events, "ApplicationFinalization");
                      } else if (events.AppInstanceCreated) {
                        getExecutionIDFromEvent(events, "AppInstanceCreated");
                      } else if (events.ApplicationInitialized) {
                        getExecutionIDFromEvent(events, "ApplicationInitialized");
                      }
                    } else if (logs) {
                      console.log("logs:")
                      console.log(logs)

                      let lastLog = logs.reduce(function(log, current) {
                        console.log(log)
                        console.log(current.topics)
                        console.log(current.logIndex)
                        if (!log) {
                          return log = current;
                        }
                        if (current.logIndex > log.logIndex) {
                          log = current;
                        }
                        return log
                      }, 0)
                      if (lastLog) {
                        if (lastLog.topics) {
                          if (lastLog.topics.length > 1) {
                            let execID = lastLog.topics[2]
                            console.log("exec_id", execID)
                            contractStore.setContractProperty('crowdsale', 'execID', execID)
                          }
                        }
                      }
                    }
                  })
                  .then(() => deploymentStore.setAsSuccessful('crowdsaleCreate'))
              })
          })
      })
    }
  ]
}

const getExecutionIDFromEvent = (events, eventName) => {
  console.log("eventName:", events[eventName])
  if (events[eventName].returnValues) {
    console.log("returnValues:", events[eventName].returnValues)
    let exec_id;
    if (events[eventName].returnValues.execution_id)
      exec_id = events[eventName].returnValues.execution_id
    else if (events[eventName].returnValues.exec_id) {
      exec_id = events[eventName].returnValues.exec_id
    }
    console.log("execution_id", exec_id)
    contractStore.setContractProperty('crowdsale', 'execID', exec_id)
  }
}

export const generateContext = (weiToSend) => {
  const { web3 } = web3Store
  let { account, execID } = contractStore.crowdsale;
  console.log(account, execID);
  let paramsContext = [execID, account, weiToSend];
  let context = web3.eth.abi.encodeParameters(["bytes32","address","uint256"], paramsContext);
  console.log("context:", context)
  return context;
}

const getTokenParams = (token, methodInterface) => {
  const { web3 } = web3Store

  let paramsToken = [
    web3.utils.fromAscii(token.name),
    web3.utils.fromAscii(token.ticker),
    parseInt(token.decimals, 10)
  ]
  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsToken, context]);
  return encodedParameters;
}

export const initializeToken = () => {
  console.log("###initialize token###")
  return [
    () => {
      return getNetworkVersion()
      .then((networkID) => {

        const methodInterface = ["bytes32","bytes32","uint256","bytes"]

        console.log("contractStore.crowdsale.account: ", contractStore.crowdsale.account)
        let account = contractStore.crowdsale.account;

        const targetPrefix = "crowdsaleConsole"
        const targetSuffix = crowdsaleStore.contractTargetSuffix
        const target = `${targetPrefix}${targetSuffix}`

        let paramsToExec = [tokenStore, methodInterface]
        const method = methodToExec("scriptExec", `initCrowdsaleToken(${methodInterface.join(',')})`, target, getTokenParams, paramsToExec)

        const opts = { gasPrice: generalStore.gasPrice, from: account }
        console.log("opts:", opts)

        return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
            .then((receipt) => {
              console.log(receipt)
            })
            .then(() => deploymentStore.setAsSuccessful('token'))
        })
      })
    }
  ]
}

const getReservedTokensParams = (addrs, inTokens, inPercentageUnit, inPercentageDecimals, methodInterface) => {
  const { web3 } = web3Store

  let paramsReservedTokens = [
    addrs,
    inTokens,
    inPercentageUnit,
    inPercentageDecimals
  ]
  console.log("paramsReservedTokens:",paramsReservedTokens)

  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsReservedTokens, context]);
  return encodedParameters;
}

export const setReservedTokensListMultiple = () => {
  console.log('###setReservedTokensListMultiple:###')
  return [
    () => {
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
            obj.inTokens = toBigNumber(val).times(`1e${tokenStore.decimals}`).toFixed()
          } else {
            obj.inPercentageDecimals = countDecimalPlaces(val)
            obj.inPercentageUnit = toBigNumber(val).times(`1e${obj.inPercentageDecimals}`).toFixed()
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

      let account = contractStore.crowdsale.account;
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      const methodInterface = ["address[]","uint256[]","uint256[]","uint256[]","bytes"]

      let paramsToExec = [addrs, inTokens, inPercentageUnit, inPercentageDecimals, methodInterface]
      const method = methodToExec("scriptExec", `updateMultipleReservedTokens(${methodInterface.join(',')})`, "tokenConsoleMintedCapped", getReservedTokensParams, paramsToExec)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('setReservedTokens'))
    }]
}

const getInitializeCrowdsaleParams = (token) => {
  const { web3 } = web3Store
  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(["bytes"], [context]);
  return encodedParameters;
}

export const initializeCrowdsale = () => {
  console.log("###initialize crowdsale###")
  return [
    () => {
      return getNetworkVersion()
      .then((networkID) => {

        let account = contractStore.crowdsale.account;

        const targetPrefix = "crowdsaleConsole"
        const targetSuffix = crowdsaleStore.contractTargetSuffix
        const target = `${targetPrefix}${targetSuffix}`

        let paramsToExec = [tokenStore]
        const method = methodToExec("scriptExec", "initializeCrowdsale(bytes)", target, getInitializeCrowdsaleParams, paramsToExec)

        const opts = { gasPrice: generalStore.gasPrice, from: account }
        console.log("opts:", opts)

        return method.estimateGas(opts)
          .then(estimatedGas => {
            opts.gasLimit = calculateGasLimit(estimatedGas)
            return sendTXToContract(method.send(opts))
              .then((receipt) => {
                console.log(receipt)
              })
              .then(() => deploymentStore.setAsSuccessful('crowdsaleInit'))
          })
      })
    }
  ]
}

const getTiersParams = (methodInterface) => {
  const { web3 } = web3Store

  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())

  let whitelistEnabledArr = []
  let updatableArr = []
  let rateArr = []
  let supplyArr = []
  let tierNameArr = []
  let durationArr = []
  for (let tierIndex = 1; tierIndex < tierStore.tiers.length; tierIndex++) {
    let { whitelistEnabled } = tierStore.tiers[0]
    let { updatable, rate, supply, tier, startTime, endTime } = tierStore.tiers[tierIndex]
    let duration = formatDate(endTime) - formatDate(startTime)
    let tierNameBytes = web3.utils.fromAscii(tier)
    let encodedTierName = web3.eth.abi.encodeParameter("bytes32", tierNameBytes);
    const rateBN = new BigNumber(rate)
    const oneTokenInETH = rateBN.pow(-1).toFixed()
    durationArr.push(duration)
    tierNameArr.push(encodedTierName)
    rateArr.push(web3.utils.toWei(oneTokenInETH, 'ether'))
    supplyArr.push(toBigNumber(supply).times(`1e${tokenStore.decimals}`).toFixed())
    updatableArr.push(updatable === 'on')
    whitelistEnabledArr.push(whitelistEnabled === 'yes')
  }
  let paramsTiers = [
    tierNameArr,
    durationArr,
    rateArr,
    supplyArr,
    updatableArr,
    whitelistEnabledArr
  ]
  console.log("paramsTiers:", paramsTiers)

  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsTiers, context]);
  return encodedParameters;
}

export const createCrowdsaleTiers = () => {
  return [
    () => {
      console.log('###createCrowdsaleTiers:###')

      const methodInterface = ["bytes32[]", "uint256[]", "uint256[]", "uint256[]", "bool[]", "bool[]","bytes"]

      let paramsToExec = [methodInterface]
      const method = methodToExec("scriptExec", `createCrowdsaleTiers(${methodInterface.join(',')})`, "crowdsaleConsoleMintedCapped", getTiersParams, paramsToExec)

      let account = contractStore.crowdsale.account;
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('createCrowdsaleTiers'))
    }
  ]
}

const getWhitelistsParams = (tierIndex, addrs, minCaps, maxCaps, methodInterface) => {
  const { web3 } = web3Store

  let paramsWhitelist = [
    tierIndex,
    addrs,
    minCaps,
    maxCaps
  ]
  console.log("paramsWhitelist:", paramsWhitelist)

  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsWhitelist, context]);
  return encodedParameters;
}

export const addWhitelist = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      console.log('###addWhitelist:###')
      //const round = index

      let whitelist = []
      whitelist.push.apply(whitelist, tier.whitelist)

      console.log('whitelist:', whitelist)

      if (whitelist.length === 0) {
        return Promise.resolve()
      }

      let addrs = []
      let minCaps = []
      let maxCaps = []

      const { web3 } = web3Store
      const { rate } = tierStore.tiers[index]
      const rateBN = new BigNumber(rate)
      const oneTokenInETH = rateBN.pow(-1).toFixed()
      const oneTokenInWEI = web3.utils.toWei(oneTokenInETH, 'ether')

      for (let i = 0; i < whitelist.length; i++) {
        addrs.push(whitelist[i].addr)
        let whitelistMin = toBigNumber(whitelist[i].min).times(`1e${tokenStore.decimals}`).toFixed() // in tokens, token do have decimals accounted
        let whitelistMax = toBigNumber(whitelist[i].max).times(oneTokenInWEI).toFixed() // in wei
        minCaps.push(whitelistMin ? whitelistMin.toString() : 0)
        maxCaps.push(whitelistMax ? whitelistMax.toString() : 0)
      }

      console.log('addrs:', addrs)
      console.log('minCaps:', minCaps)
      console.log('maxCaps:', maxCaps)

      let account = contractStore.crowdsale.account;
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      const targetPrefix = "crowdsaleConsole"
      const targetSuffix = crowdsaleStore.contractTargetSuffix
      const target = `${targetPrefix}${targetSuffix}`

      let methodInterface
      let methodName
      if (crowdsaleStore.isMintedCappedCrowdsale) {
        methodInterface = ["uint256", "address[]","uint256[]","uint256[]","bytes"]
        methodName = "whitelistMultiForTier"
      } else if (crowdsaleStore.isDutchAuction) {
        methodInterface = ["address[]","uint256[]","uint256[]","bytes"]
        methodName = "whitelistMulti"
      }

      let paramsToExec = [index, addrs, minCaps, maxCaps, methodInterface]
      const method = methodToExec("scriptExec", `${methodName}(${methodInterface.join(',')})`, target, getWhitelistsParams, paramsToExec)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('whitelist'))
    }
  })
}

const getUpdateGlobalMinCapParams = (methodInterface) => {
  const { web3 } = web3Store
  let globalMinCap = toBigNumber(tierStore.globalMinCap).times(`1e${tokenStore.decimals}`).toFixed()

  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [globalMinCap, context]);
  return encodedParameters;
}

export const updateGlobalMinContribution = () => {
  return [() => {
    console.log('###updateGlobalMinContribution:###')

    const methodInterface = ["uint256","bytes"]

    const targetPrefix = "crowdsaleConsole"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    let paramsToExec = [methodInterface]
    const method = methodToExec("scriptExec", `updateGlobalMinContribution(${methodInterface.join(',')})`, target, getUpdateGlobalMinCapParams, paramsToExec)

    let account = contractStore.crowdsale.account;
    const opts = { gasPrice: generalStore.gasPrice, from: account }

    return method.estimateGas(opts)
      .then(estimatedGas => {
        opts.gasLimit = calculateGasLimit(estimatedGas)
        return sendTXToContract(method.send(opts))
      })
      .then(() => deploymentStore.setAsSuccessful('updateGlobalMinContribution'))
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

export function getDownloadName () {
  return new Promise(resolve => {
    const whenNetworkName = getNetworkVersion()
      .then((networkID) => {
        let networkName = getNetWorkNameById(networkID)

        if (!networkName) {
          networkName = String(networkID)
        }

        return networkName
      })
      .then((networkName) => `${DOWNLOAD_NAME}_${networkName}_${contractStore.crowdsale.execID}`)

    resolve(whenNetworkName)
  })
}
