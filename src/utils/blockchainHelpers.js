import { incorrectNetworkAlert, noMetaMaskAlert, MetaMaskIsLockedAlert, invalidNetworkIDAlert } from './alerts'
import { CHAINS, MAX_GAS_PRICE } from './constants'
import { crowdsaleStore, generalStore, web3Store, contractStore } from '../stores'
import { fetchFile } from './utils'

const DEPLOY_CONTRACT = 1
const CALL_METHOD = 2

export function checkWeb3 () {
  const { web3 } = web3Store

  if (!web3) {
    setTimeout(function () {
      web3Store.getWeb3(web3 => {
        if (!web3) return noMetaMaskAlert()
        checkMetaMask()
      })
    }, 500)

  } else {
    checkMetaMask()
  }
}

const checkMetaMask = () => {
  const { web3 } = web3Store
  console.log(web3.currentProvider)

  if (!web3.currentProvider) {
    return noMetaMaskAlert()
  }

  if (web3.currentProvider.isMetaMask) {
    web3.eth.getAccounts()
      .then(accounts => {
        if (accounts.length === 0) return MetaMaskIsLockedAlert()
      })
      .catch((err) => {
        return MetaMaskIsLockedAlert()
      })
  }
}

export function checkNetWorkByID (_networkIdFromGET) {
  console.log(_networkIdFromGET)

  if (!_networkIdFromGET) return invalidNetworkIDAlert()

  const { web3 } = web3Store
  let networkNameFromGET = getNetWorkNameById(_networkIdFromGET)
  networkNameFromGET = networkNameFromGET ? networkNameFromGET : CHAINS.UNKNOWN

  web3.eth.net.getId()
    .then(_networkIdFromNetwork => {
      let networkNameFromNetwork = getNetWorkNameById(_networkIdFromNetwork)
      networkNameFromNetwork = networkNameFromNetwork ? networkNameFromNetwork : CHAINS.UNKNOWN

      if (networkNameFromGET !== networkNameFromNetwork) {
        console.log(networkNameFromGET + '!=' + networkNameFromNetwork)
        incorrectNetworkAlert(networkNameFromGET, networkNameFromNetwork)
      }
    })
}

export function getNetWorkNameById (_id) {
  switch (parseInt(_id, 10)) {
    case 1:
      return CHAINS.MAINNET
    case 2:
      return CHAINS.MORDEN
    case 3:
      return CHAINS.ROPSTEN
    case 4:
      return CHAINS.RINKEBY
    case 42:
      return CHAINS.KOVAN
    case 77:
      return CHAINS.SOKOL
    case 99:
      return CHAINS.CORE
    default:
      return null
  }
}

export const calculateGasLimit = (estimatedGas = 0) => {
  return !estimatedGas || estimatedGas > MAX_GAS_PRICE ? MAX_GAS_PRICE : estimatedGas + 100000
}

export function getNetworkVersion () {
  const { web3 } = web3Store

  if (web3.eth.net && web3.eth.net.getId) {
    return web3.eth.net.getId()
  }
  return Promise.resolve(null)
}

export function setExistingContractParams (abi, addr, setContractProperty) {
  attachToContract(abi, addr)
    .then(crowdsaleContract => {
      crowdsaleContract.token
        .call(function (err, tokenAddr) {
          if (err) return console.error(err)

          console.log('tokenAddr:', tokenAddr)
          setContractProperty('token', 'addr', tokenAddr)
        })

      crowdsaleContract.multisigWallet
        .call(function (err, multisigWalletAddr) {
          if (err) return console.error(err)

          console.log('multisigWalletAddr:', multisigWalletAddr)
          setContractProperty('multisig', 'addr', multisigWalletAddr)
        })
    })
}

export const deployContract = (abi, bin, params) => {
  const deployOpts = {
    data: '0x' + bin,
    arguments: params
  }

  return web3Store.web3.eth.getAccounts()
    .then(accounts => deployContractInner(accounts, abi, deployOpts))
}

