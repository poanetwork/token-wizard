import Web3 from 'web3';
import { incorrectNetworkAlert, noContractAlert } from './alerts'
import { getEncodedABIClientSide } from './microservices'
import { findCurrentContractRecursively as findCurrentContractRecursively2 } from './web3'

// instantiate new web3 instance
const web3 = new Web3();

// providers
export const providers = {
  testrpc: web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545')),
};

// if window provider exists
if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
  providers.window = web3.setProvider(window.web3.currentProvider);
}

// get current provider
export function getCurrentProvider() {
	console.log(web3.currentProvider);
  return web3.currentProvider;
}

export function getWeb3(cb) {
  var web3 = window.web3;
	if (typeof web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
    cb(web3, false);
  } else {
    // window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(web3.currentProvider); 

    //checkNetworkVersion(myWeb3, function(isOraclesNetwork) {
    cb(myWeb3, false);
    //});
  }
  return myWeb3;
}

export function checkNetWorkByID(web3, _networkIdFromGET) {
  web3.version.getNetwork(function(err, _networkIdFromNetwork) {
    if (err) {
      console.log(err);
    }

    let networkNameFromGET = getNetWorkNameById(_networkIdFromGET);
    let networkNameFromNetwork = getNetWorkNameById(_networkIdFromNetwork);
    if (networkNameFromGET !== networkNameFromNetwork) {
      console.log(networkNameFromGET +"!="+ networkNameFromNetwork);
      incorrectNetworkAlert(networkNameFromGET, networkNameFromNetwork);
    }
  });
}

export function calculateFutureBlock(targetTime, blockTimeGeneration, cb) {
  getWeb3((web3) => {
    web3.eth.getBlockNumber(function(err, curBlock) {
      if (err) return console.log(err);

      let curTime = new Date();

      let curTimeInSec = curTime.getTime()/1000;
      let targetTimeInSec = targetTime/1000;
      let timeDiffInSec = targetTimeInSec - curTimeInSec;
      let targetBlockDiff = Math.round(timeDiffInSec / blockTimeGeneration, 0);
      let targetBlock = curBlock + targetBlockDiff;
      cb(targetBlock);
    });
  });
}

function getNetWorkNameById(_id) {
  console.log(_id);
  switch (parseInt(_id, 10)) {
    case 1: {
      return "Mainnet";
    } break;
    case 2: {
      return "Morden";
    } break;
    case 3: {
      return "Ropsten";
    }  break;
    case 4: {
      return "Rinkeby";
    }  break;
    case 42: {
      return "Kovan";
    }  break;
     case 12648430: {
       return "Oracles dev test";
    }  break;
    default: {
      return "Unknown";
    } break;
  }
}

export function approve(web3, abi, addr, crowdsaleAddr, initialSupplyInWei, cb) {
  console.log("###approve:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    tokenContract.approve.sendTransaction(crowdsaleAddr, initialSupplyInWei, function(err, result) {
      if (err) return console.log(err);

      console.log("approve function transaction: " + result);
      cb();
    });
  });
}

export function setTransferAgent(web3, abi, addr, targetAddr, cb) {
  console.log("###setTransferAgent:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    tokenContract.setTransferAgent.sendTransaction(targetAddr, true, function(err, result) {
      if (err) return console.log(err);

      console.log("setTransferAgent function transaction: " + result);
      cb();
    });
  });
}

//for mintable token
export function setMintAgent(web3, abi, addr, acc, cb) {
  console.log("###setMintAgent:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    tokenContract.setMintAgent.sendTransaction(acc, true, function(err, result) {
      if (err) return console.log(err);

      console.log("setMintAgent function transaction: " + result);
      cb();
    });
  });
}

export function updateJoinedCrowdsales(web3, abi, addr, joinedCntrctAddr, cb) {
  console.log("###updateJoinedCrowdsales:###");
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (!crowdsaleContract) return noContractAlert();

    crowdsaleContract.updateJoinedCrowdsales.sendTransaction(joinedCntrctAddr, function(err, result) {
      if (err) return console.log(err);

      console.log("updateJoinedCrowdsales function transaction: " + result);
      cb();
    });
  });
}

