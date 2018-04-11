import {
  calculateGasLimit,
  getNetWorkNameById,
  getNetworkVersion,
  getRegistryAddress,
  sendTXToContract,
  methodToExec,
  methodToInit,
  methodToInitAppInstance,
  methodToInitAndFinalize
} from '../../utils/blockchainHelpers'
import { noContractAlert } from '../../utils/alerts'
import { countDecimalPlaces, toFixed } from '../../utils/utils'
import { DOWNLOAD_NAME } from '../../utils/constants'
import { isObservableArray } from 'mobx'
import {
  contractStore,
  deploymentStore,
  generalStore,
  reservedTokenStore,
  tierStore,
  tokenStore,
  web3Store
} from '../../stores'
import { getEncodedABIClientSide } from '../../utils/microservices'
import { BigNumber } from 'bignumber.js'
import { toBigNumber } from '../crowdsale/utils'

export const buildDeploymentSteps = (web3) => {
  const stepFnCorrelation = {
    crowdsaleCreate: deployCrowdsale,
    token: initializeToken,
    //registerCrowdsaleAddress: registerCrowdsaleAddress,
    setReservedTokens: setReservedTokensListMultiple,
    createCrowdsaleTiers: createCrowdsaleTiers,
    whitelist: addWhitelist,
    crowdsaleInit: initializeCrowdsale,
  }

  let list = []

  deploymentStore.txMap.forEach((steps, name) => {
    if (steps.length) {
      list = list.concat(stepFnCorrelation[name]())
    }
  })

  return list
}

const getCrowdSaleParams = (account, tierObj, index, methodInterface) => {
  const { web3 } = web3Store
  const { walletAddress, whitelistEnabled } = tierStore.tiers[0]
  const { updatable, supply, tier, startTime, endTime } = tierStore.tiers[index]

  console.log("1")
  BigNumber.config({ DECIMAL_PLACES: 18 })
  console.log("2")
  console.log(tierObj)
  const rate = new BigNumber(tierObj.rate)
  console.log("3")
  const oneTokenInETH = rate.pow(-1).toFixed()
  console.log("oneTokenInETH: ", oneTokenInETH)

  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())
  const duration = formatDate(endTime) - formatDate(startTime)

  /*function init(
    address _team_wallet,
    uint _start_time,
    bytes32 _initial_tier_name,
    uint _initial_tier_price,
    uint _initial_tier_duration,
    uint _initial_tier_token_sell_cap,
    bool _initial_tier_is_whitelisted,
    address _admin
  )*/

  let tierNameBytes = web3.utils.fromAscii(tier)
  let encodedTierName = web3.eth.abi.encodeParameter("bytes32", tierNameBytes);

  let paramsCrowdsale = [
    walletAddress,
    formatDate(startTime),
    encodedTierName,
    web3.utils.toWei(oneTokenInETH, 'ether'),
    duration.toString(),
    toBigNumber(supply).times(`1e${tokenStore.decimals}`).toFixed(),
    whitelistEnabled === 'yes',
    account
  ]

  console.log("paramsCrowdsale:", paramsCrowdsale)

  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, paramsCrowdsale);
  return encodedParameters;
  /*return [
    formatDate(endTime),
    toFixed('0'),
    updatable === 'on',
  ]*/
}

