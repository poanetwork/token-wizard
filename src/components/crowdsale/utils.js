import { noContractAlert } from '../../utils/alerts'
import {
  getCurrentAccount,
  attachToSpecificCrowdsaleContract,
} from '../../utils/blockchainHelpers'
import { contractStore, crowdsalePageStore, tokenStore, web3Store, crowdsaleStore } from '../../stores'
import { toJS } from 'mobx'
import { BigNumber } from 'bignumber.js'

BigNumber.config({ DECIMAL_PLACES : 18 })

export const toBigNumber = (value) => isNaN(value) || value === '' ? new BigNumber(0) : new BigNumber(value)

export let getTokenData = (initCrowdsaleContract, execID, account) => {
  return new Promise((resolve, reject) => {

    let registryStorageObj = toJS(contractStore.registryStorage)

    let getTokenName = initCrowdsaleContract.methods.name(registryStorageObj.addr, execID).call();
    let getTokenSymbol = initCrowdsaleContract.methods.symbol(registryStorageObj.addr, execID).call();
    let getTokenDecimals = initCrowdsaleContract.methods.decimals(registryStorageObj.addr, execID).call();
    let getTokenTotalSupply = initCrowdsaleContract.methods.totalSupply(registryStorageObj.addr, execID).call();
    let getBalanceOf = initCrowdsaleContract.methods.balanceOf(registryStorageObj.addr, execID, account).call();

    return Promise.all([
      getTokenName,
      getTokenSymbol,
      getTokenDecimals,
      getTokenTotalSupply,
      getBalanceOf
    ])
      .then(([
          name,
          ticker,
          decimals,
          totalSupply,
          balanceOf
      ]) => {
        const { web3 } = web3Store

        tokenStore.setProperty('name', web3.utils.toAscii(name))
        console.log('token name: ' + name)
        tokenStore.setProperty('ticker', web3.utils.toAscii(ticker))
        console.log('token ticker: ' + ticker)
        tokenStore.setProperty('decimals', decimals)
        console.log('token decimals: ' + decimals)
        if (crowdsaleStore.isMintedCappedCrowdsale) {
          totalSupply = totalSupply * toBigNumber(10).pow(Number(decimals))
        }
        tokenStore.setProperty('supply', totalSupply)
        console.log('token supply: ' + totalSupply)

        balanceOf = toBigNumber(balanceOf)
        console.log('balanceOf: ' + balanceOf)
        const tokenAmountOf = crowdsalePageStore.tokenAmountOf ? toBigNumber(crowdsalePageStore.tokenAmountOf) : toBigNumber(0)
        console.log('tokenAmountOf: ' + tokenAmountOf)
        crowdsalePageStore.setProperty('tokenAmountOf', tokenAmountOf.plus(balanceOf))

        resolve()
      })
      .catch(reject)
  })
}

