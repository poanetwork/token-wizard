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
import { CROWDSALE_STRATEGIES } from '../../utils/constants'
import { DOWNLOAD_NAME, REACT_PREFIX, MINTED_PREFIX, DUTCH_PREFIX, ADDR_BOX_LEN } from './constants'
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
  console.log("reservedTokenStore:", reservedTokenStore)
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

  const commonParams = [
    addrs,
    minCaps,
    maxCaps
  ]

  let paramsWhitelist
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    paramsWhitelist = [
      tierIndex, ...commonParams
    ]
  } else if (crowdsaleStore.isDutchAuction) {
    paramsWhitelist = commonParams
  }

  console.log("paramsWhitelist:", paramsWhitelist)

  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsWhitelist, context]);
  return encodedParameters;
}

export const addWhitelist = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      console.log('###addWhitelist:###')

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
      const { rate,  minRate } = tierStore.tiers[index]
      let rateBN
      if (crowdsaleStore.isMintedCappedCrowdsale) {
        rateBN = new BigNumber(rate)
      } else if (crowdsaleStore.isDutchAuction) {
        rateBN = new BigNumber(minRate)
      }
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

  console.log("content:", content)
  console.log("type:", type)

  if (content && type) {
    if (content.field == "whitelist") {
      let whitelistItems = []
      for (let i = 0; i < type.whitelist.length; i++) {
        let whiteListItem = type.whitelist[i]
        whitelistItems.push(whitelistTableItem(whiteListItem).join('\n'))
      }
      return whitelistItems
    } else if (content.field == "tokens" && content.parent == "reservedTokenStore") {
      let reservedTokensItems = []
      for (let i = 0; i < type.tokens.length; i++) {
        let reservedTokensItem = type.tokens[i]
        reservedTokensItems.push(reservedTokensTableItem(reservedTokensItem).join('\n'))
      }
      return reservedTokensItems.join('\n')
    } else {
      return `${content.value}${type[content.field]}${suffix}`
    }
  } else {
    if (!content) {
      console.log("WARNING!: content is undefined")
    }
    if (!type) {
      console.log("WARNING!: type is undefined")
    }
    return ''
  }
}

const whitelistTableItem = (whiteListItem) => {
  const valBoxLen = 28
  return [
    '|                                            |                            |                            |',
    `|${fillWithSpaces(whiteListItem.addr, ADDR_BOX_LEN)}|${fillWithSpaces(whiteListItem.min, valBoxLen)}|${fillWithSpaces(whiteListItem.max, valBoxLen)}|`,
    '|____________________________________________|____________________________|____________________________|'
  ]
}

const reservedTokensTableItem = (reservedTokensItem) => {
  const valBoxLen = 56
  const dim = reservedTokensItem.dim === 'percentage' ? '%' : 'tokens'
  return [
    '|                                            |                                                        |',
    `|${fillWithSpaces(reservedTokensItem.addr, ADDR_BOX_LEN)}|${fillWithSpaces(`${reservedTokensItem.val} ${dim}`, valBoxLen)}|`,
    '|____________________________________________|________________________________________________________|'
  ]
}

