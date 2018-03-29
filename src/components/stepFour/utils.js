import {
  attachToContract,
  calculateGasLimit,
  deployInstance,
  getNetWorkNameById,
  getNetworkVersion,
  getRegistryAddress,
  sendTXToContract
} from '../../utils/blockchainHelpers'
import { noContractAlert, noContractDataAlert } from '../../utils/alerts'
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

export const setupContractDeployment = (web3) => {
  const tokenABI = contractStore.token.abi || []
  const tokenAddr = contractStore.token.addr || null
  const pricingStrategyABI = contractStore.pricingStrategy.abi || []

  const whenTokenABIConstructor = Promise.resolve(tokenAddr)
    .then(tokenAddr => {
      if (!tokenAddr) {
        return getEncodedABIClientSide(web3, tokenABI, [], 0)
          .then(ABIEncoded => {
            console.log('token ABI Encoded params constructor:', ABIEncoded)
            contractStore.setContractProperty('token', 'abiConstructor', ABIEncoded)
          })
      }
    })

  const whenPricingStrategyContract = tierStore.tiers.map((value, index) => {
    return getEncodedABIClientSide(web3, pricingStrategyABI, [], index)
      .then(ABIEncoded => {
        console.log('pricingStrategy ABI Encoded params constructor:', ABIEncoded)
        const newContract = contractStore.pricingStrategy.abiConstructor.concat(ABIEncoded)
        contractStore.setContractProperty('pricingStrategy', 'abiConstructor', newContract)
      })
  })

  return Promise.all([whenTokenABIConstructor, ...whenPricingStrategyContract])
}

export const buildDeploymentSteps = (web3) => {
  const stepFnCorrelation = {
    token: deployToken,
    crowdsale: deployCrowdsale,
    registerCrowdsaleAddress: registerCrowdsaleAddress,
    setReservedTokens: setReservedTokensListMultiple,
    whitelist: addWhitelist,
  }

  let list = []

  deploymentStore.txMap.forEach((steps, name) => {
    if (steps.length) {
      list = list.concat(stepFnCorrelation[name]())
    }
  })

  return list
}

const getTokenParams = token => {
  const { web3 } = web3Store
  const { walletAddress } = tierStore.tiers[0]
  const whitelistWithGlobalMinCap = tierStore.tiers[0].whitelistEnabled !== 'yes' && tierStore.globalMinCap
  const minCap = whitelistWithGlobalMinCap ? toFixed(tierStore.globalMinCap * 10 ** token.decimals).toString() : 0

  return [
    web3.utils.fromAscii(token.name),
    web3.utils.fromAscii(token.ticker),
    parseInt(token.decimals, 10),
    parseInt(token.supply, 10),
    //true,
    //minCap
    walletAddress
  ]
}

export const deployToken = () => {
  const { web3 } = web3Store
  const toJS = x => JSON.parse(JSON.stringify(x))
  return [
    () => {
      return getNetworkVersion()
      .then((networkID) => {
        console.log(contractStore)
        const abiRegistryStorage = contractStore.registryStorage.abi || []
        const addrsRegistryStorage = contractStore.registryStorage.addr || {}
        const contract2 = new web3.eth.Contract(toJS(abiRegistryStorage), addrsRegistryStorage[networkID])
        console.log(contract2)

        return web3.eth.getAccounts()
          .then((accounts) => accounts[0])
          .then((account) => {

            const abiScriptExec = contractStore.scriptExec.abi || []
            const addrsScriptExec = contractStore.scriptExec.addr || {}
            const paramsToken = getTokenParams(tokenStore)
            console.log("paramsToken:", paramsToken)

            let tokenAppName = process.env['REACT_APP_TOKEN_APP_NAME'] || '';
            let tokenAppNameHex = web3.eth.abi.encodeParameter("bytes32", web3.utils.fromAscii(tokenAppName));
            console.log("token app name:", tokenAppName);
            console.log("token app name hex:", tokenAppNameHex);

            let functionName = "init(bytes32,bytes32,uint256,uint256,address)";
            let functionSignature = web3.eth.abi.encodeFunctionSignature(functionName);
            console.log("functionSignature init:", functionSignature);

            let encodedParameters = web3.eth.abi.encodeParameters(["bytes32","bytes32","uint256","uint256","address"], paramsToken);
            console.log("encodedParameters:", encodedParameters);

            let fullData = functionSignature + encodedParameters.substr(2);
            console.log("full calldata:", fullData);

            const scriptExec = new web3.eth.Contract(toJS(abiScriptExec), addrsScriptExec[networkID])
            console.log(scriptExec)

            const opts = { gasPrice: generalStore.gasPrice, from: account }
            console.log("opts:", opts)
            const method = scriptExec.methods.initAppInstance(tokenAppNameHex, fullData)
            console.log("method:", method)

            return method.estimateGas(opts)
              .then(estimatedGas => {
                opts.gasLimit = calculateGasLimit(estimatedGas)
                return sendTXToContract(method.send(opts))
                  .then(tokenAddr => contractStore.setContractProperty('token', 'addr', tokenAddr))
                  .then(() => deploymentStore.setAsSuccessful('token'))
              })
          })
      })
    }
  ]
}