export const deployCrowdsale = () => {
  console.log("###deploy crowdsale###")
  const { web3 } = web3Store
  return tierStore.tiers.map((tier, index) => {
    return () => {
      return getNetworkVersion()
      .then((networkID) => {
        contractStore.setContractProperty('crowdsale', 'networkID', networkID)

        return web3.eth.getAccounts()
          .then((accounts) => accounts[0])
          .then((account) => {
            contractStore.setContractProperty('crowdsale', 'account', account)

            const methodInterface = ["address","uint256","bytes32","uint256","uint256","uint256","bool","address"]

            let params = [
              account,
              tier,
              index,
              methodInterface
            ];

            const methodInterfaceStr = `init(${methodInterface.join(',')})`
            const target = "initCrowdsale"

            let method = methodToInitAppInstance(
              methodInterfaceStr,
              target,
              getCrowdSaleParams,
              params
            )
            /*let method = methodToInit(
              methodInterfaceStr,
              target,
              getCrowdSaleParams,
              params
            )*/
            /*let method = methodToInitAndFinalize(
              methodInterfaceStr,
              target,
              getCrowdSaleParams,
              params
            )*/

            const opts = { gasPrice: generalStore.gasPrice, from: account }
            console.log("opts:", opts)

            return method.estimateGas(opts)
              .then(estimatedGas => {
                opts.gasLimit = calculateGasLimit(estimatedGas)
                return sendTXToContract(method.send(opts))
                  .then((receipt) => {
                    console.log("receipt:", receipt)
                    let logs = receipt.logs;
                    let events = receipt.events;
                    if (events) {
                      console.log("events:", events)
                      if (events.ApplicationFinalization) {
                        getExecutionIDFromEvent(events, "ApplicationFinalization");
                      } else if (events.AppInstanceCreated) {
                        getExecutionIDFromEvent(events, "AppInstanceCreated");
                      }
                    } else if (logs) {
                      console.log("logs:")
                      console.log(logs)

                      let lastLog = logs.reduce(function(log, current) {
                        console.log(log)
                        console.log(current.topics)
                        console.log(current.logIndex)
                        if (!log) {
                          return log = current;
                        }
                        if (current.logIndex > log.logIndex) {
                          log = current;
                        }
                        return log
                      }, 0)
                      if (lastLog) {
                        if (lastLog.topics) {
                          if (lastLog.topics.length > 1) {
                            let execID = lastLog.topics[2]
                            console.log("exec_id", execID)
                            contractStore.setContractProperty('crowdsale', 'execID', execID)
                          }
                        }
                      }
                    }
                  })
                  .then(() => deploymentStore.setAsSuccessful('crowdsaleCreate'))
              })
          })
      })
    }
  })
}

const getExecutionIDFromEvent = (events, eventName) => {
  console.log("AppInstanceCreated:", events[eventName])
  if (events[eventName].returnValues) {
    console.log("returnValues:", events[eventName].returnValues)
    let exec_id;
    if (events[eventName].returnValues.execution_id)
      exec_id = events[eventName].returnValues.execution_id
    else if (events[eventName].returnValues.exec_id) {
      exec_id = events[eventName].returnValues.exec_id
    }
    console.log("execution_id", exec_id)
    contractStore.setContractProperty('crowdsale', 'execID', exec_id)
  }
}

const getTokenParams = (token, methodInterface) => {
  const { web3 } = web3Store
  let account = contractStore.crowdsale.account;
  const whitelistWithGlobalMinCap = tierStore.tiers[0].whitelistEnabled !== 'yes' && tierStore.globalMinCap
  const minCap = whitelistWithGlobalMinCap ? toFixed(tierStore.globalMinCap * 10 ** token.decimals).toString() : 0

  let paramsToken = [
    web3.utils.fromAscii(token.name),
    web3.utils.fromAscii(token.ticker),
    parseInt(token.decimals, 10)
  ]
  console.log("paramsToken: ", paramsToken)
  let paramsContext = [contractStore.crowdsale.execID, account, 0];
  let context = web3.eth.abi.encodeParameters(["bytes32","address","uint256"], paramsContext);
  console.log("context:", context)
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsToken, context]);
  return encodedParameters;
}

export const initializeToken = () => {
  console.log("###initialize token###")
  return [
    () => {
      return getNetworkVersion()
      .then((networkID) => {

        const methodInterface = ["bytes32","bytes32","uint256","bytes"]

        console.log("contractStore.crowdsale.account: ", contractStore.crowdsale.account)
        let account = contractStore.crowdsale.account;

        let paramsToExec = [tokenStore, methodInterface]
        const method = methodToExec(`initCrowdsaleToken(${methodInterface.join(',')})`, "crowdsaleConsole", getTokenParams, paramsToExec)

        const opts = { gasPrice: generalStore.gasPrice, gasLimit: 300000, from: account }
        console.log("opts:", opts)

        return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
            .then((receipt) => {
              console.log(receipt)
            })
            .then(() => deploymentStore.setAsSuccessful('token'))
        })
      })
    }
  ]
}

