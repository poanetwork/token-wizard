import JSZip from 'jszip'
import { getOptimizationFlagByStore, getVersionFlagByStore } from '../components/stepFour/utils'
import {
  ADDR_BOX_LEN,
  DOWNLOAD_NAME,
  DOWNLOAD_TYPE,
  DUTCH_PREFIX,
  MINTED_PREFIX
} from '../components/stepFour/constants'
import logdown from 'logdown'
import { convertDateToUTCTimezoneToDisplay, getContractBySourceType } from './utils'
import { isObservableArray } from 'mobx'
import { REACT_PREFIX } from './constants'
import { getNetWorkNameById } from './blockchainHelpers'

const logger = logdown('TW:downloadCrowdsaleInfo')

export default function downloadCrowdsaleInfo(stores) {
  const { crowdsaleStore, contractStore, tierStore } = stores
  const { isMintedCappedCrowdsale } = crowdsaleStore
  const { crowdsale } = contractStore
  const { tiers } = tierStore
  const zip = new JSZip()
  const fileContents = summaryFileContents(crowdsale.networkID, stores)
  const { files, auth_os, common } = fileContents
  const orderNumber = order => order.toString().padStart(3, '0')

  files.order.forEach(key => {
    if (contractStore.hasOwnProperty(key)) {
      const { txt, name } = files[key]
      const authOSHeader = auth_os.map(content => handleContentByParent({ content, stores }))
      const commonHeader = common.map(content => handleContentByParent({ content, stores }))

      zip.file(`Auth-os_addresses.txt`, authOSHeader.join('\n'))
      zip.file(`${name}_data.txt`, commonHeader.join('\n'))

      if (isMintedCappedCrowdsale) {
        for (let tierNumber = 0; tierNumber < tiers.length; tierNumber++) {
          const txtFilename = `${orderNumber(tierNumber + 1)}_tier.txt`

          zip.file(
            txtFilename,
            txt.map(content => handleContentByParent({ content, index: tierNumber, stores })).join('\n')
          )
        }
      }
    }
  })

  const fileName = isMintedCappedCrowdsale ? 'MintedCappedProxy.sol' : 'DutchProxy.sol'
  zip.file(fileName, getContractBySourceType('src', isMintedCappedCrowdsale, contractStore))

  zip.generateAsync({ type: DOWNLOAD_TYPE.blob }).then(zip => {
    download({ zip, filename: getDownloadName(stores) })
  })
}

function getDownloadName(stores) {
  const { contractStore, crowdsaleStore } = stores
  const { networkID, execID } = contractStore.crowdsale
  const crowdsalePointer = execID || contractStore[crowdsaleStore.proxyName].addr
  let networkName = getNetWorkNameById(networkID)

  if (!networkName) {
    networkName = String(networkID)
  }

  return `${DOWNLOAD_NAME}_${networkName}_${crowdsalePointer}`
}

