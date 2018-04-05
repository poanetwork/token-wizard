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

    let getCrowdsaleStartTime = initCrowdsaleContract.methods.getCrowdsaleStartTime(registryStorageObj.addr, execID).call();
    let getCrowdsaleInfo = initCrowdsaleContract.methods.getCrowdsaleInfo(registryStorageObj.addr, execID).call();
    let getCurrentTierInfo = initCrowdsaleContract.methods.getCurrentTierInfo(registryStorageObj.addr, execID).call();
    let getTokensSold = initCrowdsaleContract.methods.getTokensSold(registryStorageObj.addr, execID).call();

    return Promise.all([
      getCrowdsaleStartTime,
      getCrowdsaleInfo,
      getCurrentTierInfo,
      getTokensSold
    ])
      .then(([
          crowdsaleStartTime,
          crowdsaleInfo,
          currentTierInfo,
          tokensSold
      ]) => {
        const { web3 } = web3Store

        console.log('crowdsaleInfo:')
        console.log(crowdsaleInfo)
        console.log('currentTierInfo:')
        console.log(currentTierInfo)

        crowdsalePageStore.setProperty('weiRaised', Number(crowdsaleInfo[1]).toFixed())
        crowdsalePageStore.setProperty('ethRaised', web3.utils.fromWei(crowdsalePageStore.weiRaised, 'ether'))
        crowdsalePageStore.setProperty('rate', Number(crowdsaleInfo[0]).toFixed()) //should be one token in wei
        const storedTokensSold = toBigNumber(tokensSold)
        crowdsalePageStore.setProperty('tokensSold', storedTokensSold.toFixed())

        /*let getMaximumSellableTokens = crowdsaleContract.methods.maximumSellableTokens().call().then((maximumSellableTokens) => {
          const maxSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
          crowdsalePageStore.setProperty('maximumSellableTokens', maxSellableTokens.plus(maximumSellableTokens).toFixed())

          //calc maximumSellableTokens in Eth
          return setMaximumSellableTokensInEth(crowdsaleContract, maximumSellableTokens)
        })

        let getInvestors = crowdsaleContract.methods.investorCount().call().then((investors) => {
          const storedInvestorsCount = toBigNumber(crowdsalePageStore.investors)
          crowdsalePageStore.setProperty('investors', storedInvestorsCount.plus(investors).toFixed())
        })*/

        resolve()
      })
      .catch(reject)
  })
}

export function initializeAccumulativeData() {
  crowdsalePageStore.setProperty('maximumSellableTokens', 0)
  crowdsalePageStore.setProperty('maximumSellableTokensInWei', 0)
  crowdsalePageStore.setProperty('investors', 0)
  //crowdsalePageStore.setProperty('ethRaised', 0)
  //crowdsalePageStore.setProperty('weiRaised', 0)
  //crowdsalePageStore.setProperty('tokensSold', 0)
  crowdsalePageStore.setProperty('tokenAmountOf', 0)
  return Promise.resolve()
}

export function getAccumulativeCrowdsaleData(initCrowdsaleContract, crowdsaleExecID) {
  //to do: iterate through tiers and get accumulative data
  const { web3 } = web3Store

  let promises = /*contractStore.crowdsale.addr*/[]
    .map(crowdsaleAddr => {

      /*let getWeiRaised = crowdsaleContract.methods.weiRaised().call().then((weiRaised) => {
        const storedWeiRaised = toBigNumber(crowdsalePageStore.weiRaised)
        crowdsalePageStore.setProperty('weiRaised', storedWeiRaised.plus(weiRaised).toFixed())
        crowdsalePageStore.setProperty('ethRaised', web3.utils.fromWei(crowdsalePageStore.weiRaised, 'ether'))
      })

      let getTokensSold = crowdsaleContract.methods.tokensSold().call().then((tokensSold) => {
        const storedTokensSold = toBigNumber(crowdsalePageStore.tokensSold)
        crowdsalePageStore.setProperty('tokensSold', storedTokensSold.plus(tokensSold).toFixed())
      })*/

      /*let getMaximumSellableTokens = crowdsaleContract.methods.maximumSellableTokens().call().then((maximumSellableTokens) => {
        const maxSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
        crowdsalePageStore.setProperty('maximumSellableTokens', maxSellableTokens.plus(maximumSellableTokens).toFixed())

        //calc maximumSellableTokens in Eth
        return setMaximumSellableTokensInEth(crowdsaleContract, maximumSellableTokens)
      })

      let getInvestors = crowdsaleContract.methods.investorCount().call().then((investors) => {
        const storedInvestorsCount = toBigNumber(crowdsalePageStore.investors)
        crowdsalePageStore.setProperty('investors', storedInvestorsCount.plus(investors).toFixed())
      })*/

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

    let getCrowdsaleStartTime = initCrowdsaleContract.methods.getCrowdsaleStartTime(registryStorageObj.addr, execID).call();
    let getCurrentTierInfo = initCrowdsaleContract.methods.getCurrentTierInfo(registryStorageObj.addr, execID).call();

    return Promise.all([getCrowdsaleStartTime, getCurrentTierInfo])
      .then(([crowdsaleStartTime, currentTierInfo]) => {
        const startsAtMilliseconds = crowdsaleStartTime * 1000
        console.log('currentTierInfo:')
        console.log(currentTierInfo)
        let crowdsaleEndTime = currentTierInfo[2]
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
    let isFinalized = crowdsaleInfo[4];
    return isFinalized;
  })
}

function setMaximumSellableTokensInEth(crowdsaleContract, maximumSellableTokens) {
  return crowdsaleContract.methods.pricingStrategy().call()
    .then((pricingStrategyAddr) => {
      return attachToContract(contractStore.pricingStrategy.abi, pricingStrategyAddr)
    })
    .then(pricingStrategyContract => {
      if (!pricingStrategyContract) return noContractAlert()

      return pricingStrategyContract.methods.oneTokenInWei().call()
        .then((oneTokenInWei) => {
          const currentMaximumSellableTokensInWei = toBigNumber(crowdsalePageStore.maximumSellableTokensInWei)
          const maximumSellableTokensInWei = toBigNumber(oneTokenInWei).times(maximumSellableTokens).div(`1e${tokenStore.decimals}`).dp(0)

          crowdsalePageStore.setProperty('maximumSellableTokensInWei', currentMaximumSellableTokensInWei.plus(maximumSellableTokensInWei).toFixed())
        })
    })
}

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
