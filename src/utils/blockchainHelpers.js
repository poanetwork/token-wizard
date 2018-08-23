import { incorrectNetworkAlert, noMetaMaskAlert, MetaMaskIsLockedAlert, noContractAlert } from './alerts'
import { CHAINS, MAX_GAS_PRICE, CROWDSALE_STRATEGIES, EXCEPTIONS, REACT_PREFIX } from './constants'
import { crowdsaleStore, generalStore, web3Store, contractStore } from '../stores'
import { toJS } from 'mobx'
import { removeTrailingNUL } from './utils'
import logdown from 'logdown'

const logger = logdown('TW:blockchainHelpers')

const DEPLOY_CONTRACT = 1
const CALL_METHOD = 2

export const checkWeb3 = async () => {
  const { web3 } = web3Store

  if (web3) {
    await checkMetaMask()
  } else {
    setTimeout(() => {
      web3Store.getWeb3(async web3 => {
        if (!web3) {
          return noMetaMaskAlert()
        }
        await checkMetaMask()
      })
    }, 500)
  }
}

const checkMetaMask = async () => {
  const { web3 } = web3Store

  if (!web3 || !web3.currentProvider || !web3.currentProvider.isMetaMask) {
    return noMetaMaskAlert()
  }

  logger.log(web3.currentProvider)

  try {
    let accounts = await web3.eth.getAccounts()
    if (!accounts || accounts.length === 0) {
      throw new Error(`There is no accounts`)
    }
  } catch (err) {
    logger.error(err)
    return MetaMaskIsLockedAlert()
  }
}

export const checkNetWorkByID = async _networkIdFromGET => {
  if (!_networkIdFromGET) {
    return null
  }
  logger.log(_networkIdFromGET)

  const { web3 } = web3Store
  if (!web3) {
    return null
  }

  let networkNameFromGET = getNetWorkNameById(_networkIdFromGET)
  networkNameFromGET = networkNameFromGET ? networkNameFromGET : CHAINS.UNKNOWN

  let _networkIdFromNetwork = await web3.eth.net.getId()
  let networkNameFromNetwork = getNetWorkNameById(_networkIdFromNetwork)
  networkNameFromNetwork = networkNameFromNetwork ? networkNameFromNetwork : CHAINS.UNKNOWN

  if (networkNameFromGET !== networkNameFromNetwork) {
    logger.log(`${networkNameFromGET}!=${networkNameFromNetwork}`)
    return incorrectNetworkAlert(networkNameFromGET, networkNameFromNetwork)
  }

  return _networkIdFromNetwork
}