function download({ data = {}, filename = '', type = '', zip = '' }) {
  const file = !zip ? new Blob([data], { type: type }) : zip

  if (window.navigator.msSaveOrOpenBlob) {
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  } else {
    // Others
    let a = document.createElement('a')
    let url = URL.createObjectURL(file)

    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    setTimeout(function() {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

function summaryFileContents(networkID, stores) {
  const { tierStore, reservedTokenStore, contractStore, crowdsaleStore } = stores
  const hasWhitelist = tierStore.tiers.some(tier => tier.whitelistEnabled === 'no')
  const hasReservedTokens = reservedTokenStore.tokens.length
  const { isDutchAuction, appName, strategy, proxyName } = crowdsaleStore
  const { abiEncoded } = contractStore[proxyName]

  return {
    common: [
      ...bigHeaderElements('*********TOKEN SETUP*********'),
      { field: 'name', value: 'Token name: ', parent: 'tokenStore' },
      { field: 'ticker', value: 'Token ticker: ', parent: 'tokenStore' },
      { field: 'decimals', value: 'Token decimals: ', parent: 'tokenStore' },
      { field: 'supply', value: 'Token total supply: ', parent: 'tokenStore' },
      ...reservedTokensElements(hasReservedTokens),
      '\n',
      ...bigHeaderElements('*******CROWDSALE SETUP*******'),
      { field: 'walletAddress', value: 'Multisig wallet address: ', parent: 'tierStore' },
      ...burn(isDutchAuction),
      ...rates(isDutchAuction),
      ...minCapEl(hasWhitelist),
      { field: 'supply', value: 'Crowdsale hard cap: ', parent: 'crowdsaleStore' },
      { field: 'startTime', value: 'Crowdsale start time: ', parent: 'tierStore' },
      { field: 'endTime', value: 'Crowdsale end time: ', parent: 'crowdsaleStore' },
      ...crowdsaleIsModifiableEl(isDutchAuction),
      ...crowdsaleIsWhitelistedEl(isDutchAuction),
      ...crowdsaleWhitelistEl(isDutchAuction, hasWhitelist),
      '\n',
      ...bigHeaderElements('**********METADATA***********'),
      { field: 'proxyName', value: 'Contract name: ', parent: 'crowdsaleStore' },
      {
        value: 'Compiler version: ',
        parent: 'none',
        fileValue: getVersionFlagByStore(crowdsaleStore)
      },
      {
        value: 'Optimized: ',
        parent: 'none',
        fileValue: getOptimizationFlagByStore(crowdsaleStore)
      },
      { value: 'Encoded ABI parameters: ', parent: 'none', fileValue: abiEncoded },
      ...footerElements()
    ],
    // prettier-ignore
    auth_os: [
      ...bigHeaderElements('*******AUTH-OS METADATA******'),
      smallHeader('**********REGISTRY***********'),
      { value: authOSContractString('abstract storage'), parent: 'none', fileValue: getAddr("ABSTRACT_STORAGE", networkID) },
      { value: authOSContractString('registry idx'), parent: 'none', fileValue: getAddr("REGISTRY_IDX", networkID) },
      { value: authOSContractString('script executor'), parent: 'none', fileValue: getAddr("REGISTRY_EXEC", networkID) },
      { value: authOSContractString('provider'), parent: 'none', fileValue: getAddr("PROVIDER", networkID) },
      smallHeader('*********CROWDSALE***********'),
      { value: 'Auth-os application name: ', parent: 'none', fileValue: appName },
      getCrowdsaleID(proxyName),
      ...getCrowdsaleENV(networkID, crowdsaleStore),
      ...getManagers(networkID, strategy, isDutchAuction),
      ...footerElements()
    ],
    files: {
      order: ['crowdsale'],
      crowdsale: {
        name: crowdsaleStore.appName,
        txt: [
          ...bigHeaderElements('*********TIER SETUP**********'),
          { field: 'tier', value: 'Tier name: ', parent: 'tierStore' },
          { field: 'rate', value: 'Tier rate: ', parent: 'tierStore' },
          { field: 'supply', value: 'Tier max cap: ', parent: 'tierStore' },
          { field: 'startTime', value: 'Tier start time: ', parent: 'tierStore' },
          { field: 'endTime', value: 'Tier end time: ', parent: 'tierStore' },
          { field: 'updatable', value: "Tier's duration is modifiable: ", parent: 'tierStore' },
          { field: 'whitelistEnabled', value: 'Tier is whitelisted: ', parent: 'tierStore' },
          ...tierWhitelistElements(hasWhitelist),
          ...footerElements()
        ]
      }
    }
  }
}

function bigHeaderElements(headerName) {
  return [
    { value: '*****************************', parent: 'none', fileValue: '' },
    { value: headerName, parent: 'none', fileValue: '' },
    { value: '*****************************', parent: 'none', fileValue: '\n' }
  ]
}

function reservedTokensElements(hasReservedTokens) {
  if (!hasReservedTokens) return []
  else
    return [
      '\n',
      ...bigHeaderElements('******RESERVED TOKENS********'),
      ...reservedTokensHeaderTableElements(),
      { field: 'tokens', value: '', parent: 'reservedTokenStore' }
    ]
}

function reservedTokensHeaderTableElements() {
  // prettier-ignore
  return [
    { value: '_______________________________________________________________________________________________________', parent: 'none', fileValue: '' },
    { value: '|                                            |                                                        |', parent: 'none', fileValue: '' },
    { value: '|                ADDRESS                     |                        VALUE                           |', parent: 'none', fileValue: '' },
    { value: '|____________________________________________|________________________________________________________|', parent: 'none', fileValue: '' },
  ]
}

function burn(isDutchAuction) {
  if (!isDutchAuction) return []
  else return [{ field: 'burnExcess', value: 'Burn Excess: ', parent: 'tierStore' }]
}

function rates(isDutchAuction) {
  if (!isDutchAuction) return []
  else
    return [
      { field: 'minRate', value: 'Crowdsale min rate: ', parent: 'tierStore' },
      { field: 'maxRate', value: 'Crowdsale max rate: ', parent: 'tierStore' }
    ]
}

function minCapEl(hasWhitelist) {
  if (hasWhitelist) return []
  return [{ field: 'minCap', value: 'Crowdsale global min cap: ', parent: 'tierStore' }]
}

function crowdsaleIsModifiableEl(isDutchAuction) {
  if (!isDutchAuction) return []
  else return [{ value: "Crowdsale's duration is modifiable: ", parent: 'none', fileValue: 'no' }]
}

function crowdsaleIsWhitelistedEl(isDutchAuction) {
  if (!isDutchAuction) return []
  else return [{ field: 'whitelistEnabled', value: 'Crowdsale is whitelisted: ', parent: 'tierStore' }]
}

function crowdsaleWhitelistEl(isDutchAuction, hasWhitelist) {
  if (!isDutchAuction) return []
  else return tierWhitelistElements(hasWhitelist)
}

function tierWhitelistElements(hasWhitelist) {
  if (!hasWhitelist) return []
  else
    return [
      '\n',
      ...bigHeaderElements('*********WHITELIST***********'),
      ...whitelistHeaderTableElements(),
      { field: 'whitelist', value: '', parent: 'tierStore' }
    ]
}

function whitelistHeaderTableElements() {
  // prettier-ignore
  return [
    { value: '________________________________________________________________________________________________________', parent: 'none', fileValue: '' },
    { value: '|                                            |                            |                            |', parent: 'none', fileValue: '' },
    { value: '|                ADDRESS                     |     MIN CAP IN TOKENS      |     MAX CAP IN TOKENS      |', parent: 'none', fileValue: '' },
    { value: '|____________________________________________|____________________________|____________________________|', parent: 'none', fileValue: '' },
  ]
}

function footerElements() {
  return [
    { value: '\n*****************************', parent: 'none', fileValue: '' },
    { value: '*****************************', parent: 'none', fileValue: '' },
    { value: '*****************************', parent: 'none', fileValue: '\n' }
  ]
}

function smallHeader(headerName) {
  return { value: headerName, parent: 'none', fileValue: '\n' }
}

function authOSContractString(contract) {
  return `Auth-os ${contract} address: `
}

function getAddr(contractName, networkID) {
  return JSON.parse(process.env[`${REACT_PREFIX}${contractName}_ADDRESS`] || '{}')[networkID]
}

function getCrowdsaleID(proxyName) {
  return { field: 'addr', value: authOSContractString('Crowdsale proxy'), parent: proxyName }
}

function getCrowdsaleENV(networkID, crowdsaleStore) {
  const { isDutchAuction, isMintedCappedCrowdsale } = crowdsaleStore
  const labelIdx = isDutchAuction ? 'DutchIdx' : 'MintedCappedIdx'
  const labelCrowdsale = isDutchAuction ? 'Dutch Crowdsale' : 'Sale'
  const labelToken = isDutchAuction ? 'Dutch Token' : 'Token'
  // Dutch strategy has no managers smart-contracts
  const labelSaleManager = 'Sale manager'
  const labelTokenManager = 'Token manager'

  if (isMintedCappedCrowdsale) {
    return [
      {
        value: authOSContractString(labelIdx),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'IDX', networkID)
      },
      {
        value: authOSContractString(labelCrowdsale),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'CROWDSALE', networkID)
      },
      {
        value: authOSContractString(labelToken),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'TOKEN', networkID)
      },
      {
        value: authOSContractString(labelSaleManager),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'CROWDSALE_MANAGER', networkID)
      },
      {
        value: authOSContractString(labelTokenManager),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'TOKEN_MANAGER', networkID)
      }
    ]
  } else if (isDutchAuction) {
    return [
      {
        value: authOSContractString(labelIdx),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'IDX', networkID)
      },
      {
        value: authOSContractString(labelCrowdsale),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'CROWDSALE', networkID)
      },
      {
        value: authOSContractString(labelToken),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'TOKEN', networkID)
      }
    ]
  } else {
    return []
  }
}

