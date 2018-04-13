import { isObservableArray } from 'mobx'
import {
  getCurrentAccount,
  sendTXToContract,
  methodToExec
} from '../../utils/blockchainHelpers'
import { contractStore, crowdsaleStore, generalStore, tierStore, tokenStore, web3Store } from '../../stores'
import { TRUNC_TO_DECIMALS, VALIDATION_TYPES } from '../../utils/constants'
import { floorToDecimals, toFixed } from '../../utils/utils'
import { toBigNumber } from '../crowdsale/utils'
import { generateContext } from '../stepFour/utils'

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
  const { decimals } = tokenStore
  let methods = {
    //startTime: 'setStartsAt',
    endTime: 'updateTierDuration',
    //supply: 'setMaximumSellableTokens',
    //rate: 'updateRate',
    //whitelist: 'setEarlyParticipantWhitelistMultiple'
  }

  if (attribute === 'startTime' || attribute === 'endTime' || attribute === 'supply' || attribute === 'whitelist') {

    if (attribute === 'startTime') {
      value = toFixed(parseInt(Date.parse(value) / 1000, 10).toString())
    } else if (attribute === 'endTime') {
      let { startTime, endTime } = tierStore.tiers[tierIndex]
      const duration = formatDate(endTime) - formatDate(startTime)
      const durationBN = toBigNumber(duration).toFixed()
      value = durationBN
    } else if (attribute === 'supply') {
      value = toBigNumber(value).times(`1e${tokenStore.decimals}`).toFixed()
    } else {
      // whitelist
      value = value.reduce((toAdd, whitelist) => {
        toAdd[0].push(whitelist.addr)
        toAdd[1].push(true)
        toAdd[2].push(whitelist.min * 10 ** decimals ? toFixed((whitelist.min * 10 ** decimals).toString()) : 0)
        toAdd[3].push(whitelist.max * 10 ** decimals ? toFixed((whitelist.max * 10 ** decimals).toString()) : 0)
        return toAdd
      }, [[], [], [], []])
    }
  }

  if (attribute === 'rate') {
    const oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, 1 / Number(value))
    value = web3Store.web3.utils.toWei(oneTokenInETH, 'ether')
  }

  //to do
  /*if (attribute === 'whitelist') {
    const totalTiers = tierStore.tiers.length
    const currentTierIndex = crowdsaleStore.selected.initialTiersValues
      .findIndex(tier => tier.addresses.crowdsaleAddress === addresses.crowdsaleAddress)

    if (currentTierIndex <= totalTiers - 1) {
      contractAddresses = crowdsaleStore.selected.initialTiersValues
        .slice(currentTierIndex)
        .map(tier => tier.addresses.crowdsaleAddress)
    }
  }*/

  console.log("attribute:", attribute)
  console.log("methods[attribute]:", methods[attribute])

  console.log("tierIndex:", tierIndex)
  console.log("value:", value)

  const methodInterface = ["uint256","uint256","bytes"]
  const paramsToExec = [ tierIndex, value, methodInterface ]

  const method = methodToExec(`updateTierDuration(${methodInterface.join(',')})`, "crowdsaleConsole", updateCrowdsaleParams, paramsToExec)

  return getCurrentAccount()
    .then(account => {
      return method.estimateGas()
      .then(estimatedGas => {
        return sendTXToContract(method.send({
          gasLimit: estimatedGas,
          gasPrice: generalStore.gasPrice,
          from: account
        })
        )
      })
    })
}

const updateCrowdsaleParams = (tierIndex, duration, methodInterface) => {
  const { web3 } = web3Store
  let context = generateContext(0);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [tierIndex, duration, context]);
  return encodedParameters;
}

//to do
const extractWhitelistInformation = (isWhitelisted, crowdsaleMethods) => {
  let whitelistedAccounts = []
  const whenWhitelistedAddresses = []

  if (isWhitelisted && crowdsaleMethods.whitelistedParticipantsLength) {
    return crowdsaleMethods.whitelistedParticipantsLength().call()
      .then(participantsCount => {
        for (let participantIndex = 0; participantIndex < participantsCount; participantIndex++) {
          whenWhitelistedAddresses.push(crowdsaleMethods.whitelistedParticipants(participantIndex).call())
        }

        return Promise.all(whenWhitelistedAddresses)
      })
      .then(whitelistedAddresses => {
        const whenAccountData = whitelistedAddresses
          .map(address => crowdsaleMethods.earlyParticipantWhitelist(address).call())

        return Promise.all(whenAccountData)
          .then(accountData => [isWhitelisted, whitelistedAddresses, accountData])
      })
  }

  return Promise.resolve([isWhitelisted, whenWhitelistedAddresses, whitelistedAccounts])
}

const crowdsaleData = (tier, crowdsale, token) => {
  const { web3 } = web3Store
  let whitelistAccounts //to do
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
  return Promise.resolve([
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

      return Promise.all([whitelistAccounts, rate])
    })
    .then(([whitelistAccounts, rate]) => {
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

      //to do
      /*whitelistAccounts.forEach(({ addr, min, max }) => {
        min = parseInt(toFixed(min), 10) / 10 ** tokenDecimals
        max = parseInt(toFixed(max), 10) / 10 ** tokenDecimals

        whitelist.push({ addr, min, max, stored: true })
      })*/

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
