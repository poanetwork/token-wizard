import { attachToContract } from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { toFixed } from '../../utils/utils'
import { CONTRACT_TYPES } from '../../utils/constants'
import { crowdsalePageStore, contractStore, web3Store, tokenStore } from '../../stores'
import { findCurrentContractRecursively as findCurrentContractRecursively2 } from './utils'
import { toJSON } from 'mobx';

export function getJoinedTiers(web3, abi, addr, joinedCrowdsales, cb) {
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) {
      console.log(err)
      return cb([]);
    }

    crowdsaleContract.methods.joinedCrowdsalesLen().call(function(err, joinedCrowdsalesLen) {
      if (err) {
        console.log(err)
        return cb([]);
      };

      getJoinedTiersRecursively(0, crowdsaleContract, joinedCrowdsales, joinedCrowdsalesLen, function(_joinedCrowdsales) {
        cb(_joinedCrowdsales);
      })
    });
  });
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

export function findCurrentContractRecursively(i, $this, web3, firstCrowdsaleContract, cb) {
  console.log(contractStore.crowdsale.addr);
  let crowdsaleAddr = contractStore.crowdsale.addr[i];
  if (i === contractStore.crowdsale.addr.length) return cb(firstCrowdsaleContract, i);
  if (!crowdsaleAddr) return cb(null);
  if (!web3.utils.isAddress(crowdsaleAddr)) return cb(null);
  attachToContract(web3, contractStore.crowdsale.abi, crowdsaleAddr, (err, crowdsaleContract) => {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (i === 0) {
      firstCrowdsaleContract = crowdsaleContract;
    }
    if (!crowdsaleContract) return noContractAlert();
    console.log(contractStore.crowdsale.contractType);
    if (contractStore.crowdsale.contractType === CONTRACT_TYPES.standard)
      return cb(crowdsaleContract, i);
    crowdsaleContract.methods.startsAt().call(function(err, startDate) {
      if (err) return console.log(err);

      startDate = startDate*1000;
      console.log("startDate: " + startDate);
      crowdsaleContract.methods.endsAt().call(function(err, endDate) {
        if (err) return console.log(err);

        endDate = endDate*1000;
        console.log("endDate: " + endDate);

        let curDate = new Date().getTime();
        console.log("curDate: " + curDate);
        if (curDate < endDate && curDate >= startDate) {
          cb(crowdsaleContract, i);
        } else {
          i++;
          findCurrentContractRecursively2(i, $this, web3, firstCrowdsaleContract, cb);
        }
      });
    });
  });
}

