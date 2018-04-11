import { attachToContract } from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'
import { contractStore, crowdsalePageStore, tokenStore, web3Store } from '../../stores'
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
    let getTokenTotalSypply = initCrowdsaleContract.methods.totalSupply(registryStorageObj.addr, execID).call();
    let getBalanceOf = initCrowdsaleContract.methods.balanceOf(registryStorageObj.addr, execID, account).call();

    return Promise.all([
      getTokenName,
      getTokenSymbol,
      getTokenDecimals,
      getTokenTotalSypply,
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
        totalSupply = totalSupply * toBigNumber(10).pow(Number(decimals))
        tokenStore.setProperty('supply', totalSupply)
        console.log('token supply: ' + totalSupply)
        balanceOf = toFixed(balanceOf * toBigNumber(10).pow(Number(decimals)))
        const tokenAmountOf = crowdsalePageStore.tokenAmountOf ? crowdsalePageStore.tokenAmountOf : 0
        crowdsalePageStore.setProperty('tokenAmountOf', tokenAmountOf + parseInt(balanceOf, 10))
        console.log('token balanceOf: ' + balanceOf)

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
    let getCurrentTierInfo = initCrowdsaleContract.methods.getCurrentTierInfo(registryStorageObj.addr, execID).call();
    let getTokensSold = initCrowdsaleContract.methods.getTokensSold(registryStorageObj.addr, execID).call();
    let getContributors = initCrowdsaleContract.methods.getCrowdsaleUniqueBuyers(registryStorageObj.addr, execID).call();

    return Promise.all([
      getCrowdsaleInfo,
      getCurrentTierInfo,
      getTokensSold,
      getContributors
    ])
      .then(([
          crowdsaleInfo,
          currentTierInfo,
          tokensSold,
          contributors
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

        crowdsalePageStore.setProperty('weiRaised', Number(crowdsaleInfo.wei_raised).toFixed())
        crowdsalePageStore.setProperty('ethRaised', web3.utils.fromWei(crowdsalePageStore.weiRaised, 'ether'))
        crowdsalePageStore.setProperty('rate', Number(currentTierInfo.tier_price).toFixed()) //should be one token in wei
        const storedTokensSold = toBigNumber(tokensSold)
        crowdsalePageStore.setProperty('tokensSold', storedTokensSold.toFixed())
        crowdsalePageStore.setProperty('investors', toBigNumber(contributors).toFixed())

        resolve()
      })
      .catch(reject)
  })
}

export function initializeAccumulativeData() {
  crowdsalePageStore.setProperty('maximumSellableTokens', 0)
  crowdsalePageStore.setProperty('maximumSellableTokensInWei', 0)
  crowdsalePageStore.setProperty('tokenAmountOf', 0)
  return Promise.resolve()
}

export function getAccumulativeCrowdsaleData(initCrowdsaleContract, crowdsaleExecID) {
  //to do: iterate through tiers and get accumulative data
  const { web3 } = web3Store

  //to do: get the number of tiers
  let numOfTiers = 1;
  let tiers = new Array(numOfTiers);
  tiers.push(0);

  let promises = /*contractStore.crowdsale.addr*/tiers
    .map(tierNum => {

      let registryStorageObj = toJS(contractStore.registryStorage)

      initCrowdsaleContract.methods.getCrowdsaleTier(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum).call()
        .then((getCrowdsaleTier) => {
          console.log("getCrowdsaleTier:", getCrowdsaleTier)
          let maximumSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
          crowdsalePageStore.setProperty('maximumSellableTokens', maximumSellableTokens.plus(getCrowdsaleTier.tier_sell_cap).toFixed())

          //calc maximumSellableTokens in Eth
          return setMaximumSellableTokensInEth(initCrowdsaleContract, getCrowdsaleTier.tier_sell_cap, getCrowdsaleTier.tier_price, crowdsaleExecID)
        })

      return Promise.all([/*getWeiRaised, getTokensSold, getMaximumSellableTokens, getInvestors*/])
    })

  return Promise.all(promises)
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
    let getCurrentTierInfo = initCrowdsaleContract.methods.getCurrentTierInfo(registryStorageObj.addr, execID).call();

    return Promise.all([getCrowdsaleStartAndEndTimes, getCurrentTierInfo])
      .then(([crowdsaleStartAndEndTimes, currentTierInfo]) => {
        let crowdsaleStartTime = crowdsaleStartAndEndTimes.start_time
        console.log("crowdsaleStartTime:", crowdsaleStartTime)
        const startsAtMilliseconds = crowdsaleStartTime * 1000
        console.log('currentTierInfo:')
        console.log(currentTierInfo)
        let crowdsaleEndTime = currentTierInfo.tier_ends_at
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

function setMaximumSellableTokensInEth(initCrowdsaleContract, tierSellCap, tierPrice, execID) {
  const currentMaximumSellableTokensInWei = toBigNumber(crowdsalePageStore.maximumSellableTokensInWei)
  const maximumSellableTokensInWei = toBigNumber(tierPrice).times(tierSellCap).div(`1e${tokenStore.decimals}`).dp(0)

  crowdsalePageStore.setProperty('maximumSellableTokensInWei', currentMaximumSellableTokensInWei.plus(maximumSellableTokensInWei).toFixed())
}

//to do
/*export function getCurrentRate(crowdsaleContract) {
  return new Promise((resolve, reject) => {
    if (!crowdsaleContract) {
      noContractAlert()
      reject('no contract')
      return
    }

    crowdsaleContract.methods.pricingStrategy().call((err, pricingStrategyAddr) => {
      if (err) {
        console.log(err)
        reject(err)
        return
      }

      console.log('pricingStrategy:', pricingStrategyAddr)
      contractStore.setContractProperty('pricingStrategy', 'addr', pricingStrategyAddr)

      if (!pricingStrategyAddr || pricingStrategyAddr === "0x") {
        reject('no pricingStrategy address')
        return
      }

      resolve()
    });
  }
)}*/

export const getContractStoreProperty = (contract, property) => {
  const text = contractStore && contractStore[contract] && contractStore[contract][property]
  return text === undefined ? '' : text
}
