import {
  calculateGasLimit,
  deployContract,
  getNetWorkNameById,
  getNetworkVersion,
  methodToCreateAppInstance,
  methodToExec,
  sendTXToContract
} from '../../utils/blockchainHelpers'
import {
  countDecimalPlaces,
  toBigNumber,
  toFixed,
  convertDateToUTCTimezone,
  convertDateToUTCTimezoneToDisplay
} from '../../utils/utils'
import { CROWDSALE_STRATEGIES, REACT_PREFIX } from '../../utils/constants'
import { ADDR_BOX_LEN, DOWNLOAD_NAME, DUTCH_PREFIX, MINTED_PREFIX } from './constants'
import { isObservableArray, toJS } from 'mobx'
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
import logdown from 'logdown'

const logger = logdown('TW:stepFour:utils')

export const buildDeploymentSteps = (deploymentStore) => {
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

const getProxyParams = () => {
  return [
    contractStore.abstractStorage.addr,
    JSON.parse(process.env['REACT_APP_REGISTRY_EXEC_ID'] || '{}')[contractStore.crowdsale.networkID],
    JSON.parse(process.env['REACT_APP_PROXY_PROVIDER_ADDRESS'] || '{}')[contractStore.crowdsale.networkID],
    crowdsaleStore.appNameHash
  ]
}

export function updateProxyContractInfo(receipt) {
  const { web3 } = web3Store
  const paramsProxy = getProxyParams()
  const encoded = web3.eth.abi.encodeParameters(['address', 'bytes32', 'address', 'bytes32'], paramsProxy)

  contractStore.setContractProperty(crowdsaleStore.proxyName, 'addr', receipt.contractAddress.toLowerCase())
  contractStore.setContractProperty(crowdsaleStore.proxyName, 'abiEncoded', encoded.slice(2))
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
      const paramsProxy = getProxyParams()
      const receipt = await deployContract(abiProxy, binProxy, paramsProxy, executionOrder)
      updateProxyContractInfo(receipt, web3, paramsProxy)
      return receipt
    }
  ]
}