export function addWhiteList(round, web3, crowdsale, abi, addr, cb) {
  console.log("###whitelist:###");
  let whitelist = [];
  for (let i = 0; i <= round; i++) {
    console.log(crowdsale[i]);
    console.log(crowdsale[i].whitelist);
    whitelist.push.apply(whitelist, crowdsale[i].whitelist);
  }
  console.log(whitelist);
  if (whitelist.length === 0) {
    return cb();
  }
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (!crowdsaleContract) return noContractAlert();

    let addrs = [];
    let statuses = [];
    let minCaps = [];
    let maxCaps = [];

    for (let i = 0; i < whitelist.length; i++) {
      addrs.push(whitelist[i].addr);
      statuses.push(true);
      minCaps.push(whitelist[i].min);
      maxCaps.push(whitelist[i].max);
    }

    console.log("addrs:");
    console.log(addrs);
    console.log("statuses:");
    console.log(statuses);
    console.log("minCaps:");
    console.log(minCaps);
    console.log("maxCaps:");
    console.log(maxCaps);

    crowdsaleContract.setEarlyParicipantsWhitelist.sendTransaction(addrs, statuses, minCaps, maxCaps, function(err, result) {
      if (err) return console.log(err);

      console.log("setEarlyParicipantsWhitelist function transaction: " + result);
      cb();
    });
  });
}

export function setReservedTokensListMultiple(web3, abi, addr, token, cb) {
  console.log("###setReservedTokensListMultiple:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    let addrs = [];
    let dims = [];
    let vals = [];

    for (let i = 0; i < token.reservedTokens.length; i++) {
      addrs.push(token.reservedTokens[i].addr);
      dims.push(token.reservedTokens[i].dim == "tokens"?true:false);
      vals.push(token.reservedTokens[i].val);
    }

    tokenContract.setReservedTokensListMultiple.sendTransaction(addrs, dims, vals, function(err, result) {
      if (err) return console.log(err);

      console.log("setReservedTokensListMultiple function transaction: " + result);
      cb();
    });
  });
}

export function setFinalizeAgent(web3, abi, addr, finalizeAgentAddr, cb) {
  console.log("###setFinalizeAgent:###");
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (!crowdsaleContract) return noContractAlert();

    crowdsaleContract.setFinalizeAgent.sendTransaction(finalizeAgentAddr, function(err, result) {
      if (err) return console.log(err);

      console.log("setFinalizeAgent function transaction: " + result);
      cb();
    });
  });
}

export function setReleaseAgent(web3, abi, addr, finalizeAgentAddr, cb) {
  console.log("###setReleaseAgent:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    tokenContract.setReleaseAgent.sendTransaction(finalizeAgentAddr, function(err, result) {
      if (err) return console.log(err);

      console.log("setReleaseAgent function transaction: " + result);
      cb();
    });
  });
}

export function transferOwnership(web3, abi, addr, finalizeAgentAddr, cb) {
  console.log("###transferOwnership:###");
  attachToContract(web3, abi, addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    tokenContract.transferOwnership.sendTransaction(finalizeAgentAddr, function(err, result) {
      if (err) return console.log(err);

      console.log("transferOwnership function transaction: " + result);
      cb();
    });
  });
}

export function getJoinedTiers(web3, abi, addr, joinedCrowdsales, cb) {
  //joinedCrowdsales.push(addr);
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);

    getJoinedTiersRecursively(0, crowdsaleContract, joinedCrowdsales, function(_joinedCrowdsales) {
      cb(_joinedCrowdsales);
    })
  });
}

