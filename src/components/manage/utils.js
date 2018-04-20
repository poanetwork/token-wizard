import { isObservableArray } from 'mobx'
import {
  getCurrentAccount,
  sendTXToContract,
  methodToExec
} from '../../utils/blockchainHelpers'
import { contractStore, crowdsaleStore, generalStore, tierStore, tokenStore, web3Store } from '../../stores'
import { VALIDATION_TYPES } from '../../utils/constants'
import { toFixed } from '../../utils/utils'
import { toBigNumber } from '../crowdsale/utils'
import { generateContext } from '../stepFour/utils'
import { BigNumber } from 'bignumber.js'

const { VALID } = VALIDATION_TYPES

const formatDate = timestamp => {
  const ten = i => (i < 10 ? '0' : '') + i
  const date = new Date(timestamp * 1000)
  const YYYY = date.getFullYear()
  const MM = ten(date.getMonth() + 1)
  const DD = ten(date.getDate())
  const HH = ten(date.getHours())
  const II = ten(date.getMinutes())

  return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + II
}

export const updateTierAttribute = (attribute, value, tierIndex) => {
  let methodInterface
  let getParams
  const { decimals } = tokenStore
  let methods = {
    //startTime: 'setStartsAt', // startTime is not changed from migration to Auth_os
    endTime: 'updateTierDuration',
    //supply: 'setMaximumSellableTokens', // supply is not changed from migration to Auth_os
    //rate: 'updateRate', // rate is not changed from migration to Auth_os
    whitelist: 'whitelistMultiForTier'
  }

  if (attribute === 'startTime' || attribute === 'endTime' || attribute === 'supply' || attribute === 'whitelist') {
    /*if (attribute === 'startTime') {
      value = toFixed(parseInt(Date.parse(value) / 1000, 10).toString())
    } else */

    if (attribute === 'endTime') {
      let { startTime, endTime } = tierStore.tiers[tierIndex]
      console.log(startTime, endTime)
      const duration = new Date(endTime) - new Date(startTime)
      const durationBN = (toBigNumber(duration)/1000).toFixed()
      value = durationBN
      methodInterface = ["uint256","uint256","bytes"]
      getParams = updateDurationParams
    } /*else if (attribute === 'supply') {
      value = toBigNumber(value).times(`1e${tokenStore.decimals}`).toFixed()
    } */else if (attribute === 'whitelist')  {
      // whitelist
      const rate = tierStore.tiers[tierIndex].rate;
      const rateBN = new BigNumber(rate)
      const oneTokenInETH = rateBN.pow(-1).toFixed()
      const oneTokenInWEI = web3Store.web3.utils.toWei(oneTokenInETH, 'ether')
      value = value.reduce((toAdd, whitelist) => {
        toAdd[0].push(whitelist.addr)
        toAdd[1].push(toBigNumber(whitelist.min).times(oneTokenInWEI).toFixed())
        toAdd[2].push(toBigNumber(whitelist.max).times(oneTokenInWEI).toFixed())
        //toAdd[1].push(whitelist.min * 10 ** decimals ? toFixed((whitelist.min * 10 ** decimals).toString()) : 0)
        //toAdd[2].push(whitelist.max * 10 ** decimals ? toFixed((whitelist.max * 10 ** decimals).toString()) : 0)
        return toAdd
      }, [[], [], []])
      methodInterface = ["uint256","address[]","uint256[]","uint256[]","bytes"]
      getParams = updateWhitelistParams
    }
  }

  /*if (attribute === 'rate') {
    const oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, 1 / Number(value))
    value = web3Store.web3.utils.toWei(oneTokenInETH, 'ether')
  }*/

  console.log("value:", value)

  console.log("attribute:", attribute)
  console.log("methods[attribute]:", methods[attribute])

  console.log("tierIndex:", tierIndex)
  console.log("value:", value)

  const paramsToExec = [ tierIndex, value, methodInterface ] // tierIndex + 1 due to `The index of the tier whose duration will be updated (indexes in the tier list are 1-indexed: 0 is an invalid index)`

  const method = methodToExec(`${methods[attribute]}(${methodInterface.join(',')})`, "crowdsaleConsole", getParams, paramsToExec)

  return getCurrentAccount()
    .then(account => {
      const opts = { gasPrice: generalStore.gasPrice, from: account }
      return method.estimateGas(opts)
      .then(estimatedGas => {
        opts.gasLimit = estimatedGas
        return sendTXToContract(method.send(opts))
      })
    })
}

const updateDurationParams = (tierIndex, duration, methodInterface) => {
  console.log(tierIndex, duration)
  const { web3 } = web3Store
  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [tierIndex, duration, context]);
  return encodedParameters;
}

const updateWhitelistParams = (tierIndex, [addr, min, max], methodInterface) => {
  console.log(tierIndex, addr, min, max, methodInterface)
  const { web3 } = web3Store
  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [tierIndex, addr, min, max, context]);
  return encodedParameters;
}

