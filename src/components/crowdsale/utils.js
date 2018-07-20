import { noContractAlert } from '../../utils/alerts'
import { attachToSpecificCrowdsaleContract } from '../../utils/blockchainHelpers'
import { contractStore, crowdsalePageStore, tokenStore, web3Store, crowdsaleStore } from '../../stores'
import { toJS } from 'mobx'
import { removeTrailingNUL, toBigNumber } from '../../utils/utils'
import { BigNumber } from 'bignumber.js'
import logdown from 'logdown'

const logger = logdown('TW:crowdsale:utils')

export let getTokenData = async (initCrowdsaleContract, execID, account) => {
  if (!initCrowdsaleContract) {
    noContractAlert()
    return Promise.reject('no contract')
  }

  try {
    const { name, symbol, decimals, totalSupply, balanceOf } = initCrowdsaleContract.methods
    const { addr } = contractStore.abstractStorage
    const { toAscii } = web3Store.web3.utils

    let params = []
    if (execID) {
      params.push(addr, execID)
    }

    let token_name = await name(...params).call()
    let token_ticker = await symbol(...params).call()
    const token_decimals = await decimals(...params).call()
    const token_balance = await balanceOf(...params, account).call()
    let token_total_supply = await totalSupply(...params).call()

    if (execID) {
      token_name = removeTrailingNUL(toAscii(token_name))
      token_ticker = removeTrailingNUL(toAscii(token_ticker))
    }

    tokenStore.setProperty('name', token_name)
    tokenStore.setProperty('ticker', token_ticker)
    tokenStore.setProperty('decimals', token_decimals)
    logger.log('token name:', token_name)
    logger.log('token ticker:', token_ticker)
    logger.log('token decimals: ' + token_decimals)

    if (crowdsaleStore.isMintedCappedCrowdsale) {
      token_total_supply = toBigNumber(token_total_supply)
        .times(`1e${token_decimals}`)
        .toFixed()
    }

    tokenStore.setProperty('supply', token_total_supply)
    logger.log('token supply:', token_total_supply)

    const tokenAmountOf = crowdsalePageStore.tokenAmountOf || 0

    crowdsalePageStore.setProperty(
      'tokenAmountOf',
      toBigNumber(tokenAmountOf)
        .plus(token_balance)
        .toFixed()
    )
    logger.log('balanceOf:', token_balance)
    logger.log('tokenAmountOf:', tokenAmountOf)
  } catch (err) {
    return Promise.reject(err)
  }
}