const fillWithSpaces = (val, len) => {
  val = val.toString()
  if (val.length < len) {
    const whitespaceLen = len - val.length
    const prefixLen = Math.ceil(whitespaceLen / 2)
    const suffixLen = Number.isInteger(whitespaceLen / 2) ? prefixLen : prefixLen - 1
    let prefix = new Array(prefixLen).fill(' ').join('')
    let suffix = new Array(suffixLen).fill(' ').join('')
    const out = prefix + val + suffix
    return out
  } else {
    return val.toString().substr(len)
  }
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

const getAddr = (contractName, networkID) => {
  return JSON.parse(process.env[`${REACT_PREFIX}${contractName}_ADDRESS`] || {})[networkID]
}

const authOSContractString = (contrct) => {return `Auth_os ${contrct} address: `}

const getAppName = (strategy) => {
  switch(strategy) {
    case CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE:
      return process.env[`${REACT_PREFIX}${MINTED_PREFIX}APP_NAME`]
    case CROWDSALE_STRATEGIES.DUTCH_AUCTION:
      return process.env[`${REACT_PREFIX}${DUTCH_PREFIX}APP_NAME`]
  }
}

const getCrowdsaleContractAddr = (strategy, contractName, networkID) => {
  switch(strategy) {
    case CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE:
      return JSON.parse(process.env[`${REACT_PREFIX}${MINTED_PREFIX}${contractName}_ADDRESS`] || {})[networkID]
    case CROWDSALE_STRATEGIES.DUTCH_AUCTION:
      return JSON.parse(process.env[`${REACT_PREFIX}${DUTCH_PREFIX}${contractName}_ADDRESS`] || {})[networkID]
  }
}

const footerElemets = [
  { value: '\n*****************************', parent: 'none', fileValue: '' },
  { value: '*****************************', parent: 'none', fileValue: '' },
  { value: '*****************************', parent: 'none', fileValue: '\n' },
]

const bigHeaderElements = (headerName) => {
  return [
    { value: '*****************************', parent: 'none', fileValue: '' },
    { value: headerName, parent: 'none', fileValue: '' },
    { value: '*****************************', parent: 'none', fileValue: '\n' },
  ]
}

const smallHeader = (headerName) => {
  return { value: headerName, parent: 'none', fileValue: '\n' }
}

const whitelistHeaderTableElements = () => {
  return [
    { value: '________________________________________________________________________________________________________', parent: 'none', fileValue: '' },
    { value: '|                                            |                            |                            |', parent: 'none', fileValue: '' },
    { value: '|                ADDRESS                     |     MIN CAP IN TOKENS      |     MAX CAP IN TOKENS      |', parent: 'none', fileValue: '' },
    { value: '|____________________________________________|____________________________|____________________________|', parent: 'none', fileValue: '' },
  ]
}

const reservedTokensHeaderTableElements = () => {
  return [
    { value: '_______________________________________________________________________________________________________', parent: 'none', fileValue: '' },
    { value: '|                                            |                                                        |', parent: 'none', fileValue: '' },
    { value: '|                ADDRESS                     |                        VALUE                           |', parent: 'none', fileValue: '' },
    { value: '|____________________________________________|________________________________________________________|', parent: 'none', fileValue: '' },
  ]
}

export const SUMMARY_FILE_CONTENTS = (networkID) => {
  let globalMinCapEl = []
  let crowdsaleWhitelistElements = []
  let tierWhitelistElements = []
  if (tierStore.tiers[0].whitelistEnabled !== "yes") {
    globalMinCapEl = [
      { field: 'globalMinCap', value: 'Crowdsale global min cap: ', parent: 'tierStore' }
    ]
  } else {
    tierWhitelistElements = [
      '\n',
      ...bigHeaderElements('*********WHITELIST***********'),
      ...whitelistHeaderTableElements(),
      { field: 'whitelist', value: '', parent: 'tierStore' },
    ]
  }

  let reservedTokensElements = []
  if (reservedTokenStore.tokens.length > 0) {
    reservedTokensElements = [
      '\n',
      ...bigHeaderElements('******RESERVED TOKENS********'),
      ...reservedTokensHeaderTableElements(),
      { field: 'tokens', value: '', parent: 'reservedTokenStore' },
    ]
  }

  let rates = []
  let crowdsaleIsModifiableEl = []
  if (crowdsaleStore.strategy == CROWDSALE_STRATEGIES.DUTCH_AUCTION) {
    rates = [
      { field: 'minRate', value: 'Crowdsale min rate: ', parent: 'tierStore' },
      { field: 'maxRate', value: 'Crowdsale max rate: ', parent: 'tierStore' },
    ]

    crowdsaleIsModifiableEl = [
      { value: 'Crowdsale is modifiable: ', parent: 'none', fileValue: 'no' },
    ]

    crowdsaleWhitelistElements = tierWhitelistElements
  }

  return {
    common: [
      ...bigHeaderElements('*********TOKEN SETUP*********'),
      { field: 'name', value: 'Token name: ', parent: 'tokenStore' },
      { field: 'ticker', value: 'Token ticker: ', parent: 'tokenStore' },
      { field: 'decimals', value: 'Token decimals: ', parent: 'tokenStore' },
      { field: 'supply', value: 'Token total supply: ', parent: 'tokenStore' },
      ...reservedTokensElements,
      '\n',
      ...bigHeaderElements('*******CROWDSALE SETUP*******'),
      { field: 'walletAddress', value: 'Multisig wallet address: ', parent: 'tierStore' },
      ...rates,
      ...globalMinCapEl,
      { field: 'supply', value: 'Crowdsale hard cap: ', parent: 'crowdsaleStore' },
      { field: 'startTime', value: 'Crowdsale start time: ', parent: 'tierStore' },
      { field: 'endTime', value: 'Crowdsale end time: ', parent: 'crowdsaleStore' },
      ...crowdsaleIsModifiableEl,
      { field: 'whitelistEnabled', value: 'Crowdsale is whitelisted: ', parent: 'tierStore' },
      ...crowdsaleWhitelistElements,
      ...footerElemets
    ],
    auth_os: [
      ...bigHeaderElements('*******AUTH_OS METADATA******'),
      smallHeader('**********REGISTRY***********'),
      { value: authOSContractString('registry storage'), parent: 'none', fileValue: getAddr("REGISTRY_STORAGE", networkID) },
      { value: authOSContractString('script executor'), parent: 'none', fileValue: getAddr("SCRIPT_EXEC", networkID) },
      { value: authOSContractString('InitRegistry'), parent: 'none', fileValue: getAddr("INIT_REGISTRY", networkID) },
      { value: authOSContractString('AppConsole'), parent: 'none', fileValue: getAddr("APP_CONSOLE", networkID) },
      { value: authOSContractString('VersionConsole'), parent: 'none', fileValue: getAddr("VERSION_CONSOLE", networkID) },
      { value: authOSContractString('ImplementationConsole'), parent: 'none', fileValue: `${getAddr("IMPLEMENTATION_CONSOLE", networkID)}\n` },
      smallHeader('*********CROWDSALE***********'),
      { value: 'Auth_os application name: ', parent: 'none', fileValue: getAppName(crowdsaleStore.strategy) },
      { field: 'execID', value: 'Auth_os execution ID: ', parent: 'crowdsale' },
      { value: authOSContractString('InitCrowdsale'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "INIT_CROWDSALE", networkID) },
      { value: authOSContractString('CrowdsaleConsole'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "CROWDSALE_CONSOLE", networkID) },
      { value: authOSContractString('TokenConsole'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "TOKEN_CONSOLE", networkID) },
      { value: authOSContractString('CrowdsaleBuyTokens'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "CROWDSALE_BUY_TOKENS", networkID) },
      { value: authOSContractString('TokenTransfer'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "TOKEN_TRANSFER", networkID) },
      { value: authOSContractString('TokenTransferFrom'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "TOKEN_TRANSFER_FROM", networkID) },
      { value: authOSContractString('TokenApprove'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "TOKEN_APPROVE", networkID) },
      ...footerElemets
    ],
    files: {
      order: [
        'crowdsale'
      ],
      crowdsale: {
        name: getAppName(crowdsaleStore.strategy),
        txt: [
          ...bigHeaderElements('*********TIER SETUP**********'),
          { field: 'tier', value: 'Tier name: ', parent: 'tierStore' },
          { field: 'rate', value: 'Tier rate: ', parent: 'tierStore' },
          { field: 'supply', value: 'Tier max cap: ', parent: 'tierStore' },
          { field: 'startTime', value: 'Tier start time: ', parent: 'tierStore' },
          { field: 'endTime', value: 'Tier end time: ', parent: 'tierStore' },
          { field: 'updatable', value: 'Tier is modifiable: ', parent: 'tierStore' },
          ...tierWhitelistElements,
          ...footerElemets
        ]
      }
    }
  }
}