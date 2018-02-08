import { attachToContract } from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'
import { CONTRACT_TYPES } from '../../utils/constants'
import { contractStore, crowdsalePageStore, tokenStore, web3Store } from '../../stores'
import { toJS } from 'mobx'

export function getJoinedTiers(abi, addr, joinedCrowdsales, cb) {
  attachToContract(abi, addr)
    .then(crowdsaleContract => {
      console.log('attach to crowdsale contract')

      crowdsaleContract.methods.joinedCrowdsalesLen().call(function (err, joinedCrowdsalesLen) {
        if (err) {
          console.log(err)
          return cb([])
        }

        getJoinedTiersRecursively(0, crowdsaleContract, joinedCrowdsales, joinedCrowdsalesLen, function (_joinedCrowdsales) {
          cb(_joinedCrowdsales)
        })
      })
    })
    .catch(err => {
      console.log(err)
      cb([])
    })
}

function getJoinedTiersRecursively(i, crowdsaleContract, joinedCrowdsales, joinedCrowdsalesLen, cb) {
  if (i >= joinedCrowdsalesLen) {
    return cb(joinedCrowdsales);
  }

  crowdsaleContract.methods.joinedCrowdsales(i).call(function(err, joinedCrowdsale) {
    if (err) return console.log(err);
    console.log("joinedCrowdsale: " + joinedCrowdsale);

    if (joinedCrowdsale === "0x") {
      cb(joinedCrowdsales);
    } else {
      joinedCrowdsales.push(joinedCrowdsale);
      i++;
      getJoinedTiersRecursively(i, crowdsaleContract, joinedCrowdsales, joinedCrowdsalesLen, cb);
    }
  })
}

export function findCurrentContractRecursively(i, firstCrowdsaleContract, cb) {
  console.log(contractStore.crowdsale.addr);
  let crowdsaleAddr = contractStore.crowdsale.addr[i];
  const { web3 } = web3Store

  if (i === contractStore.crowdsale.addr.length) return cb(firstCrowdsaleContract, i);
  if (!crowdsaleAddr) return cb(null);
  if (!web3.utils.isAddress(crowdsaleAddr)) return cb(null);

  attachToContract(contractStore.crowdsale.abi, crowdsaleAddr)
    .then(crowdsaleContract => {
      console.log('attach to crowdsale contract')

      if (i === 0) {
        firstCrowdsaleContract = crowdsaleContract
      }

      if (!crowdsaleContract) return noContractAlert()

      console.log(contractStore.crowdsale.contractType)

      if (contractStore.crowdsale.contractType === CONTRACT_TYPES.standard) return cb(crowdsaleContract, i)

      crowdsaleContract.methods.startsAt().call(function (err, startDate) {
        if (err) return console.log(err)

        startDate = startDate * 1000
        console.log('startDate: ' + startDate)
        crowdsaleContract.methods.endsAt().call(function (err, endDate) {
          if (err) return console.log(err)

          endDate = endDate * 1000
          console.log('endDate: ' + endDate)

          let curDate = new Date().getTime()
          console.log('curDate: ' + curDate)
          if (curDate < endDate && curDate >= startDate) {
            cb(crowdsaleContract, i)
          } else {
            i++
            findCurrentContractRecursively(i, firstCrowdsaleContract, cb)
          }
        })
      })
    })
    .catch(err => console.log(err))
}

