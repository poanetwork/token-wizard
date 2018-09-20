import {
  calculateGasLimit,
  deployContract,
  getNetworkVersion,
  getProxyParams,
  methodToCreateAppInstance,
  methodToExec,
  sendTXToContract
} from '../../utils/blockchainHelpers'
import { countDecimalPlaces, toBigNumber, toFixed, updateProxyContractInfo } from '../../utils/utils'
import { toJS } from 'mobx'
import {
  contractStore,
  crowdsaleStore,
  generalStore,
  reservedTokenStore,
  tierStore,
  tokenStore,
  web3Store
} from '../../stores'
import logdown from 'logdown'

const logger = logdown('TW:StepFour:utils')

export const buildDeploymentSteps = deploymentStore => {
  let stepFnCorrelation = {
    deployProxy: deployProxy,
    crowdsaleCreate: deployCrowdsale,
    token: initializeToken,
    setReservedTokens: setReservedTokensListMultiple,
    updateGlobalMinContribution: updateGlobalMinContribution,
    createCrowdsaleTiers: createCrowdsaleTiers,
    whitelist: addWhitelist,
    crowdsaleInit: initializeCrowdsale,
    trackProxy: trackProxy
  }

  let list = []

  deploymentStore.txMap.forEach((steps, name) => {
    const { isMintedCappedCrowdsale, isDutchAuction, crowdsaleDeployInterface, appName } = crowdsaleStore

    if (steps.length) {
      logger.log('Step name:', name)
      if (name === 'crowdsaleCreate') {
        let getParams
        if (isMintedCappedCrowdsale) {
          getParams = getCrowdSaleParams
        } else if (isDutchAuction) {
          getParams = getDutchAuctionCrowdSaleParams
        }
        list = list.concat(stepFnCorrelation[name](getParams, crowdsaleDeployInterface, appName))
      } else {
        list = list.concat(stepFnCorrelation[name]())
      }
    }
  })

  return list
}

export const deployProxy = () => {
  const { web3 } = web3Store
  return [
    async executionOrder => {
      const networkID = await getNetworkVersion()
      contractStore.setContractProperty('crowdsale', 'networkID', networkID)

      const accounts = await web3.eth.getAccounts()
      contractStore.setContractProperty('crowdsale', 'account', accounts[0])

      logger.log('***Deploy Proxy contract***')

      const binProxy = contractStore[crowdsaleStore.proxyName].bin || ''
      const abiProxy = contractStore[crowdsaleStore.proxyName].abi || []
      const proxyParams = getProxyParams({
        abstractStorageAddr: contractStore.abstractStorage.addr,
        networkID: contractStore.crowdsale.networkID,
        appNameHash: crowdsaleStore.appNameHash
      })
      const receipt = await deployContract(abiProxy, binProxy, proxyParams, executionOrder)
      updateProxyContractInfo(receipt, { web3Store, contractStore, crowdsaleStore }, proxyParams)
      return receipt
    }
  ]
}

