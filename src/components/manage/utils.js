import {
  getCurrentAccount,
  sendTXToContract,
  methodToExec
} from '../../utils/blockchainHelpers'
import { contractStore, crowdsaleStore, generalStore, tierStore, tokenStore, web3Store, reservedTokenStore } from '../../stores'
import { VALIDATION_TYPES } from '../../utils/constants'
import { removeTrailingNUL, toFixed } from '../../utils/utils'
import { toBigNumber } from '../crowdsale/utils'
import { BigNumber } from 'bignumber.js'
import moment from 'moment'

const { VALID } = VALIDATION_TYPES

const formatDate = timestamp => {
  return moment(timestamp * 1000).format('YYYY-MM-DDTHH:mm')
}

export const updateTierAttribute = (attribute, value, tierIndex) => {
  let methodInterface
  let getParams
  const { decimals } = tokenStore
  const { isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore
  let methods = {
    startTime: isDutchAuction ? 'setCrowdsaleStartAndDuration' : null, // startTime is not changed after migration to Auth-os in MintedCappedCrowdsale strategy
    endTime: isMintedCappedCrowdsale ? 'updateTierDuration' : isDutchAuction ? 'setCrowdsaleStartAndDuration' : null,
    whitelist: isMintedCappedCrowdsale ? 'whitelistMultiForTier' : isDutchAuction ? 'whitelistMulti' : null
  }

  let crowdsaleStartTime
  if (attribute === 'startTime' || attribute === 'endTime' || attribute === 'supply' || attribute === 'whitelist') {
    if (attribute === 'startTime') {
      let { startTime, endTime } = tierStore.tiers[tierIndex]
      crowdsaleStartTime = toFixed(parseInt(Date.parse(value) / 1000, 10).toString())
      const duration = new Date(endTime) - new Date(startTime)
      const durationBN = (toBigNumber(duration) / 1000).toFixed()
      methodInterface = ["uint256","uint256"]
      value = durationBN
      getParams = updateDutchAuctionDurationParams
    } else if (attribute === 'endTime') {
      let { startTime, endTime } = tierStore.tiers[tierIndex]
      console.log(startTime, endTime)
      const duration = new Date(endTime) - new Date(startTime)
      const durationBN = toBigNumber(duration).div(1000)
      value = durationBN.toFixed()
      methodInterface = ["uint256","uint256"]
      if (isMintedCappedCrowdsale) {
        getParams = updateMintedCappedCrowdsaleDurationParams
      } else if (isDutchAuction) {
        getParams = updateDutchAuctionDurationParams
        crowdsaleStartTime = toFixed((new Date(startTime)).getTime() / 1000).toString()
      }
    } else if (attribute === 'whitelist')  {
      // whitelist
      const rate = tierStore.tiers[tierIndex].rate;
      const rateBN = new BigNumber(rate)
      const oneTokenInETH = rateBN.pow(-1).toFixed()
      const oneTokenInWEI = web3Store.web3.utils.toWei(oneTokenInETH, 'ether')
      value = value.reduce((toAdd, whitelist) => {
        toAdd[0].push(whitelist.addr)
        toAdd[1].push(toBigNumber(whitelist.min).times(`1e${decimals}`).toFixed())
        toAdd[2].push(toBigNumber(whitelist.max).times(oneTokenInWEI).toFixed())
        return toAdd
      }, [[], [], []])
      if (isMintedCappedCrowdsale) {
        methodInterface = ["uint256","address[]","uint256[]","uint256[]"]
        getParams = updateTierWhitelistParams
      } else if (isDutchAuction) {
        methodInterface = ["address[]","uint256[]","uint256[]"]
        getParams = updateWhitelistParams
      }
    }
  }

  console.log("crowdsaleStartTime:", crowdsaleStartTime)
  console.log("value:", value)

  console.log("attribute:", attribute)
  console.log("methods[attribute]:", methods[attribute])

  console.log("tierIndex:", tierIndex)

  let paramsToExec
  if (isMintedCappedCrowdsale) {
    paramsToExec = [ tierIndex, value, methodInterface ]
  } else if (isDutchAuction) {
    if (attribute === 'whitelist') {
      paramsToExec = [ value, methodInterface ]
    } else {
      paramsToExec = [ crowdsaleStartTime, value, methodInterface ]
    }
  }

  console.log("paramsToExec:", paramsToExec)
  console.log("methods[attribute]:", methods[attribute])
  console.log("methodInterface:", methodInterface)

  let targetContractName
  if (crowdsaleStore.execID) {
    targetContractName = 'registryExec'
  } else {
    targetContractName = 'MintedCappedProxy'
  }

  const method = methodToExec(targetContractName, `${methods[attribute]}(${methodInterface.join(',')})`, getParams, paramsToExec)
  console.log("method:", method)

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

const updateMintedCappedCrowdsaleDurationParams = (tierIndex, duration, methodInterface) => {
  console.log(tierIndex, duration)
  const { web3 } = web3Store
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [tierIndex, duration]);
  return encodedParameters;
}

const updateDutchAuctionDurationParams = (startTime, duration, methodInterface) => {
  console.log(startTime, duration)
  const { web3 } = web3Store
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [startTime, duration]);
  return encodedParameters;
}