export let getCrowdsaleData = (initCrowdsaleContract, execID, account) => {
  return new Promise((resolve, reject) => {
    if (!initCrowdsaleContract) {
      noContractAlert()
      reject('no contract')
    }

    console.log(initCrowdsaleContract)

    let registryStorageObj = toJS(contractStore.registryStorage)

    let getCrowdsaleInfo = initCrowdsaleContract.methods.getCrowdsaleInfo(registryStorageObj.addr, execID).call();
    let getTokensSold = initCrowdsaleContract.methods.getTokensSold(registryStorageObj.addr, execID).call();
    let getContributors = initCrowdsaleContract.methods.getCrowdsaleUniqueBuyers(registryStorageObj.addr, execID).call();

    let getCurrentTierInfo = crowdsaleStore.isMintedCappedCrowdsale? initCrowdsaleContract.methods.getCurrentTierInfo(registryStorageObj.addr, execID).call() : null;
    let getCrowdsaleMaxRaise = crowdsaleStore.isMintedCappedCrowdsale ? initCrowdsaleContract.methods.getCrowdsaleMaxRaise(registryStorageObj.addr, execID).call() : null;

    let getCrowdsaleStartAndEndTimes = crowdsaleStore.isDutchAuction ? initCrowdsaleContract.methods.getCrowdsaleStartAndEndTimes(registryStorageObj.addr, execID).call() : null;
    let getCrowdsaleStatus = crowdsaleStore.isDutchAuction ? initCrowdsaleContract.methods.getCrowdsaleStatus(registryStorageObj.addr, execID).call() : null;
    let getIsCrowdsaleFull = crowdsaleStore.isDutchAuction ? initCrowdsaleContract.methods.isCrowdsaleFull(registryStorageObj.addr, execID).call() : null;

    return Promise.all([
      getCrowdsaleInfo,
      getCurrentTierInfo,
      getTokensSold,
      getContributors,
      getCrowdsaleMaxRaise,
      getCrowdsaleStartAndEndTimes,
      getCrowdsaleStatus,
      getIsCrowdsaleFull,
    ])
      .then(([
          crowdsaleInfo,
          currentTierInfo,
          tokensSold,
          contributors,
          crowdsaleMaxRaise,
          crowdsaleStartAndEndTimes,
          crowdsaleStatus,
          isCrowdsaleFull,
      ]) => {
        const { web3 } = web3Store

        console.log('crowdsaleInfo:')
        console.log(crowdsaleInfo)
        console.log('currentTierInfo:')
        console.log(currentTierInfo)
        console.log('tokensSold:')
        console.log(tokensSold)
        console.log('contributors:')
        console.log(contributors)
        console.log('crowdsaleMaxRaise:')
        console.log(crowdsaleMaxRaise)
        console.log('crowdsaleStartAndEndTimes:')
        console.log(crowdsaleStartAndEndTimes)
        console.log('crowdsaleStatus:')
        console.log(crowdsaleStatus)
        console.log('isCrowdsaleFull:')
        console.log(isCrowdsaleFull)

        crowdsalePageStore.setProperty('weiRaised', Number(crowdsaleInfo.wei_raised).toFixed())
        crowdsalePageStore.setProperty('ethRaised', web3.utils.fromWei(crowdsalePageStore.weiRaised, 'ether'))

        if (crowdsaleStore.isMintedCappedCrowdsale) {
          crowdsalePageStore.setProperty('rate', Number(currentTierInfo.tier_price).toFixed()) //should be one token in wei
          crowdsalePageStore.setProperty('maximumSellableTokens', toBigNumber(crowdsaleMaxRaise.total_sell_cap).toFixed())
          crowdsalePageStore.setProperty('maximumSellableTokensInWei', toBigNumber(crowdsaleMaxRaise.wei_raise_cap).toFixed())
        } else if (crowdsaleStore.isDutchAuction) {
          crowdsalePageStore.setProperty('rate', Number(crowdsaleStatus.current_rate).toFixed()) //should be one token in wei
          crowdsalePageStore.setProperty('maximumSellableTokens', toBigNumber(isCrowdsaleFull.max_sellable).toFixed())
          let remainingETH = toBigNumber(crowdsaleStatus.current_rate) > 0 ? parseInt((toBigNumber(crowdsaleStatus.tokens_remaining)).div(toBigNumber(crowdsaleStatus.current_rate)), 10) : 0
          console.log("remainingETH:",remainingETH)
          let maximumSellableTokensInETH = (toBigNumber(crowdsaleInfo.wei_raised)).plus(remainingETH).toFixed()
          let maximumSellableTokensInWei = web3.utils.toWei(maximumSellableTokensInETH, 'ether')
          console.log("maximumSellableTokensInETH:", maximumSellableTokensInETH)
          console.log("maximumSellableTokensInWei:", maximumSellableTokensInWei)
          crowdsalePageStore.setProperty('maximumSellableTokensInWei', maximumSellableTokensInWei)
        }

        const storedTokensSold = toBigNumber(tokensSold)
        crowdsalePageStore.setProperty('tokensSold', storedTokensSold.toFixed())

        if (contributors)
          crowdsalePageStore.setProperty('investors', toBigNumber(contributors).toFixed())

        resolve()
      })
      .catch(reject)
  })
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

    let registryStorageObj = toJS(contractStore.registryStorage)

    let getCrowdsaleStartAndEndTimes = initCrowdsaleContract.methods.getCrowdsaleStartAndEndTimes(registryStorageObj.addr, execID).call();
    let getCurrentTierInfo = crowdsaleStore.isMintedCappedCrowdsale ? initCrowdsaleContract.methods.getCurrentTierInfo(registryStorageObj.addr, execID).call() : null;

    return Promise.all([getCrowdsaleStartAndEndTimes, getCurrentTierInfo])
      .then(([crowdsaleStartAndEndTimes, currentTierInfo]) => {
        console.log("crowdsaleStartAndEndTimes:", crowdsaleStartAndEndTimes)
        let crowdsaleStartTime = crowdsaleStartAndEndTimes.start_time
        console.log("crowdsaleStartTime:", crowdsaleStartTime)
        const startsAtMilliseconds = crowdsaleStartTime * 1000
        console.log('currentTierInfo:')
        console.log(currentTierInfo)
        let crowdsaleEndTime
        if (crowdsaleStore.isMintedCappedCrowdsale) {
          crowdsaleEndTime = currentTierInfo.tier_ends_at
        } else if (crowdsaleStore.isDutchAuction) {
          crowdsaleEndTime = crowdsaleStartAndEndTimes.end_time
        }
        const endsAtMilliseconds = crowdsaleEndTime * 1000

        crowdsalePageStore.addTier({
          startDate: startsAtMilliseconds,
          endDate: endsAtMilliseconds
        })

        if (!crowdsalePageStore.startDate || crowdsalePageStore.startDate > startsAtMilliseconds)
          crowdsalePageStore.startDate = startsAtMilliseconds
        console.log('startDate:' + startsAtMilliseconds)

        if (!crowdsalePageStore.endDate || crowdsalePageStore.endDate < endsAtMilliseconds)
          crowdsalePageStore.setProperty('endDate', endsAtMilliseconds)
        console.log("endDate:", endsAtMilliseconds)

        resolve()
      })
      .catch(reject)
  })
}