const crowdsaleData = (tier, crowdsale, token) => {
  const { web3 } = web3Store
  let startsAt = tier.tier_start
  let endsAt = tier.tier_end
  let rate = tier.tier_price
  let tokenName = web3.utils.toAscii(token.token_name)
  let tokenSymbol = web3.utils.toAscii(token.token_symbol)
  let decimals = token.token_decimals
  let multisigWallet = crowdsale.team_wallet
  let tierName = web3.utils.toAscii(tier.tier_name)
  let maximumSellableTokens = tier.tier_sell_cap
  let isUpdatable = tier.duration_is_modifiable
  let isWhitelisted = tier.whitelist_enabled
  let isFinalized = crowdsale.is_finalized
  let whitelistAccounts = tier.whitelist

  return Promise.all([
    multisigWallet,
    startsAt,
    endsAt,
    rate,
    isUpdatable,
    isWhitelisted,
    maximumSellableTokens,
    isFinalized,
    tierName,
    whitelistAccounts,
    [tokenName, tokenSymbol, decimals]
  ]);
}

export const processTier = (tier, crowdsale, token, tierNum) => {
  console.log("tier:", tier)
  console.log("crowdsale:", crowdsale)
  console.log("token:", token)
  const { web3 } = web3Store

  const newTier = {
    whitelist: []
  }

  const initialValues = {}

  return crowdsaleData(tier, crowdsale, token)
    .then(([
             walletAddress,
             startsAt,
             endsAt,
             rate,
             updatable,
             isWhitelisted,
             maximumSellableTokens,
             isFinalized,
             name,
             whitelistAccounts,
             [tokenName, tokenSymbol, decimals]
           ]) => {
      crowdsaleStore.setSelectedProperty('finalized', isFinalized)
      crowdsaleStore.setSelectedProperty('updatable', crowdsaleStore.selected.updatable || updatable)

      newTier.walletAddress = walletAddress
      newTier.startTime = formatDate(startsAt)
      newTier.endTime = formatDate(endsAt)
      newTier.updatable = updatable
      newTier.tier = name

      initialValues.updatable = newTier.updatable
      initialValues.index = tierNum
      initialValues.addresses = {
        crowdsaleAddress: contractStore.crowdsale.execID
      }

      if (tierNum === 0) {
        newTier.whitelistEnabled = isWhitelisted ? 'yes' : 'no'
      }

      return Promise.all([maximumSellableTokens, whitelistAccounts, rate, [tokenName, tokenSymbol, decimals]])
    })
    .then(([maximumSellableTokens, whitelistAccounts, rate, [tokenName, tokenSymbol, decimals]]) => {
      tokenStore.setProperty('name', tokenName)
      tokenStore.setProperty('ticker', tokenSymbol)
      tokenStore.setProperty('decimals', decimals)

      //total supply
      const tokenDecimals = !isNaN(decimals) ? decimals : 0
      const maxCapBeforeDecimals = toBigNumber(maximumSellableTokens).div(`1e${tokenDecimals}`)

      newTier.supply = maxCapBeforeDecimals ? maxCapBeforeDecimals.toFixed() : 0

      return Promise.all([whitelistAccounts, rate, tokenDecimals])
    })
    .then(([whitelistAccounts, rate, tokenDecimals]) => {
      //const { decimals } = tokenStore
      //const tokenDecimals = !isNaN(decimals) ? decimals : 0

      //price
      newTier.rate = toBigNumber(web3.utils.fromWei(toBigNumber(rate).toFixed(), 'ether'))
        .pow(-1)
        .decimalPlaces(0)
        .toFixed()

      tierStore.addTier(newTier, {
        tier: VALID,
        walletAddress: VALID,
        rate: VALID,
        supply: VALID,
        startTime: VALID,
        endTime: VALID,
        updatable: VALID
      })

      const whitelist = newTier.whitelist.slice()

      if (whitelistAccounts) {
        whitelistAccounts.forEach(({ addr, min, max }) => {
          min = parseInt(toFixed(min), 10) * newTier.rate / 10 ** tokenDecimals
          max = parseInt(toFixed(max), 10) * newTier.rate / 10 ** tokenDecimals

          whitelist.push({ addr, min, max, stored: true })
        })
      }

      tierStore.setTierProperty(whitelist, 'whitelist', tierNum)
      tierStore.sortWhitelist(tierNum)

      if (initialValues.updatable) {
        initialValues.startTime = newTier.startTime
        initialValues.endTime = newTier.endTime
        initialValues.rate = newTier.rate
        initialValues.supply = newTier.supply
        initialValues.whitelist = whitelist
      }
      crowdsaleStore.addInitialTierValues(initialValues)
    })
}

export function getFieldsToUpdate(updatableTiers, tiers) {
  const keys = Object
    .keys(updatableTiers[0])
    .filter(key => key !== 'index' && key !== 'updatable' && key !== 'addresses')

  const toUpdate = updatableTiers
    .reduce((toUpdate, tier, index) => {
      keys.forEach(key => {
        let newValue = tiers[tier.index][key]

        if (isObservableArray(newValue)) {
          newValue = newValue.filter(item => !item.stored)

          if (newValue.length) {
            toUpdate.push({ key, newValue, tier: index })
          }

        } else if (newValue !== tier[key]) {
          toUpdate.push({ key, newValue, tier: index })
        }
      })
      return toUpdate
    }, [])
    .sort((item1, item2) => {
      if (item1.tier !== item2.tier) {
        return item2.tier - item1.tier
      }

      if (item1.key === 'startTime' && item2.key === 'endTime') {
        return 1
      }

      if (item1.key === 'endTime' && item2.key === 'startTime') {
        return -1
      }

      return 0
    })

  return toUpdate
}