export function getCrowdsaleTargetDates($this, cb) {
  let propsCount = 0;
  let cbCount = 0;
  let state = $this.state;
  const { web3 } = web3Store

  for (let i = 0; i < contractStore.crowdsale.addr.length; i++) {
    let crowdsaleAddr = contractStore.crowdsale.addr[i];
    attachToContract(contractStore.crowdsale.abi, crowdsaleAddr)
      .then(crowdsaleContract => { // eslint-disable-line no-loop-func
        console.log("attach to crowdsale contract");

        if (!crowdsaleContract) return noContractAlert();

        if (crowdsaleContract.methods.startBlock) {
          propsCount++;
          crowdsaleContract.methods.startBlock().call((err, startBlock) => {
            cbCount++;
            if (err) return console.log(err);

            console.log("startBlock: " + startBlock);
            if (!crowdsalePageStore.startBlock || crowdsalePageStore.startBlock > startBlock)
              crowdsalePageStore.setProperty('startBlock', startBlock);
            if (propsCount === cbCount) {
              state.loading = false;
              $this.setState(state, cb);
            }
          });
        }

        if (crowdsaleContract.methods.startsAt) {
          propsCount++;
          crowdsaleContract.methods.startsAt().call((err, startDate) => {
            cbCount++;
            if (err) return console.log(err);

            console.log("startDate: " + startDate * 1000);
            if (!crowdsalePageStore.startDate || crowdsalePageStore.startDate > startDate * 1000)
              crowdsalePageStore.startDate = startDate * 1000;
            if (propsCount === cbCount) {
              state.loading = false;
              $this.setState(state, cb);
            }
          });
        }

        if (crowdsaleContract.methods.endBlock) {
          propsCount++;
          crowdsaleContract.methods.endBlock().call((err, endBlock) => {
            cbCount++;
            if (err) return console.log(err);

            console.log("endBlock: " + endBlock);

            if (!crowdsalePageStore.endBlock || crowdsalePageStore.endBlock < endBlock) crowdsalePageStore.endBlock = endBlock;

            web3.eth.getBlockNumber((err, curBlock) => {
              if (err) return console.log(err);

              console.log("curBlock: " + curBlock);
              let blocksDiff = parseInt($this.crowdsalePageStore.endBlock, 10) - parseInt(curBlock, 10);

              console.log("blocksDiff: " + blocksDiff);
              let blocksDiffInSec = blocksDiff * state.blockTimeGeneration;

              console.log("blocksDiffInSec: " + blocksDiffInSec);
              state.seconds = blocksDiffInSec;

              if (propsCount === cbCount) {
                state.loading = false;
                $this.setState(state, cb);
              }
            });
          });
        }

        if (crowdsaleContract.methods.endsAt) {
          propsCount++;
          crowdsaleContract.methods.endsAt().call((err, endDate) => {
            cbCount++;
            if (err) return console.log(err);

            console.log("endDate: " + endDate * 1000);

            if (!crowdsalePageStore.endDate || crowdsalePageStore.endDate < endDate * 1000) {
              crowdsalePageStore.setProperty('endDate', endDate * 1000)
            }

            console.log("curDate: " + new Date().getTime());

            if (propsCount === cbCount) {
              state.loading = false;
              $this.setState(state, cb);
            }
          });
        }
      })
      .catch(console.log)
  }
}

export function initializeAccumulativeData() {
  crowdsalePageStore.setProperty('maximumSellableTokens', 0)
  crowdsalePageStore.setProperty('maximumSellableTokensInWei', 0)
  crowdsalePageStore.setProperty('investors', 0)
  crowdsalePageStore.setProperty('ethRaised', 0)
  crowdsalePageStore.setProperty('weiRaised', 0)
  crowdsalePageStore.setProperty('tokensSold', 0)
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
            let newWeiRaised
            if (crowdsalePageStore.weiRaised) {
              newWeiRaised = crowdsalePageStore.weiRaised + parseInt(weiRaised, 10);
            } else {
              newWeiRaised = parseInt(weiRaised, 10);
            }

            crowdsalePageStore.setProperty('weiRaised', newWeiRaised)
            crowdsalePageStore.setProperty('ethRaised', parseFloat(web3.utils.fromWei(toFixed(crowdsalePageStore.weiRaised).toString(), 'ether')))
          })

          let getTokensSold = crowdsaleContract.methods.tokensSold().call().then((tokensSold) => {
            if (crowdsalePageStore.tokensSold) {
              crowdsalePageStore.setProperty('tokensSold', crowdsalePageStore.tokensSold + parseInt(tokensSold, 10))
            } else {
              crowdsalePageStore.setProperty('tokensSold', parseInt(tokensSold, 10))
            }
          })

          let getMaximumSellableTokens = crowdsaleContract.methods.maximumSellableTokens().call().then((maximumSellableTokens) => {
            const maxSellableTokens = crowdsalePageStore.maximumSellableTokens
            if (maxSellableTokens) {
              crowdsalePageStore.setProperty('maximumSellableTokens', maxSellableTokens + parseInt(toFixed(maximumSellableTokens), 10))
            } else {
              crowdsalePageStore.setProperty('maximumSellableTokens', parseInt(toFixed(maximumSellableTokens), 10))
            }

            //calc maximumSellableTokens in Eth
            return setMaximumSellableTokensInEth(crowdsaleContract, maximumSellableTokens)
          })

          let getInvestors = crowdsaleContract.methods.investorCount().call().then((investors) => {
            const oldInvestors = crowdsalePageStore.investors
            const investorsCount = parseInt(investors, 10)

            if (oldInvestors) {
              crowdsalePageStore.setProperty('investors', oldInvestors + investorsCount);
            } else {
              crowdsalePageStore.setProperty('investors', investorsCount);
            }
          });

          return Promise.all([getWeiRaised, getTokensSold, getMaximumSellableTokens, getInvestors])
        })
    })

  return Promise.all(promises)
}