const getReservedTokensParams = (addrs, inTokens, inPercentageUnit, inPercentageDecimals, methodInterface) => {
  const { web3 } = web3Store
  let account = contractStore.crowdsale.account;

  let paramsReservedTokens = [
    addrs,
    inTokens,
    inPercentageUnit,
    inPercentageDecimals
  ]
  console.log("paramsReservedTokens:",paramsReservedTokens)

  let paramsContext = [contractStore.crowdsale.execID, account, 0];
  let context = web3.eth.abi.encodeParameters(["bytes32","address","uint256"], paramsContext);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsReservedTokens, context]);
  return encodedParameters;
}

export const setReservedTokensListMultiple = () => {
  console.log('###setReservedTokensListMultiple:###')
  return [
    () => {
      let map = {}
      let addrs = []
      let inTokens = []
      let inPercentageUnit = []
      let inPercentageDecimals = []

      const reservedTokens = reservedTokenStore.tokens

      for (let i = 0; i < reservedTokens.length; i++) {
        if (!reservedTokens[i].deleted) {
          const val = reservedTokens[i].val
          const addr = reservedTokens[i].addr
          const obj = map[addr] ? map[addr] : {}

          if (reservedTokens[i].dim === 'tokens') {
            obj.inTokens = val * 10 ** tokenStore.decimals
          } else {
            obj.inPercentageDecimals = countDecimalPlaces(val)
            obj.inPercentageUnit = val * 10 ** obj.inPercentageDecimals
          }
          map[addr] = obj
        }
      }

      let keys = Object.keys(map)

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let obj = map[key]

        addrs.push(key)
        inTokens.push(obj.inTokens ? toFixed(obj.inTokens.toString()) : 0)
        inPercentageUnit.push(obj.inPercentageUnit ? obj.inPercentageUnit : 0)
        inPercentageDecimals.push(obj.inPercentageDecimals ? obj.inPercentageDecimals : 0)
      }

      if (addrs.length === 0 && inTokens.length === 0 && inPercentageUnit.length === 0) {
        if (inPercentageDecimals.length === 0) return Promise.resolve()
      }

      const opts = { gasPrice: generalStore.gasPrice }

      const methodInterface = ["address[]","uint256[]","uint256[]","uint256[]","bytes"]

      let paramsToExec = [addrs, inTokens, inPercentageUnit, inPercentageDecimals, methodInterface]
      const method = methodToExec(`updateMultipleReservedTokens(${methodInterface.join(',')})`, "tokenConsole", getReservedTokensParams, paramsToExec)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('setReservedTokens'))
    }]
}

const getInitializeCrowdsaleParams = (token) => {
  const { web3 } = web3Store
  let account = contractStore.crowdsale.account;
  let paramsContext = [contractStore.crowdsale.execID, account, 0];
  let context = web3.eth.abi.encodeParameters(["bytes32","address","uint256"], paramsContext);
  let encodedParameters = web3.eth.abi.encodeParameters(["bytes"], [context]);
  return encodedParameters;
}

export const initializeCrowdsale = () => {
  console.log("###initialize crowdsale###")
  return [
    () => {
      return getNetworkVersion()
      .then((networkID) => {

        let account = contractStore.crowdsale.account;

        let paramsToExec = [tokenStore]
        const method = methodToExec("initializeCrowdsale(bytes)", "crowdsaleConsole", getInitializeCrowdsaleParams, paramsToExec)

        const opts = { gasPrice: generalStore.gasPrice, from: account }
        console.log("opts:", opts)

        return method.estimateGas(opts)
          .then(estimatedGas => {
            opts.gasLimit = calculateGasLimit(estimatedGas)
            return sendTXToContract(method.send(opts))
              .then((receipt) => {
                console.log(receipt)
              })
              .then(() => deploymentStore.setAsSuccessful('crowdsaleInit'))
          })
      })
    }
  ]
}