export let isFinalized = (initCrowdsaleContract, crowdsaleExecID) => {
  let registryStorageObj = toJS(contractStore.registryStorage)
  let getCrowdsaleInfo = initCrowdsaleContract.methods.getCrowdsaleInfo(registryStorageObj.addr, crowdsaleExecID).call();

  return getCrowdsaleInfo.then(crowdsaleInfo => {
    let isFinalized = crowdsaleInfo.is_finalized;
    return isFinalized;
  })
}

export const getTiers = () => {
  if (crowdsaleStore.isMintedCappedCrowdsale) {
    return getCurrentAccount()
      .then(account => {
        const targetPrefix = "initCrowdsale"
        const targetSuffix = crowdsaleStore.contractTargetSuffix
        const target = `${targetPrefix}${targetSuffix}`
        return attachToSpecificCrowdsaleContract(target)
          .then((initCrowdsaleContract) => {
            const { methods } = initCrowdsaleContract
            let registryStorageObj = toJS(contractStore.registryStorage)

            return methods.getCrowdsaleTierList(registryStorageObj.addr, contractStore.crowdsale.execID).call()
              .then(tiers => {
                console.log("tiers:", tiers)
                return Promise.resolve(tiers.length)
              })
          })
      })
  } else if (crowdsaleStore.isDutchAuction) {
    const dutchAuctionTiersLength = 1
    return Promise.resolve(dutchAuctionTiersLength)
  }
}

export const getContractStoreProperty = (contract, property) => {
  const text = contractStore && contractStore[contract] && contractStore[contract][property]
  return text === undefined ? '' : text
}
