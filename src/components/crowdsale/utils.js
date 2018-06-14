import { noContractAlert } from '../../utils/alerts'
import {
  attachToSpecificCrowdsaleContract,
} from '../../utils/blockchainHelpers'
import { contractStore, crowdsalePageStore, tokenStore, web3Store, crowdsaleStore } from '../../stores'
import { toJS } from 'mobx'
import { BigNumber } from 'bignumber.js'
import { removeTrailingNUL } from '../../utils/utils'

BigNumber.config({ DECIMAL_PLACES : 18 })

export const toBigNumber = (value) => isNaN(value) || value === '' ? new BigNumber(0) : new BigNumber(value)

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
    console.log('token name:', token_name)
    console.log('token ticker:', token_ticker)
    console.log('token decimals: ' + token_decimals)

    if (crowdsaleStore.isMintedCappedCrowdsale) {
      token_total_supply = toBigNumber(token_total_supply).times(`1e${token_decimals}`).toFixed()
    }

    tokenStore.setProperty('supply', token_total_supply)
    console.log('token supply:', token_total_supply)

    const tokenAmountOf = crowdsalePageStore.tokenAmountOf || 0

    crowdsalePageStore.setProperty('tokenAmountOf', toBigNumber(tokenAmountOf).plus(token_balance).toFixed())
    console.log('balanceOf:', token_balance)
    console.log('tokenAmountOf:', tokenAmountOf)

  } catch (err) {
    return Promise.reject(err)
  }
}

