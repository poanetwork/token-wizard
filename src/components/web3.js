import Web3 from 'web3';

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

export function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You aren't connected to Oracles Network. Please, switch on Oracles plugin and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    console.log(msgNotEthereum);
    callback(myWeb3, false);
  } else {
    // window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(window.web3.currentProvider); 

    // the default account doesn't seem to be persisted, copy it to our
    // new instance
    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

    checkNetworkVersion(myWeb3, function(isOraclesNetwork) {
      callback(myWeb3, isOraclesNetwork);
    });
  }
}

function checkNetworkVersion(web3, cb) {
  var msgNotOracles = "You aren't connected to Oracles network. Please, switch on Oracles plugin and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
  web3.version.getNetwork(function(err, netId) {
    if (err) console.log(err);
    console.log("netId: " + netId);
    switch (netId) {
      case "1": {
        console.log('This is mainnet');
        console.log(msgNotOracles);
        cb(false);
      } break;
      case "2": {
        console.log('This is the deprecated Morden test network.');
        console.log(msgNotOracles);
        cb(false);
      } break;
      case "3": {
        console.log('This is the ropsten test network.');
        console.log(msgNotOracles);
        cb(false);
      }  break;
       case "12648430": {
         console.log('This is Oracles from Metamask');
         cb(true);
      }  break;
      default: {
        console.log('This is an unknown network.');
        console.log(msgNotOracles);
        cb(false);
      } break;
    }
  });
}

export function deployContract(web3, abi, bin, cb) {
    var $this = this;
    console.log(web3.eth.accounts);
    console.log(web3.eth.defaultAccount);

    web3.eth.estimateGas({
        from: web3.eth.defaultAccount, 
        data: bin
    }, function(err, estimatedGas) {
      if (err) console.log(err);

      var crowdSaleContract = web3.eth.contract(abi);
      var opts = {
          data: "0x" + bin,
          gas: estimatedGas,
          from: web3.eth.defaultAccount
      };
      crowdSaleContract.new(
        $this.state.startBlock,
        $this.state.endBlock,
        $this.state.rate,
        $this.state.walletAddress,
        opts, function(err, contract) {
        console.log(err);
        console.log(contract);
        if (err) return cb(err);
        
        console.log(contract);
        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
        cb(null, contract.address);
      })
    });
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
