import { incorrectNetworkAlert, noMetaMaskAlert, MetaMaskIsLockedAlert, invalidNetworkIDAlert, noContractAlert } from './alerts'
import { CHAINS, MAX_GAS_PRICE, CROWDSALE_STRATEGIES, EXCEPTIONS, CROWDSALE_APP_NAMES, REACT_PREFIX } from './constants'
import { crowdsaleStore, generalStore, web3Store, contractStore } from '../stores'
import { toJS } from 'mobx'
import { removeTrailingNUL } from './utils'

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

  if (!_networkIdFromGET) return null

  const { web3 } = web3Store
  let networkNameFromGET = getNetWorkNameById(_networkIdFromGET)
  networkNameFromGET = networkNameFromGET ? networkNameFromGET : CHAINS.UNKNOWN

  return web3.eth.net.getId()
    .then(_networkIdFromNetwork => {
      let networkNameFromNetwork = getNetWorkNameById(_networkIdFromNetwork)
      networkNameFromNetwork = networkNameFromNetwork ? networkNameFromNetwork : CHAINS.UNKNOWN

      if (networkNameFromGET !== networkNameFromNetwork) {
        console.log(networkNameFromGET + '!=' + networkNameFromNetwork)
        return incorrectNetworkAlert(networkNameFromGET, networkNameFromNetwork)
      }

      return _networkIdFromNetwork
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

export const deployInstance = (abi, bin, params) => {
  const deployOpts = {
    data: '0x' + bin,
    arguments: params
  }

  return web3Store.web3.eth.getAccounts()
    .then(accounts => deployInstanceInner(accounts, abi, deployOpts))
}

const deployInstanceInner = (accounts, abi, deployOpts) => {
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

let checkEventTopics = (obj) => {
  const topics = obj.topics || obj.raw.topics
  console.log("topics:", topics)
  const { web3 } = web3Store
  if (topics.length > 0) {
    const eventEncoded = topics[0];
    if (eventEncoded == web3.utils.sha3(EXCEPTIONS.storageException)
      || eventEncoded == web3.utils.sha3(EXCEPTIONS.applicationException))
      return true;
  }
}

const sendTXResponse = (receipt, type) => {
  console.log("receipt:")
  console.log(receipt)
  console.log("receipt.status:")
  console.log(receipt.status)
  if (0 !== +receipt.status || null === receipt.status) {
    const logs = receipt.logs
    const events = receipt.events;
    let eventsArr;
    if (events) {
      eventsArr = Object.keys(events).map((ind) => { return events[ind] })
    }
    const ev_logs = logs || eventsArr
    console.log("ev_logs:", ev_logs)
    if (ev_logs.some(checkEventTopics)) {
      return Promise.reject({ message: 0 })
    } else {
      return type === DEPLOY_CONTRACT ? Promise.resolve(receipt.contractAddress, receipt) : Promise.resolve(receipt)
    }
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

async function getApplicationsInstances () {
  const { web3 } = web3Store
  const whenRegistryExecContract = attachToSpecificCrowdsaleContract("registryExec")
  const accounts = await web3.eth.getAccounts()
  const whenAccount = accounts[0]

  const [registryExecContract, account] = await Promise.all([whenRegistryExecContract, whenAccount])
  console.log("account:", account)
  console.log("registryExecContract:", registryExecContract)
  let promises = [];
  const crowdsales = []
  //to do: length of applications
  for (let i = 0; i < 100; i++) {
    let promise = new Promise((resolve, reject) => {
      registryExecContract.methods.deployer_instances(account, i).call()
      .then((deployer_instance) => {
        //console.log("deployer_instance:", deployer_instance)
        let appName = removeTrailingNUL(web3.utils.toAscii(deployer_instance.app_name))
        let appNameLowerCase = appName.toLowerCase()
        if (
          appNameLowerCase.includes(process.env[`${REACT_PREFIX}MINTED_CAPPED_APP_NAME`].toLowerCase())
          || appNameLowerCase.includes(process.env[`${REACT_PREFIX}DUTCH_APP_NAME`].toLowerCase())) {
          crowdsales.push({
            appName: appName,
            execID: deployer_instance.exec_id
          })
        }
        resolve();
      })
      .catch((err) => {
        resolve();
      })
    })
    promises.push(promise)
  }
  return Promise.all(promises)
    .then(() => {
      return Promise.all(crowdsales)
    })
}

const getApplicationsInstance = async (execID) => {
  if (!execID) return Promise.reject('invalid exec-id')

  const { methods } = await attachToSpecificCrowdsaleContract("registryExec")
  return await methods.instance_info(execID).call()
}

export const getCrowdsaleStrategy = async (execID) => {
  try {
    const { REACT_APP_MINTED_CAPPED_APP_NAME, REACT_APP_DUTCH_APP_NAME } = process.env
    const { toAscii } = web3Store.web3.utils
    const { app_name } = await getApplicationsInstance(execID)
    const app_name_lower_case = removeTrailingNUL(toAscii(app_name)).toLowerCase()

    if (app_name_lower_case.includes(REACT_APP_MINTED_CAPPED_APP_NAME.toLowerCase())) {
      return CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE
    } else if (app_name_lower_case.includes(REACT_APP_DUTCH_APP_NAME.toLowerCase())) {
      return CROWDSALE_STRATEGIES.DUTCH_AUCTION
    } else {
      return Promise.reject('no strategy defined')
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function loadRegistryAddresses () {
  const crowdsales = await getApplicationsInstances()
  console.log(crowdsales)
  crowdsaleStore.setCrowdsales(crowdsales)
}

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

export const attachToSpecificCrowdsaleContract = async (contractName) => {
  const contractObj = toJS(contractStore[contractName])

  if (!contractObj) {
    noContractAlert()
    return Promise.reject('no contract')
  }

  try {
    const { abi, addr } = contractObj
    const contractInstance = await attachToContract(abi, addr)

    if (!contractInstance) {
      noContractAlert()
      return Promise.reject('no contract')
    }

    console.log(`attach to ${contractName} contract`)
    return contractInstance
  } catch (err) {
    return Promise.reject(err)
  }
}

//todo: targetName is redundant
export let methodToExec = (contractName, methodName, targetName, getEncodedParams, params) => {
  const { web3 } = web3Store
  const methodParams = getEncodedParams(...params)
  console.log("methodParams:", methodParams)

  let methodSignature = web3.eth.abi.encodeFunctionSignature(methodName);
  console.log(`methodSignature ${methodName}:`, methodSignature);

  //let encodedParameters = web3.eth.abi.encodeParameters(["bytes"], [methodParams]);
  //let fullData = methodSignature + encodedParameters.substr(2);

  let fullData = methodSignature + methodParams.substr(2);
  console.log("full calldata:", fullData);

  const abiContract = contractStore[contractName].abi || []
  console.log("abiContract:", abiContract)
  const addrContract = contractStore[contractName].addr || {}
  console.log("addrContract:", addrContract)
  const contract = new web3.eth.Contract(toJS(abiContract), addrContract)
  console.log(contract)

  const { execID } = contractStore.crowdsale;
  const paramsToExec = [
    execID,
    fullData
  ]

  console.log("paramsToExec: ", paramsToExec)

  const method = contract.methods.exec(...paramsToExec)
  console.log("method:", method)

  return method;
}

export let methodToCreateAppInstance = (methodName, getEncodedParams, params, appName) => {
  const { web3 } = web3Store
  const methodParams = getEncodedParams(...params)
  console.log("methodParams:", methodParams)

  let methodSignature = web3.eth.abi.encodeFunctionSignature(methodName);
  console.log(`methodSignature ${methodName}:`, methodSignature);

  // let encodedParameters = web3.eth.abi.encodeParameters(["bytes"], [methodParams]);
  // let fullData = methodSignature + encodedParameters.substr(2);

  let fullData = methodSignature + methodParams.substr(2);
  console.log("full calldata:", fullData);

  const abiRegistryExec = contractStore.registryExec.abi || []
  console.log("abiRegistryExec:", abiRegistryExec)
  const addrRegistryExec = contractStore.registryExec.addr || {}
  console.log("addrRegistryExec:", addrRegistryExec)
  const registryExec = new web3.eth.Contract(toJS(abiRegistryExec), addrRegistryExec)
  console.log(registryExec)

  let appNameBytes = web3.utils.fromAscii(appName)
  let encodedAppName = web3.eth.abi.encodeParameter("bytes32", appNameBytes);

  let paramsToCreateAppInstance = [
    encodedAppName,
    fullData
  ]
  console.log("paramsToCreateAppInstance: ", paramsToCreateAppInstance)

  const method = registryExec.methods.createAppInstance(...paramsToCreateAppInstance)
  console.log("method:", method)

  return method;
}

function getCrowdsaleInfo (initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleInfo = initCrowdsaleContract.methods.getCrowdsaleInfo(addr, execID).call()
  return whenCrowdsaleInfo
}

function getCrowdsaleContributors (initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleUniqueBuyers = initCrowdsaleContract.methods.getCrowdsaleUniqueBuyers(addr, execID).call()
  return whenCrowdsaleUniqueBuyers
}

function getCrowdsaleStartAndEndTimes (initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleStartAndEndTimes = initCrowdsaleContract.methods.getCrowdsaleStartAndEndTimes(addr, execID).call()
  return whenCrowdsaleStartAndEndTimes
}

function getCrowdsaleTierList (initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleTierList = initCrowdsaleContract.methods.getCrowdsaleTierList(addr, execID).call()
  return whenCrowdsaleTierList
}

//todo: it gets all instances crated by current user. We need to get all instances from all users. Should be implemented in Auth-os side.
export async function getAllCrowdsaleAddresses () {
  const instances = await getApplicationsInstances()
  const targetPrefix = "idx"

  const targetMintedCapped = `${targetPrefix}MintedCapped`
  const initCrowdsaleContractMintedCapped = await attachToSpecificCrowdsaleContract(targetMintedCapped)

  const targetDutchAuction = `${targetPrefix}DutchAuction`
  const initCrowdsaleContractDutchAuction = await attachToSpecificCrowdsaleContract(targetDutchAuction)

  const registryStorageObj = toJS(contractStore.abstractStorage)
  const { addr } = registryStorageObj

  let whenCrowdsaleInfo = []
  let whenCrowdsaleContributors = []
  let whenCrowdsaleDates = []
  let whenCrowdsaleTierList = []
  instances.forEach((instance) => {
    let initCrowdsaleContract
    switch (instance.appName) {
      case CROWDSALE_APP_NAMES.MINTED_CAPPED_CROWDSALE:
        initCrowdsaleContract = initCrowdsaleContractMintedCapped
        whenCrowdsaleTierList.push(getCrowdsaleTierList(initCrowdsaleContract, addr, instance.execID))
        break
      case CROWDSALE_APP_NAMES.DUTCH_AUCTION:
        initCrowdsaleContract = initCrowdsaleContractDutchAuction
        whenCrowdsaleTierList.push([])
        break
      default:
        initCrowdsaleContract = initCrowdsaleContractMintedCapped
        break
    }
    whenCrowdsaleInfo.push(getCrowdsaleInfo(initCrowdsaleContract, addr, instance.execID))
    whenCrowdsaleContributors.push(getCrowdsaleContributors(initCrowdsaleContract, addr, instance.execID))
    whenCrowdsaleDates.push(getCrowdsaleStartAndEndTimes(initCrowdsaleContract, addr, instance.execID))
  })

  const crowdsaleData = [whenCrowdsaleInfo, whenCrowdsaleContributors, whenCrowdsaleDates, whenCrowdsaleTierList]
  let crowdsaleDataReorg = crowdsaleData.map(function(innerPromiseArray) {
    return Promise.all(innerPromiseArray);
  })

  const [crowdsalesInfo, crowdsaleContributors, crowdsaleDates, crowdsaleTierList] = await Promise.all(crowdsaleDataReorg)

  crowdsalesInfo.forEach((crowdsaleInfo, ind) => {
    instances[ind].crowdsaleInfo = crowdsaleInfo
    instances[ind].crowdsaleContributors = crowdsaleContributors[ind]
    instances[ind].crowdsaleDates = crowdsaleDates[ind]
    instances[ind].crowdsaleTierList = crowdsaleTierList[ind]
  })

  console.log("instances:", instances)

  return Promise.all(instances)
}
