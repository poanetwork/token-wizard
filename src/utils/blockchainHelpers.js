import { incorrectNetworkAlert, noMetaMaskAlert, invalidNetworkIDAlert } from './alerts'
import { getEncodedABIClientSide } from './microservices'
import { CHAINS } from './constants'
import { crowdsaleStore, generalStore, web3Store } from '../stores'
import { fetchFile } from './utils'

// instantiate new web3 instance
const web3 = web3Store.web3

// get current provider
export function getCurrentProvider() {
  console.log(web3.currentProvider);
  return web3.currentProvider;
}

export function checkWeb3(web3) {
  if (!web3) {
    setTimeout(function() {
      web3Store.getWeb3((web3) => {
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

export function checkNetWorkByID(web3, _networkIdFromGET) {
  console.log(_networkIdFromGET);
  if (!_networkIdFromGET) {
    return invalidNetworkIDAlert();
  }
  web3.eth.net.getId().then((_networkIdFromNetwork) => {
    let networkNameFromGET = getNetWorkNameById(_networkIdFromGET);
    networkNameFromGET = networkNameFromGET ? networkNameFromGET : CHAINS.UNKNOWN;
    let networkNameFromNetwork = getNetWorkNameById(_networkIdFromNetwork);
    networkNameFromNetwork = networkNameFromNetwork? networkNameFromNetwork : CHAINS.UNKNOWN;
    if (networkNameFromGET !== networkNameFromNetwork) {
      console.log(networkNameFromGET +"!="+ networkNameFromNetwork);
      incorrectNetworkAlert(networkNameFromGET, networkNameFromNetwork);
    }
  });
}

export function getNetWorkNameById(_id) {
  switch (parseInt(_id, 10)) {
    case 1:
      return CHAINS.MAINNET;
    case 2:
      return CHAINS.MORDEN;
    case 3:
      return CHAINS.ROPSTEN;
    case 4:
      return CHAINS.RINKEBY;
    case 42:
      return CHAINS.KOVAN;
    case 12648430:
      return CHAINS.ORACLES;
    default:
      return null;
  }
}

export function getNetworkVersion(web3) {
  if (web3.eth.net && web3.eth.net.getId) {
    return web3.eth.net.getId();
  }
  return Promise.resolve(null);
}

export function setExistingContractParams(abi, addr, setContractProperty) {
  setTimeout(function() {
    web3Store.getWeb3((web3) => {
      attachToContract(web3, abi, addr, function(err, crowdsaleContract) {
        crowdsaleContract.token.call(function(err, tokenAddr) {
          console.log("tokenAddr: " + tokenAddr);
          setContractProperty('token', 'addr', tokenAddr)
        });

        crowdsaleContract.multisigWallet.call(function(err, multisigWalletAddr) {
          console.log("multisigWalletAddr: " + multisigWalletAddr);
          setContractProperty('multisig', 'addr', multisigWalletAddr)
        });
      });
    })
  });
}

export function deployContract(i, web3, abi, bin, params) {
  const abiContent = abi.slice()

  return getEncodedABIClientSide(web3, abiContent, params, i)
    .then(ABIEncoded => {
      let binFull = bin + ABIEncoded.substr(2)

      console.log(ABIEncoded)

      return web3.eth.getAccounts()
        .then(accounts => {
          return web3.eth.estimateGas({ from: accounts[0], data: binFull })
            .then(
              estimatedGas => estimatedGas,
              err => console.log('errrrrrrrrrrrrrrrrr', err)
            )
            .then(estimatedGas => {
              console.log('gas is estimated', estimatedGas)

              const estimatedGasMax = 4016260

              if (!estimatedGas || estimatedGas > estimatedGasMax) {
                estimatedGas = estimatedGasMax
              } else {
                estimatedGas += 100000
              }

              console.log('abi', abi)

              const objAbi = JSON.parse(JSON.stringify(abi))
              let contractInstance = new web3.eth.Contract(objAbi)

              let deployOpts = {
                data: '0x' + bin,
                arguments: params
              }

              let sendOpts = {
                from: accounts[0],
                gas: estimatedGas,
                gasPrice: generalStore.gasPrice
              }

              let isMined = false

              return new Promise((resolve, reject) => {
                contractInstance.deploy(deployOpts).send(sendOpts)
                  .on('error', error => {
                    console.log(error)
                    reject(error)
                  })
                  .on('transactionHash', transactionHash => {
                    console.log('contract deployment transaction: ' + transactionHash)

                    checkTxMined(web3, transactionHash, function txMinedCallback (receipt) {
                      if (isMined) return

                      if (receipt) {
                        if (receipt.blockNumber) {
                          console.log('Contract deployment is mined from polling of tx receipt')
                          console.log(receipt.contractAddress) // instance with the new contract address

                          isMined = true
                          resolve(receipt.contractAddress)
                        } else {
                          console.log('Still mining... Polling of transaction once more')

                          setTimeout(() => {
                            checkTxMined(web3, transactionHash, txMinedCallback)
                          }, 5000)
                        }
                      } else {
                        console.log('Still mining... Polling of transaction once more')

                        setTimeout(() => {
                          checkTxMined(web3, transactionHash, txMinedCallback)
                        }, 5000)
                      }
                    })
                  })
                  .then(newContractInstance => {
                    if (!isMined) {
                      console.log('Contract deployment is mined from Promise')
                      console.log(newContractInstance.options.address) // instance with the new contract address

                      isMined = true
                      resolve(newContractInstance.options.address)
                    }
                  })
              })
            })
        })
    })
}

export function sendTXToContract(web3, method) {
  return new Promise((resolve, reject) => {
    let isMined = false

    method
      .on('error', reject)
      .on('transactionHash', transactionHash => {
        console.log("contract method transaction: " + transactionHash);

        // This additional polling of tx receipt was made, because users had problems on mainnet: wizard hanged on random
        // transaction, because there wasn't response from it, no receipt. Especially, if you switch between tabs when
        // wizard works.
        // https://github.com/oraclesorg/ico-wizard/pull/364/files/c86c3e8482ef078e0cb46b8bebf57a9187f32181#r152277434
        checkTxMined(web3, transactionHash, function txMinedCallback(receipt) {
          if (isMined) return

          if (receipt) {
            if (receipt.blockNumber) {
              console.log("Sending tx to contract is mined from polling of tx receipt");
              isMined = true

              if (0 !== +receipt.status || null === receipt.status) {
                resolve()
              } else {
                reject({ message: 0 })
              }

            } else {
              console.log("Still mining... Polling of transaction once more");
              setTimeout(() => {
                checkTxMined(web3, transactionHash, txMinedCallback)
              }, 5000)
            }
          } else {
            console.log("Still mining... Polling of transaction once more");
            setTimeout(() => {
              checkTxMined(web3, transactionHash, txMinedCallback)
            }, 5000)
          }
        })
      })
      .on('receipt', receipt => {
        if (isMined) return
        isMined = true

        if (0 !== +receipt.status || null === receipt.status) {
          resolve()
        } else {
          reject({ message: 0 })
        }
      })
  })
}

export function checkTxMined(web3, txhash, cb) {
  web3.eth.getTransactionReceipt(txhash, function(err, receipt) {
    if (receipt)
      console.log(receipt);
    cb(receipt);
  });
}

export function attachToContract(web3, abi, addr) {
  return new Promise(resolve => {
    web3.eth.getAccounts()
      .then(accounts => {
        web3.eth.defaultAccount = accounts[0]
        console.log('web3.eth.defaultAccount:' + web3.eth.defaultAccount)

        const objAbi = JSON.parse(JSON.stringify(abi))
        const contractInstance = new web3.eth.Contract(objAbi, addr, { from: web3.eth.defaultAccount })

        resolve(contractInstance)
      })
  })
}

function getRegistryAddress() {
  return web3.eth.net.getId()
    .then((networkId) => {
      const registryAddressMap = JSON.parse(process.env['REACT_APP_REGISTRY_ADDRESS'] || '{}')
      const registryAddress = registryAddressMap[networkId]

      return registryAddress
    })
}

export function registerCrowdsaleAddress(web3, contractStore) {
  const toJS = x => JSON.parse(JSON.stringify(x))

  const registryAbi = contractStore.registry.abi
  const crowdsaleAddress = contractStore.crowdsale.addr[0]

  const whenRegistryAddress = getRegistryAddress()

  const whenAccount = web3.eth.getAccounts()
    .then((accounts) => accounts[0])

  return Promise.all([whenRegistryAddress, whenAccount])
    .then(([registryAddress, account]) => {
      const registry = new web3.eth.Contract(toJS(registryAbi), registryAddress)
      return registry.methods
        .add(crowdsaleAddress)
        .send({
          from: account
        })
    })
}

function getRegistryAbi() {
  return fetchFile('./contracts/Registry_flat.abi')
}

function getRegistryContract() {
  // Get Registry ABI and address
  const whenRegistryAbi = getRegistryAbi().then(JSON.parse)
  const whenRegistryAddress = getRegistryAddress()

  // Load Registry contract
  return Promise.all([whenRegistryAbi, whenRegistryAddress])
    .then(([abi, address]) => attachToContract(web3, abi, address))
}

export function loadRegistryAddresses() {
  const whenRegistryContract = getRegistryContract()
  const whenAccount = web3.eth.getAccounts()
    .then((accounts) => accounts[0])

  return Promise.all([whenRegistryContract, whenAccount])
    .then(([registry, account]) => {
      return registry.methods.count(account).call()
        .then((count) => {
          const crowdsales = []
          for (let i = 0; i < +count; i++) {
            crowdsales.push(registry.methods.deployedContracts(account, i).call())
          }

          return Promise.all(crowdsales);
        })
    })
    .then((crowdsales) => {
      crowdsaleStore.setCrowdsales(crowdsales)
    })
}

// export web3 object instance
export default web3;