export const getCrowdSaleParams = (account, methodInterface) => {
  const { web3 } = web3Store
  const { walletAddress, whitelistEnabled, updatable, supply, tier, startTime, endTime, rate } = tierStore.tiers[0]

  const lastTier = tierStore.tiers[tierStore.tiers.length - 1]
  crowdsaleStore.setProperty('endTime', lastTier.endTime)

  //tier 0 oneTokenInWEI
  const rateBN = toBigNumber(rate)
  const oneTokenInETH = rateBN.pow(-1).toFixed()
  const oneTokenInWEI = web3.utils.toWei(oneTokenInETH, 'ether')

  //tier 0 duration
  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())
  const duration = formatDate(endTime) - formatDate(startTime)
  const durationBN = toBigNumber(duration).toFixed()

  //is tier whitelisted?
  const isWhitelisted = whitelistEnabled === 'yes'

  //is tier updatable
  const isUpdatable = updatable === 'on'

  // tie 0 name bytes32
  const tierNameBytes = web3.utils.fromAscii(tier)
  const encodedTierName = web3.eth.abi.encodeParameter('bytes32', tierNameBytes)

  //tier 0 supply
  const supplyBN = toBigNumber(supply)
    .times(`1e${tokenStore.decimals}`)
    .toFixed()

  //tier 0 global min cap
  const minCapBN = toBigNumber(tierStore.tiers[0].minCap)
    .times(`1e${tokenStore.decimals}`)
    .toFixed()

  let crowdsaleParams = [
    walletAddress,
    formatDate(startTime),
    encodedTierName,
    oneTokenInWEI,
    durationBN,
    supplyBN,
    minCapBN,
    isWhitelisted,
    isUpdatable,
    account
  ]

  logger.log('crowdsaleParams:', crowdsaleParams)

  let crowdsaleParamsEncoded = web3.eth.abi.encodeParameters(methodInterface, crowdsaleParams)
  return { params: crowdsaleParams, paramsEncoded: crowdsaleParamsEncoded }
}

export const getDutchAuctionCrowdSaleParams = (account, methodInterface) => {
  const { web3 } = web3Store
  const {
    walletAddress,
    supply,
    startTime,
    endTime,
    minRate,
    maxRate,
    whitelistEnabled,
    burnExcess
  } = tierStore.tiers[0]

  const lastTier = tierStore.tiers[tierStore.tiers.length - 1]
  crowdsaleStore.setProperty('endTime', lastTier.endTime)

  logger.log(tierStore.tiers[0])

  //Dutch Auction crowdsale minOneTokenInWEI
  const minRateBN = toBigNumber(minRate)
  const minOneTokenInETH = minRateBN.pow(-1).toFixed()
  const minOneTokenInWEI = web3.utils.toWei(minOneTokenInETH, 'ether')

  //Dutch Auction crowdsale maxOneTokenInWEI
  const maxRateBN = toBigNumber(maxRate)
  const maxOneTokenInETH = maxRateBN.pow(-1).toFixed()
  const maxOneTokenInWEI = web3.utils.toWei(maxOneTokenInETH, 'ether')

  //Dutch Auction crowdsale duration
  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())
  const duration = formatDate(endTime) - formatDate(startTime)
  const durationBN = toBigNumber(duration).toFixed()

  //token supply
  const tokenSupplyBN = toBigNumber(tokenStore.supply)
    .times(`1e${tokenStore.decimals}`)
    .toFixed()

  //Dutch Auction crowdsale supply
  const crowdsaleSupplyBN = toBigNumber(supply)
    .times(`1e${tokenStore.decimals}`)
    .toFixed()

  //is Dutch Auction crowdsale whitelisted?
  const isWhitelisted = whitelistEnabled === 'yes'

  const mustBurnExcess = burnExcess === 'yes'

  let crowdsaleParams = [
    walletAddress,
    tokenSupplyBN,
    crowdsaleSupplyBN,
    minOneTokenInWEI,
    maxOneTokenInWEI,
    durationBN,
    formatDate(startTime),
    isWhitelisted,
    account,
    mustBurnExcess
  ]

  let crowdsaleParamsEncoded = web3.eth.abi.encodeParameters(methodInterface, crowdsaleParams)
  return { params: crowdsaleParams, paramsEncoded: crowdsaleParamsEncoded }
}