function registerCrowdsaleAddress () {
  return [
    () => {
      const { web3 } = web3Store
      const toJS = x => JSON.parse(JSON.stringify(x))

      const registryAbi = contractStore.registry.abi
      const crowdsaleAddress = contractStore.crowdsale.execID

      const whenRegistryAddress = getRegistryAddress()

      const whenAccount = web3.eth.getAccounts()
        .then((accounts) => accounts[0])

      return Promise.all([whenRegistryAddress, whenAccount])
        .then(([registryAddress, account]) => {
          const registry = new web3.eth.Contract(toJS(registryAbi), registryAddress)

          const opts = { gasPrice: generalStore.gasPrice, from: account }
          const method = registry.methods.add(crowdsaleAddress)

          return method.estimateGas(opts)
            .then(estimatedGas => {
              opts.gasLimit = calculateGasLimit(estimatedGas)
              return sendTXToContract(method.send(opts))
            })
        })
        .then(() => deploymentStore.setAsSuccessful('registerCrowdsaleAddress'))
    }
  ]
}

const getTiersParams = (methodInterface) => {
  const { web3 } = web3Store
  let account = contractStore.crowdsale.account;

  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())

  let whitelistEnabledArr = []
  let updatableArr = []
  let rateArr = []
  let supplyArr = []
  let tierNameArr = []
  let durationArr = []
  for (let tierIndex = 1; tierIndex < tierStore.tiers.length; tierIndex++) {
    let { whitelistEnabled, updatable, rate, supply, tier, startTime, endTime } = tierStore.tiers[tierIndex]
    let duration = formatDate(endTime) - formatDate(startTime)
    let tierNameBytes = web3.utils.fromAscii(tier)
    let encodedTierName = web3.eth.abi.encodeParameter("bytes32", tierNameBytes);
    durationArr.push(duration)
    tierNameArr.push(encodedTierName)
    rateArr.push(rate)
    supplyArr.push(supply)
    updatableArr.push(updatable === 'on')
    whitelistEnabledArr.push(whitelistEnabled === 'yes')
  }
  let paramsTiers = [
    tierNameArr,
    durationArr,
    rateArr,
    supplyArr,
    updatableArr,
    whitelistEnabledArr
  ]
  console.log("paramsTiers:", paramsTiers)

  let paramsContext = [contractStore.crowdsale.execID, account, 0];
  let context = web3.eth.abi.encodeParameters(["bytes32","address","uint256"], paramsContext);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsTiers, context]);
  return encodedParameters;
}

//to do
export const createCrowdsaleTiers = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      console.log('###createCrowdsaleTiers:###')
      const round = index

      const opts = { gasPrice: generalStore.gasPrice }

      const methodInterface = ["bytes32[]", "uint[]", "uint[]", "uint[]", "bool[]", "bool[]","bytes"]

      let paramsToExec = [methodInterface]
      const method = methodToExec(`createCrowdsaleTiers(${methodInterface.join(',')})`, "crowdsaleConsole", getTiersParams, paramsToExec)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('createCrowdsaleTiers'))
    }
  })
}

const getWhitelistsParams = (tierIndex, addrs, minCaps, maxCaps, methodInterface) => {
  const { web3 } = web3Store
  let account = contractStore.crowdsale.account;

  let paramsWhitelist = [
    tierIndex,
    addrs,
    minCaps,
    maxCaps
  ]
  console.log("paramsWhitelist:", paramsWhitelist)

  let paramsContext = [contractStore.crowdsale.execID, account, 0];
  let context = web3.eth.abi.encodeParameters(["bytes32","address","uint256"], paramsContext);
  let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [...paramsWhitelist, context]);
  return encodedParameters;
}

