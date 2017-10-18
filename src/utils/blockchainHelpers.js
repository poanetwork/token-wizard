import Web3 from 'web3';
import { incorrectNetworkAlert, noContractAlert, noMetaMaskAlert, invalidNetworkIDAlert } from './alerts'
import { getEncodedABIClientSide } from './microservices'
import { toFixed } from '../utils/utils'

// instantiate new web3 instance
const web3 = new Web3();

// get current provider
export function getCurrentProvider() {
	console.log(web3.currentProvider);
  return web3.currentProvider;
}

export function checkWeb3(web3) {
  if (!web3) {
    setTimeout(function() {
      getWeb3((web3) => {
        if (!web3) return noMetaMaskAlert();
        if (web3.eth.accounts.length === 0) {
          return noMetaMaskAlert();
        }
      });
    }, 500);
  } else {
    if (web3.eth.accounts.length === 0) {
      return noMetaMaskAlert();
    }
  }
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
  console.log(_networkIdFromGET);
  if (!_networkIdFromGET) {
    return invalidNetworkIDAlert();
  }
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

/*
//depreciated
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
*/

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
    } break;
    case 4: {
      return "Rinkeby";
    } break;
    case 42: {
      return "Kovan";
    } break;
     case 12648430: {
       return "Oracles dev test";
    }  break;
    default: {
      return "Unknown";
    } break;
  }
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

export function setExistingContractParams(abi, addr, setContractProperty) {
  setTimeout(function() {
    getWeb3((web3) => {
      attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
        let propsCount = 0;
        let cbCount = 0;
        propsCount++;
        crowdsaleContract.token.call(function(err, tokenAddr) {
          cbCount++;
          console.log("tokenAddr: " + tokenAddr);
          // state.contracts.token.addr = tokenAddr;
          setContractProperty('token', 'addr', tokenAddr)
          // if (propsCount === cbCount) {
          //   $this.setState(state);
          // }
        });

        /*propsCount++;
        crowdsaleContract.pricingStrategy.call(function(err, pricingStrategyAddr) {
          cbCount++;
          console.log("pricingStrategyAddr: " + pricingStrategyAddr);
          state.contracts.pricingStrategy.addr = pricingStrategyAddr;

          if (propsCount == cbCount) {
            $this.setState(state);
          }
        });*/

        propsCount++;
        crowdsaleContract.multisigWallet.call(function(err, multisigWalletAddr) {
          cbCount++;
          console.log("multisigWalletAddr: " + multisigWalletAddr);
          // state.contracts.multisig.addr = multisigWalletAddr;
          setContractProperty('multisig', 'addr', multisigWalletAddr)
          // if (propsCount === cbCount) {
          //   $this.setState(state);
          // }
        });
      });
    })
  });
}

export function deployContract(i, web3, abi, bin, params, state, cb) {
  //console.log('web3.eth.accounts[0]', web3.eth.accounts[0], 'bin', bin)
  getEncodedABIClientSide(web3, abi, params, i, (ABIencoded) => {
    console.log(ABIencoded);
    let binFull = bin + ABIencoded.substr(2);
    //console.log(binFull);
    web3.eth.estimateGas({
      from: web3.eth.accounts[0], 
      data: binFull
    }, function(err, estimatedGas) {
      console.log('estimated gas callback', estimatedGas)
      if (err) console.log('errrrrrrrrrrrrrrrrr', err);
      console.log('gas is estimated', estimatedGas, 'err', err)
      let estimatedGasMax = 3716260;
      if (!estimatedGas) estimatedGas = estimatedGasMax;
      else estimatedGas += 100000;

      if (estimatedGas > estimatedGasMax) estimatedGas = estimatedGasMax;
      
      var contractInstance = web3.eth.contract(abi);
      var opts = {
        from: web3.eth.accounts[0],
        data: "0x" + bin,
        gas: estimatedGas,
        gasPrice: 21000000000
      };
      var totalParams = params;
      totalParams.push(opts);
      totalParams.push(deployContractCB);
      console.log('totalParams', totalParams);
      contractInstance.new(...totalParams);

      function deployContractCB(err, contract) {
        if (err) {
          return cb(err, null);
        }
        if (contract) {
          console.log(contract);
          if (contract.address) {
            console.log(contract);
            console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
            cb(null, contract.address);
          }
          else if (contract.transactionHash) {
            checkTxMined(web3, contract.transactionHash, function txMinedCallback(receipt) {
              if (receipt) {
                if (receipt.blockNumber)
                  return cb(null, receipt.contractAddress);
              } else {
                setTimeout(checkTxMined(web3, contract.transactionHash, txMinedCallback), 1000);
              }
            })
          }
        }
      };
    });
  });
}

export function checkTxMined(web3, txhash, cb) {
  web3.eth.getTransactionReceipt(txhash, function(err, receipt) {
    if (receipt)
      console.log(receipt);
    cb(receipt);
  });
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

// export web3 object instance
export default web3;