export function updateCrowdsaleContractInfo({ logs, events }, { contractStore }) {
  if (events) {
    logger.log('events:', events)
    if (events.ApplicationFinalization) {
      getExecutionIDFromEvent(events, 'ApplicationFinalization')
    } else if (events.AppInstanceCreated) {
      getExecutionIDFromEvent(events, 'AppInstanceCreated')
    } else if (events.ApplicationInitialized) {
      getExecutionIDFromEvent(events, 'ApplicationInitialized')
    }
  } else if (logs) {
    logger.log('logs:', logs)

    const lastLog = logs.reduce((log, current) => {
      if (!log) return (log = current)
      if (current.logIndex > log.logIndex) log = current
      return log
    }, 0)

    if (lastLog && lastLog.topics && lastLog.topics.length > 1) {
      const execID = lastLog.topics[2]
      logger.log('exec_id', execID)
      contractStore.setContractProperty('crowdsale', 'execID', execID)
    }
  }
}

export const deployCrowdsale = (getParams, methodInterface, appName) => {
  logger.log('###deploy crowdsale###')
  return [
    async executionOrder => {
      const account = contractStore.crowdsale.account

      let params = [account, methodInterface]

      const methodInterfaceStr = `init(${methodInterface.join(',')})`

      let method = methodToCreateAppInstance(crowdsaleStore.proxyName, methodInterfaceStr, getParams, params, appName)

      const opts = { gasPrice: generalStore.gasPrice, from: account }
      logger.log('opts:', opts)

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)

      const receipt = await sendTXToContract(method.send(opts), executionOrder)
      updateCrowdsaleContractInfo(receipt, { contractStore })
      return receipt
    }
  ]
}

const getExecutionIDFromEvent = (events, eventName) => {
  logger.log('eventName:', events[eventName])
  if (events[eventName].returnValues) {
    logger.log('returnValues:', events[eventName].returnValues)
    let exec_id
    if (events[eventName].returnValues.execution_id) exec_id = events[eventName].returnValues.execution_id
    else if (events[eventName].returnValues.exec_id) exec_id = events[eventName].returnValues.exec_id
    logger.log('execution_id', exec_id)
    contractStore.setContractProperty('crowdsale', 'execID', exec_id)
  }
}

const getTokenParams = (token, methodInterface) => {
  const { eth, utils } = web3Store.web3
  const paramsToken = [utils.fromAscii(token.name), utils.fromAscii(token.ticker), parseInt(token.decimals, 10)]
  return eth.abi.encodeParameters(methodInterface, [...paramsToken])
}

export const initializeToken = () => {
  logger.log('###initialize token###')
  return [
    async executionOrder => {
      const methodInterface = ['bytes32', 'bytes32', 'uint256']

      logger.log('contractStore.crowdsale.account: ', contractStore.crowdsale.account)
      let account = contractStore.crowdsale.account

      let paramsToExec = [tokenStore, methodInterface]
      const method = methodToExec(
        crowdsaleStore.proxyName,
        `initCrowdsaleToken(${methodInterface.join(',')})`,
        getTokenParams,
        paramsToExec
      )

      const opts = { gasPrice: generalStore.gasPrice, from: account }
      logger.log('opts:', opts)

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)
      return await sendTXToContract(method.send(opts), executionOrder)
    }
  ]
}

const getReservedTokensParams = (addrs, inTokens, inPercentageUnit, inPercentageDecimals, methodInterface) => {
  const { web3 } = web3Store
  const paramsReservedTokens = [addrs, inTokens, inPercentageUnit, inPercentageDecimals]
  logger.log('paramsReservedTokens:', paramsReservedTokens)
  return web3.eth.abi.encodeParameters(methodInterface, [...paramsReservedTokens])
}

export const setReservedTokensListMultiple = () => {
  logger.log('###setReservedTokensListMultiple:###')
  logger.log('reservedTokenStore:', reservedTokenStore)
  return [
    async executionOrder => {
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
            obj.inTokens = toBigNumber(val)
              .times(`1e${tokenStore.decimals}`)
              .toFixed()
          } else {
            obj.inPercentageDecimals = countDecimalPlaces(val)
            obj.inPercentageUnit = toBigNumber(val)
              .times(`1e${obj.inPercentageDecimals}`)
              .toFixed()
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

      let account = contractStore.crowdsale.account
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      const methodInterface = ['address[]', 'uint256[]', 'uint256[]', 'uint256[]']

      let paramsToExec = [addrs, inTokens, inPercentageUnit, inPercentageDecimals, methodInterface]
      const method = methodToExec(
        crowdsaleStore.proxyName,
        `updateMultipleReservedTokens(${methodInterface.join(',')})`,
        getReservedTokensParams,
        paramsToExec
      )

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)
      return await sendTXToContract(method.send(opts), executionOrder)
    }
  ]
}