export function getCrowdsaleTargetDates(web3, $this, cb) {
  let propsCount = 0;
  let cbCount = 0;
  let state = $this.state;
  for (let i = 0; i < contractStore.crowdsale.addr.length; i++) {
    let crowdsaleAddr = contractStore.crowdsale.addr[i];
    attachToContract(web3, contractStore.crowdsale.abi, crowdsaleAddr, function(err, crowdsaleContract) {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();
      if (crowdsaleContract.methods.startBlock) {
        propsCount++;
        crowdsaleContract.methods.startBlock().call(function(err, startBlock) {
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
        crowdsaleContract.methods.startsAt().call(function(err, startDate) {
          cbCount++;
          if (err) return console.log(err);

          console.log("startDate: " + startDate*1000);
          if (!crowdsalePageStore.startDate || crowdsalePageStore.startDate > startDate*1000)
            crowdsalePageStore.startDate = startDate*1000;
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }

      if (crowdsaleContract.methods.endBlock) {
        propsCount++;
        crowdsaleContract.methods.endBlock().call(function(err, endBlock) {
          cbCount++;
          if (err) return console.log(err);

          console.log("endBlock: " + endBlock);
          if (!crowdsalePageStore.endBlock || crowdsalePageStore.endBlock < endBlock)
            crowdsalePageStore.endBlock = endBlock;
          web3.eth.getBlockNumber(function(err, curBlock) {
            if (err) return console.log(err);

            console.log("curBlock: " + curBlock);
            var blocksDiff = parseInt($this.crowdsalePageStore.endBlock, 10) - parseInt(curBlock, 10);
            console.log("blocksDiff: " + blocksDiff);
            var blocksDiffInSec = blocksDiff * state.blockTimeGeneration;
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
        crowdsaleContract.methods.endsAt().call(function(err, endDate) {
          cbCount++;
          if (err) return console.log(err);

          console.log("endDate: " + endDate*1000);
          if (!crowdsalePageStore.endDate || crowdsalePageStore.endDate < endDate*1000)
            crowdsalePageStore.endDate = endDate*1000;
          console.log("curDate: " + new Date().getTime());
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
      });
      }
    });
  }
}

export function initializeAccumulativeData(cb) {
  crowdsalePageStore.setProperty('weiRaised', 0)
  crowdsalePageStore.setProperty('tokenAmountOf', 0)
  crowdsalePageStore.setProperty('maximumSellableTokens', 0)
  crowdsalePageStore.setProperty('investors', 0)
  cb()
}

export function getAccumulativeCrowdsaleData(web3, $this, cb) {
  let propsCount = 0;
  let cbCount = 0;
  console.log("contractStore.crowdsale.addr.length: " + contractStore.crowdsale.addr.length);
  for (let i = 0; i < contractStore.crowdsale.addr.length; i++) {
    let crowdsaleAddr = contractStore.crowdsale.addr[i];
    attachToContract(web3, contractStore.crowdsale.abi, crowdsaleAddr, function(err, crowdsaleContract) {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();

      propsCount++;
      crowdsaleContract.methods.weiRaised().call(function(err, weiRaised) {
        cbCount++;
        if (err) return console.log(err);

        console.log("weiRaised: " + web3.utils.fromWei(parseInt(weiRaised, 10), "ether"));
        let state = $this.state;
        const oldWeiRaised = crowdsalePageStore.weiRaised
        if (crowdsalePageStore.weiRaised)
          crowdsalePageStore.setProperty('weiRaised', oldWeiRaised + parseInt(weiRaised, 10));//parseFloat(web3.fromWei(parseInt(weiRaised, 10), "ether"));
        else
          crowdsalePageStore.setProperty('weiRaised', parseInt(weiRaised, 10));//parseFloat(web3.fromWei(parseInt(weiRaised, 10), "ether"));
        crowdsalePageStore.setProperty('ethRaised', parseFloat(web3.utils.fromWei(parseInt(crowdsalePageStore.weiRaised, 10), "ether")));

        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state, cb);
        }
      });

      if (crowdsaleContract.methods.tokensSold) {
        propsCount++;
        crowdsaleContract.methods.tokensSold().call(function(err, tokensSold) {
          cbCount++;
          if (err) return console.log(err);

          console.log("tokensSold: " + tokensSold);
          let state = { ...$this.state };
          if (crowdsalePageStore.tokensSold)
            crowdsalePageStore.setProperty('tokensSold',crowdsalePageStore.tokensSold + parseInt(tokensSold, 10));
          else
            crowdsalePageStore.setProperty('tokensSold', parseInt(tokensSold, 10));

          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      };

      if (crowdsaleContract.methods.maximumSellableTokens) {
        propsCount++;
        crowdsaleContract.methods.maximumSellableTokens().call(function(err, maximumSellableTokens) {
          cbCount++;
          if (err) return console.log(err);

          console.log("maximumSellableTokens: " + maximumSellableTokens);
          let state = $this.state;
          const maxSellableTokens = crowdsalePageStore.maximumSellableTokens
          if (maxSellableTokens)
            crowdsalePageStore.setProperty('maximumSellableTokens', maxSellableTokens + parseInt(toFixed(maximumSellableTokens), 10));
          else
            crowdsalePageStore.setProperty('maximumSellableTokens', parseInt(toFixed(maximumSellableTokens), 10));

          //calc maximumSellableTokens in Eth
          setMaximumSellableTokensInEth(web3, crowdsaleContract, maximumSellableTokens);

          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }

      let getInvestors;
      if (crowdsaleContract.methods.investorCount) getInvestors = crowdsaleContract.methods.investorCount();
      else if (crowdsaleContract.methods.investors) getInvestors = crowdsaleContract.methods.investors();

      if (getInvestors) {
        propsCount++;
        getInvestors.call(function(err, investors) {
          cbCount++;
          if (err) return console.log(err);

          console.log("investors: " + investors);
          let state = $this.state;
          const oldInvestors = crowdsalePageStore.investors
          if (oldInvestors)
            crowdsalePageStore.setProperty('investors', oldInvestors + parseInt(investors, 10));
          else
            crowdsalePageStore.setProperty('investors', oldInvestors);
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }
    });
  }
}

function setMaximumSellableTokensInEth(web3, crowdsaleContract, maximumSellableTokens) {
  crowdsaleContract.methods.pricingStrategy().call(function(err, pricingStrategyAddr) {
    if (err) return console.log(err);

    console.log("pricingStrategy: " + pricingStrategyAddr);
    attachToContract(web3, contractStore.pricingStrategy.abi, pricingStrategyAddr, function(err, pricingStrategyContract) {
      console.log("attach to pricing strategy contract");
      if (err) return console.log(err);
      if (!pricingStrategyContract) return noContractAlert();

      pricingStrategyContract.methods.oneTokenInWei().call(function(err, oneTokenInWei) {
        if (err) console.log(err);

        console.log("pricing strategy oneTokenInWei: " + oneTokenInWei);
        if (crowdsalePageStore.maximumSellableTokensInWei)
          crowdsalePageStore.setProperty('maximumSellableTokensInWei', crowdsalePageStore.maximumSellableTokensInWei + parseInt(oneTokenInWei, 10)*maximumSellableTokens/10**tokenStore.decimals)
        else
          crowdsalePageStore.setProperty('maximumSellableTokensInWei', parseInt(oneTokenInWei, 10)*maximumSellableTokens/10**tokenStore.decimals)
      });
    });
  });
}

export function getCurrentRate(web3, $this, crowdsaleContract, cb) {
  if (!crowdsaleContract) return noContractAlert();

  crowdsaleContract.methods.pricingStrategy().call(function(err, pricingStrategyAddr) {
    if (err) return console.log(err);

    console.log("pricingStrategy: " + pricingStrategyAddr);
    contractStore.setContractProperty('pricingStrategy', 'addr', pricingStrategyAddr)
    if (!pricingStrategyAddr || pricingStrategyAddr === "0x") return;
    getPricingStrategyData(web3, () => { cb() });
  });
}

export function getCrowdsaleData(web3, $this, crowdsaleContract, cb) {
  if (!crowdsaleContract) return noContractAlert();

  console.log(crowdsaleContract);
  let propsCount = 0;
  let cbCount = 0;

  if (crowdsaleContract.methods.supply) {
    propsCount++;
    crowdsaleContract.methods.supply().call(function(err, supply) {
      cbCount++;
      if (err) return console.log(err);

      console.log("supply: " + supply);
      let state = $this.state;
      crowdsalePageStore.supply = supply;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state, cb);
      }
    });
  }

  propsCount++;
  crowdsaleContract.methods.token().call(function(err, tokenAddr) {
    cbCount++;
    if (err) return console.log(err);

    console.log("token: " + tokenAddr);
    let state = $this.state;
    contractStore.setContractProperty('token', 'addr', tokenAddr)
    if (propsCount === cbCount) {
      state.loading = false;
      $this.setState(state, cb);
    }

    if (!tokenAddr || tokenAddr === "0x") return;
    propsCount++;
    getTokenData($this, function() {

      if (!crowdsaleContract.methods.pricingStrategy) return;

      propsCount++;
      crowdsaleContract.methods.pricingStrategy().call(function(err, pricingStrategyAddr) {
        cbCount++;
        if (err) return console.log(err);

        console.log("pricingStrategy: " + pricingStrategyAddr);
        let state = $this.state;
        contractStore.setContractProperty('pricingStrategy', 'addr', pricingStrategyAddr)
        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state, cb);
        }

        if (!pricingStrategyAddr || pricingStrategyAddr === "0x") return;
        getPricingStrategyData(web3, function() {
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      });

    });
  });
}

function getTokenData($this, cb) {
  const { web3 } = web3Store
  if (!web3) {
    let state = $this.state;
    state.loading = false;
    $this.setState(state, cb);
    return;
  }

  web3.eth.getAccounts().then((accounts) => {
    if (accounts.length === 0) {
      let state = $this.state;
      state.loading = false;
      $this.setState(state, cb);
      return;
    }

    let propsCount = 0;
    let cbCount = 0;
    let tokenObj = JSON.parse(JSON.stringify(contractStore.token))
    console.log('tokenObj', tokenObj)
    attachToContract(web3, tokenObj.abi, tokenObj.addr, function(err, tokenContract) {
      console.log("attach to token contract");
      if (err) return console.log(err);
      if (!tokenContract) return noContractAlert();

      propsCount++;
      tokenContract.methods.name().call(function(err, name) {
        cbCount++;
        if (err) return console.log(err);

        console.log("token name: " + name);
        let state = $this.state;
        tokenStore.setProperty('name', name);
        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state, cb);
        }
      });
      propsCount++;
      tokenContract.methods.symbol().call(function(err, ticker) {
        cbCount++;
        if (err) console.log(err);
        console.log("token ticker: " + ticker);
        let state = $this.state;
        tokenStore.setProperty('ticker', ticker)
        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state, cb);
        }
      });
      if (tokenContract.methods.balanceOf) {
        propsCount++;
        tokenContract.methods.balanceOf.call(accounts[0], function(err, balanceOf) {
          cbCount++;
          if (err) return console.log(err);

          console.log("balanceOf: " + balanceOf);
          let state = $this.state;
          if (crowdsalePageStore.tokenAmountOf)
            crowdsalePageStore.setProperty('tokenAmountOf', crowdsalePageStore.tokenAmountOf + parseInt(balanceOf, 10));
          else
            crowdsalePageStore.setProperty('tokenAmountOf', parseInt(balanceOf, 10));
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }
      propsCount++;
      tokenContract.methods.decimals().call(function(err, decimals) {
        cbCount++;
        if (err) console.log(err);
        console.log("token decimals: " + decimals);
        let state = $this.state;
        tokenStore.setProperty('decimals', decimals);
        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state, cb);
        }
      });
      propsCount++;
      tokenContract.methods.totalSupply().call(function(err, supply) {
        cbCount++;
        if (err) console.log(err);
        let state = $this.state;
        console.log("token supply: " + supply);
        tokenStore.setProperty('supply', supply);
        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state, cb);
          return;
        } else {
          let propsCount = 0;
          let cbCount = 0;
          attachToContract(web3, contractStore.token.abi, contractStore.token.addr, function(err, tokenContract) {
            console.log("attach to token contract");
            if (err) return console.log(err);
            if (!tokenContract) return noContractAlert();

            propsCount++;
            tokenContract.methods.name().call(function(err, name) {
              cbCount++;
              if (err) return console.log(err);

              console.log("token name: " + name);
              let state = $this.state;
              tokenStore.setProperty('name', name);
              if (propsCount === cbCount) {
                state.loading = false;
                $this.setState(state, cb);
              }
            });
            propsCount++;
            tokenContract.methods.symbol().call(function(err, ticker) {
              cbCount++;
              if (err) console.log(err);
              console.log("token ticker: " + ticker);
              let state = $this.state;
              tokenStore.setProperty('ticker', ticker);
              if (propsCount === cbCount) {
                state.loading = false;
                $this.setState(state, cb);
              }
            });
            if (tokenContract.methods.balanceOf) {
              propsCount++;
              tokenContract.methods.balanceOf(accounts[0]).call(function(err, balanceOf) {
                cbCount++;
                if (err) return console.log(err);

                console.log("balanceOf: " + balanceOf);
                let state = $this.state;
                if (crowdsalePageStore.tokenAmountOf)
                  crowdsalePageStore.setProperty('tokenAmountOf', crowdsalePageStore.tokenAmountOf + parseInt(balanceOf, 10));
                else
                  crowdsalePageStore.setProperty('tokenAmountOf', parseInt(balanceOf, 10));
                if (propsCount === cbCount) {
                  state.loading = false;
                  $this.setState(state, cb);
                }
              });
            }
            propsCount++;
            tokenContract.methods.decimals().call(function(err, decimals) {
              cbCount++;
              if (err) console.log(err);
              console.log("token decimals: " + decimals);
              let state = $this.state;
              tokenStore.setProperty('decimals', decimals);
              if (propsCount === cbCount) {
                state.loading = false;
                $this.setState(state, cb);
              }
            });
            propsCount++;
            tokenContract.methods.totalSupply().call(function(err, supply) {
              cbCount++;
              if (err) console.log(err);
              let state = $this.state;
              console.log("token supply: " + supply);
              tokenStore.setProperty('supply', supply);
              if (propsCount === cbCount) {
                state.loading = false;
                $this.setState(state, cb);
              }
            });
          });
        }
      })
    });
  })
}

export function getPricingStrategyData(web3, cb) {
  attachToContract(web3, contractStore.pricingStrategy.abi, contractStore.pricingStrategy.addr, function(err, pricingStrategyContract) {
    console.log("attach to pricing strategy contract");
    if (err) return console.log(err);
    if (!pricingStrategyContract) return noContractAlert();

    pricingStrategyContract.methods.oneTokenInWei().call(function(err, rate) {
      if (err) console.log(err);

      console.log("pricing strategy rate: " + rate);
      crowdsalePageStore.setProperty('rate', parseInt(rate, 10))//web3.fromWei(parseInt(rate, 10), "ether");
      cb();
    });
  });
}

export const getContractStoreProperty = (contract, property) => {
  const text = contractStore && contractStore[contract] && contractStore[contract][property]
  return text === undefined ? '' : text
}
