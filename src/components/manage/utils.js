import { attachToContract, sendTXToContract } from '../../utils/blockchainHelpers'
import { contractStore, crowdsaleStore, generalStore, tierStore, tokenStore, web3Store } from '../../stores'
import { CONTRACT_TYPES, TRUNC_TO_DECIMALS, VALIDATION_TYPES } from '../../utils/constants'
import { floorToDecimals, toFixed } from '../../utils/utils'

const { VALID } = VALIDATION_TYPES
const { whitelistwithcap: WHITELIST_WITH_CAP } = CONTRACT_TYPES

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

export const updateTierAttribute = (attribute, value, addresses) => {
  const { web3 } = web3Store
  let methods = {
    startTime: 'setStartsAt',
    endTime: 'setEndsAt',
    supply: 'setMaximumSellableTokens',
    rate: 'updateRate'
  }
  let abi
  let contractAddress

  if (attribute === 'startTime' || attribute === 'endTime' || attribute === 'supply') {
    abi = contractStore.crowdsale.abi
    contractAddress = addresses.crowdsaleAddress

    if (attribute === 'startTime' || attribute === 'endTime') {
      value = toFixed(parseInt(Date.parse(value) / 1000, 10).toString())
    } else {
      value = toFixed(parseInt(value, 10) * 10 ** parseInt(tokenStore.decimals, 10)).toString()
    }
  }

  if (attribute === 'rate') {
    abi = contractStore.pricingStrategy.abi
    contractAddress = addresses.pricingStrategyAddress
    const oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, 1 / Number(value))
    value = web3Store.web3.utils.toWei(oneTokenInETH, 'ether')
  }

  if (!contractAddress) return Promise.reject('no updatable value')

  return attachToContract(web3, abi, contractAddress)
    .then(contract => {
      const method = contract.methods[methods[attribute]]

      return method(value).estimateGas()
        .then(estimatedGas => {
          return sendTXToContract(web3, method(value)
            .send({
              gasLimit: estimatedGas,
              gasPrice: generalStore.gasPrice
            })
          )
        })
    })
}

const crowdsaleData = crowdsaleAddress => {
  const { web3 } = web3Store

  return attachToContract(web3, contractStore.crowdsale.abi, crowdsaleAddress)
    .then(crowdsaleContract => {
      const { methods } = crowdsaleContract
      const whenToken = methods.token().call()
      const whenMultisigWallet = methods.multisigWallet().call()
      const whenStartsAt = methods.startsAt().call()
      const whenEndsAt = methods.endsAt().call()
      const whenIsUpdatable = methods.isUpdatable().call()
      const whenIsWhitelisted = methods.isWhiteListed().call()
      const whenMaximumSellableTokens = methods.maximumSellableTokens().call()
      const whenPricingStrategy = methods.pricingStrategy().call()
      const whenIsFinalized = methods.finalized().call()
      const whenName = methods.name().call()

      return Promise.all([
        whenToken,
        whenMultisigWallet,
        whenStartsAt,
        whenEndsAt,
        whenIsUpdatable,
        whenIsWhitelisted,
        whenMaximumSellableTokens,
        whenPricingStrategy,
        whenIsFinalized,
        whenName
      ])
    })
}

const tokenData = tokenAddress => {
  const { web3 } = web3Store

  return attachToContract(web3, contractStore.token.abi, tokenAddress)
    .then(tokenContract => {
      const { methods } = tokenContract
      const whenName = methods.name().call()
      const whenSymbol = methods.symbol().call()
      const whenDecimals = methods.decimals().call()

      return Promise.all([whenName, whenSymbol, whenDecimals])
    })
}

const pricingStrategyData = pricingStrategyAddress => {
  const { web3 } = web3Store

  return attachToContract(web3, contractStore.pricingStrategy.abi, pricingStrategyAddress)
    .then(pricingStrategyContract => pricingStrategyContract.methods.oneTokenInWei().call())
}

export const getTiers = crowdsaleAddress => {
  const { web3 } = web3Store

  return attachToContract(web3, contractStore.crowdsale.abi, crowdsaleAddress)
    .then(crowdsaleContract => {
      const { methods } = crowdsaleContract

      return methods.joinedCrowdsalesLen().call()
        .then(joinedCrowdsalesLen => {
          let joinedCrowdsales = []

          for (let joinedTierIndex = 0; joinedTierIndex < joinedCrowdsalesLen; joinedTierIndex++) {
            joinedCrowdsales.push(methods.joinedCrowdsales(joinedTierIndex).call())
          }

          return Promise.all(joinedCrowdsales)
        })
    })
}