const deployContractInner = (accounts, abi, deployOpts) => {
  console.log('abi', abi)

  const { web3 } = web3Store
  const objAbi = JSON.parse(JSON.stringify(abi))
  const contractInstance = new web3.eth.Contract(objAbi)
  const deploy = contractInstance.deploy(deployOpts)

  return deploy.estimateGas({ gas: MAX_GAS_PRICE })
    .then(
      estimatedGas => estimatedGas,
      err => console.log('errrrrrrrrrrrrrrrrr', err)
    )
    .then(estimatedGas => {
      console.log('gas is estimated', estimatedGas)
      const sendOpts = {
        from: accounts[0],
        gasPrice: generalStore.gasPrice,
        gas: calculateGasLimit(estimatedGas)
      }
      return sendTX(deploy.send(sendOpts), DEPLOY_CONTRACT)
    })
}

export function sendTXToContract (method) {
  return sendTX(method, CALL_METHOD)
}

let sendTX = (method, type) => {
  let isMined = false
  let txHash

  return new Promise((resolve, reject) => {
    method
      .on('error', error => {
        if (isMined) return
        console.error(error)
        // https://github.com/poanetwork/token-wizard/issues/472
        if (
          !error.message.includes('Failed to check for transaction receipt')
          && !error.message.includes('Failed to fetch')
          && !error.message.includes('Unexpected end of JSON input')
        ) reject(error)
      })
      // This additional polling of tx receipt was made, because users had problems on mainnet: wizard hanged on random
      // transaction, because there wasn't response from it, no receipt. Especially, if you switch between tabs when
      // wizard works.
      // https://github.com/poanetwork/token-wizard/pull/364/files/c86c3e8482ef078e0cb46b8bebf57a9187f32181#r152277434
      .on('transactionHash', _txHash => checkTxMined(_txHash, function pollingReceiptCheck (err, receipt) {
        if (isMined) return
        //https://github.com/poanetwork/token-wizard/issues/480
        if (
          err
          && !err.message.includes('Failed to check for transaction receipt')
          && !err.message.includes('Failed to fetch')
          && !err.message.includes('Unexpected end of JSON input')
        ) return reject(err)

        txHash = _txHash
        const typeDisplayName = getTypeOfTxDisplayName(type)

        if (receipt) {
          if (receipt.blockNumber) {
            console.log(`${typeDisplayName} ${txHash} is mined from polling of tx receipt`)
            isMined = true
            sendTXResponse(receipt, type).then(resolve).catch(reject)
          } else {
            repeatPolling()
          }
        } else {
          repeatPolling()
        }

        function repeatPolling () {
          console.log(`${typeDisplayName} ${txHash} is still pending. Polling of transaction once more`)
          setTimeout(() => checkTxMined(txHash, pollingReceiptCheck), 5000)
        }
      }))
      .on('receipt', receipt => {
        if (isMined) return

        const typeDisplayName = getTypeOfTxDisplayName(type)

        console.log(`${typeDisplayName} ${txHash} is mined from Promise`)
        isMined = true

        sendTXResponse(receipt, type).then(resolve).catch(reject)
      })
  })

}

const sendTXResponse = (receipt, type) => {
  if (0 !== +receipt.status || null === receipt.status) {
    return type === DEPLOY_CONTRACT ? Promise.resolve(receipt.contractAddress) : Promise.resolve()
  } else {
    return Promise.reject({ message: 0 })
  }
}

export const checkTxMined = (txHash, _pollingReceiptCheck) => {
  const { web3 } = web3Store

  web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
    if (receipt)
      console.log(receipt)
    _pollingReceiptCheck(err, receipt)
  })
}

const getTypeOfTxDisplayName = (type) => {
  const deployContractTypeDisplayName = 'Contract deployment transaction'
  const callMethodTypeDisplayName = 'Contract method transaction'

  switch (type) {
    case DEPLOY_CONTRACT:
      return deployContractTypeDisplayName
    case CALL_METHOD:
      return callMethodTypeDisplayName
    default:
      return deployContractTypeDisplayName
  }
}

