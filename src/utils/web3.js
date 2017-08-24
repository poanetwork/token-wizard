import Web3 from 'web3';
import { incorrectNetworkAlert, noContractAlert } from './alerts'

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
    console.log(networkNameFromGET +"!="+ networkNameFromNetwork);
    if (networkNameFromGET !== networkNameFromNetwork) {
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
      let targetTimeInSec = targetTime.getTime()/1000;
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

export function addWhiteList(web3, whitelist, abi, addr, cb) {
  console.log("###whitelist:###");
  console.log(whitelist);
  attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (!crowdsaleContract) return noContractAlert();

    crowdsaleContract.setEarlyParicipantWhitelist.sendTransaction(whitelist[0].addr, true, whitelist[0].min, whitelist[0].max, function(err, result) {
      if (err) return console.log(err);

      console.log("setEarlyParicipantWhitelist function transaction: " + result);
      cb();
    });
  });
}

export function setFinalizeAgent(web3, abi, addr, finalizeAgentAddr, cb) {
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

export function getCrowdsaleData(web3, $this) {
  attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr, function(err, crowdsaleContract) {
    console.log("attach to crowdsale contract");
    if (err) return console.log(err);
    if (!crowdsaleContract) return noContractAlert();

    console.log(crowdsaleContract);

    crowdsaleContract.weiRaised.call(function(err, weiRaised) {
      if (err) return console.log(err);
      
      console.log("weiRaised: " + web3.fromWei(parseInt(weiRaised, 10), "ether"));
      let state = $this.state;
      state.crowdsale.weiRaised = web3.fromWei(parseInt(weiRaised, 10), "ether");
      $this.setState(state);
    });

    if (crowdsaleContract.rate) {
      crowdsaleContract.rate.call(function(err, rate) {
        if (err) return console.log(err);
        
        console.log("rate: " + web3.fromWei(parseInt(rate, 10), "ether"));
        let state = $this.state;
        state.pricingStrategy.rate = web3.fromWei(parseInt(rate, 10), "ether");
        $this.setState(state);
      });
    }

    if (crowdsaleContract.minimumFundingGoal) {
      crowdsaleContract.minimumFundingGoal.call(function(err, supply) {
        if (err) return console.log(err);
        
        console.log("supply: " + supply);
        let state = $this.state;
        state.crowdsale.supply = supply;
        $this.setState(state);
      });
    }

    if (crowdsaleContract.supply) {
      crowdsaleContract.supply.call(function(err, supply) {
        if (err) return console.log(err);
        
        console.log("supply: " + supply);
        let state = $this.state;
        state.crowdsale.supply = supply;
        $this.setState(state);
      });
    }

    let getInvestors;
    if (crowdsaleContract.investorCount) getInvestors = crowdsaleContract.investorCount;
    else if (crowdsaleContract.investors) getInvestors = crowdsaleContract.investors;

    if (getInvestors) {
      getInvestors.call(function(err, investors) {
        if (err) return console.log(err);
        
        console.log("investors: " + investors);
        let state = $this.state;
        state.crowdsale.investors = investors;
        $this.setState(state);
      });
    }

    if (crowdsaleContract.startBlock) {
      crowdsaleContract.startBlock.call(function(err, startBlock) {
        if (err) return console.log(err); 
                   
        console.log("startBlock: " + startBlock);
        let state = $this.state;
        state.crowdsale.startBlock = startBlock;
         $this.setState(state);
      });
    }

    if (crowdsaleContract.startsAt) {
      crowdsaleContract.startsAt.call(function(err, startDate) {
        if (err) return console.log(err);
        
        console.log("startDate: " + startDate*1000);
        let state = $this.state;
        state.crowdsale.startDate = startDate*1000;
        $this.setState(state);
      });
    }

    if (crowdsaleContract.endBlock) {
      crowdsaleContract.endBlock.call(function(err, endBlock) {
        if (err) return console.log(err);
                   
        console.log("endBlock: " + endBlock);
        let state = $this.state;
        state.crowdsale.endBlock = endBlock;
        $this.setState(state);
        web3.eth.getBlockNumber(function(err, curBlock) {
          if (err) return console.log(err);
       
          console.log("curBlock: " + curBlock);
          var blocksDiff = parseInt($this.state.crowdsale.endBlock, 10) - parseInt(curBlock, 10);
          console.log("blocksDiff: " + blocksDiff);
          var blocksDiffInSec = blocksDiff * state.blockTimeGeneration;
          console.log("blocksDiffInSec: " + blocksDiffInSec); 
          state.seconds = blocksDiffInSec;
           $this.setState(state);
         });
      });
    }

    if (crowdsaleContract.endsAt) {
      crowdsaleContract.endsAt.call(function(err, endDate) {
        if (err) return console.log(err);
        
        console.log("endDate: " + endDate*1000);
        let state = $this.state;
        state.crowdsale.endDate = endDate*1000;
        $this.setState(state);
        web3.eth.getBlockNumber(function(err, curBlock) {
          if (err) return console.log(err);

          console.log("curDate: " + new Date().getTime());
          /*console.log("curBlock: " + curBlock);
          var blocksDiff = parseInt($this.state.crowdsale.endBlock, 10) - parseInt(curBlock, 10);
          console.log("blocksDiff: " + blocksDiff);
          var blocksDiffInSec = blocksDiff * state.blockTimeGeneration;
          console.log("blocksDiffInSec: " + blocksDiffInSec);
          state.seconds = blocksDiffInSec;*/
          state.seconds = (state.crowdsale.endDate - new Date().getTime())/1000;
          $this.setState(state);
        });
      });
    }

    crowdsaleContract.token.call(function(err, tokenAddr) {
      if (err) return console.log(err);
      
      console.log("token: " + tokenAddr);
      let state = $this.state;
      state.contracts.token.addr = tokenAddr;
      $this.setState(state);

      if (!tokenAddr || tokenAddr === "0x") return;
      getTokenData(web3, $this);
      if (!crowdsaleContract.pricingStrategy) return;

      crowdsaleContract.pricingStrategy.call(function(err, pricingStrategyAddr) {
        if (err) return console.log(err);
        
        console.log("pricingStrategy: " + pricingStrategyAddr);
        let state = $this.state;
        state.contracts.pricingStrategy.addr = pricingStrategyAddr;
        $this.setState(state);

        if (!pricingStrategyAddr || pricingStrategyAddr === "0x") return;
        getPricingStrategyData(web3, $this);
      });
    });

    let newState = $this.state;
    newState.loading = false;
    $this.setState(newState);
  });
}