export const processTier = (crowdsaleAddress, crowdsaleNum) => {
  const { web3 } = web3Store

  const newTier = {
    whitelist: [],
    whitelistElements: [],
    whitelistInput: {
      addr: '',
      min: '',
      max: ''
    }
  }

  const initialValues = {}

  return crowdsaleData(crowdsaleAddress)
    .then(([
             tokenAddress,
             walletAddress,
             startsAt,
             endsAt,
             updatable,
             whitelisted,
             maximumSellableTokens,
             pricingStrategyAddress,
             isFinalized,
             name
           ]) => {
      crowdsaleStore.setSelectedProperty('finalized', isFinalized)
      crowdsaleStore.setSelectedProperty('updatable', crowdsaleStore.selected.updatable || updatable)

      newTier.walletAddress = walletAddress
      newTier.startTime = formatDate(startsAt)
      newTier.endTime = formatDate(endsAt)
      newTier.updatable = updatable
      newTier.name = name

      initialValues.updatable = newTier.updatable
      initialValues.index = crowdsaleNum
      initialValues.addresses = {
        pricingStrategyAddress,
        tokenAddress,
        crowdsaleAddress
      }

      if (crowdsaleNum === 0) {
        newTier.whitelistdisabled = !whitelisted ? 'yes' : 'no'
      }

      return Promise.all([pricingStrategyAddress, maximumSellableTokens, tokenData(tokenAddress)])
    })
    .then(([pricingStrategyAddress, maximumSellableTokens, [tokenName, tokenSymbol, decimals]]) => {
      tokenStore.setProperty('name', tokenName)
      tokenStore.setProperty('ticker', tokenSymbol)
      tokenStore.setProperty('decimals', decimals)

      //total supply: tiers, standard
      const tokenDecimals = !isNaN(decimals) ? decimals : 0
      const maxCapBeforeDecimals = parseInt(toFixed(maximumSellableTokens), 10) / 10 ** tokenDecimals
      const tierCap = maxCapBeforeDecimals ? maxCapBeforeDecimals.toString() : 0
      const standardCrowdsaleSupply = !isNaN(crowdsaleStore.supply) ? (crowdsaleStore.supply).toString() : 0

      newTier.supply = (contractStore.contractType === WHITELIST_WITH_CAP) ? tierCap : standardCrowdsaleSupply

      return pricingStrategyData(pricingStrategyAddress)
    })
    .then(rate => {
      //price: tiers, standard
      const tokensPerETHStandard = !isNaN(rate) ? rate : 0
      const tokensPerETHTiers = !isNaN(1 / rate) ? 1 / web3.utils.fromWei(toFixed(rate).toString(), 'ether') : 0

      newTier.rate = (contractStore.contractType === WHITELIST_WITH_CAP) ? tokensPerETHTiers : tokensPerETHStandard

      if (crowdsaleNum === 0) {
        tierStore.emptyList()
        tierStore.addTier(newTier)
        tierStore.setTierProperty(newTier.tier, 'tier', crowdsaleNum)
        tierStore.setTierProperty(newTier.walletAddress, 'walletAddress', crowdsaleNum)
        tierStore.setTierProperty(newTier.rate, 'rate', crowdsaleNum)
        tierStore.setTierProperty(newTier.supply, 'supply', crowdsaleNum)
        tierStore.setTierProperty(newTier.startTime, 'startTime', crowdsaleNum)
        tierStore.setTierProperty(newTier.endTime, 'endTime', crowdsaleNum)
        tierStore.setTierProperty(newTier.updatable, 'updatable', crowdsaleNum)
        tierStore.validateTiers('rate', crowdsaleNum)
        tierStore.validateTiers('supply', crowdsaleNum)
      } else {
        tierStore.addTier(newTier)
        tierStore.addTierValidations({
          tier: VALID,
          walletAddress: VALID,
          rate: VALID,
          supply: VALID,
          startTime: VALID,
          endTime: VALID,
          updatable: VALID
        })
      }

      if (initialValues.updatable) {
        initialValues.startTime = newTier.startTime
        initialValues.endTime = newTier.endTime
        initialValues.rate = newTier.rate
        initialValues.supply = newTier.supply
      }
      crowdsaleStore.addInitialTierValues(initialValues)
    })
}