function getCrowdsaleContractAddr({ isDutchAuction, isMintedCappedCrowdsale }, contractName, networkID) {
  const prefix = isDutchAuction ? DUTCH_PREFIX : isMintedCappedCrowdsale ? MINTED_PREFIX : null
  if (!prefix) return ''
  return JSON.parse(process.env[`${REACT_PREFIX}${prefix}${contractName}_ADDRESS`] || '{}')[networkID]
}

function getManagers(networkID, strategy, isDutchAuction) {
  if (!isDutchAuction) return []
  else
    return [
      {
        value: authOSContractString('SaleManager'),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(strategy, 'CROWDSALE_MANAGER', networkID)
      },
      {
        value: authOSContractString('TokenManager'),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(strategy, 'TOKEN_MANAGER', networkID)
      }
    ]
}

function handleContentByParent({ content, index = 0, stores = {} }) {
  const { parent, child, field, value, fileValue } = content

  switch (parent) {
    case 'crowdsale':
    case 'MintedCappedProxy':
    case 'DutchProxy':
      return handlerForFile(content, stores.contractStore[parent])
    case 'crowdsaleStore':
      return handlerForFile(content, stores[parent])
    case 'tierStore': {
      index = ['minCap', 'walletAddress'].includes(field) ? 0 : index
      logger.log('TierStore index', index)
      return handlerForFile(content, stores[parent].tiers[index])
    }
    case 'tokenStore':
    case 'reservedTokenStore':
      return handlerForFile(content, stores[parent])
    case 'contracts': {
      const fields = stores.contractStore[child][field]
      const tier = stores.tierStore.tiers[index].tier
      return handleContractsForFile(content, index, fields, tier)
    }
    case 'none':
      return `${value}${fileValue}`
    default:
    // do nothing
  }
}

