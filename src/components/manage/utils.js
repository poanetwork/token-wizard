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
  const { decimals } = tokenStore
  let methods = {
    startTime: 'setStartsAt',
    endTime: 'setEndsAt',
    supply: 'setMaximumSellableTokens',
    rate: 'updateRate',
    whitelist: 'setEarlyParticipantWhitelistMultiple'
  }
  let abi
  let contractAddresses

  if (attribute === 'startTime' || attribute === 'endTime' || attribute === 'supply' || attribute === 'whitelist') {
    abi = contractStore.crowdsale.abi
    contractAddresses = [addresses.crowdsaleAddress]

    if (attribute === 'startTime' || attribute === 'endTime') {
      value = [toFixed(parseInt(Date.parse(value) / 1000, 10).toString())]
    } else if (attribute === 'supply') {
      value = [toFixed(parseInt(value, 10) * 10 ** parseInt(tokenStore.decimals, 10)).toString()]
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
    abi = contractStore.crowdsale.abi
    contractAddresses = [addresses.crowdsaleAddress]
    const oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, 1 / Number(value))
    value = [web3Store.web3.utils.toWei(oneTokenInETH, 'ether')]
  }

  if (!contractAddresses) return Promise.reject('no updatable value')

  if (attribute === 'whitelist') {
    const totalTiers = tierStore.tiers.length
    const currentTierIndex = crowdsaleStore.selected.initialTiersValues
      .findIndex(tier => tier.addresses.crowdsaleAddress === addresses.crowdsaleAddress)

    if (currentTierIndex <= totalTiers - 1) {
      contractAddresses = crowdsaleStore.selected.initialTiersValues
        .slice(currentTierIndex)
        .map(tier => tier.addresses.crowdsaleAddress)
    }
  }

  return contractAddresses.reduce((promise, contractAddress) => {
    return promise.then(() => {
      return attachToContract(abi, contractAddress)
        .then(contract => {
          const method = contract.methods[methods[attribute]]

          return method(...value).estimateGas()
            .then(estimatedGas => {
              return sendTXToContract(method(...value)
                .send({
                  gasLimit: estimatedGas,
                  gasPrice: generalStore.gasPrice
                })
              )
            })
        })
    })
  }, Promise.resolve())
}

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

const crowdsaleData = crowdsaleAddress => {
  return attachToContract(contractStore.crowdsale.abi, crowdsaleAddress)
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

      return whenIsWhitelisted
        .then(isWhitelisted => extractWhitelistInformation(isWhitelisted, methods))
        .then(([whitelisted, whitelistedAddresses, accountData]) => {
          const whitelistedAccounts = accountData.map((data, index) => {
            return {
              addr: whitelistedAddresses[index],
              min: data.minCap,
              max: data.maxCap
            }
          })

          return Promise.all([whitelisted, whitelistedAccounts])
        })
        .then(([isWhitelisted, whitelistAccounts]) => {
          return Promise.all([
            whenToken,
            whenMultisigWallet,
            whenStartsAt,
            whenEndsAt,
            whenIsUpdatable,
            isWhitelisted,
            whenMaximumSellableTokens,
            whenPricingStrategy,
            whenIsFinalized,
            whenName,
            whitelistAccounts
          ])
        })
    })
}

const tokenData = tokenAddress => {
  return attachToContract(contractStore.token.abi, tokenAddress)
    .then(tokenContract => {
      const { methods } = tokenContract
      const whenName = methods.name().call()
      const whenSymbol = methods.symbol().call()
      const whenDecimals = methods.decimals().call()

      return Promise.all([whenName, whenSymbol, whenDecimals])
    })
}

const pricingStrategyData = pricingStrategyAddress => {
  return attachToContract(contractStore.pricingStrategy.abi, pricingStrategyAddress)
    .then(pricingStrategyContract => pricingStrategyContract.methods.oneTokenInWei().call())
}

export const getTiers = crowdsaleAddress => {
  return attachToContract(contractStore.crowdsale.abi, crowdsaleAddress)
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
             isWhitelisted,
             maximumSellableTokens,
             pricingStrategyAddress,
             isFinalized,
             name,
             whitelistAccounts
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
        newTier.whitelistEnabled = isWhitelisted ? 'yes' : 'no'
      }

      return Promise.all([pricingStrategyAddress, maximumSellableTokens, whitelistAccounts, tokenData(tokenAddress)])
    })
    .then(([pricingStrategyAddress, maximumSellableTokens, whitelistAccounts, [tokenName, tokenSymbol, decimals]]) => {
      tokenStore.setProperty('name', tokenName)
      tokenStore.setProperty('ticker', tokenSymbol)
      tokenStore.setProperty('decimals', decimals)

      //total supply: tiers, standard
      const tokenDecimals = !isNaN(decimals) ? decimals : 0
      const maxCapBeforeDecimals = parseInt(toFixed(maximumSellableTokens), 10) / 10 ** tokenDecimals
      const tierCap = maxCapBeforeDecimals ? maxCapBeforeDecimals.toString() : 0
      const standardCrowdsaleSupply = !isNaN(crowdsaleStore.supply) ? (crowdsaleStore.supply).toString() : 0

      newTier.supply = (contractStore.contractType === WHITELIST_WITH_CAP) ? tierCap : standardCrowdsaleSupply

      return Promise.all([whitelistAccounts, pricingStrategyData(pricingStrategyAddress)])
    })
    .then(([whitelistAccounts, rate]) => {
      const { decimals } = tokenStore
      const tokenDecimals = !isNaN(decimals) ? decimals : 0

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

      const whitelist = newTier.whitelist.slice()
      const whitelistElements = newTier.whitelistElements.slice()

      whitelistAccounts.forEach(({ addr, min, max }, whitelistNum) => {
        min = parseInt(toFixed(min), 10) / 10 ** tokenDecimals
        max = parseInt(toFixed(max), 10) / 10 ** tokenDecimals

        whitelistElements.push({ addr, min, max, whitelistNum, crowdsaleNum, alreadyDeployed: true })
        whitelist.push({ addr, min, max })
      })

      tierStore.setTierProperty(whitelistElements, 'whitelistElements', crowdsaleNum)
      tierStore.setTierProperty(whitelist, 'whitelist', crowdsaleNum)

      if (initialValues.updatable) {
        initialValues.startTime = newTier.startTime
        initialValues.endTime = newTier.endTime
        initialValues.rate = newTier.rate
        initialValues.supply = newTier.supply
        initialValues.whitelist = whitelist
        initialValues.whitelistElements = whitelistElements
      }
      crowdsaleStore.addInitialTierValues(initialValues)
    })
}