const getInitializeCrowdsaleParams = () => {
  const { web3 } = web3Store
  return web3.eth.abi.encodeParameters([], [])
}

export const initializeCrowdsale = () => {
  logger.log('###initialize crowdsale###')
  return [
    async executionOrder => {
      const account = contractStore.crowdsale.account

      let paramsToExec = []
      const method = methodToExec(
        crowdsaleStore.proxyName,
        'initializeCrowdsale()',
        getInitializeCrowdsaleParams,
        paramsToExec
      )

      const opts = { gasPrice: generalStore.gasPrice, from: account }
      logger.log('opts:', opts)

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)
      return await sendTXToContract(method.send(opts), executionOrder)
    }
  ]
}

const getTiersParams = methodInterface => {
  const { web3 } = web3Store

  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())

  let whitelistEnabledArr = []
  let updatableArr = []
  let rateArr = []
  let supplyArr = []
  let tierNameArr = []
  let durationArr = []
  let minCapArr = []
  const tiersExceptFirst = tierStore.tiers.slice(1)

  tiersExceptFirst.forEach(tier => {
    const { updatable, whitelistEnabled, rate, supply, tier: tierName, startTime, endTime } = tier
    const duration = formatDate(endTime) - formatDate(startTime)
    const tierNameBytes = web3.utils.fromAscii(tierName)
    const encodedTierName = web3.eth.abi.encodeParameter('bytes32', tierNameBytes)
    const rateBN = toBigNumber(rate)
    const oneTokenInETH = rateBN.pow(-1).toFixed()
    durationArr.push(duration)
    tierNameArr.push(encodedTierName)
    rateArr.push(web3.utils.toWei(oneTokenInETH, 'ether'))
    supplyArr.push(
      toBigNumber(supply)
        .times(`1e${tokenStore.decimals}`)
        .toFixed()
    )
    minCapArr.push(
      toBigNumber(tier.minCap)
        .times(`1e${tokenStore.decimals}`)
        .toFixed()
    )
    updatableArr.push(updatable === 'on')
    whitelistEnabledArr.push(whitelistEnabled === 'yes')
  })
  let paramsTiers = [tierNameArr, durationArr, rateArr, supplyArr, minCapArr, updatableArr, whitelistEnabledArr]
  logger.log('paramsTiers:', paramsTiers)

  return web3.eth.abi.encodeParameters(methodInterface, [...paramsTiers])
}

export const createCrowdsaleTiers = () => {
  return [
    async executionOrder => {
      logger.log('###createCrowdsaleTiers:###')

      const methodInterface = ['bytes32[]', 'uint256[]', 'uint256[]', 'uint256[]', 'uint256[]', 'bool[]', 'bool[]']

      let paramsToExec = [methodInterface]
      const method = methodToExec(
        crowdsaleStore.proxyName,
        `createCrowdsaleTiers(${methodInterface.join(',')})`,
        getTiersParams,
        paramsToExec
      )

      let account = contractStore.crowdsale.account
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)
      return await sendTXToContract(method.send(opts), executionOrder)
    }
  ]
}

const getWhitelistsParams = (tierIndex, addrs, minCaps, maxCaps, methodInterface) => {
  const { web3 } = web3Store

  const commonParams = [addrs, minCaps, maxCaps]

  let paramsWhitelist
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    paramsWhitelist = [tierIndex, ...commonParams]
  } else if (crowdsaleStore.isDutchAuction) {
    paramsWhitelist = commonParams
  }

  logger.log('paramsWhitelist:', paramsWhitelist)

  return web3.eth.abi.encodeParameters(methodInterface, [...paramsWhitelist])
}