export const getCrowdSaleParams = (account, methodInterface) => {
  const { web3 } = web3Store
  const { walletAddress, whitelistEnabled, updatable, supply, tier, startTime, endTime, rate } = tierStore.tiers[0]

  const startTimeTierToUTC = convertDateToUTCTimezone(startTime)
  const endTimeTierToUTC = convertDateToUTCTimezone(endTime)

  tierStore.setTierProperty(startTimeTierToUTC, 'startTime', 0)
  tierStore.setTierProperty(endTimeTierToUTC, 'endTime', 0)

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

  const startTimeTierToUTC = convertDateToUTCTimezone(startTime)
  const endTimeTierToUTC = convertDateToUTCTimezone(endTime)

  tierStore.setTierProperty(startTimeTierToUTC, 'startTime', 0)
  tierStore.setTierProperty(endTimeTierToUTC, 'endTime', 0)

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

export function updateCrowdsaleContractInfo(receipt) {
  const { logs, events } = receipt
  logger.log('receipt:', receipt)

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
      updateCrowdsaleContractInfo(receipt)
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
  tiersExceptFirst.forEach((tier, index) => {
    const { updatable, whitelistEnabled, rate, supply, tier: tierName } = tier
    let { startTime, endTime } = tier

    startTime = convertDateToUTCTimezone(startTime)
    endTime = convertDateToUTCTimezone(endTime)

    tierStore.setTierProperty(startTime, 'startTime', index + 1)
    tierStore.setTierProperty(endTime, 'endTime', index + 1)

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

export const handlerForFile = (content, type) => {
  const checkIfTime = content.field === 'startTime' || content.field === 'endTime'
  let value = type[content.field]

  if (checkIfTime) {
    value = convertDateToUTCTimezoneToDisplay(type[content.field])
  }

  if (content && type) {
    if (content.field === 'whitelist') {
      let whitelistItems = []
      for (let i = 0; i < type.whitelist.length; i++) {
        let whiteListItem = type.whitelist[i]
        whitelistItems.push(whitelistTableItem(whiteListItem).join('\n'))
      }
      return whitelistItems
    } else if (content.field === 'tokens' && content.parent === 'reservedTokenStore') {
      let reservedTokensItems = []
      for (let i = 0; i < type.tokens.length; i++) {
        let reservedTokensItem = type.tokens[i]
        reservedTokensItems.push(reservedTokensTableItem(reservedTokensItem).join('\n'))
      }
      return reservedTokensItems.join('\n')
    } else {
      return `${content.value}${value}`
    }
  } else {
    if (!content) {
      logger.log('WARNING!: content is undefined')
    }
    if (!type) {
      logger.log('WARNING!: type is undefined')
    }
    return ''
  }
}

const whitelistTableItem = whiteListItem => {
  const valBoxLen = 28
  return [
    '|                                            |                            |                            |',
    `|${fillWithSpaces(whiteListItem.addr, ADDR_BOX_LEN)}|${fillWithSpaces(
      whiteListItem.min,
      valBoxLen
    )}|${fillWithSpaces(whiteListItem.max, valBoxLen)}|`,
    '|____________________________________________|____________________________|____________________________|'
  ]
}

const reservedTokensTableItem = reservedTokensItem => {
  const valBoxLen = 56
  const dim = reservedTokensItem.dim === 'percentage' ? '%' : 'tokens'
  return [
    '|                                            |                                                        |',
    `|${fillWithSpaces(reservedTokensItem.addr, ADDR_BOX_LEN)}|${fillWithSpaces(
      `${reservedTokensItem.val} ${dim}`,
      valBoxLen
    )}|`,
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

  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  } else {
    // Others
    let a = document.createElement('a')
    let url = URL.createObjectURL(file)

    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    setTimeout(function() {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

export function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight)
}

export function getDownloadName() {
  const { crowdsale } = contractStore
  const crowdsalePointer = crowdsale.execID || contractStore[crowdsaleStore.proxyName].addr
  const networkID = contractStore.crowdsale.networkID
  let networkName = getNetWorkNameById(networkID)

  if (!networkName) {
    networkName = String(networkID)
  }

  return `${DOWNLOAD_NAME}_${networkName}_${crowdsalePointer}`
}

const getAddr = (contractName, networkID) => {
  return JSON.parse(process.env[`${REACT_PREFIX}${contractName}_ADDRESS`] || {})[networkID]
}

const authOSContractString = contrct => {
  return `Auth-os ${contrct} address: `
}

const getCrowdsaleContractAddr = (strategy, contractName, networkID) => {
  switch (strategy) {
    case CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE:
      return JSON.parse(process.env[`${REACT_PREFIX}${MINTED_PREFIX}${contractName}_ADDRESS`] || {})[networkID]
    case CROWDSALE_STRATEGIES.DUTCH_AUCTION:
      return JSON.parse(process.env[`${REACT_PREFIX}${DUTCH_PREFIX}${contractName}_ADDRESS`] || {})[networkID]
    default:
      return ''
  }
}

const footerElemets = [
  { value: '\n*****************************', parent: 'none', fileValue: '' },
  { value: '*****************************', parent: 'none', fileValue: '' },
  { value: '*****************************', parent: 'none', fileValue: '\n' }
]

const bigHeaderElements = headerName => {
  return [
    { value: '*****************************', parent: 'none', fileValue: '' },
    { value: headerName, parent: 'none', fileValue: '' },
    { value: '*****************************', parent: 'none', fileValue: '\n' }
  ]
}

const smallHeader = headerName => {
  return { value: headerName, parent: 'none', fileValue: '\n' }
}

const whitelistHeaderTableElements = () => {
  // prettier-ignore
  return [
    { value: '________________________________________________________________________________________________________', parent: 'none', fileValue: '' },
    { value: '|                                            |                            |                            |', parent: 'none', fileValue: '' },
    { value: '|                ADDRESS                     |     MIN CAP IN TOKENS      |     MAX CAP IN TOKENS      |', parent: 'none', fileValue: '' },
    { value: '|____________________________________________|____________________________|____________________________|', parent: 'none', fileValue: '' },
  ]
}

const reservedTokensHeaderTableElements = () => {
  // prettier-ignore
  return [
    { value: '_______________________________________________________________________________________________________', parent: 'none', fileValue: '' },
    { value: '|                                            |                                                        |', parent: 'none', fileValue: '' },
    { value: '|                ADDRESS                     |                        VALUE                           |', parent: 'none', fileValue: '' },
    { value: '|____________________________________________|________________________________________________________|', parent: 'none', fileValue: '' },
  ]
}

export const summaryFileContents = networkID => {
  let minCapEl = []
  let crowdsaleWhitelistElements = []
  let tierWhitelistElements = []
  if (
    tierStore.tiers.every(tier => {
      return tier.whitelistEnabled !== 'yes'
    })
  ) {
    minCapEl = [{ field: 'minCap', value: 'Crowdsale global min cap: ', parent: 'tierStore' }]
  } else {
    tierWhitelistElements = [
      '\n',
      ...bigHeaderElements('*********WHITELIST***********'),
      ...whitelistHeaderTableElements(),
      { field: 'whitelist', value: '', parent: 'tierStore' }
    ]
  }

  let reservedTokensElements = []
  if (reservedTokenStore.tokens.length > 0) {
    reservedTokensElements = [
      '\n',
      ...bigHeaderElements('******RESERVED TOKENS********'),
      ...reservedTokensHeaderTableElements(),
      { field: 'tokens', value: '', parent: 'reservedTokenStore' }
    ]
  }

  let rates = []
  let crowdsaleIsModifiableEl = []
  let crowdsaleIsWhitelistedEl = []
  let burn = []
  if (crowdsaleStore.isDutchAuction) {
    rates = [
      { field: 'minRate', value: 'Crowdsale min rate: ', parent: 'tierStore' },
      { field: 'maxRate', value: 'Crowdsale max rate: ', parent: 'tierStore' }
    ]

    crowdsaleIsModifiableEl = [{ value: "Crowdsale's duration is modifiable: ", parent: 'none', fileValue: 'no' }]

    crowdsaleIsWhitelistedEl = [{ field: 'whitelistEnabled', value: 'Crowdsale is whitelisted: ', parent: 'tierStore' }]

    crowdsaleWhitelistElements = tierWhitelistElements

    burn = [{ field: 'burnExcess', value: 'Burn Excess: ', parent: 'tierStore' }]
  }

  const getCrowdsaleID = () => {
    return { field: 'addr', value: authOSContractString('Crowdsale proxy'), parent: crowdsaleStore.proxyName }
  }

  const getManagers = () => {
    if (crowdsaleStore.isDutchAuction) {
      // prettier-ignore
      return [
        { value: authOSContractString('SaleManager'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "CROWDSALE_MANAGER", networkID) },
        { value: authOSContractString('TokenManager'), parent: 'none', fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, "TOKEN_MANAGER", networkID) },
      ]
    }
    return []
  }

  const isDutchStrategy = crowdsaleStore.strategy === CROWDSALE_STRATEGIES.DUTCH_AUCTION
  const labelIdx = isDutchStrategy ? 'DutchIdx' : 'MintedCappedIdx'
  const labelCrowdsale = isDutchStrategy ? 'Dutch Crowdsale' : 'Sale'
  const labelToken = isDutchStrategy ? 'Dutch Token' : 'Token'
  // Dutch strategy has no managers smart-contracts
  const labelSaleManager = 'Sale manager'
  const labelTokenManager = 'Token manager'

  const getCrowdsaleENV = () => {
    if (crowdsaleStore.isMintedCappedCrowdsale) {
      return [
        {
          value: authOSContractString(labelIdx),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'IDX', networkID)
        },
        {
          value: authOSContractString(labelCrowdsale),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'CROWDSALE', networkID)
        },
        {
          value: authOSContractString(labelToken),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'TOKEN', networkID)
        },
        {
          value: authOSContractString(labelSaleManager),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'CROWDSALE_MANAGER', networkID)
        },
        {
          value: authOSContractString(labelTokenManager),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'TOKEN_MANAGER', networkID)
        }
      ]
    } else if (crowdsaleStore.isDutchAuction) {
      return [
        {
          value: authOSContractString(labelIdx),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'IDX', networkID)
        },
        {
          value: authOSContractString(labelCrowdsale),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'CROWDSALE', networkID)
        },
        {
          value: authOSContractString(labelToken),
          parent: 'none',
          fileValue: getCrowdsaleContractAddr(crowdsaleStore.strategy, 'TOKEN', networkID)
        }
      ]
    } else {
      return []
    }
  }

  const { abiEncoded } = contractStore[crowdsaleStore.proxyName]
  const versionFlag = getVersionFlagByStore(crowdsaleStore)
  const optimizationFlag = getOptimizationFlagByStore(crowdsaleStore)

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
      ...burn,
      ...rates,
      ...minCapEl,
      { field: 'supply', value: 'Crowdsale hard cap: ', parent: 'crowdsaleStore' },
      { field: 'startTime', value: 'Crowdsale start time: ', parent: 'tierStore' },
      { field: 'endTime', value: 'Crowdsale end time: ', parent: 'crowdsaleStore' },
      ...crowdsaleIsModifiableEl,
      ...crowdsaleIsWhitelistedEl,
      ...crowdsaleWhitelistElements,
      '\n',
      ...bigHeaderElements('**********METADATA***********'),
      { field: 'proxyName', value: 'Contract name: ', parent: 'crowdsaleStore' },
      { value: 'Compiler version: ', parent: 'none', fileValue: versionFlag },
      { value: 'Optimized: ', parent: 'none', fileValue: optimizationFlag },
      { value: 'Encoded ABI parameters: ', parent: 'none', fileValue: abiEncoded },
      ...footerElemets
    ],
    // prettier-ignore
    auth_os: [
      ...bigHeaderElements('*******AUTH-OS METADATA******'),
      smallHeader('**********REGISTRY***********'),
      { value: authOSContractString('abstract storage'), parent: 'none', fileValue: getAddr("ABSTRACT_STORAGE", networkID) },
      { value: authOSContractString('registry idx'), parent: 'none', fileValue: getAddr("REGISTRY_IDX", networkID) },
      { value: authOSContractString('script executor'), parent: 'none', fileValue: getAddr("REGISTRY_EXEC", networkID) },
      { value: authOSContractString('provider'), parent: 'none', fileValue: getAddr("PROVIDER", networkID) },
      smallHeader('*********CROWDSALE***********'),
      { value: 'Auth-os application name: ', parent: 'none', fileValue: crowdsaleStore.appName },
      getCrowdsaleID(),
      ...getCrowdsaleENV(),
      ...getManagers,
      ...footerElemets
    ],
    files: {
      order: ['crowdsale'],
      crowdsale: {
        name: crowdsaleStore.appName,
        txt: [
          ...bigHeaderElements('*********TIER SETUP**********'),
          { field: 'tier', value: 'Tier name: ', parent: 'tierStore' },
          { field: 'rate', value: 'Tier rate: ', parent: 'tierStore' },
          { field: 'supply', value: 'Tier max cap: ', parent: 'tierStore' },
          { field: 'startTime', value: 'Tier start time: ', parent: 'tierStore' },
          { field: 'endTime', value: 'Tier end time: ', parent: 'tierStore' },
          { field: 'updatable', value: "Tier's duration is modifiable: ", parent: 'tierStore' },
          { field: 'whitelistEnabled', value: 'Tier is whitelisted: ', parent: 'tierStore' },
          ...tierWhitelistElements,
          ...footerElemets
        ]
      }
    }
  }
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