export const getNetWorkNameById = _id => {
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

export const getNetworkVersion = () => {
  const { web3 } = web3Store

  if (web3 && web3.eth && web3.eth.net && web3.eth.net.getId) {
    return web3.eth.net.getId()
  }
  return Promise.resolve(null)
}

export const setExistingContractParams = (abi, addr, setContractProperty) => {
  attachToContract(abi, addr).then(crowdsaleContract => {
    crowdsaleContract.token.call(function(err, tokenAddr) {
      if (err) return logger.error(err)

      logger.log('tokenAddr:', tokenAddr)
      setContractProperty('token', 'addr', tokenAddr)
    })

    crowdsaleContract.multisigWallet.call(function(err, multisigWalletAddr) {
      if (err) return logger.error(err)

      logger.log('multisigWalletAddr:', multisigWalletAddr)
      setContractProperty('multisig', 'addr', multisigWalletAddr)
    })
  })
}

export const deployContract = (abi, bin, params) => {
  const deployOpts = {
    data: `0x${bin}`,
    arguments: params
  }

  return web3Store.web3.eth.getAccounts().then(accounts => deployContractInner(accounts, abi, deployOpts))
}

const deployContractInner = (accounts, abi, deployOpts) => {
  const { web3 } = web3Store
  const objAbi = JSON.parse(JSON.stringify(abi))
  const contractInstance = new web3.eth.Contract(objAbi)
  const deploy = contractInstance.deploy(deployOpts)

  return deploy
    .estimateGas({ gas: MAX_GAS_PRICE })
    .then(estimatedGas => estimatedGas, err => logger.error('estimate gas error', err))
    .then(estimatedGas => {
      logger.log('gas is estimated', estimatedGas)
      const sendOpts = {
        from: accounts[0],
        gasPrice: generalStore.gasPrice,
        gas: calculateGasLimit(estimatedGas)
      }
      return sendTX(deploy.send(sendOpts), DEPLOY_CONTRACT)
    })
}

export function sendTXToContract(method) {
  return sendTX(method, CALL_METHOD)
}

let sendTX = (method, type) => {
  let isMined = false
  let txHash

  return new Promise((resolve, reject) => {
    method
      .on('error', error => {
        if (isMined) return
        logger.error(error)
        // https://github.com/poanetwork/token-wizard/issues/472
        if (
          !error.message.includes('Failed to check for transaction receipt') &&
          !error.message.includes('Failed to fetch') &&
          !error.message.includes('Unexpected end of JSON input')
        )
          reject(error)
      })
      // This additional polling of tx receipt was made, because users had problems on mainnet: wizard hanged on random
      // transaction, because there wasn't response from it, no receipt. Especially, if you switch between tabs when
      // wizard works.
      // https://github.com/poanetwork/token-wizard/pull/364/files/c86c3e8482ef078e0cb46b8bebf57a9187f32181#r152277434
      .on('transactionHash', _txHash =>
        checkTxMined(_txHash, function pollingReceiptCheck(err, receipt) {
          if (isMined) return
          //https://github.com/poanetwork/token-wizard/issues/480
          if (
            err &&
            !err.message.includes('Failed to check for transaction receipt') &&
            !err.message.includes('Failed to fetch') &&
            !err.message.includes('Unexpected end of JSON input')
          )
            return reject(err)

          txHash = _txHash
          const typeDisplayName = getTypeOfTxDisplayName(type)

          if (receipt) {
            if (receipt.blockNumber) {
              logger.log(`${typeDisplayName} ${txHash} is mined from polling of tx receipt`)
              isMined = true
              sendTXResponse(receipt, type)
                .then(resolve)
                .catch(reject)
            } else {
              repeatPolling()
            }
          } else {
            repeatPolling()
          }

          function repeatPolling() {
            logger.log(`${typeDisplayName} ${txHash} is still pending. Polling of transaction once more`)
            setTimeout(() => checkTxMined(txHash, pollingReceiptCheck), 5000)
          }
        })
      )
      .on('receipt', receipt => {
        if (isMined) return

        const typeDisplayName = getTypeOfTxDisplayName(type)

        logger.log(`${typeDisplayName} ${txHash} is mined from Promise`)
        isMined = true

        sendTXResponse(receipt, type)
          .then(resolve)
          .catch(reject)
      })
  })
}

let checkEventTopics = obj => {
  const topics = obj.topics || obj.raw.topics
  logger.log('topics:', topics)
  const { web3 } = web3Store
  if (topics.length > 0) {
    const eventEncoded = topics[0]
    if (
      eventEncoded === web3.utils.sha3(EXCEPTIONS.storageException) ||
      eventEncoded === web3.utils.sha3(EXCEPTIONS.applicationException)
    )
      return true
  }
}

const sendTXResponse = (receipt, type) => {
  logger.log('receipt:', receipt)
  logger.log('receipt.status:', receipt.status)
  if (0 !== +receipt.status || null === receipt.status) {
    const logs = receipt.logs
    const events = receipt.events
    let eventsArr
    if (events) {
      eventsArr = Object.keys(events).map(ind => {
        return events[ind]
      })
    }
    const ev_logs = logs || eventsArr
    logger.log('ev_logs:', ev_logs)
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
    if (receipt) logger.log(`transaction mined`, receipt)
    _pollingReceiptCheck(err, receipt)
  })
}