function setMaximumSellableTokensInEth(crowdsaleContract, maximumSellableTokens) {
  return crowdsaleContract.methods.pricingStrategy().call()
    .then((pricingStrategyAddr) => {
      return attachToContract(contractStore.pricingStrategy.abi, pricingStrategyAddr)
    })
    .then(pricingStrategyContract => {
      if (!pricingStrategyContract) return noContractAlert()

      return pricingStrategyContract.methods.oneTokenInWei().call().then((oneTokenInWei) => {
        if (crowdsalePageStore.maximumSellableTokensInWei) {
          crowdsalePageStore.setProperty('maximumSellableTokensInWei', crowdsalePageStore.maximumSellableTokensInWei + parseInt(oneTokenInWei, 10) * maximumSellableTokens / 10 ** tokenStore.decimals)
        } else {
          crowdsalePageStore.setProperty('maximumSellableTokensInWei', parseInt(oneTokenInWei, 10) * maximumSellableTokens / 10 ** tokenStore.decimals)
        }
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

      getPricingStrategyData()
        .then(resolve)
        .catch(reject)
    });
  }
)}

export function getCrowdsaleData (crowdsaleContract) {
  return new Promise((resolve, reject) => {
    if (!crowdsaleContract) {
      noContractAlert()
      reject('no contract')
      return
    }

    console.log(crowdsaleContract)

    let propsCount = 0
    let cbCount = 0

    if (crowdsaleContract.methods.supply) {
      propsCount++
      crowdsaleContract.methods.supply().call((err, supply) => {
        cbCount++

        if (err) {
          return console.log(err)
        }

        console.log('supply:', supply)
        crowdsalePageStore.supply = supply

        if (propsCount === cbCount) {
          resolve()
        }
      })
    }

    propsCount++
    crowdsaleContract.methods.token().call((err, tokenAddr) => {
      cbCount++

      if (err) {
        return console.log(err)
      }

      console.log('token:', tokenAddr)
      contractStore.setContractProperty('token', 'addr', tokenAddr)

      // if (propsCount === cbCount) {
      //   resolve()
      //   return
      // }

      if (!tokenAddr || tokenAddr === '0x') {
        return console.log('no token address available:', tokenAddr)
      }

      propsCount++
      getTokenData()
        .then(() => {
          if (!crowdsaleContract.methods.pricingStrategy) {
            reject('no pricingStrategy method')
            return
          }

          propsCount++
          crowdsaleContract.methods.pricingStrategy().call((err, pricingStrategyAddr) => {
            cbCount++

            if (err) {
              reject(err)
              return console.log(err)
            }

            console.log('pricingStrategy:', pricingStrategyAddr)
            contractStore.setContractProperty('pricingStrategy', 'addr', pricingStrategyAddr)

            if (propsCount === cbCount) {
              resolve()
              return
            }

            if (!pricingStrategyAddr || pricingStrategyAddr === '0x') {
              reject('no pricingStrategyAddr')
              return
            }

            getPricingStrategyData()
              .then(() => {
                cbCount++
                if (propsCount === cbCount) {
                  resolve()
                }
              })
              .catch(reject)
          })
        })
        .catch(reject)
    })
  })
}