export const addWhitelist = () => {
  return tierStore.tiers.reduce((acc, tier, index) => {
    const whitelist = []
    whitelist.push.apply(whitelist, tier.whitelist)

    if (whitelist.length) {
      acc.push(async executionOrder => {
        logger.log('###addWhitelist:###')

        let addrs = []
        let minCaps = []
        let maxCaps = []

        for (let i = 0; i < whitelist.length; i++) {
          addrs.push(whitelist[i].addr)
          let whitelistMin = toBigNumber(whitelist[i].min)
            .times(`1e${tokenStore.decimals}`)
            .toFixed() // in tokens, token do have decimals accounted
          let whitelistMax = toBigNumber(whitelist[i].max)
            .times(`1e${tokenStore.decimals}`)
            .toFixed() // in tokens, token do have decimals accounted
          minCaps.push(whitelistMin ? whitelistMin.toString() : 0)
          maxCaps.push(whitelistMax ? whitelistMax.toString() : 0)
        }

        logger.log('addrs:', addrs)
        logger.log('minCaps:', minCaps)
        logger.log('maxCaps:', maxCaps)

        let account = contractStore.crowdsale.account
        const opts = { gasPrice: generalStore.gasPrice, from: account }

        let methodInterface
        let methodName
        if (crowdsaleStore.isMintedCappedCrowdsale) {
          methodInterface = ['uint256', 'address[]', 'uint256[]', 'uint256[]']
          methodName = 'whitelistMultiForTier'
        } else if (crowdsaleStore.isDutchAuction) {
          methodInterface = ['address[]', 'uint256[]', 'uint256[]']
          methodName = 'whitelistMulti'
        }

        let paramsToExec = [index, addrs, minCaps, maxCaps, methodInterface]
        const method = methodToExec(
          crowdsaleStore.proxyName,
          `${methodName}(${methodInterface.join(',')})`,
          getWhitelistsParams,
          paramsToExec
        )

        const estimatedGas = await method.estimateGas(opts)
        opts.gasLimit = calculateGasLimit(estimatedGas)
        return await sendTXToContract(method.send(opts), executionOrder)
      })
    }

    return acc
  }, [])
}

const getUpdateGlobalMinCapParams = methodInterface => {
  let globalMinCap = toBigNumber(tierStore.tiers[0].minCap)
    .times(`1e${tokenStore.decimals}`)
    .toFixed()
  return web3Store.web3.eth.abi.encodeParameters(methodInterface, [globalMinCap])
}

export const updateGlobalMinContribution = () => {
  return [
    async executionOrder => {
      logger.log('###updateGlobalMinContribution:###')

      const methodInterface = ['uint256']

      let paramsToExec = [methodInterface]
      const method = methodToExec(
        crowdsaleStore.proxyName,
        `updateGlobalMinContribution(${methodInterface.join(',')})`,
        getUpdateGlobalMinCapParams,
        paramsToExec
      )

      let account = contractStore.crowdsale.account
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)
      return await sendTXToContract(method.send(opts), executionOrder)
    }
  ]
}

const getUpdateTierMinimumParams = (tierIndex, methodInterface) => {
  const { web3 } = web3Store
  const minCap = toBigNumber(tierStore.tiers[tierIndex].minCap)
    .times(`1e${tokenStore.decimals}`)
    .toFixed()

  return web3.eth.abi.encodeParameters(methodInterface, [tierIndex, minCap])
}