function getTokenData(web3, $this) {
  attachToContract(web3, $this.state.contracts.token.abi, $this.state.contracts.token.addr, function(err, tokenContract) {
    console.log("attach to token contract");
    if (err) return console.log(err);
    if (!tokenContract) return noContractAlert();

    tokenContract["name"].call(function(err, name) {
      if (err) return console.log(err);
      
      console.log("token name: " + name);
      let state = $this.state;
      state.token.name = name;
      $this.setState(state);
    });
    tokenContract["symbol"].call(function(err, ticker) {
      if (err) console.log(err);
      console.log("token ticker: " + ticker);
      let state = $this.state;
      state.token.ticker = ticker;
      $this.setState(state);
    });
    tokenContract["totalSupply"].call(function(err, supply) {
      if (err) console.log(err);
      let state = $this.state;
      console.log("token supply: " + supply);
      state.token.supply = supply;
      $this.setState(state);
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
      state.pricingStrategy.rate = web3.fromWei(parseInt(rate, 10), "ether");
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

export function deployContract(web3, abi, bin, params, cb) {
  console.log('web3.eth.accounts[0]', web3.eth.accounts[0], 'bin', bin)
    web3.eth.estimateGas({
        from: web3.eth.accounts[0], 
        data: bin
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

      /*contractInstance.new(
        params[0],
        params[1],
        params[2],
        params[3],
        opts, deployContractCB
      );*/

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
}

export function attachToContract(web3, abi, addr, cb) {
	if(!web3.isConnected()) {
		if (cb) cb({code: 200, title: "Error", message: "check RPC availability"});
	} else {
    web3.eth.defaultAccount = web3.eth.accounts[0];
		console.log("web3.eth.defaultAccount:");
		console.log(web3.eth.defaultAccount);
    console.log(web3.eth.accounts);
		
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