export let getCrowdsaleData = async (initCrowdsaleContract, execID) => {
  if (!initCrowdsaleContract) {
    noContractAlert()
    return Promise.reject('no contract')
  }

  try {
    const { addr } = contractStore.abstractStorage
    const {
      getCrowdsaleInfo,
      getTokensSold,
      getCrowdsaleUniqueBuyers,
      getCurrentTierInfo,
      getCrowdsaleMaxRaise,
      getCrowdsaleStatus,
      isCrowdsaleFull
    } = initCrowdsaleContract.methods

    let params = []
    if (execID) {
      params.push(addr, execID)
    }

    const crowdsaleInfo = await getCrowdsaleInfo(...params).call()
    if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('wei_raised')) {
      crowdsaleInfo.wei_raised = crowdsaleInfo[0]
    }
    if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('team_wallet')) {
      crowdsaleInfo.team_wallet = crowdsaleInfo[1]
    }
    if (crowdsaleStore.isMintedCappedCrowdsale) {
      if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('is_initialized')) {
        crowdsaleInfo.is_initialized = crowdsaleInfo[2]
      }
      if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('is_finalized')) {
        crowdsaleInfo.is_finalized = crowdsaleInfo[3]
      }
    } else if (crowdsaleStore.isDutchAuction) {
      if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('is_initialized')) {
        crowdsaleInfo.is_initialized = crowdsaleInfo[3]
      }
      if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('is_finalized')) {
        crowdsaleInfo.is_finalized = crowdsaleInfo[4]
      }
    }
    const wei_raised = crowdsaleInfo.wei_raised
    let tokensSold = await getTokensSold(...params).call()
    logger.log('tokensSold:', tokensSold)
    const contributors = await getCrowdsaleUniqueBuyers(...params).call()
    const { fromWei } = web3Store.web3.utils
    crowdsalePageStore.setProperty('weiRaised', wei_raised)
    crowdsalePageStore.setProperty('ethRaised', fromWei(wei_raised, 'ether'))
    crowdsalePageStore.setProperty('tokensSold', tokensSold)
    if (contributors) crowdsalePageStore.setProperty('contributors', contributors)

    if (crowdsaleStore.isMintedCappedCrowdsale) {
      const currentTierInfo = await getCurrentTierInfo(...params).call()
      const tier_price = currentTierInfo.tier_price || currentTierInfo[4]
      const crowdsaleMaxRaise = await getCrowdsaleMaxRaise(...params).call()
      const total_sell_cap = crowdsaleMaxRaise.total_sell_cap || crowdsaleMaxRaise[1]
      const wei_raise_cap = crowdsaleMaxRaise.wei_raise_cap || crowdsaleMaxRaise[0]

      crowdsalePageStore.setProperty('rate', tier_price) //should be one token in wei
      crowdsalePageStore.setProperty('maximumSellableTokens', total_sell_cap)
      crowdsalePageStore.setProperty('maximumSellableTokensInWei', wei_raise_cap)
    }

    if (crowdsaleStore.isDutchAuction) {
      const crowdsaleStatus = await getCrowdsaleStatus(...params).call()
      crowdsaleStatus.start_rate = crowdsaleStatus.start_rate || crowdsaleStatus[0]
      crowdsaleStatus.end_rate = crowdsaleStatus.end_rate || crowdsaleStatus[1]
      crowdsaleStatus.current_rate = crowdsaleStatus.current_rate || crowdsaleStatus[2]
      crowdsaleStatus.time_remaining = crowdsaleStatus.time_remaining || crowdsaleStatus[4]
      const tokens_remaining = crowdsaleStatus.tokens_remaining || crowdsaleStatus[5]
      const _isCrowdsaleFull = await isCrowdsaleFull(...params).call()
      const max_sellable = _isCrowdsaleFull.max_sellable || _isCrowdsaleFull[1]

      crowdsalePageStore.setProperty('rate', crowdsaleStatus.current_rate) //should be one token in wei
      crowdsalePageStore.setProperty('startRate', crowdsaleStatus.start_rate)
      crowdsalePageStore.setProperty('endRate', crowdsaleStatus.end_rate)
      crowdsalePageStore.setProperty('maximumSellableTokens', max_sellable)

      const tokenRemainingBN = toBigNumber(tokens_remaining)
      const curRateBN = toBigNumber(crowdsaleStatus.current_rate) //one token in wei
      const remainingWEI = curRateBN.gt(0)
        ? tokenRemainingBN
            .div(`1e${tokenStore.decimals}`)
            .multipliedBy(curRateBN)
            .integerValue(BigNumber.ROUND_CEIL)
        : 0
      logger.log('remainingWEI:', remainingWEI.toFixed())

      const maximumSellableTokensInWei = toBigNumber(wei_raised)
        .plus(remainingWEI)
        .toFixed()
      const maximumSellableTokensInETH = fromWei(maximumSellableTokensInWei, 'ether')
      logger.log('maximumSellableTokensInETH:', maximumSellableTokensInETH)
      logger.log('maximumSellableTokensInWei:', maximumSellableTokensInWei)

      crowdsalePageStore.setProperty('maximumSellableTokensInWei', maximumSellableTokensInWei)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

export function initializeAccumulativeData() {
  crowdsalePageStore.setProperty('tokenAmountOf', 0)
  return Promise.resolve()
}

export let getCrowdsaleTargetDates = (initCrowdsaleContract, execID) => {
  return new Promise((resolve, reject) => {
    if (!initCrowdsaleContract) {
      noContractAlert()
      reject('no contract')
    }

    logger.log(initCrowdsaleContract)

    const registryStorageObj = toJS(contractStore.abstractStorage)
    const { addr } = registryStorageObj
    const { methods } = initCrowdsaleContract

    let params = []
    if (execID) {
      params.push(addr, execID)
    }

    if (crowdsaleStore.isMintedCappedCrowdsale) {
      return getTiersLength()
        .then(tiersLength => {
          logger.log('tiersLength:', tiersLength)
          let getTiersStartAndEndDates = []
          for (let ind = 0; ind < tiersLength; ind++) {
            let getTierStartAndEndDates = methods.getTierStartAndEndDates(...params, ind).call()
            getTiersStartAndEndDates.push(getTierStartAndEndDates)
          }

          return Promise.all(getTiersStartAndEndDates)
        })
        .then(tiersStartAndEndDates => {
          logger.log('tiersStartAndEndDates:', tiersStartAndEndDates)
          let crowdsaleStartDate = 0
          let crowdsaleEndDate = 0
          tiersStartAndEndDates.forEach(tierStartAndEndDates => {
            const tier_start = tierStartAndEndDates.tier_start || tierStartAndEndDates[0]
            const tier_end = tierStartAndEndDates.tier_end || tierStartAndEndDates[1]
            const tierDates = setTierDates(tier_start, tier_end)
            crowdsaleStartDate = crowdsaleStartDate
              ? Math.min(crowdsaleStartDate, tierDates.startsAtMilliseconds)
              : tierDates.startsAtMilliseconds
            crowdsaleEndDate = Math.max(crowdsaleEndDate, tierDates.endsAtMilliseconds)
          })

          fillCrowdsalePageStoreDates(crowdsaleStartDate, crowdsaleEndDate)

          resolve()
        })
        .catch(reject)
    } else if (crowdsaleStore.isDutchAuction) {
      methods
        .getCrowdsaleStartAndEndTimes(...params)
        .call()
        .then(crowdsaleStartAndEndTimes => {
          crowdsaleStartAndEndTimes.start_time = crowdsaleStartAndEndTimes.start_time || crowdsaleStartAndEndTimes[0]
          crowdsaleStartAndEndTimes.end_time = crowdsaleStartAndEndTimes.end_time || crowdsaleStartAndEndTimes[1]
          const tierDates = setTierDates(crowdsaleStartAndEndTimes.start_time, crowdsaleStartAndEndTimes.end_time)

          fillCrowdsalePageStoreDates(tierDates.startsAtMilliseconds, tierDates.endsAtMilliseconds)

          resolve()
        })
        .catch(reject)
    } else {
      reject('no strategy available')
    }
  })
}

let setTierDates = (startTime, endTime) => {
  const startsAtMilliseconds = startTime * 1000
  const endsAtMilliseconds = endTime * 1000

  crowdsalePageStore.addTier({
    startDate: startsAtMilliseconds,
    endDate: endsAtMilliseconds
  })

  return {
    startsAtMilliseconds,
    endsAtMilliseconds
  }
}

let fillCrowdsalePageStoreDates = (startsAtMilliseconds, endsAtMilliseconds) => {
  if (!crowdsalePageStore.startDate || crowdsalePageStore.startDate > startsAtMilliseconds)
    crowdsalePageStore.startDate = startsAtMilliseconds
  logger.log('startDate:' + startsAtMilliseconds)

  if (!crowdsalePageStore.endDate || crowdsalePageStore.endDate < endsAtMilliseconds)
    crowdsalePageStore.setProperty('endDate', endsAtMilliseconds)
  logger.log('endDate:', endsAtMilliseconds)
}

/**
 * Check if a crowdsale is finalized
 * @param methods
 * @param crowdsaleExecID
 * @returns {Promise<*>}
 */
export const isFinalized = async ({ methods }, crowdsaleExecID) => {
  const { addr } = contractStore.abstractStorage
  let params = []
  if (crowdsaleExecID) {
    params.push(addr, crowdsaleExecID)
  }
  const crowdsale = await methods.getCrowdsaleInfo(...params).call()
  const { isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore
  let isFinalized = false
  if (isMintedCappedCrowdsale) {
    //Value is finalized is the index #3
    isFinalized = crowdsale.is_finalized || crowdsale[3]
  } else if (isDutchAuction) {
    //Value is finalized is the index #4
    isFinalized = crowdsale.is_finalized || crowdsale[4]
  }
  logger.log(`Crowdsale Info: Is finalized`, isFinalized)
  return isFinalized
}

/**
 * Check if a crowdsale is ended
 * @param methods
 * @param crowdsaleExecID
 * @returns {Promise<boolean>}
 */
export const isEnded = async ({ methods }, crowdsaleExecID) => {
  const { addr } = contractStore.abstractStorage
  let params = []
  if (crowdsaleExecID) {
    params.push(addr, crowdsaleExecID)
  }
  const crowdsaleStartAndEndTimes = await methods.getCrowdsaleStartAndEndTimes(...params).call()
  logger.log(`Crowdsale start time:`, crowdsaleStartAndEndTimes[0])
  logger.log(`Crowdsale end time::`, crowdsaleStartAndEndTimes[1])
  const end_time = crowdsaleStartAndEndTimes.end_time || crowdsaleStartAndEndTimes[1]
  return end_time * 1000 <= Date.now()
}

/**
 * Check if a crowdsale is sold out
 * @param methods
 * @param crowdsaleExecID
 * @returns {Promise<*>}
 */
export const isSoldOut = async ({ methods }, crowdsaleExecID) => {
  const { addr } = contractStore.abstractStorage
  let params = []
  if (crowdsaleExecID) {
    params.push(addr, crowdsaleExecID)
  }
  const isCrowdsaleFull = await methods.isCrowdsaleFull(...params).call()
  if (isCrowdsaleFull && !isCrowdsaleFull.hasOwnProperty('is_crowdsale_full')) {
    isCrowdsaleFull.is_crowdsale_full = isCrowdsaleFull[0]
  }
  return isCrowdsaleFull.is_crowdsale_full
}

export const getTiersLength = async () => {
  if (crowdsaleStore.isDutchAuction) return 1

  const { abstractStorage, crowdsale } = contractStore
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    let targetContractName
    if (crowdsale.execID) {
      targetContractName = `idx${crowdsaleStore.contractTargetSuffix}`
    } else {
      targetContractName = crowdsaleStore.proxyName
    }
    const { methods } = await attachToSpecificCrowdsaleContract(targetContractName)
    const { getCrowdsaleTierList } = methods
    const { addr } = toJS(abstractStorage)
    let params = []
    if (crowdsale.execID) {
      params.push(addr, crowdsale.execID)
    }
    const tiers = await getCrowdsaleTierList(...params).call()

    return tiers.length
  }

  return Promise.reject(0)
}

export const getContractStoreProperty = (contract, property) => {
  const text = contractStore && contractStore[contract] && contractStore[contract][property]
  return text === undefined ? '' : text
}

export const getUserMaxLimits = async (addr, execID, methods, account) => {
  let params = []
  if (execID) {
    params.push(addr, execID)
  }
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    const { getCurrentTierInfo, getWhitelistStatus, decimals } = methods
    const currentTierInfo = await getCurrentTierInfo(...params).call()
    const is_whitelisted = currentTierInfo.is_whitelisted || currentTierInfo[7]
    const tier_tokens_remaining = currentTierInfo.tier_tokens_remaining || currentTierInfo[3]
    const tier_price = currentTierInfo.tier_price || currentTierInfo[4]
    const tier_index = currentTierInfo.tier_index || currentTierInfo[1]
    const token_decimals = await decimals(...params).call()

    const currentRate = toBigNumber(tier_price).times(`1e-${token_decimals}`)
    const tierTokensRemaining = toBigNumber(tier_tokens_remaining).times(currentRate)

    if (!is_whitelisted) return tierTokensRemaining

    const whitelistStatus = await getWhitelistStatus(...params, tier_index, account).call()
    const max_tokens_remaining = whitelistStatus.max_tokens_remaining || whitelistStatus[1]
    const maxTokensRemaining = toBigNumber(max_tokens_remaining).times(currentRate)

    return tierTokensRemaining.lt(maxTokensRemaining) ? tierTokensRemaining : maxTokensRemaining
  } else if (crowdsaleStore.isDutchAuction) {
    const { getCrowdsaleStatus, getWhitelistStatus, decimals } = methods
    const crowdsaleStatus = await getCrowdsaleStatus(...params).call()
    const is_whitelisted = crowdsaleStatus.is_whitelisted || crowdsaleStatus[6]
    const current_rate = crowdsaleStatus.current_rate || crowdsaleStatus[2]
    const tokens_remaining = crowdsaleStatus.tokens_remaining || crowdsaleStatus[5]
    const token_decimals = await decimals(...params).call()

    const currentRate = toBigNumber(current_rate).times(`1e-${token_decimals}`)
    const crowdsaleTokensRemaining = toBigNumber(tokens_remaining).times(currentRate)

    if (!is_whitelisted) return crowdsaleTokensRemaining

    const whitelistStatus = await getWhitelistStatus(...params, account).call()
    const max_tokens_remaining = whitelistStatus.max_tokens_remaining || whitelistStatus[1]
    const maxTokensRemaining = toBigNumber(max_tokens_remaining).times(currentRate)

    return crowdsaleTokensRemaining.lt(maxTokensRemaining) ? crowdsaleTokensRemaining : maxTokensRemaining
  }
}