export const updateTierMinimum = () => {
  return tierStore.tiers.map((tier, index) => {
    return async executionOrder => {
      logger.log('###updateTierMinimum:###')

      const methodInterface = ['uint256', 'uint256']

      let paramsToExec = [index, methodInterface]
      const method = methodToExec(
        crowdsaleStore.proxyName,
        `updateTierMinimum(${methodInterface.join(',')})`,
        getUpdateTierMinimumParams,
        paramsToExec
      )

      let account = contractStore.crowdsale.account
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)
      return await sendTXToContract(method.send(opts), executionOrder)
    }
  })
}

export const trackProxy = () => {
  const { web3 } = web3Store
  return [
    async executionOrder => {
      logger.log('###trackProxy:###')
      logger.log('contractStore:', contractStore)

      let account = contractStore.crowdsale.account
      const opts = { gasPrice: generalStore.gasPrice, from: account }

      const targetContract = new web3.eth.Contract(
        toJS(contractStore.ProxiesRegistry.abi),
        contractStore.ProxiesRegistry.addr
      )
      logger.log('contractStore[crowdsaleStore.proxyName].addr:', contractStore[crowdsaleStore.proxyName].addr)
      const method = targetContract.methods.trackCrowdsale(contractStore[crowdsaleStore.proxyName].addr)

      const estimatedGas = await method.estimateGas(opts)
      opts.gasLimit = calculateGasLimit(estimatedGas)
      return await sendTXToContract(method.send(opts), executionOrder)
    }
  ]
}

export function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight)
}

export const getStrategies = () => {
  return ['Dutch', 'MintedCapped']
}

export const getPragmaVersion = async strategy => {
  const strategiesAllowed = getStrategies()
  if (!strategiesAllowed.includes(strategy)) {
    throw new Error('Strategy not exist')
  }
  const contractFile = await (await fetch(`./contracts/${strategy}Proxy.sol`)).text()
  const firstLine = contractFile.split('\n')[0]
  return firstLine.match(/(?:\^0|\d*)\.(?:0|\d*)\.(?:0|\d*)/gi) || '0.4.24'
}

export const getVersionFlagByStrategy = strategy => {
  const strategiesAllowed = getStrategies()
  if (!strategiesAllowed.includes(strategy)) {
    throw new Error('Strategy not exist')
  }

  //Check path by enviroment variable
  let constants
  try {
    if (['development', 'test'].includes(process.env.NODE_ENV)) {
      constants = require(`json-loader!../../../public/metadata/${strategy}TruffleVersions.json`)
    } else {
      constants = require(`json-loader!../../../build/metadata/${strategy}TruffleVersions.json`)
    }
  } catch (err) {
    logger.log('Error require truffle version', err)
  }
  const { solcVersion = '0.4.24' } = constants

  return solcVersion
}

export const getOptimizationFlagByStrategy = strategy => {
  const strategiesAllowed = getStrategies()
  if (!strategiesAllowed.includes(strategy)) {
    throw new Error('Strategy not exist')
  }

  //Check path by enviroment variable
  let constants
  try {
    if (['development', 'test'].includes(process.env.NODE_ENV)) {
      constants = require(`../../../public/metadata/${strategy}CrowdsaleTruffle.js`)
    } else {
      constants = require(`../../../build/metadata/${strategy}CrowdsaleTruffle.js`)
    }
  } catch (err) {
    logger.log('Error require truffle config', err)
  }
  const { solc } = constants

  return solc && solc.optimizer && solc.optimizer.enabled ? 'Yes' : 'No'
}

export const getOptimizationFlagByStore = crowdsaleStore => {
  let strategy
  if (crowdsaleStore.isDutchAuction) {
    strategy = 'Dutch'
  }
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    strategy = 'MintedCapped'
  }
  return getOptimizationFlagByStrategy(strategy)
}

export const getVersionFlagByStore = crowdsaleStore => {
  let strategy
  if (crowdsaleStore.isDutchAuction) {
    strategy = 'Dutch'
  }
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    strategy = 'MintedCapped'
  }
  return getVersionFlagByStrategy(strategy)
}
