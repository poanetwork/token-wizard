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
    if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('wei_raised')) {
      crowdsaleInfo.wei_raised = crowdsaleInfo[0]
    }
    if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('team_wallet')) {
      crowdsaleInfo.team_wallet = crowdsaleInfo[1]
    }
    if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('is_initialized')) {
      crowdsaleInfo.is_initialized = crowdsaleInfo[2]
    }
    if (crowdsaleInfo && !crowdsaleInfo.hasOwnProperty('is_finalized')) {
      crowdsaleInfo.is_finalized = crowdsaleInfo[3]
    }
    const wei_raised = crowdsaleInfo.wei_raised ? crowdsaleInfo.wei_raised : crowdsaleInfo[0]
    let tokensSold = 0
    //todo:
    try {
      tokensSold = await getTokensSold(...params).call()
    } catch (e) {
      console.log("e:", "###getTokensSold is not supported in Auth-os###")
    }
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

      const maximumSellableTokensInWei = toBigNumber(wei_raised).plus(remainingWEI).toFixed()
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
            const tier_start = tierStartAndEndDates.tier_start || tierStartAndEndDates[0]
            const tier_end = tierStartAndEndDates.tier_end || tierStartAndEndDates[1]
            const tierDates = setTierDates(tier_start, tier_end)
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

export const isFinalized = async ({ methods }, crowdsaleExecID) => {
  const { addr } = contractStore.abstractStorage
  let params = []
  if (crowdsaleExecID) {
    params.push(addr, crowdsaleExecID)
  }
  const { is_finalized } = await methods.getCrowdsaleInfo(...params).call();
  return is_finalized
}

export const getTiersLength = async () => {
  if (crowdsaleStore.isDutchAuction) return 1

  const { abstractStorage, crowdsale } = contractStore
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    let targetContractName
    if (crowdsale.execID) {
      targetContractName = `idx${crowdsaleStore.contractTargetSuffix}`
    }  else {
      targetContractName = `MintedCappedProxy`
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
    const maxTokensRemaining = toBigNumber(max_tokens_remaining)

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
    const maxTokensRemaining = toBigNumber(max_tokens_remaining)

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
  //todo: update for Proxy
  const { tier_min, minimum_contribution, minimum_purchase_amt, max_tokens_remaining, max_purchase_remaining } = await method.call()
  const minimumContributionDutch = toBigNumber(minimum_contribution).times(`1e-${decimals}`)
  const minimumContributionMintedCapped = toBigNumber(tier_min).times(`1e-${decimals}`)
  const minimumContribution = minimumContributionMintedCapped || minimumContributionDutch
  const minimumPurchaseAmt = toBigNumber(minimum_purchase_amt).times(`1e-${decimals}`)
  //todo:
  const maximumContributionDutch = toBigNumber(max_tokens_remaining).times(`1e-${decimals}`)
  const maximumContributionMintedCapped = toBigNumber(max_purchase_remaining).times(`1e-${decimals}`)
  const maximumContribution = maximumContributionMintedCapped || maximumContributionDutch
  if (isWhitelisted && maximumContribution.eq(0)) {
    return -1
  }
  return minimumContribution.gt(naturalMinCap) ? minimumContribution : minimumPurchaseAmt.gt(naturalMinCap) ? minimumPurchaseAmt : naturalMinCap
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
    return calculateMinContribution(getWhitelistStatus(...params, tier_index, account), token_decimals, naturalMinCap, is_whitelisted)

  } else if (crowdsaleStore.isDutchAuction) {
    const { getCrowdsaleStatus, getWhitelistStatus, getCrowdsaleInfo } = methods
    const crowdsaleStatus = await getCrowdsaleStatus(...params).call()
    const is_whitelisted = crowdsaleStatus.is_whitelisted || crowdsaleStatus[6]

    if (!is_whitelisted) {
      if (owner_balance.gt('0')) return naturalMinCap
      return calculateMinContribution(getCrowdsaleInfo(...params), token_decimals, naturalMinCap)
    }
    return calculateMinContribution(getWhitelistStatus(...params, account), token_decimals, naturalMinCap, is_whitelisted)
  }
}