const getRate = async (addr, execID, methods) => {
  let params = []
  if (execID) {
    params.push(addr, execID)
  }
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    const currentTierInfo = await methods.getCurrentTierInfo(...params).call()
    const tier_price = currentTierInfo.tier_price || currentTierInfo[4]
    return toBigNumber(tier_price)
  } else if (crowdsaleStore.isDutchAuction) {
    const crowdsaleStatus = await methods.getCrowdsaleStatus(...params).call()
    const current_rate = crowdsaleStatus.current_rate || crowdsaleStatus[2]
    return toBigNumber(current_rate)
  }

  return toBigNumber('0')
}

const calculateMinContribution = async (method, decimals, naturalMinCap, isWhitelisted) => {
  const crowdsaleData = await method.call()
  let { tier_min, minimum_contribution, minimum_purchase_amt, max_tokens_remaining } = crowdsaleData
  if (!tier_min) {
    if (method._method.name === 'getCurrentTierInfo') {
      tier_min = crowdsaleData[5]
    }
  }
  if (!minimum_contribution) {
    if (method._method.name === 'getCrowdsaleInfo') {
      minimum_contribution = crowdsaleData[2]
    }
  }
  if (!minimum_purchase_amt && !max_tokens_remaining) {
    if (method._method.name === 'getWhitelistStatus') {
      minimum_purchase_amt = crowdsaleData[0]
      max_tokens_remaining = crowdsaleData[1]
    }
  }
  const minimumContribution = toBigNumber(tier_min || minimum_contribution).times(`1e-${decimals}`) //global min cap
  const minimumPurchaseAmt = toBigNumber(minimum_purchase_amt).times(`1e-${decimals}`) //whitelist min cap
  const maximumContribution = toBigNumber(max_tokens_remaining).times(`1e-${decimals}`)
  if ((isWhitelisted && maximumContribution.eq(0)) || !isFinite(naturalMinCap)) {
    return -1
  }
  return minimumContribution.gt(naturalMinCap)
    ? minimumContribution
    : minimumPurchaseAmt.gt(naturalMinCap)
      ? minimumPurchaseAmt
      : naturalMinCap
}