const getPricingStrategyParams = tier => {
  BigNumber.config({ DECIMAL_PLACES: 18 })
  const rate = new BigNumber(tier.rate)
  const oneTokenInETH = rate.pow(-1).toFixed()

  return [
    web3Store.web3.utils.toWei(oneTokenInETH, 'ether')
  ]
}

const getCrowdSaleParams = index => {
  const { walletAddress, whitelistEnabled } = tierStore.tiers[0]
  const { updatable, supply, tier, startTime, endTime } = tierStore.tiers[index]

  const formatDate = date => toFixed(parseInt(Date.parse(date) / 1000, 10).toString())

  return [
    tier,
    contractStore.token.addr,
    contractStore.pricingStrategy.addr[index],
    walletAddress,
    formatDate(startTime),
    formatDate(endTime),
    toFixed('0'),
    toFixed(parseInt(supply, 10) * 10 ** parseInt(tokenStore.decimals, 10)).toString(),
    updatable === 'on',
    whitelistEnabled === 'yes'
  ]
}

export const deployCrowdsale = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      return getNetworkVersion()
        .then(networkID => contractStore.setContractProperty('crowdsale', 'networkID', networkID))
        .then(() => {
          const abiCrowdsale = contractStore.crowdsale.abi || []
          const binCrowdsale = contractStore.crowdsale.bin || ''
          const paramsCrowdsale = getCrowdSaleParams(index)

          return deployInstance(abiCrowdsale, binCrowdsale, paramsCrowdsale)
        })
        .then(crowdsaleAddr => {
          console.log('***Deploy crowdsale contract***', index, crowdsaleAddr)

          const newCrowdsaleAddr = contractStore.crowdsale.addr.concat(crowdsaleAddr)
          contractStore.setContractProperty('crowdsale', 'addr', newCrowdsaleAddr)
        })
        .then(() => deploymentStore.setAsSuccessful('crowdsale'))
    }
  })
}

function registerCrowdsaleAddress () {
  return [
    () => {
      const { web3 } = web3Store
      const toJS = x => JSON.parse(JSON.stringify(x))

      const registryAbi = contractStore.registry.abi
      const crowdsaleAddress = contractStore.crowdsale.addr[0]

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

export const addWhitelist = () => {
  return tierStore.tiers.map((tier, index) => {
    return () => {
      const round = index
      const abi = contractStore.crowdsale.abi.slice()
      const addr = contractStore.crowdsale.addr[index]

      console.log('###whitelist:###')
      let whitelist = []

      for (let i = 0; i <= round; i++) {
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
      }

      console.log('whitelist:', whitelist)

      if (whitelist.length === 0) {
        return Promise.resolve()
      }

      return attachToContract(abi, addr)
        .then(crowdsaleContract => {
          console.log('attach to crowdsale contract')

          if (!crowdsaleContract) {
            noContractAlert()
            return Promise.reject('No contract available')
          }

          let addrs = []
          let statuses = []
          let minCaps = []
          let maxCaps = []

          for (let i = 0; i < whitelist.length; i++) {
            addrs.push(whitelist[i].addr)
            statuses.push(true)
            minCaps.push(whitelist[i].min * 10 ** tokenStore.decimals ? toFixed((whitelist[i].min * 10 ** tokenStore.decimals).toString()) : 0)
            maxCaps.push(whitelist[i].max * 10 ** tokenStore.decimals ? toFixed((whitelist[i].max * 10 ** tokenStore.decimals).toString()) : 0)
          }

          console.log('addrs:', addrs)
          console.log('statuses:', minCaps)
          console.log('maxCaps:', maxCaps)

          const opts = { gasPrice: generalStore.gasPrice }
          const method = crowdsaleContract.methods.setEarlyParticipantWhitelistMultiple(addrs, statuses, minCaps, maxCaps)

          return method.estimateGas(opts)
            .then(estimatedGas => {
              opts.gasLimit = calculateGasLimit(estimatedGas)
              return sendTXToContract(method.send(opts))
            })
        })
        .then(() => deploymentStore.setAsSuccessful('whitelist'))
    }

  })
}

export const setReservedTokensListMultiple = () => {
  return [() => {
    const abi = contractStore.token.abi.slice()
    const addr = contractStore.token.addr

    console.log('###setReservedTokensListMultiple:###')

    return attachToContract(abi, addr)
      .then(tokenContract => {
        console.log('attach to token contract')

        if (!tokenContract) {
          noContractAlert()
          return Promise.reject('no contract available')
        }

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
        const method = tokenContract.methods
          .setReservedTokensListMultiple(addrs, inTokens, inPercentageUnit, inPercentageDecimals)

        return method.estimateGas(opts)
          .then(estimatedGas => {
            opts.gasLimit = calculateGasLimit(estimatedGas)
            return sendTXToContract(method.send(opts))
          })
      })
      .then(() => deploymentStore.setAsSuccessful('setReservedTokens'))
  }]
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
      .then((networkId) => {
        let networkName = getNetWorkNameById(networkId)

        if (!networkName) {
          networkName = String(networkId)
        }

        return networkName
      })
      .then((networkName) => `${DOWNLOAD_NAME}_${networkName}_${tokenAddress}`)

    resolve(whenNetworkName)
  })
}