const chooseRateForDutchAuction = ({ current_rate, start_rate, end_rate, time_remaining }) => {
  return toBigNumber(current_rate).gt(0) ? current_rate : toBigNumber(time_remaining).gt(0) ? start_rate : end_rate
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
    const _wei_raised = crowdsaleInfo._wei_raised ? crowdsaleInfo._wei_raised : crowdsaleInfo[0]
    const tokensSold = await getTokensSold(...params).call()
    let contributors = 0
    //todo:
    try {
      contributors = await getCrowdsaleUniqueBuyers(...params).call()
    } catch (e) {
      console.log("e:", e)
    }
    const { fromWei } = web3Store.web3.utils

    crowdsalePageStore.setProperty('weiRaised', _wei_raised)
    crowdsalePageStore.setProperty('ethRaised', fromWei(_wei_raised, 'ether'))
    crowdsalePageStore.setProperty('tokensSold', tokensSold)
    if (contributors) crowdsalePageStore.setProperty('contributors', contributors)

    if (crowdsaleStore.isMintedCappedCrowdsale) {
      const currentTierInfo = await getCurrentTierInfo(...params).call()
      const tier_price = currentTierInfo.tier_price ? currentTierInfo.tier_price : currentTierInfo[4]
      const crowdsaleMaxRaise = await getCrowdsaleMaxRaise(...params).call()
      const total_sell_cap = crowdsaleMaxRaise.total_sell_cap ? crowdsaleMaxRaise.total_sell_cap : crowdsaleMaxRaise[1]
      const wei_raise_cap = crowdsaleMaxRaise.wei_raise_cap ? crowdsaleMaxRaise.wei_raise_cap : crowdsaleMaxRaise[0]

      crowdsalePageStore.setProperty('rate', tier_price) //should be one token in wei
      crowdsalePageStore.setProperty('maximumSellableTokens', total_sell_cap)
      crowdsalePageStore.setProperty('maximumSellableTokensInWei', wei_raise_cap)
    }

    if (crowdsaleStore.isDutchAuction) {
      //todo: wei_raised -> _wei_raised
      const crowdsaleStatus = await getCrowdsaleStatus(...params).call()
      const { max_sellable } = await isCrowdsaleFull(...params).call()
      const current_rate = chooseRateForDutchAuction(crowdsaleStatus)

      crowdsalePageStore.setProperty('rate', current_rate) //should be one token in wei
      crowdsalePageStore.setProperty('maximumSellableTokens', max_sellable)

      const tokenRemainingBN = toBigNumber(crowdsaleStatus.tokens_remaining)
      const curRateBN = toBigNumber(current_rate) //one token in wei
      const remainingWEI = curRateBN.gt(0)
        ? tokenRemainingBN.div(`1e${tokenStore.decimals}`).multipliedBy(curRateBN).integerValue(BigNumber.ROUND_CEIL)
        : 0
      console.log("remainingWEI:", remainingWEI.toFixed())

      const maximumSellableTokensInWei = toBigNumber(_wei_raised).plus(remainingWEI).toFixed()
      const maximumSellableTokensInETH = fromWei(maximumSellableTokensInWei, 'ether')
      console.log("maximumSellableTokensInETH:", maximumSellableTokensInETH)
      console.log("maximumSellableTokensInWei:", maximumSellableTokensInWei)

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

    console.log(initCrowdsaleContract)

    const registryStorageObj = toJS(contractStore.abstractStorage)
    const { addr } = registryStorageObj
    const { methods } = initCrowdsaleContract

    let params = []
    if (execID) {
      params.push(addr, execID)
    }

    if (crowdsaleStore.isMintedCappedCrowdsale) {
      return getTiersLength()
        .then((tiersLength) => {
          console.log("tiersLength:", tiersLength)
          let getTiersStartAndEndDates = []
          for (let ind = 0; ind < tiersLength; ind++) {
            let getTierStartAndEndDates = methods.getTierStartAndEndDates(...params, ind).call()
            getTiersStartAndEndDates.push(getTierStartAndEndDates)
          }

          return Promise.all(getTiersStartAndEndDates)
        })
        .then((tiersStartAndEndDates) => {
          console.log("tiersStartAndEndDates:", tiersStartAndEndDates)
          let crowdsaleStartDate = 0
          let crowdsaleEndDate = 0
          tiersStartAndEndDates.forEach((tierStartAndEndDates) => {
            const tierDates = setTierDates(tierStartAndEndDates.tier_start, tierStartAndEndDates.tier_end)
            crowdsaleStartDate = crowdsaleStartDate ? Math.min(crowdsaleStartDate, tierDates.startsAtMilliseconds) : tierDates.startsAtMilliseconds
            crowdsaleEndDate = Math.max(crowdsaleEndDate, tierDates.endsAtMilliseconds)
          })

          fillCrowdsalePageStoreDates(crowdsaleStartDate, crowdsaleEndDate)

          resolve()
        })
        .catch(reject)
    } else if (crowdsaleStore.isDutchAuction) {
      methods.getCrowdsaleStartAndEndTimes(...params).call()
        .then((crowdsaleStartAndEndTimes) => {
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
  console.log('startDate:' + startsAtMilliseconds)

  if (!crowdsalePageStore.endDate || crowdsalePageStore.endDate < endsAtMilliseconds)
    crowdsalePageStore.setProperty('endDate', endsAtMilliseconds)
  console.log("endDate:", endsAtMilliseconds)
}

export let isFinalized = (initCrowdsaleContract, crowdsaleExecID) => {
  const { addr } = toJS(contractStore.abstractStorage)
  let params = []
  if (crowdsaleExecID) {
    params.push(addr, crowdsaleExecID)
  }
  let getCrowdsaleInfo = initCrowdsaleContract.methods.getCrowdsaleInfo(...params).call();

  return getCrowdsaleInfo.then(crowdsaleInfo => {
    let isFinalized = crowdsaleInfo.is_finalized;
    return isFinalized;
  })
}

export const getTiersLength = async () => {
  if (crowdsaleStore.isDutchAuction) return 1

  if (crowdsaleStore.isMintedCappedCrowdsale) {
    //todo
    const { methods } = await attachToSpecificCrowdsaleContract(`idx${crowdsaleStore.contractTargetSuffix}`)
    //const { methods } = await attachToSpecificCrowdsaleContract('MintedCappedProxy')
    const { getCrowdsaleTierList } = methods
    const { addr } = toJS(contractStore.abstractStorage)
    let params = []
    if (contractStore.crowdsale.execID) {
      params.push(addr, contractStore.crowdsale.execID)
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
    const whitelist_enabled = currentTierInfo.whitelist_enabled ? currentTierInfo.whitelist_enabled : currentTierInfo[6]
    const tier_tokens_remaining = currentTierInfo.tier_tokens_remaining ? currentTierInfo.tier_tokens_remaining : currentTierInfo[3]
    const tier_price = currentTierInfo.tier_price ? currentTierInfo.tier_price : currentTierInfo[4]
    const tier_index = currentTierInfo.tier_index ? currentTierInfo.tier_index : currentTierInfo[1]
    const token_decimals = await decimals(...params).call()

    const currentRate = toBigNumber(tier_price).times(`1e-${token_decimals}`)
    const tierTokensRemaining = toBigNumber(tier_tokens_remaining).times(currentRate)

    if (!whitelist_enabled) return tierTokensRemaining

    const whitelistStatus = await getWhitelistStatus(...params, tier_index, account).call()
    const max_spend_remaining = whitelistStatus.max_spend_remaining ? whitelistStatus.max_spend_remaining : whitelistStatus[1]
    const maxSpendRemaining = toBigNumber(max_spend_remaining)

    return tierTokensRemaining.lt(maxSpendRemaining) ? tierTokensRemaining : maxSpendRemaining

  } else if (crowdsaleStore.isDutchAuction) {
    //todo: Dutch
    const { getCrowdsaleWhitelist, getCrowdsaleStatus, getWhitelistStatus, decimals } = methods
    const { num_whitelisted } = await getCrowdsaleWhitelist(...params).call()
    const { current_rate, tokens_remaining } = await getCrowdsaleStatus(...params).call()
    const token_decimals = await decimals(...params).call()

    const currentRate = toBigNumber(current_rate).times(`1e-${token_decimals}`)
    const crowdsaleTokensRemaining = toBigNumber(tokens_remaining).times(currentRate)

    if (num_whitelisted === '0') return crowdsaleTokensRemaining

    const { max_spend_remaining } = await getWhitelistStatus(...params, account).call()
    const maxSpendRemaining = toBigNumber(max_spend_remaining)

    return crowdsaleTokensRemaining.lt(maxSpendRemaining) ? crowdsaleTokensRemaining : maxSpendRemaining
  }
}

const getRate = async (addr, execID, methods) => {
  let params = []
  if (execID) {
    params.push(addr, execID)
  }
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    const currentTierInfo = await methods.getCurrentTierInfo(...params).call()
    const tier_price = currentTierInfo.tier_price ? currentTierInfo.tier_price : currentTierInfo[4]
    return toBigNumber(tier_price)
  } else if (crowdsaleStore.isDutchAuction) {
    //todo: Dutch
    const { current_rate } = await methods.getCrowdsaleStatus(...params).call()
    return toBigNumber(current_rate)
  }

  return toBigNumber('0')
}

const calculateMinContribution = async (method, decimals, naturalMinCap, isWhitelisted) => {
  //todo
  const { minimum_contribution, max_spend_remaining } = await method.call()
  const minimumContribution = toBigNumber(minimum_contribution).times(`1e-${decimals}`)
  const maximumContribution = toBigNumber(max_spend_remaining)
  if (isWhitelisted && maximumContribution.eq(0)) {
    return -1
  }
  return minimumContribution.gt(naturalMinCap) ? minimumContribution : naturalMinCap
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

  let isWhitelisted = false
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    const { getCurrentTierInfo, getWhitelistStatus, getCrowdsaleInfo } = methods
    const currentTierInfo = await getCurrentTierInfo(...params).call()
    const whitelist_enabled = currentTierInfo.whitelist_enabled ? currentTierInfo.whitelist_enabled : currentTierInfo[6]
    const tier_index = currentTierInfo.tier_index ? currentTierInfo.tier_index : currentTierInfo[1]

    if (!whitelist_enabled) {
      if (owner_balance.gt('0')) return naturalMinCap
      return calculateMinContribution(getCrowdsaleInfo(...params), token_decimals, naturalMinCap)
    } else {
      isWhitelisted = true
    }
    return calculateMinContribution(getWhitelistStatus(...params, tier_index, account), token_decimals, naturalMinCap, isWhitelisted)

  } else if (crowdsaleStore.isDutchAuction) {
    const { getCrowdsaleWhitelist, getWhitelistStatus, getCrowdsaleInfo } = methods
    const { num_whitelisted } = await getCrowdsaleWhitelist(...params).call()

    if (num_whitelisted === '0') {
      if (owner_balance.gt('0')) return naturalMinCap
      return calculateMinContribution(getCrowdsaleInfo(...params), token_decimals, naturalMinCap)
    } else {
      isWhitelisted = true
    }
    return calculateMinContribution(getWhitelistStatus(...params, account), token_decimals, naturalMinCap, isWhitelisted)
  }
}