export const getUserMinLimits = async (addr, execID, methods, account) => {
  const { decimals, balanceOf } = methods
  let params = []
  if (execID) {
    params.push(addr, execID)
  }
  const token_decimals = await decimals(...params).call()
  const owner_balance = toBigNumber(await balanceOf(...params, account).call())
  const rate = await getRate(addr, execID, methods)
  const { DECIMAL_PLACES } = rate.constructor.config()

  rate.constructor.config({ DECIMAL_PLACES: +token_decimals })

  const minimumByRate = rate.pow(-1)
  const minimumByDecimals = toBigNumber(`1e-${token_decimals}`)
  const naturalMinCap = minimumByRate.gt(minimumByDecimals) ? minimumByRate : minimumByDecimals

  rate.constructor.config({ DECIMAL_PLACES })

  if (crowdsaleStore.isMintedCappedCrowdsale) {
    const { getCurrentTierInfo, getWhitelistStatus } = methods
    const currentTierInfo = await getCurrentTierInfo(...params).call()
    const is_whitelisted = currentTierInfo.is_whitelisted || currentTierInfo[7]
    const tier_index = currentTierInfo.tier_index || currentTierInfo[1]

    if (!is_whitelisted) {
      if (owner_balance.gt('0')) return naturalMinCap
      return calculateMinContribution(getCurrentTierInfo(...params), token_decimals, naturalMinCap)
    }
    return calculateMinContribution(
      getWhitelistStatus(...params, tier_index, account),
      token_decimals,
      naturalMinCap,
      is_whitelisted
    )
  } else if (crowdsaleStore.isDutchAuction) {
    const { getCrowdsaleStatus, getWhitelistStatus, getCrowdsaleInfo } = methods
    const crowdsaleStatus = await getCrowdsaleStatus(...params).call()
    const is_whitelisted = crowdsaleStatus.is_whitelisted || crowdsaleStatus[6]

    if (!is_whitelisted) {
      if (owner_balance.gt('0')) return naturalMinCap
      return calculateMinContribution(getCrowdsaleInfo(...params), token_decimals, naturalMinCap)
    }
    return calculateMinContribution(
      getWhitelistStatus(...params, account),
      token_decimals,
      naturalMinCap,
      is_whitelisted
    )
  }
}