export const addWhitelist = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      console.log('###addWhitelist:###')
      const round = index

      let whitelist = []
      whitelist.push.apply(whitelist, tier.whitelist)

      //inheritance of whitelists
      /*for (let i = 0; i <= round; i++) {
        const tier = tierStore.tiers[i]

        for (let j = 0; j < tier.whitelist.length; j++) {
          let itemIsAdded = false

          for (let k = 0; k < whitelist.length; k++) {
            if (whitelist[k].addr === tier.whitelist[j].addr) {
              itemIsAdded = true
              break
            }
          }

          if (!itemIsAdded) {
            whitelist.push.apply(whitelist, tier.whitelist)
          }
        }
      }*/

      console.log('whitelist:', whitelist)

      if (whitelist.length === 0) {
        return Promise.resolve()
      }

      let addrs = []
      let minCaps = []
      let maxCaps = []

      for (let i = 0; i < whitelist.length; i++) {
        addrs.push(whitelist[i].addr)
        minCaps.push(whitelist[i].min * 10 ** tokenStore.decimals ? toFixed((whitelist[i].min * 10 ** tokenStore.decimals).toString()) : 0)
        maxCaps.push(whitelist[i].max * 10 ** tokenStore.decimals ? toFixed((whitelist[i].max * 10 ** tokenStore.decimals).toString()) : 0)
      }

      console.log('addrs:', addrs)
      console.log('minCaps:', minCaps)
      console.log('maxCaps:', maxCaps)

      const opts = { gasPrice: generalStore.gasPrice }

      const methodInterface = ["uint", "address[]","uint256[]","uint256[]","bytes"]

      let paramsToExec = [index, addrs, minCaps, maxCaps, methodInterface]
      const method = methodToExec(`whitelistMultiForTier(${methodInterface.join(',')})`, "crowdsaleConsole", getWhitelistsParams, paramsToExec)

      return method.estimateGas(opts)
        .then(estimatedGas => {
          opts.gasLimit = calculateGasLimit(estimatedGas)
          return sendTXToContract(method.send(opts))
        })
        .then(() => deploymentStore.setAsSuccessful('whitelist'))
    }
  })
}

export const handlerForFile = (content, type) => {
  const checkIfTime = content.field === 'startTime' || content.field === 'endTime'
  let suffix = ''

  if (checkIfTime) {
    let timezoneOffset = (new Date()).getTimezoneOffset() / 60
    let operator = timezoneOffset > 0 ? '-' : '+'
    suffix = ` (GMT ${operator} ${Math.abs(timezoneOffset)})`
  }

  return `${content.value}${type[content.field]}${suffix}`
}

export const handleConstantForFile = content => {
  return `${content.value}${content.fileValue}`
}

export const handleContractsForFile = (content, index, contractStore, tierStore) => {
  const title = content.value
  const { field } = content
  let fileContent = ''

  if (field !== 'src' && field !== 'abi' && field !== 'addr') {
    const contractField = contractStore[content.child][field]
    let fileBody

    if (isObservableArray(contractField)) {
      fileBody = contractField[index]

      if (!!fileBody) {
        fileContent = title + ' for ' + tierStore.tiers[index].tier + ':**** \n\n' + fileBody
      }
    } else if (!!contractField) {
      fileContent = title + ':**** \n\n' + contractField
    }
  } else {
    fileContent = addSrcToFile(content, index, contractStore, tierStore)
  }

  return fileContent
}

const addSrcToFile = (content, index, contractStore, tierStore) => {
  const title = content.value
  const { field } = content
  const contractField = contractStore[content.child][field]
  let fileContent = ''

  if (isObservableArray(contractField) && field !== 'abi') {
    fileContent = title + ' for ' + tierStore.tiers[index].tier + ': ' + contractField[index]
  } else {
    if (field !== 'src') {
      const body = field === 'abi' ? JSON.stringify(contractField) : contractField
      fileContent = title + body
    } else {
      fileContent = contractField
    }
  }

  return fileContent
}

export const download = ({ data = {}, filename = '', type = '', zip = '' }) => {
  let file = !zip ? new Blob([data], { type: type }) : zip

  if (window.navigator.msSaveOrOpenBlob) { // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  } else { // Others
    let a = document.createElement('a')
    let url = URL.createObjectURL(file)

    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

export function scrollToBottom () {
  window.scrollTo(0, document.body.scrollHeight)
}

export function getDownloadName (tokenAddress) {
  return new Promise(resolve => {
    const whenNetworkName = getNetworkVersion()
      .then((networkID) => {
        let networkName = getNetWorkNameById(networkID)

        if (!networkName) {
          networkName = String(networkID)
        }

        return networkName
      })
      .then((networkName) => `${DOWNLOAD_NAME}_${networkName}_${tokenAddress}`)

    resolve(whenNetworkName)
  })
}
