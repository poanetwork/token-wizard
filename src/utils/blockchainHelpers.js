import Web3 from 'web3';
import { incorrectNetworkAlert, noMetaMaskAlert, invalidNetworkIDAlert } from './alerts'
import { getEncodedABIClientSide } from './microservices'

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
        web3.eth.getAccounts().then((accounts) => {
          if (accounts.length === 0) {
            return noMetaMaskAlert();
          }
        });
      });
    }, 500);
  } else {
    web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        return noMetaMaskAlert();
      }
    });
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
  web3.eth.net.getId().then((_networkIdFromNetwork) => {
    let networkNameFromGET = getNetWorkNameById(_networkIdFromGET);
    let networkNameFromNetwork = getNetWorkNameById(_networkIdFromNetwork);
    if (networkNameFromGET !== networkNameFromNetwork) {
      console.log(networkNameFromGET +"!="+ networkNameFromNetwork);
      incorrectNetworkAlert(networkNameFromGET, networkNameFromNetwork);
    }
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
  web3.eth.net.getId().then((netId) => {
    cb(netId);
  });
}

export function setExistingContractParams(abi, addr, $this) {
  let state = $this.state;
  setTimeout(function() {
    getWeb3((web3) => {
      attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
        let propsCount = 0;
        let cbCount = 0;
        propsCount++;
        crowdsaleContract.token.call(function(err, tokenAddr) {
          cbCount++;
          console.log("tokenAddr: " + tokenAddr);
          state.contracts.token.addr = tokenAddr;

          if (propsCount === cbCount) {
            $this.setState(state);
          }
        });

        propsCount++;
        crowdsaleContract.multisigWallet.call(function(err, multisigWalletAddr) {
          cbCount++;
          console.log("multisigWalletAddr: " + multisigWalletAddr);
          state.contracts.multisig.addr = multisigWalletAddr;

          if (propsCount === cbCount) {
            $this.setState(state);
          }
        });
      });
    })
  });
}

export function deployContract(i, web3, abi, bin, params, state, cb) {
  getEncodedABIClientSide(web3, abi, state, params, i, (ABIencoded) => {
    console.log(ABIencoded);
    let binFull = bin + ABIencoded.substr(2);
    web3.eth.getAccounts().then(function(accounts) {
      web3.eth.estimateGas({
        from: accounts[0], 
        data: binFull
      }, function(err, estimatedGas) {
        if (err) console.log('errrrrrrrrrrrrrrrrr', err);
        console.log('gas is estimated', estimatedGas, 'err', err)
        let estimatedGasMax = 3716260;
        if (!estimatedGas) estimatedGas = estimatedGasMax;
        if (estimatedGas > estimatedGasMax) estimatedGas = estimatedGasMax;
        else estimatedGas += 100000;

        var contractInstance = new web3.eth.Contract(abi);

        var deployOpts = {
          data: "0x" + bin,
          arguments: params
        };

        var sendOpts = {
          from: accounts[0],
          gas: estimatedGas,
          gasPrice: 21000000000
        };

        let errorArised;

        contractInstance.deploy(deployOpts).send(sendOpts)
        //contractInstance.new(...totalParams)
        .on('error', function(error) { 
          errorArised = error;
          console.log(errorArised);
          //return cb(error, null); 
        })
        //.on('transactionHash', function(transactionHash){ console.log(transactionHash); })
        .on('receipt', function(receipt){
          if (errorArised) {
           console.log(receipt.contractAddress) // contains the new contract address
           cb(null, receipt.contractAddress);
          }
        })
        .on('confirmation', function(confirmationNumber, receipt){ 
          //console.log(confirmationNumber, receipt); 
          /*if (errorArised) {
           console.log(receipt.contractAddress) // contains the new contract address
           cb(null, receipt.contractAddress);
          }*/

        })
        .then(function(newContractInstance){
          if (!errorArised) {
            //console.log(newContractInstance);
            console.log(newContractInstance.options.address) // instance with the new contract address
            cb(null, newContractInstance.options.address);
          }
        });

        function deployContractCB(err, txHash) {
          console.log(txHash);
          if (err) {
            return cb(err, null);
          }
        };
      });
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
  web3.eth.getAccounts().then((accounts) => {
    web3.eth.defaultAccount = accounts[0];
		console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
		
		let contractInstance = new web3.eth.Contract(abi, addr, {
      from: web3.eth.defaultAccount
    });

    //console.log(contractInstance);
    //console.log(contractInstance.options);
		
		if (cb) cb(null, contractInstance);
  });
}

// export web3 object instance
export default web3;