/**
 * Get user max contribution token
 * @param addr
 * @param execID
 * @param methods
 * @param account
 * @returns {Promise<BigNumber>}
 */
export const getUserMaxContribution = async (addr, execID, methods, account) => {
  let params = []
  if (execID) {
    params.push(addr, execID)
  }
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    const { getCurrentTierInfo, getWhitelistStatus, decimals } = methods
    const currentTierInfo = await getCurrentTierInfo(...params).call()

    //get properties
    const isWhitelisted = currentTierInfo.is_whitelisted || currentTierInfo[7]
    const tierTokensRemaining = currentTierInfo.tier_tokens_remaining || currentTierInfo[3]
    const tierIndex = currentTierInfo.tier_index || currentTierInfo[1]

    const tokenDecimals = await decimals(...params).call()
    const tierTokensRemainingTimes = toBigNumber(tierTokensRemaining).times(`1e-${tokenDecimals}`)
    if (!isWhitelisted) {
      return tierTokensRemainingTimes
    }

    const whitelistStatus = await getWhitelistStatus(...params, tierIndex, account).call()
    const maxTokensRemaining = whitelistStatus.max_tokens_remaining || whitelistStatus[1]
    const maxTokensRemainingWithTimes = toBigNumber(maxTokensRemaining).times(`1e-${tokenDecimals}`)

    return tierTokensRemainingTimes.lt(maxTokensRemainingWithTimes)
      ? tierTokensRemainingTimes
      : maxTokensRemainingWithTimes
  } else if (crowdsaleStore.isDutchAuction) {
    const { getCrowdsaleStatus, getWhitelistStatus, decimals } = methods
    const crowdsaleStatus = await getCrowdsaleStatus(...params).call()

    //get properties
    const isWhitelisted = crowdsaleStatus.is_whitelisted || crowdsaleStatus[6]
    const tokensRemaining = crowdsaleStatus.tokens_remaining || crowdsaleStatus[5]
    const tokenDecimals = await decimals(...params).call()

    const crowdsaleTokensRemaining = toBigNumber(tokensRemaining).times(`1e-${tokenDecimals}`)

    if (!isWhitelisted) {
      return crowdsaleTokensRemaining
    }

    const whitelistStatus = await getWhitelistStatus(...params, account).call()
    const maxTokensRemaining = whitelistStatus.max_tokens_remaining || whitelistStatus[1]
    const maxTokensRemainingTimes = toBigNumber(maxTokensRemaining).times(`1e-${tokenDecimals}`)

    return crowdsaleTokensRemaining.lt(maxTokensRemainingTimes) ? crowdsaleTokensRemaining : maxTokensRemainingTimes
  }
}