const updateTierWhitelistParams = (tierIndex, [addr, min, max], methodInterface) => {
  console.log(tierIndex, addr, min, max, methodInterface)
  const { web3 } = web3Store
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [tierIndex, addr, min, max]);
  return encodedParameters;
}

const updateWhitelistParams = ([addr, min, max], methodInterface) => {
  console.log(addr, min, max, methodInterface)
  const { web3 } = web3Store
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [addr, min, max]);
  return encodedParameters;
}

const crowdsaleData = (tier, crowdsale, token, reserved_tokens_info) => {
  const { isMintedCappedCrowdsale } = crowdsaleStore
  const { toAscii } = web3Store.web3.utils
  const {
    start_time,
    tier_start,
    end_time,
    tier_end,
    current_rate,
    tier_price,
    tier_sell_cap,
    tokens_remaining,
    tokens_sold,
    whitelist,
    duration_is_modifiable,
    whitelist_enabled
  } = tier
  let { tier_name } = tier
  try {
    tier_name = removeTrailingNUL(toAscii(tier_name))
  } catch(e) {
    console.log("###Token name is already in ASCII###")
  }
  const { team_wallet, is_finalized } = crowdsale
  const { total_supply, token_decimals } = token
  let { token_name, token_symbol } = token
  try {
    token_name = removeTrailingNUL(toAscii(token_name))
  } catch(e) {
    console.log("###Token name is already in ASCII###")
  }
  try {
    token_symbol = removeTrailingNUL(toAscii(token_symbol))
  } catch(e) {
    console.log("###Token name is already in ASCII###")
  }

  return {
    wallet: team_wallet,
    start_time: isMintedCappedCrowdsale ? tier_start : start_time,
    end_time: isMintedCappedCrowdsale ? tier_end : end_time,
    rate: isMintedCappedCrowdsale ? tier_price : current_rate,
    max_sell_cap: isMintedCappedCrowdsale ? tier_sell_cap : toBigNumber(tokens_remaining).plus(tokens_sold || '0'),
    name: isMintedCappedCrowdsale ? tier_name : '',
    updatable: isMintedCappedCrowdsale ? duration_is_modifiable : true,
    whitelist: whitelist || [],
    whitelisted: whitelist_enabled,
    finalized: is_finalized,
    crowdsale_token: {
      name: token_name,
      ticker: token_symbol,
      supply: toBigNumber(total_supply).div(`1e${token_decimals}`),
      decimals: token_decimals,
      reserved_accounts: reserved_tokens_info
    }
  }
}