const getTypeOfTxDisplayName = type => {
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

export function attachToContract(abi, addr) {
  const { web3 } = web3Store

  return web3.eth.getAccounts().then(accounts => {
    const objAbi = JSON.parse(JSON.stringify(abi))
    return new web3.eth.Contract(objAbi, addr, { from: accounts[0] })
  })
}

//todo: leave only appName. AppNameHash parameter should be removed in the future and calculated from appName
const getApplicationInstance = async (app_instances, appName, appNameHash, i) => {
  try {
    const execID = await app_instances(appNameHash, i).call()
    logger.log('app_instance:', execID)
    return {
      appName,
      execID
    }
  } catch (err) {
    logger.error(err)
    return null
  }
}

async function getAllApplicationsInstances() {
  const whenRegistryExecContract = attachToSpecificCrowdsaleContract('registryExec')
  const {
    REACT_APP_MINTED_CAPPED_APP_NAME: MINTED_CAPPED_APP_NAME,
    REACT_APP_DUTCH_APP_NAME: DUTCH_APP_NAME,
    REACT_APP_MINTED_CAPPED_APP_NAME_HASH: MINTED_CAPPED_APP_NAME_HASH,
    REACT_APP_DUTCH_APP_NAME_HASH: DUTCH_APP_NAME_HASH
  } = process.env

  const registryExecContract = await whenRegistryExecContract
  logger.log('registryExecContract:', registryExecContract)
  const { getInstances, app_instances } = registryExecContract.methods

  const whenCrowdsales = []
  const appInstancesMintedCapped = await getInstances(MINTED_CAPPED_APP_NAME_HASH).call()
  const appInstancesDutch = await getInstances(DUTCH_APP_NAME_HASH).call()

  for (let i = 0; i < appInstancesMintedCapped.length; i++) {
    whenCrowdsales.push(getApplicationInstance(app_instances, MINTED_CAPPED_APP_NAME, MINTED_CAPPED_APP_NAME_HASH, i))
  }

  for (let i = 0; i < appInstancesDutch.length; i++) {
    whenCrowdsales.push(getApplicationInstance(app_instances, DUTCH_APP_NAME, DUTCH_APP_NAME_HASH, i))
  }

  return Promise.all(whenCrowdsales).then(crowdsales => crowdsales.filter(crowdsale => crowdsale !== null))
}

async function getOwnerApplicationsInstancesForProxy() {
  const { web3 } = web3Store
  const proxiesRegistryContract = await attachToSpecificCrowdsaleContract('ProxiesRegistry')
  const accounts = await web3.eth.getAccounts()

  const promises = []
  const crowdsales = []
  const proxyAddrs = await proxiesRegistryContract.methods.getCrowdsalesForUser(accounts[0]).call()
  const mintedCapped = process.env[`${REACT_PREFIX}MINTED_CAPPED_APP_NAME`].toLowerCase()
  const dutchAuction = process.env[`${REACT_PREFIX}DUTCH_APP_NAME`].toLowerCase()
  proxyAddrs.forEach(proxyAddr => {
    let promise = new Promise(async (resolve, reject) => {
      const abi = contractStore.MintedCappedProxy.abi // we can use minted caped proxy ABI for minted capped and Dutch acution
      try {
        const contractInstance = await attachToContract(abi, proxyAddr)
        const contractAppName = await contractInstance.methods.app_name().call()
        const appName = removeTrailingNUL(web3.utils.toAscii(contractAppName))
        const appNameLowerCase = appName.toLowerCase()
        if (appNameLowerCase.includes(mintedCapped) || appNameLowerCase.includes(dutchAuction)) {
          crowdsales.push({ appName, execID: proxyAddr })
        }
        resolve()
      } catch (error) {
        logger.error(error)
        resolve()
      }
    })
    promises.push(promise)
  })
  return Promise.all(promises).then(() => {
    return Promise.all(crowdsales)
  })
}

// eslint-disable-next-line no-unused-vars
async function getOwnerApplicationsInstances() {
  const { web3 } = web3Store
  const registryExecContract = await attachToSpecificCrowdsaleContract('registryExec')
  const accounts = await web3.eth.getAccounts()

  let promises = []
  const crowdsales = []
  const lengthOfUserApplications = await registryExecContract.methods.getDeployedLength(accounts[0]).call()
  for (let i = 0; i < lengthOfUserApplications; i++) {
    let promise = new Promise((resolve, reject) => {
      registryExecContract.methods
        .deployed_instances(accounts[0], i)
        .call()
        .then(deployer_instance => {
          let appName = removeTrailingNUL(web3.utils.toAscii(deployer_instance.app_name))
          let appNameLowerCase = appName.toLowerCase()
          if (
            appNameLowerCase.includes(process.env[`${REACT_PREFIX}MINTED_CAPPED_APP_NAME`].toLowerCase()) ||
            appNameLowerCase.includes(process.env[`${REACT_PREFIX}DUTCH_APP_NAME`].toLowerCase())
          ) {
            crowdsales.push({ appName, execID: deployer_instance.app_exec_id })
          }
          resolve()
        })
        .catch(err => {
          resolve()
        })
    })
    promises.push(promise)
  }
  return Promise.all(promises).then(() => {
    return Promise.all(crowdsales)
  })
}

const getApplicationsInstance = async execID => {
  //if (!execID) return Promise.reject('invalid exec-id')
  let targetContract
  if (execID) {
    targetContract = 'registryExec'
  } else {
    if (contractStore.MintedCappedProxy) {
      targetContract = 'MintedCappedProxy'
    } else if (contractStore.DutchProxy) {
      targetContract = 'DutchProxy'
    }
  }
  logger.log('targetContract:', targetContract)

  const { methods } = await attachToSpecificCrowdsaleContract(targetContract)
  logger.log('methods:', methods)
  if (execID) {
    return await methods.instance_info(execID).call()
  } else {
    const appName = await methods.app_name().call()
    return { app_name: appName }
  }
}

export const getCrowdsaleStrategy = async execID => {
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
    logger.error(err)
    return null
  }
}