function getTokenData () {
  return new Promise((resolve, reject) => {
    const { web3 } = web3Store

    if (!web3) {
      resolve('no MetaMask')
      return
    }

    web3.eth.getAccounts().then(accounts => {
      if (accounts.length === 0) {
        resolve('no accounts')
        return
      }

      let propsCount = 0
      let cbCount = 0
      let tokenObj = toJS(contractStore.token)
      console.log('tokenObj', tokenObj)

      attachToContract(tokenObj.abi, tokenObj.addr)
        .then(tokenContract => {
          console.log('attach to token contract')

          if (!tokenContract) {
            noContractAlert()
            reject('no contract')
            return
          }

          propsCount++
          tokenContract.methods.name().call((err, name) => {
            cbCount++

            if (err) {
              return console.log(err)
            }

            console.log('token name:', name)
            tokenStore.setProperty('name', name)

            if (propsCount === cbCount) {
              resolve()
            }
          })

          propsCount++
          tokenContract.methods.symbol().call((err, ticker) => {
            cbCount++

            if (err) {
              console.log(err)
            }

            console.log('token ticker: ' + ticker)
            tokenStore.setProperty('ticker', ticker)

            if (propsCount === cbCount) {
              resolve()
            }
          })

          if (tokenContract.methods.balanceOf) {
            propsCount++
            tokenContract.methods.balanceOf.call(accounts[0], (err, balanceOf) => {
              cbCount++

              if (err) {
                return console.log(err)
              }

              console.log('balanceOf: ' + balanceOf)
              const tokenAmountOf = crowdsalePageStore.tokenAmountOf ? crowdsalePageStore.tokenAmountOf : 0
              crowdsalePageStore.setProperty('tokenAmountOf', tokenAmountOf + parseInt(balanceOf, 10))

              if (propsCount === cbCount) {
                resolve()
              }
            })
          }

          propsCount++
          tokenContract.methods.decimals().call((err, decimals) => {
            cbCount++

            if (err) {
              console.log(err)
            }

            console.log('token decimals:', decimals)
            tokenStore.setProperty('decimals', decimals)

            if (propsCount === cbCount) {
              resolve()
            }
          })

          propsCount++
          tokenContract.methods.totalSupply().call((err, supply) => {
            cbCount++

            if (err) {
              console.log(err)
            }

            console.log('token supply:', supply)
            tokenStore.setProperty('supply', supply)

            if (propsCount === cbCount) {
              resolve()

            } else {
              let propsCount = 0
              let cbCount = 0

              attachToContract(contractStore.token.abi, contractStore.token.addr)
                .then(tokenContract => {
                  console.log('attach to token contract')

                  if (!tokenContract) {
                    noContractAlert()
                    reject('no contract')
                    return
                  }

                  propsCount++
                  tokenContract.methods.name().call((err, name) => {
                    cbCount++

                    if (err) {
                      return console.log(err)
                    }

                    console.log('token name:', name)
                    tokenStore.setProperty('name', name)

                    if (propsCount === cbCount) {
                      resolve()
                    }
                  })

                  propsCount++
                  tokenContract.methods.symbol().call((err, ticker) => {
                    cbCount++

                    if (err) {
                      console.log(err)
                    }

                    console.log('token ticker:', ticker)
                    tokenStore.setProperty('ticker', ticker)

                    if (propsCount === cbCount) {
                      resolve()
                    }
                  })

                  if (tokenContract.methods.balanceOf) {
                    propsCount++
                    tokenContract.methods.balanceOf(accounts[0]).call((err, balanceOf) => {
                      cbCount++

                      if (err) {
                        return console.log(err)
                      }

                      console.log('balanceOf:', balanceOf)
                      const tokenAmountOf = crowdsalePageStore.tokenAmountOf ? crowdsalePageStore.tokenAmountOf : 0
                      crowdsalePageStore.setProperty('tokenAmountOf', tokenAmountOf + parseInt(balanceOf, 10))

                      if (propsCount === cbCount) {
                        resolve()
                      }
                    })
                  }

                  propsCount++
                  tokenContract.methods.decimals().call((err, decimals) => {
                    cbCount++

                    if (err) {
                      console.log(err)
                    }

                    console.log('token decimals:', decimals)
                    tokenStore.setProperty('decimals', decimals)

                    if (propsCount === cbCount) {
                      resolve()
                    }
                  })

                  propsCount++
                  tokenContract.methods.totalSupply().call((err, supply) => {
                    cbCount++

                    if (err) {
                      console.log(err)
                    }

                    console.log('token supply:', supply)
                    tokenStore.setProperty('supply', supply)

                    if (propsCount === cbCount) {
                      resolve()
                    }
                  })
                })
                .catch(reject)
            }
          })
        })
        .catch(reject)
    })
  })
}

export function getPricingStrategyData () {
  return new Promise((resolve, reject) => {
    attachToContract(contractStore.pricingStrategy.abi, contractStore.pricingStrategy.addr)
      .then(pricingStrategyContract => {
        console.log('attach to pricing strategy contract')

        if (!pricingStrategyContract) {
          noContractAlert()
          reject('no contract')
          return
        }

        pricingStrategyContract.methods.oneTokenInWei().call((err, rate) => {
          if (err) {
            console.log(err)
          }

          console.log('pricing strategy rate:', rate)
          crowdsalePageStore.setProperty('rate', parseInt(rate, 10))
          resolve()
        })
      })
      .catch(err => {
        reject(err)
        console.log(err)
      })
  })
}

export const getContractStoreProperty = (contract, property) => {
  const text = contractStore && contractStore[contract] && contractStore[contract][property]
  return text === undefined ? '' : text
}