export const processTier = (tier, crowdsale, token, reserved_tokens_info, tier_index) => {
  console.log("tier:", tier)
  console.log("reserved_tokens_info:", reserved_tokens_info)
  console.log("crowdsale:", crowdsale)
  console.log("token:", token)

  const { web3 } = web3Store
  const {
    wallet,
    start_time,
    end_time,
    rate: rate_in_wei,
    max_sell_cap,
    name,
    whitelist,
    updatable,
    whitelisted,
    finalized,
    crowdsale_token
  } = crowdsaleData(tier, crowdsale, token, reserved_tokens_info)
  console.log("reserved_tokens_info:", crowdsale_token.reserved_accounts)

  const token_decimals = !isNaN(crowdsale_token.decimals) ? crowdsale_token.decimals : 0
  const max_cap_before_decimals = toBigNumber(max_sell_cap).div(`1e${token_decimals}`).toFixed()
  const rate = rate_in_wei > 0 ? toBigNumber(web3.utils.fromWei(rate_in_wei, 'ether')).pow(-1).dp(0).toFixed() : 0
  // TODO: remove this filter after Auth-os implement uniqueness for the whitelisted addresses (#871)
  const filtered_whitelist = [...new Set(whitelist.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))

  const new_tier = {
    tier: name,
    walletAddress: wallet,
    rate,
    supply: max_cap_before_decimals || 0,
    startTime: formatDate(start_time),
    endTime: formatDate(end_time),
    updatable,
    whitelistEnabled: whitelisted ? 'yes' : 'no',
    whitelist: filtered_whitelist.map(({ addr, min, max }) => ({
      addr,
      min: toBigNumber(min).div(`1e${token_decimals}`).toFixed(),
      max: toBigNumber(web3.utils.fromWei(max, 'ether')).times(rate).dp(0, BigNumber.ROUND_CEIL).toFixed(),
      stored: true
    }))
  }

  const validations = {
    tier: VALID,
    walletAddress: VALID,
    rate: VALID,
    supply: VALID,
    startTime: VALID,
    endTime: VALID,
    updatable: VALID
  }

  const initial_tier_values = {
    duration: (end_time * 1000) - (start_time * 1000),
    updatable,
    index: tier_index,
    startTime: new_tier.startTime,
    endTime: new_tier.endTime,
    whitelist: new_tier.whitelist.slice(),
    isWhitelisted: whitelisted,
    supply: new_tier.supply,
    addresses: {
      crowdsaleAddress: contractStore.crowdsale.execID
    }
  }

  tierStore.addTier(new_tier, validations)
  tierStore.sortWhitelist(tier_index)

  crowdsaleStore.addInitialTierValues(initial_tier_values)
  crowdsaleStore.setSelectedProperty('finalized', finalized)
  crowdsaleStore.setSelectedProperty('updatable', crowdsaleStore.selected.updatable || updatable)

  crowdsale_token.reserved_accounts.forEach(reservedTokenStore.addToken)

  tokenStore.setProperty('name', crowdsale_token.name)
  tokenStore.setProperty('ticker', crowdsale_token.ticker)
  tokenStore.setProperty('decimals', crowdsale_token.decimals)
  tokenStore.setProperty('supply', crowdsale_token.supply)
}

export function getFieldsToUpdate(updatableTiers, tiers) {
  const keys = Object.keys(updatableTiers[0]).filter(key => key === 'endTime' || key === 'whitelist')

  return updatableTiers
    .reduce((toUpdate, updatableTier, index) => {
      keys.forEach(key => {
        let newValue = tiers[updatableTier.index][key]

        if (key === 'whitelist') {
          newValue = newValue.filter(item => !item.stored)

          if (newValue.length) {
            toUpdate.push({ key, newValue, tier: index })
          }

        } else if (key === 'endTime') {
          const end = new Date(tiers[updatableTier.index].endTime)
          const start = new Date(tiers[updatableTier.index].startTime)
          const duration = end - start

          if (updatableTier.duration !== duration) {
            toUpdate.push({ key, newValue, tier: index })
          }
        }
      })

      return toUpdate
    }, [])
}