function getJoinedTiersRecursively(i, crowdsaleContract, joinedCrowdsales, cb) {
  crowdsaleContract.joinedCrowdsales.call(i, function(err, joinedCrowdsale) {
    if (err) return console.log(err);
    console.log("joinedCrowdsale: " + joinedCrowdsale);

    if (joinedCrowdsale === "0x") {
      cb(joinedCrowdsales);
    } else {
      joinedCrowdsales.push(joinedCrowdsale);
      i++;
      getJoinedTiersRecursively(i, crowdsaleContract, joinedCrowdsales, cb);
    }
  })
}

export function findCurrentContractRecursively(i, $this, web3, firstCrowdsaleContract, cb) {
  console.log($this.state.contracts.crowdsale.addr);
  let crowdsaleAddr = $this.state.contracts.crowdsale.addr[i];
  if (i === $this.state.contracts.crowdsale.addr.length) return cb(firstCrowdsaleContract, i);
  if (!crowdsaleAddr) return cb(null);
  if (!web3.isAddress(crowdsaleAddr)) return cb(null);
  attachToContract(web3, $this.state.contracts.crowdsale.abi, crowdsaleAddr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (i === 0) {
      firstCrowdsaleContract = crowdsaleContract;
    }
    if (!crowdsaleContract) return noContractAlert();
    console.log($this.state.contracts.crowdsale.contractType);
    if ($this.state.contracts.crowdsale.contractType == $this.state.contractTypes.standard)
      return cb(crowdsaleContract, i);
    crowdsaleContract.startsAt.call(function(err, startDate) {
      if (err) return console.log(err);
      
      startDate = startDate*1000;
      console.log("startDate: " + startDate);
      crowdsaleContract.endsAt.call(function(err, endDate) {
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

export function updateWhiteListRecursively(i, $this, tierNum, web3, cb) {
  console.log($this.state.contracts.crowdsale.addr);
  if (tierNum >= $this.state.contracts.crowdsale.addr.length - 1) return cb();

  let crowdsaleAddr = $this.state.contracts.crowdsale.addr[tierNum + 1];
  attachToContract(web3, $this.state.contracts.crowdsale.abi, crowdsaleAddr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);

    if (!crowdsaleContract) return noContractAlert();
    console.log(crowdsaleContract);

    crowdsaleContract.updateEarlyParicipantWhitelist.sendTransaction($this.state.tokensToInvest, function(err, txHash) {
      if (err) return console.log(err);

      console.log("updateEarlyParicipantWhitelist function transaction: " + txHash);
    })
  });
}

export function getCrowdsaleTargetDates(web3, $this, cb) {
  let propsCount = 0;
  let cbCount = 0;
  let state = $this.state;
  for (let i = 0; i < state.contracts.crowdsale.addr.length; i++) {
    let crowdsaleAddr = state.contracts.crowdsale.addr[i];
    attachToContract(web3, state.contracts.crowdsale.abi, crowdsaleAddr, function(err, crowdsaleContract) {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();
      if (crowdsaleContract.startBlock) {
        propsCount++;
        crowdsaleContract.startBlock.call(function(err, startBlock) {
          cbCount++;
          if (err) return console.log(err); 
                     
          console.log("startBlock: " + startBlock);
          if (!state.crowdsale.startBlock || state.crowdsale.startBlock > startBlock)
            state.crowdsale.startBlock = startBlock;
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }

      if (crowdsaleContract.startsAt) {
        propsCount++;
        crowdsaleContract.startsAt.call(function(err, startDate) {
          cbCount++;
          if (err) return console.log(err);
          
          console.log("startDate: " + startDate*1000);
          if (!state.crowdsale.startDate || state.crowdsale.startDate > startDate*1000)
            state.crowdsale.startDate = startDate*1000;
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }

      if (crowdsaleContract.endBlock) {
        propsCount++;
        crowdsaleContract.endBlock.call(function(err, endBlock) {
          cbCount++;
          if (err) return console.log(err);
                     
          console.log("endBlock: " + endBlock);
          if (!state.crowdsale.endBlock || state.crowdsale.endBlock < endBlock)
            state.crowdsale.endBlock = endBlock;
          web3.eth.getBlockNumber(function(err, curBlock) {
            if (err) return console.log(err);
         
            console.log("curBlock: " + curBlock);
            var blocksDiff = parseInt($this.state.crowdsale.endBlock, 10) - parseInt(curBlock, 10);
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

      if (crowdsaleContract.endsAt) {
        propsCount++;
        crowdsaleContract.endsAt.call(function(err, endDate) {
          cbCount++;
          if (err) return console.log(err);
          
          console.log("endDate: " + endDate*1000);
          if (!state.crowdsale.endDate || state.crowdsale.endDate < endDate*1000)
            state.crowdsale.endDate = endDate*1000;
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

export function initializeAccumulativeData($this, cb) {
  let state = $this.state;
  state.crowdsale.weiRaised = 0;
  state.crowdsale.tokenAmountOf = 0;
  state.crowdsale.maximumSellableTokens = 0;
  state.crowdsale.investors = 0;
  $this.setState(state, cb);
}

export function getAccumulativeCrowdsaleData(web3, $this, cb) {
  let propsCount = 0;
  let cbCount = 0;
  console.log("$this.state.contracts.crowdsale.addr.length: " + $this.state.contracts.crowdsale.addr.length);
  for (let i = 0; i < $this.state.contracts.crowdsale.addr.length; i++) {
    let crowdsaleAddr = $this.state.contracts.crowdsale.addr[i];
    attachToContract(web3, $this.state.contracts.crowdsale.abi, crowdsaleAddr, function(err, crowdsaleContract) {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();

      propsCount++;
      crowdsaleContract.weiRaised.call(function(err, weiRaised) {
        cbCount++;
        if (err) return console.log(err);
        
        console.log("weiRaised: " + web3.fromWei(parseInt(weiRaised, 10), "ether"));
        let state = $this.state;
        if (state.crowdsale.weiRaised)
          state.crowdsale.weiRaised += parseInt(weiRaised, 10);//parseFloat(web3.fromWei(parseInt(weiRaised, 10), "ether"));
        else
          state.crowdsale.weiRaised = parseInt(weiRaised, 10);//parseFloat(web3.fromWei(parseInt(weiRaised, 10), "ether"));

        state.crowdsale.ethRaised = parseFloat(web3.fromWei(parseInt(state.crowdsale.weiRaised, 10), "ether"));

        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state, cb);
        }
      });

      /*if (crowdsaleContract.tokenAmountOf) {
        propsCount++;
        crowdsaleContract.tokenAmountOf.call(web3.eth.accounts[0], function(err, tokenAmountOf) {
          cbCount++;
          if (err) return console.log(err);
          
          console.log("tokenAmountOf: " + tokenAmountOf);
          let state = $this.state;
          if (state.crowdsale.tokenAmountOf)
            state.crowdsale.tokenAmountOf += parseInt(tokenAmountOf, 10);
          else
            state.crowdsale.tokenAmountOf = parseInt(tokenAmountOf, 10);
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }*/

      if (crowdsaleContract.maximumSellableTokens) {
        propsCount++;
        crowdsaleContract.maximumSellableTokens.call(function(err, maximumSellableTokens) {
          cbCount++;
          if (err) return console.log(err);
          
          console.log("maximumSellableTokens: " + maximumSellableTokens);
          let state = $this.state;
          if (state.crowdsale.maximumSellableTokens)
            state.crowdsale.maximumSellableTokens += parseInt(maximumSellableTokens, 10);
          else
            state.crowdsale.maximumSellableTokens = parseInt(maximumSellableTokens, 10);
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }

      let getInvestors;
      if (crowdsaleContract.investorCount) getInvestors = crowdsaleContract.investorCount;
      else if (crowdsaleContract.investors) getInvestors = crowdsaleContract.investors;

      if (getInvestors) {
        propsCount++;
        getInvestors.call(function(err, investors) {
          cbCount++;
          if (err) return console.log(err);
          
          console.log("investors: " + investors);
          let state = $this.state;
          if (state.crowdsale.investors)
            state.crowdsale.investors += parseInt(investors, 10);
          else
            state.crowdsale.investors = parseInt(investors, 10);
          if (propsCount === cbCount) {
            state.loading = false;
            $this.setState(state, cb);
          }
        });
      }
    });
  }
}

export function getCrowdsaleData(web3, $this, crowdsaleContract, cb) {
  if (!crowdsaleContract) return noContractAlert();

  console.log(crowdsaleContract);
  let propsCount = 0;
  let cbCount = 0;

  if (crowdsaleContract.rate) {
    propsCount++;
    crowdsaleContract.rate.call(function(err, rate) {
      cbCount++;
      if (err) return console.log(err);
      
      console.log("rate: " + web3.fromWei(parseInt(rate, 10), "ether"));
      let state = $this.state;
      state.pricingStrategy.rate = web3.fromWei(parseInt(rate, 10), "ether");
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state, cb);
      }
    });
  }

  if (crowdsaleContract.minimumFundingGoal) {
    propsCount++;
    crowdsaleContract.minimumFundingGoal.call(function(err, supply) {
      cbCount++;
      if (err) return console.log(err);
      
      console.log("supply: " + supply);
      let state = $this.state;
      state.crowdsale.supply = supply;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state, cb);
      }
    });
  }

  if (crowdsaleContract.supply) {
    propsCount++;
    crowdsaleContract.supply.call(function(err, supply) {
      cbCount++;
      if (err) return console.log(err);
      
      console.log("supply: " + supply);
      let state = $this.state;
      state.crowdsale.supply = supply;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state, cb);
      }
    });
  }

  propsCount++;
  crowdsaleContract.token.call(function(err, tokenAddr) {
    cbCount++;
    if (err) return console.log(err);
    
    console.log("token: " + tokenAddr);
    let state = $this.state;
    state.contracts.token.addr = tokenAddr;
    if (propsCount === cbCount) {
      state.loading = false;
      $this.setState(state, cb);
    }

    if (!tokenAddr || tokenAddr === "0x") return;
    getTokenData(web3, $this);

    if (!crowdsaleContract.pricingStrategy) return;

    propsCount++;
    crowdsaleContract.pricingStrategy.call(function(err, pricingStrategyAddr) {
      cbCount++;
      if (err) return console.log(err);
      
      console.log("pricingStrategy: " + pricingStrategyAddr);
      let state = $this.state;
      state.contracts.pricingStrategy.addr = pricingStrategyAddr;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state, cb);
      }

      if (!pricingStrategyAddr || pricingStrategyAddr === "0x") return;
      getPricingStrategyData(web3, $this);
    });
  });
}

function getTokenData(web3, $this) {
  let propsCount = 0;
  let cbCount = 0;
  attachToContract(web3, $this.state.contracts.token.abi, $this.state.contracts.token.addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    propsCount++;
    tokenContract["name"].call(function(err, name) {
      cbCount++;
      if (err) return console.log(err);
      
      console.log("token name: " + name);
      let state = $this.state;
      state.token.name = name;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state);
      }
    });
    propsCount++;
    tokenContract["symbol"].call(function(err, ticker) {
      cbCount++;
      if (err) console.log(err);
      console.log("token ticker: " + ticker);
      let state = $this.state;
      state.token.ticker = ticker;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state);
      }
    });
    if (tokenContract.balanceOf) {
      propsCount++;
      tokenContract.balanceOf.call(web3.eth.accounts[0], function(err, balanceOf) {
        cbCount++;
        if (err) return console.log(err);
        
        console.log("balanceOf: " + balanceOf);
        let state = $this.state;
        if (state.crowdsale.tokenAmountOf)
          state.crowdsale.tokenAmountOf += parseInt(balanceOf, 10);
        else
          state.crowdsale.tokenAmountOf = parseInt(balanceOf, 10);
        if (propsCount === cbCount) {
          state.loading = false;
          $this.setState(state);
        }
      });
    }
    propsCount++;
    tokenContract["decimals"].call(function(err, decimals) {
      cbCount++;
      if (err) console.log(err);
      console.log("token decimals: " + decimals);
      let state = $this.state;
      state.token.decimals = decimals;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state);
      }
    });
    propsCount++;
    tokenContract["totalSupply"].call(function(err, supply) {
      cbCount++;
      if (err) console.log(err);
      let state = $this.state;
      console.log("token supply: " + supply);
      state.token.supply = supply;
      if (propsCount === cbCount) {
        state.loading = false;
        $this.setState(state);
      }
    });
  });
}

function getPricingStrategyData(web3, $this) {
  attachToContract(web3, $this.state.contracts.pricingStrategy.abi, $this.state.contracts.pricingStrategy.addr, function(err, pricingStrategyContract) {
    console.log("attach to pricing strategy contract");
    if (err) return console.log(err);
    if (!pricingStrategyContract) return noContractAlert();

    pricingStrategyContract.oneTokenInWei.call(function(err, rate) {
      if (err) console.log(err);
      
      console.log("pricing strategy rate: " + rate);
      let state = $this.state;
      state.pricingStrategy.rate = parseInt(rate, 10);//web3.fromWei(parseInt(rate, 10), "ether");
      $this.setState(state);
    });

    //EthTranchePricing
    /*pricingStrategyContract.getCurrentPrice($this.state.crowdsale.weiRaised, function(err, rate) {
      if (err) console.log(err);
      
      console.log("pricing strategy rate: " + rate);
      let state = $this.state;
      state.pricingStrategy.rate = rate.toString();
      $this.setState(state);
    });*/
  });
}

export function getNetworkVersion(web3, cb) {
  web3.version.getNetwork(function(err, netId) {
    if (err) {
      console.log(err);
      cb(null);
    }
    
    cb(netId);
  });
}

export function deployContract(i, web3, abi, bin, params, state, cb) {
  //console.log('web3.eth.accounts[0]', web3.eth.accounts[0], 'bin', bin)
  getEncodedABIClientSide(web3, abi, state, params, i, (ABIencoded) => {
    console.log(ABIencoded);
    let binFull = bin + ABIencoded.substr(2);
    web3.eth.estimateGas({
      from: web3.eth.accounts[0], 
      data: binFull
    }, function(err, estimatedGas) {
      console.log('estimated gas callback', estimatedGas)
      if (err) console.log('errrrrrrrrrrrrrrrrr', err);
      console.log('gas is estimated', estimatedGas, 'err', err)
      if (!estimatedGas) estimatedGas = 3516260;
      else estimatedGas += 100000;
      
      var contractInstance = web3.eth.contract(abi);
      var opts = {
        from: web3.eth.accounts[0],
        data: "0x" + bin,
        gas: estimatedGas
      };
      var totalParams = params;
      totalParams.push(opts);
      totalParams.push(deployContractCB);
      console.log('totalParams', totalParams);
      contractInstance.new(...totalParams);

      function deployContractCB(err, contract) {
        if (err) console.log(err);
        console.log(contract);
        if (contract) {
          if (contract.address) {
            console.log(contract);
            console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
            cb(null, contract.address);
          }
        }
      };
    });
  });
}

//todo
export function txMinedCallback() {

}

export function attachToContract(web3, abi, addr, cb) {
	if(!web3.isConnected()) {
		if (cb) cb({code: 200, title: "Error", message: "check RPC availability"});
	} else {
    web3.eth.defaultAccount = web3.eth.accounts[0];
		console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
		
		var MyContract = web3.eth.contract(abi);

		var contractInstance = MyContract.at(addr);
		
		if (cb) cb(null, contractInstance);
	}
}

// Abstraction:
// The web3 object may change in the future
// it is best to abstract the critical methods
// so we dont get hung up on object design that may change in the future


// abstract the contract object
export function contract() {
  return web3.eth.contract.apply(web3.eth, arguments); // eslint-disable-line
}

// export web3 object instance
export default web3;