function handlerForFile(content, type) {
  if (!content || !type) {
    if (!content) logger.warn('WARNING!: content is undefined')
    if (!type) logger.warn('WARNING!: type is undefined')
    return ''
  }

  const { field, parent, value: title } = content
  const { whitelist, tokens, [field]: value } = type

  if (field === 'whitelist') {
    return whitelist.map(item => whitelistTableItem(item).join('\n'))
  } else if (field === 'tokens' && parent === 'reservedTokenStore') {
    return tokens.map(item => reservedTokensTableItem(item).join('\n')).join('\n')
  } else {
    const isTime = field === 'startTime' || field === 'endTime'
    return `${title}${isTime ? convertDateToUTCTimezoneToDisplay(value) : value}`
  }
}

function whitelistTableItem(whiteListItem) {
  const valBoxLen = 28
  return [
    '|                                            |                            |                            |',
    `|${fillWithSpaces(whiteListItem.addr, ADDR_BOX_LEN)}|${fillWithSpaces(
      whiteListItem.min,
      valBoxLen
    )}|${fillWithSpaces(whiteListItem.max, valBoxLen)}|`,
    '|____________________________________________|____________________________|____________________________|'
  ]
}

function fillWithSpaces(val, len) {
  val = val.toString()
  if (val.length < len) {
    const whitespaceLen = len - val.length
    const prefixLen = Math.ceil(whitespaceLen / 2)
    const suffixLen = Number.isInteger(whitespaceLen / 2) ? prefixLen : prefixLen - 1
    const prefix = new Array(prefixLen).fill(' ').join('')
    const suffix = new Array(suffixLen).fill(' ').join('')
    return `${prefix}${val}${suffix}`
  } else {
    return val.toString().substr(len)
  }
}

function reservedTokensTableItem(reservedTokensItem) {
  const valBoxLen = 56
  const dim = reservedTokensItem.dim === 'percentage' ? '%' : 'tokens'
  return [
    '|                                            |                                                        |',
    `|${fillWithSpaces(reservedTokensItem.addr, ADDR_BOX_LEN)}|${fillWithSpaces(
      `${reservedTokensItem.val} ${dim}`,
      valBoxLen
    )}|`,
    '|____________________________________________|________________________________________________________|'
  ]
}

function handleContractsForFile({ field, value }, index, fields, tier) {
  const contractField = isObservableArray(fields) ? fields : fields[index]

  if (!['src', 'abi', 'addr'].includes(field)) {
    const multipleTiers = isObservableArray(fields) ? ` for ${tier}` : ''
    return `${value}${multipleTiers}:****${'\n\n'}${contractField}`
  } else {
    const content = field !== 'abi' ? ` for ${tier}: ${contractField}` : JSON.stringify(contractField)
    return `${value}${content}`
  }
}
