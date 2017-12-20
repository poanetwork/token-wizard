import { attachToContract } from '../../utils/blockchainHelpers'
import { contractStore, web3Store } from '../../stores'

export const promisifyMethodCall = method => {
  return new Promise((resolve, reject) => {
    method.call((err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

export const formatDate = timestamp => {
  return new Date(timestamp * 1000).toJSON().split('.')[0]
}

export const crowdsaleData = crowdsaleAddress => {
  const { web3 } = web3Store

  return attachToContract(web3, contractStore.crowdsale.abi, crowdsaleAddress)
    .then(crowdsaleContract => {
      const { methods } = crowdsaleContract
      const whenToken = promisifyMethodCall(methods.token())
      const whenMultisigWallet = promisifyMethodCall(methods.multisigWallet())
      const whenStartsAt = promisifyMethodCall(methods.startsAt())
      const whenEndsAt = promisifyMethodCall(methods.endsAt())
      const whenIsUpdatable = promisifyMethodCall(methods.isUpdatable())
      const whenMaximumSellableTokens = promisifyMethodCall(methods.maximumSellableTokens())
      const whenPricingStrategy = promisifyMethodCall(methods.pricingStrategy())
      const whenIsFinalized = promisifyMethodCall(methods.finalized())

      return Promise.all([whenToken, whenMultisigWallet, whenStartsAt, whenEndsAt, whenIsUpdatable, whenMaximumSellableTokens, whenPricingStrategy, whenIsFinalized])
    })
}

export const tokenData = tokenAddress => {
  const { web3 } = web3Store

  return attachToContract(web3, contractStore.token.abi, tokenAddress)
    .then(tokenContract => {
      const { methods } = tokenContract
      const whenName = promisifyMethodCall(methods.name())
      const whenSymbol = promisifyMethodCall(methods.symbol())
      const whenDecimals = promisifyMethodCall(methods.decimals())

      return Promise.all([whenName, whenSymbol, whenDecimals])
    })
}

export const pricingStrategyData = pricingStrategyAddress => {
  const { web3 } = web3Store

  return attachToContract(web3, contractStore.pricingStrategy.abi, pricingStrategyAddress)
    .then(pricingStrategyContract => promisifyMethodCall(pricingStrategyContract.methods.oneTokenInWei()))
}

