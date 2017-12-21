import { attachToContract } from '../../utils/blockchainHelpers'
import { contractStore, crowdsaleStore, tierStore, tokenStore, web3Store } from '../../stores'
import { CONTRACT_TYPES, VALIDATION_TYPES } from '../../utils/constants'
import { toFixed } from '../../utils/utils'

const { VALID } = VALIDATION_TYPES
const { whitelistwithcap: WHITELIST_WITH_CAP } = CONTRACT_TYPES

const formatDate = timestamp => {
  return new Date(timestamp * 1000).toJSON().split('.')[0]
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

      return Promise.all([
        whenToken,
        whenMultisigWallet,
        whenStartsAt,
        whenEndsAt,
        whenIsUpdatable,
        whenIsWhitelisted,
        whenMaximumSellableTokens,
        whenPricingStrategy,
        whenIsFinalized
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

export const gweiToWei = x => x * 1000000000

export const weiToGwei = x => x / 1000000000

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
             isFinalized
           ]) => {
      crowdsaleStore.setSelectedProperty('finalized', isFinalized)
      crowdsaleStore.setSelectedProperty('updatable', crowdsaleStore.selected.updatable || updatable)

      newTier.walletAddress = walletAddress
      newTier.startTime = formatDate(startsAt)
      newTier.endTime = formatDate(endsAt)
      newTier.updatable = updatable

      if (crowdsaleNum === 0) {
        newTier.whitelistdisabled = !whitelisted ? 'yes' : 'no'
      }

      return Promise.all([pricingStrategyAddress, maximumSellableTokens, tokenData(tokenAddress)])
    })
    .then(([pricingStrategyAddress, maximumSellableTokens, [tokenName, tokenSymbol, decimals]]) => {
      tokenStore.setProperty('name', tokenName)
      tokenStore.setProperty('ticker', tokenSymbol)

      //total supply: tiers, standard
      const tokenDecimals = !isNaN(decimals) ? decimals : 0
      const maxCapBeforeDecimals = parseInt(toFixed(maximumSellableTokens), 10) / 10 ** tokenDecimals
      const tierCap = maxCapBeforeDecimals ? maxCapBeforeDecimals.toString() : 0
      const standardCrowdsaleSupply = !isNaN(crowdsaleStore.supply) ? (crowdsaleStore.supply).toString() : 0

      newTier.supply = (contractStore.contractType === WHITELIST_WITH_CAP) ? tierCap : standardCrowdsaleSupply

      return pricingStrategyData(pricingStrategyAddress)
    })
    .then(rate => {
      let initialValues = { updatable: newTier.updatable, index: crowdsaleNum }

      //price: tiers, standard
      const tokensPerETHStandard = !isNaN(rate) ? rate : 0
      const tokensPerETHTiers = !isNaN(1 / rate) ? 1 / web3.utils.fromWei(toFixed(rate).toString(), 'ether') : 0

      newTier.rate = (contractStore.contractType === WHITELIST_WITH_CAP) ? tokensPerETHTiers : tokensPerETHStandard

      if (crowdsaleNum === 0) {
        tierStore.emptyList()
        tierStore.emptyTierValidationsList()
      }

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

      if (initialValues.updatable) {
        initialValues = Object.assign({
          startTime: newTier.startTime,
          endTime: newTier.endTime,
          rate: newTier.rate,
          supply: newTier.supply
        }, initialValues)
      }
      crowdsaleStore.addInitialTierValues(initialValues)
    })
}