/**
 * Check if crowdsale is full, related to an account
 * @param addr
 * @param execID
 * @param methods
 * @param account
 * @returns {Promise<*|boolean>}
 */
export const isCrowdSaleFull = async (addr, execID, methods, account) => {
  let params = []
  if (execID) {
    params.push(addr, execID)
  }

  const { isCrowdsaleFull } = methods
  let isCrowdsaleFullInstance = await isCrowdsaleFull(...params).call()
  const userMaxContribution = await getUserMaxContribution(addr, execID, methods, account)

  const isCrowdsaleFullValue = isCrowdsaleFullInstance.is_crowdsale_full || isCrowdsaleFullInstance[0]
  const checkIfCrowdsaleIsFull = isCrowdsaleFullValue || userMaxContribution.toFixed() == 0

  logger.log(`Crowdsale is full`, checkIfCrowdsaleIsFull)

  return checkIfCrowdsaleIsFull
}

/**
 * Get user balance by params
 * @param addr
 * @param execID
 * @param account
 * @returns {Promise<BigNumber>}
 */
export const getUserBalanceByParams = async (addr, execID, account) => {
  const crowdsaleContract = await getInitCrowdsale()
  const { balanceOf, decimals } = crowdsaleContract.methods

  let params = []
  if (execID) {
    params.push(addr, execID)
  }

  let ownerBalance = await balanceOf(...params, account).call()

  const tokenDecimals = await decimals(...params).call()
  ownerBalance = toBigNumber(ownerBalance).times(`1e-${tokenDecimals}`)

  return ownerBalance
}

/**
 * Get user balance by contract
 * @returns {string}
 */
export const getUserBalanceByStore = () => {
  const { tokenAmountOf } = crowdsalePageStore
  const { decimals } = tokenStore

  const tokenDecimals = !isNaN(decimals) ? decimals : 0

  //balance
  return tokenAmountOf
    ? toBigNumber(tokenAmountOf)
      .div(`1e${tokenDecimals}`)
      .toFixed()
    : '0'
}

/**
 * Get init crowdSale
 * @returns {Promise<*>}
 */
export const getInitCrowdsale = async () => {
  let target
  if (contractStore.crowdsale.execID) {
    const targetPrefix = 'idx'
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    target = `${targetPrefix}${targetSuffix}`
  } else {
    target = crowdsaleStore.proxyName
  }

  return await attachToSpecificCrowdsaleContract(target)
}
