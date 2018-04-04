import { attachToContract } from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'
import { contractStore, crowdsalePageStore, tokenStore, web3Store } from '../../stores'
import { toJS } from 'mobx'
import { BigNumber } from 'bignumber.js'

BigNumber.config({ DECIMAL_PLACES : 18 })

export const toBigNumber = (value) => isNaN(value) || value === '' ? new BigNumber(0) : new BigNumber(value)

export let getTokenData = (iniCrowdsaleContract, execID, account) => {
  return new Promise((resolve, reject) => {

    let registryStorageObj = toJS(contractStore.registryStorage)

    let getTokenName = iniCrowdsaleContract.methods.name(registryStorageObj.addr, execID).call();
    let getTokenSymbol = iniCrowdsaleContract.methods.symbol(registryStorageObj.addr, execID).call();
    let getTokenDecimals = iniCrowdsaleContract.methods.decimals(registryStorageObj.addr, execID).call();
    let getTokenTotalSypply = iniCrowdsaleContract.methods.totalSupply(registryStorageObj.addr, execID).call();
    let getBalanceOf = iniCrowdsaleContract.methods.balanceOf(registryStorageObj.addr, execID, account).call();

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

export let getCrowdsaleData = (iniCrowdsaleContract, execID, account) => {
  return new Promise((resolve, reject) => {
    if (!iniCrowdsaleContract) {
      noContractAlert()
      reject('no contract')
    }

    console.log(iniCrowdsaleContract)

    let registryStorageObj = toJS(contractStore.registryStorage)

    let getCrowdsaleStartTime = iniCrowdsaleContract.methods.getCrowdsaleStartTime(registryStorageObj.addr, execID).call();
    let getCrowdsaleInfo = iniCrowdsaleContract.methods.getCrowdsaleInfo(registryStorageObj.addr, execID).call();
    let getCurrentTierInfo = iniCrowdsaleContract.methods.getCurrentTierInfo(registryStorageObj.addr, execID).call();
    let getTokensSold = iniCrowdsaleContract.methods.getTokensSold(registryStorageObj.addr, execID).call();

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

        const startsAtMilliseconds = crowdsaleStartTime * 1000
        console.log('crowdsaleInfo:')
        console.log(crowdsaleInfo)
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

export function getAccumulativeCrowdsaleData() {
  const { web3 } = web3Store

  let promises = contractStore.crowdsale.addr
    .map(crowdsaleAddr => {
      return attachToContract(contractStore.crowdsale.abi, crowdsaleAddr)
        .then(crowdsaleContract => { // eslint-disable-line no-loop-func
          if (!crowdsaleContract) return noContractAlert()

          let getWeiRaised = crowdsaleContract.methods.weiRaised().call().then((weiRaised) => {
            const storedWeiRaised = toBigNumber(crowdsalePageStore.weiRaised)
            crowdsalePageStore.setProperty('weiRaised', storedWeiRaised.plus(weiRaised).toFixed())
            crowdsalePageStore.setProperty('ethRaised', web3.utils.fromWei(crowdsalePageStore.weiRaised, 'ether'))
          })

          let getTokensSold = crowdsaleContract.methods.tokensSold().call().then((tokensSold) => {
            const storedTokensSold = toBigNumber(crowdsalePageStore.tokensSold)
            crowdsalePageStore.setProperty('tokensSold', storedTokensSold.plus(tokensSold).toFixed())
          })

          let getMaximumSellableTokens = crowdsaleContract.methods.maximumSellableTokens().call().then((maximumSellableTokens) => {
            const maxSellableTokens = toBigNumber(crowdsalePageStore.maximumSellableTokens)
            crowdsalePageStore.setProperty('maximumSellableTokens', maxSellableTokens.plus(maximumSellableTokens).toFixed())

            //calc maximumSellableTokens in Eth
            return setMaximumSellableTokensInEth(crowdsaleContract, maximumSellableTokens)
          })

          let getInvestors = crowdsaleContract.methods.investorCount().call().then((investors) => {
            const storedInvestorsCount = toBigNumber(crowdsalePageStore.investors)
            crowdsalePageStore.setProperty('investors', storedInvestorsCount.plus(investors).toFixed())
          })

          return Promise.all([getWeiRaised, getTokensSold, getMaximumSellableTokens, getInvestors])
        })
    })

  return Promise.all(promises)
}

export function getCrowdsaleTargetDates() {
  return contractStore.crowdsale.addr.reduce((promise, address) => {
    return promise.then(() => {
      return attachToContract(contractStore.crowdsale.abi, address)
        .then(contract => {
          if (!contract) return Promise.reject(noContractAlert())

          const { methods } = contract

          const whenStartsAt = methods.startsAt ? methods.startsAt().call() : Promise.resolve()
          const whenEndsAt = methods.endsAt ? methods.endsAt().call() : Promise.resolve()

          return Promise.all([whenStartsAt, whenEndsAt])
            .then(([startsAt, endsAt]) => {
              const startsAtMilliseconds = startsAt * 1000
              const endsAtMilliseconds = endsAt * 1000

              crowdsalePageStore.addTier({
                startDate: startsAtMilliseconds,
                endDate: endsAtMilliseconds
              })

              console.log("startDate:", startsAtMilliseconds)
              if (!crowdsalePageStore.startDate || crowdsalePageStore.startDate > startsAtMilliseconds)
                crowdsalePageStore.startDate = startsAtMilliseconds

              console.log("endDate:", endsAtMilliseconds)
              if (!crowdsalePageStore.endDate || crowdsalePageStore.endDate < endsAtMilliseconds)
                crowdsalePageStore.setProperty('endDate', endsAtMilliseconds)

              console.log("curDate:", Date.now())
            })
        })
    })
  }, Promise.resolve())
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

export function getCurrentRate(crowdsaleContract) {
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
)}

export let getCurrentAccount = () => {
  const { web3 } = web3Store
  return new Promise((resolve, reject) => {
    if (!web3) {
      reject('no MetaMask')
    }
    web3.eth.getAccounts().then(accounts => {
      if (accounts.length === 0) {
        reject('no accounts')
      }
      resolve(accounts[0]);
    })
  });
}

export let attachToInitCrowdsaleContract = () => {
  return new Promise((resolve, reject) => {
    let initCrowdsaleObj = toJS(contractStore.initCrowdsale)

    attachToContract(initCrowdsaleObj.abi, initCrowdsaleObj.addr)
      .then(iniCrowdsaleContract => {
        console.log('attach to crowdsale contract')

        if (!iniCrowdsaleContract) {
          noContractAlert()
          reject('no contract')
        }

        resolve(iniCrowdsaleContract);
      })
  });
}

export const getContractStoreProperty = (contract, property) => {
  const text = contractStore && contractStore[contract] && contractStore[contract][property]
  return text === undefined ? '' : text
}