export function attachToContract (abi, addr) {
  const { web3 } = web3Store

  return web3.eth.getAccounts()
    .then(accounts => {
      const objAbi = JSON.parse(JSON.stringify(abi))
      return new web3.eth.Contract(objAbi, addr, { from: accounts[0] })
    })
}

export function getRegistryAddress () {
  const { web3 } = web3Store

  return web3.eth.net.getId()
    .then(networkId => {
      const registryAddressMap = JSON.parse(process.env['REACT_APP_REGISTRY_ADDRESS'] || '{}')
      return registryAddressMap[networkId]
    })
}

function getRegistryAbi () {
  return fetchFile('./contracts/Registry_flat.abi')
}

function getRegistryContract () {
  // Get Registry ABI and address
  const whenRegistryAbi = getRegistryAbi().then(JSON.parse)
  const whenRegistryAddress = getRegistryAddress()

  // Load Registry contract
  return Promise.all([whenRegistryAbi, whenRegistryAddress])
    .then(([abi, address]) => attachToContract(abi, address))
}

export function loadRegistryAddresses () {
  const { web3 } = web3Store
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

          return Promise.all(crowdsales)
        })
    })
    .then(crowdsales => {
      crowdsaleStore.setCrowdsales(crowdsales)
    })
}

export function getAllCrowdsaleAddresses () {
  let tierData = {}
  const whenRegistryContract = getRegistryContract()

  return Promise.all([whenRegistryContract])
    .then(([registry]) => {
      return registry.getPastEvents('Added', {fromBlock: 0})
      .then((events) => {
        let crowdsalesAddresses = []
        events.forEach((event) => {
          let crowdsaleAddress = event.returnValues.deployAddress
          crowdsalesAddresses.push(crowdsaleAddress)
        })

        let whenCrowdsales = []
        let crowdsaleABI = contractStore.crowdsale.abi
        for (let i = 0; i < crowdsalesAddresses.length; i++) {
          let whenCrowdsale = attachToContract(crowdsaleABI, crowdsalesAddresses[i])
          whenCrowdsales.push(whenCrowdsale)
        }

        return Promise.all(whenCrowdsales)
      })
    })
    .then(crowdsales => {
      //console.log("crowdsales:", crowdsales)

      let whenJoinedTiersData = []

      let fullCrowdsales = {}

      crowdsales.forEach((crowdsale) => {
        //console.log("crowdsale:", crowdsale)
        let promiseInner = crowdsale.methods.joinedCrowdsalesLen().call()
        let promiseOuter = promiseInner.then((len) => {
          let whenJoinedTiers = []
          let whenIsWhiteListed = []
          let whenIsFinalized = []
          let whenTokenAddress = []
          for (let i = 0; i < len; i++) {
            whenJoinedTiers.push(crowdsale.methods.joinedCrowdsales(i).call())
          }
          whenIsWhiteListed.push(crowdsale.methods.isWhiteListed().call())
          whenIsFinalized.push(crowdsale.methods.finalized().call())
          whenTokenAddress.push(crowdsale.methods.token().call())

          let crowdsalePropsArr = [whenJoinedTiers, whenIsWhiteListed, whenIsFinalized, whenTokenAddress]

          let crowdsalePropsArrReorg = crowdsalePropsArr.map(function(innerPromiseArray) {
            return Promise.all(innerPromiseArray);
          })

          //console.log("crowdsalePropsArrReorg:", crowdsalePropsArrReorg)

          return Promise.all(crowdsalePropsArrReorg)
          .then(([joinedTiers, isWhitelisted, isFinalized, tokenAddress]) => {
            fullCrowdsales[crowdsale._address] = {
              "joinedTiers": joinedTiers,
              "isWhitelisted": isWhitelisted[0],
              "isFinalized": isFinalized[0],
              "tokenAddress": tokenAddress[0]
            }

            return Promise.resolve()
          })
        })
        whenJoinedTiersData.push(promiseOuter)
      })

      return Promise.all(whenJoinedTiersData.map(p => p.catch(() => undefined)))
      .then(() => {
        const fullCrowdsalesArr = Object.keys(fullCrowdsales)
        .map(function(addr) {
          fullCrowdsales[addr].addr = addr;
          return fullCrowdsales[addr]
        })

        let whenTokens = []
        for (let i = 0; i < fullCrowdsalesArr.length; i++) {
          whenTokens.push(attachToContract(contractStore.token.abi, fullCrowdsalesArr[i].tokenAddress))
        }

        return Promise.all(whenTokens.map(p => p.catch(() => undefined)))
      })
      .then((tokens) => {

        let whenTokensReservedDestinationsLens = []

        for (let i = 0; i < tokens.length; i++) {
          let token = tokens[i]
          whenTokensReservedDestinationsLens.push(token.methods.reservedTokensDestinationsLen().call())
        }

        return Promise.all(whenTokensReservedDestinationsLens.map(p => p.catch(() => undefined)))
      })
      .then((reservedDestinationsLens) => {
        const fullCrowdsalesArr = Object.keys(fullCrowdsales)
        .map(function(addr) {
          fullCrowdsales[addr].addr = addr;
          return fullCrowdsales[addr]
        })

        let whenTiers = []
        fullCrowdsalesArr.forEach((crowdsale) => {
          let joinedTiers = crowdsale.joinedTiers
          for (let i = 0; i < joinedTiers.length; i++) {
            let joinedTierAddress = joinedTiers[i]
            whenTiers.push(attachToContract(contractStore.crowdsale.abi, joinedTierAddress))
          }
        })

        return Promise.all(whenTiers)
        .then((tiers) => {
          //console.log("tiers: ", tiers)
          let whenTierArr = []
          for (let i = 0; i < tiers.length; i++) {
            let tier = tiers[i]
            let whenWeiRaised = tier.methods.weiRaised().call()
            .then((weiRaised) => {
              if (!tierData[tier._address]) tierData[tier._address] = {}
              tierData[tier._address].weiRaised = weiRaised
              return Promise.resolve()
            })
            whenTierArr.push(whenWeiRaised)
            let whenTierContributor = tier.methods.investorCount().call()
            .then((contributorsCount) => {
              if (!tierData[tier._address]) tierData[tier._address] = {}
              tierData[tier._address].contributorsCount = contributorsCount
              return Promise.resolve()
            })
            whenTierArr.push(whenTierContributor)
            let whenTierStartsAt = tier.methods.startsAt().call()
            .then((startsAt) => {
              if (!tierData[tier._address]) tierData[tier._address] = {}
              tierData[tier._address].startsAt = startsAt
              return Promise.resolve()
            })
            whenTierArr.push(whenTierStartsAt)
            let whenTierEndsAt = tier.methods.endsAt().call()
            .then((endsAt) => {
              if (!tierData[tier._address]) tierData[tier._address] = {}
              tierData[tier._address].endsAt = endsAt
              return Promise.resolve()
            })
            whenTierArr.push(whenTierEndsAt)
          }

          let totalArr = [
            fullCrowdsalesArr,
            reservedDestinationsLens,
            whenTierArr.map(p => p.catch(() => undefined))
          ]

          let totalArrayReorg = totalArr.map(function(innerPromiseArray) {
            return Promise.all(innerPromiseArray);
          })

          return Promise.all(totalArrayReorg)
        })
      })
    })
    .then((totalArr) => {
      let [fullCrowdsalesArr, reservedDestinationsLensArr, ] = totalArr
      return [fullCrowdsalesArr, reservedDestinationsLensArr, tierData]
    })
    .catch((err) => {
      console.log("err: ", err)
    })
}