export const getCrowdsaleStrategyByName = async appName => {
  try {
    const { REACT_APP_MINTED_CAPPED_APP_NAME, REACT_APP_DUTCH_APP_NAME } = process.env
    const { toAscii } = web3Store.web3.utils
    const app_name_lower_case = removeTrailingNUL(toAscii(appName)).toLowerCase()

    if (app_name_lower_case.includes(REACT_APP_MINTED_CAPPED_APP_NAME.toLowerCase())) {
      return CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE
    } else if (app_name_lower_case.includes(REACT_APP_DUTCH_APP_NAME.toLowerCase())) {
      return CROWDSALE_STRATEGIES.DUTCH_AUCTION
    } else {
      return Promise.reject('no strategy defined')
    }
  } catch (err) {
    logger.error(err)
    return null
  }
}

export async function loadRegistryAddresses() {
  const crowdsales = await getOwnerApplicationsInstancesForProxy()
  logger.log('Crowdsales', crowdsales)
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
      resolve(accounts[0])
    })
  })
}

export const attachToSpecificCrowdsaleContract = async contractName => {
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

    logger.log(`attach to ${contractName} contract`)
    return contractInstance
  } catch (err) {
    return Promise.reject(err)
  }
}

export const attachToSpecificCrowdsaleContractByAddr = async (addr, abi) => {
  try {
    const contractInstance = await attachToContract(abi, addr)

    if (!contractInstance) {
      noContractAlert()
      return Promise.reject('no contract')
    }

    logger.log(`attach to contract with address ${addr}`)
    return contractInstance
  } catch (err) {
    return Promise.reject(err)
  }
}

export const getExecBuyCallData = execID => {
  const { web3 } = web3Store
  const buySignature = web3.eth.abi.encodeFunctionSignature(`buy()`)
  let execInterface
  if (execID) {
    execInterface = ['bytes32', 'bytes']
  } else {
    execInterface = ['bytes']
  }
  const execSignature = web3.eth.abi.encodeFunctionSignature(`exec(${execInterface.join(',')})`)
  let execParams
  if (execID) {
    execParams = [execID, buySignature]
  } else {
    execParams = [buySignature]
  }
  const execEncodedParams = web3.eth.abi.encodeParameters(execInterface, execParams)
  const execABIEncoded = execSignature + execEncodedParams.substr(2)
  return execABIEncoded
}

export let methodToExec = (contractName, methodName, getEncodedParams, params) => {
  const { web3 } = web3Store
  const methodParams = getEncodedParams(...params)
  logger.log('methodParams:', methodParams)

  let methodSignature = web3.eth.abi.encodeFunctionSignature(methodName)
  logger.log(`methodSignature \`${methodName}\`: \`${methodSignature}\``)

  //let encodedParameters = web3.eth.abi.encodeParameters(["bytes"], [methodParams]);
  //let fullData = methodSignature + encodedParameters.substr(2);

  let fullData = methodSignature + methodParams.substr(2)
  logger.log('full calldata:', fullData)

  const abiContract = contractStore[contractName].abi || []
  logger.log('abiContract:', abiContract)
  const addrContract = contractStore[contractName].addr || {}
  logger.log('addrContract:', addrContract)
  const contract = new web3.eth.Contract(toJS(abiContract), addrContract)
  logger.info(contract)

  const { execID } = contractStore.crowdsale
  let paramsToExec = []
  if (contractName === 'MintedCappedProxy' || contractName === 'DutchProxy') {
    paramsToExec.push(fullData)
  } else if (contractName === 'registryExec') {
    paramsToExec.push(execID, fullData)
  }

  logger.log('paramsToExec: ', paramsToExec)

  const method = contract.methods.exec(...paramsToExec)
  logger.log('method:', method)

  return method
}

export let methodToCreateAppInstance = (contractName, methodName, getEncodedParams, rawParams, appName) => {
  const { web3 } = web3Store
  logger.log('rawParams:', rawParams)
  const abi = contractStore[contractName].abi || []
  logger.log('abi:', abi)
  const addr = contractStore[contractName].addr || {}
  logger.log('addr:', addr)
  const targetContract = new web3.eth.Contract(toJS(abi), addr)
  logger.log(targetContract)

  let appNameBytes = web3.utils.fromAscii(appName)
  let encodedAppName = web3.eth.abi.encodeParameter('bytes32', appNameBytes)

  const { params, paramsEncoded } = getEncodedParams(...rawParams)
  logger.log('params:', params)
  logger.log('paramsEncoded:', paramsEncoded)
  let paramsToInit
  const { methods } = targetContract
  let targetMethodName
  if (contractName === 'MintedCappedProxy' || contractName === 'DutchProxy') {
    targetMethodName = 'init'
    paramsToInit = params
  } else if (contractName === 'registryExec') {
    let methodSignature = web3.eth.abi.encodeFunctionSignature(methodName)
    logger.log(`methodSignature \`${methodName}\`: \`${methodSignature}\``)
    let fullData = methodSignature + paramsEncoded.substr(2)
    logger.log('full calldata:', fullData)

    targetMethodName = 'createAppInstance'
    paramsToInit = [encodedAppName, fullData]
  }
  logger.log('paramsToInit: ', paramsToInit)
  logger.log('targetMethodName:', targetMethodName)

  const method = methods[targetMethodName](...paramsToInit)
  logger.log('method:', method)

  return method
}

function getCrowdsaleInfo(initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleInfo = initCrowdsaleContract.methods.getCrowdsaleInfo(addr, execID).call()
  return whenCrowdsaleInfo
}

function getCrowdsaleContributors(initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleUniqueBuyers = initCrowdsaleContract.methods.getCrowdsaleUniqueBuyers(addr, execID).call()
  return whenCrowdsaleUniqueBuyers
}

function getCrowdsaleStartAndEndTimes(initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleStartAndEndTimes = initCrowdsaleContract.methods.getCrowdsaleStartAndEndTimes(addr, execID).call()
  return whenCrowdsaleStartAndEndTimes
}

function getCrowdsaleTierList(initCrowdsaleContract, addr, execID) {
  const whenCrowdsaleTierList = initCrowdsaleContract.methods.getCrowdsaleTierList(addr, execID).call()
  return whenCrowdsaleTierList
}

export async function getAllCrowdsaleAddresses() {
  const instances = await getAllApplicationsInstances()
  const targetPrefix = 'idx'

  const targetMintedCapped = `${targetPrefix}MintedCapped`
  const initCrowdsaleContractMintedCapped = await attachToSpecificCrowdsaleContract(targetMintedCapped)

  const targetDutchAuction = `${targetPrefix}Dutch`
  const initCrowdsaleContractDutchAuction = await attachToSpecificCrowdsaleContract(targetDutchAuction)

  const { addr } = toJS(contractStore.abstractStorage)

  let whenCrowdsaleInfo = []
  let whenCrowdsaleContributors = []
  let whenCrowdsaleDates = []
  let whenCrowdsaleTierList = []
  instances.forEach(instance => {
    let initCrowdsaleContract
    switch (instance.appName) {
      case process.env['REACT_APP_MINTED_CAPPED_APP_NAME']:
        initCrowdsaleContract = initCrowdsaleContractMintedCapped
        whenCrowdsaleTierList.push(getCrowdsaleTierList(initCrowdsaleContract, addr, instance.execID))
        break
      case process.env['REACT_APP_DUTCH_APP_NAME']:
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
    return Promise.all(innerPromiseArray)
  })

  const [crowdsalesInfo, crowdsaleContributors, crowdsaleDates, crowdsaleTierList] = await Promise.all(
    crowdsaleDataReorg
  )

  crowdsalesInfo.forEach((crowdsaleInfo, ind) => {
    instances[ind].crowdsaleInfo = crowdsaleInfo
    instances[ind].crowdsaleContributors = crowdsaleContributors[ind]
    instances[ind].crowdsaleDates = crowdsaleDates[ind]
    instances[ind].crowdsaleTierList = crowdsaleTierList[ind]
  })

  logger.log('instances:', instances)

  return Promise.all(instances)
}

export const isAddressValid = addr => {
  logger.log('addr:', addr)
  return web3Store && web3Store.web3 && web3Store.web3.utils.isAddress(addr)
}
