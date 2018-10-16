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
const headerFrame = '*****************************'
const newLine = '\n'

export default function downloadCrowdsaleInfo(stores) {
  const { crowdsaleStore, contractStore } = stores
  const { isMintedCappedCrowdsale } = crowdsaleStore
  const { crowdsale } = contractStore
  const zip = new JSZip()
  const fileContents = summaryFileContents(crowdsale.networkID, stores)
  const { common, auth_os, tiers } = fileContents
  const orderNumber = order => order.toString().padStart(3, '0')

  const authOSContent = auth_os.content
    .filter(content => content)
    .map(content => handleContentByParent({ content, stores }))
  zip.file(`Auth-os_addresses.txt`, authOSContent.join(newLine))

  const commonContent = common.content
    .filter(content => content)
    .map(content => handleContentByParent({ content, stores }))
  zip.file(`${common.name}_data.txt`, commonContent.join(newLine))

  if (isMintedCappedCrowdsale) {
    tiers.content.forEach((tier, index) => {
      const txtFilename = `${orderNumber(index + 1)}_tier.txt`
      zip.file(
        txtFilename,
        tier
          .filter(content => content)
          .map(content => handleContentByParent({ content, index, stores }))
          .join(newLine)
      )
    })
  }

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
  const hasWhitelist = tierStore.tiers.some(tier => tier.whitelistEnabled === 'yes')
  const hasReservedTokens = reservedTokenStore.tokens.length
  const { isDutchAuction, appName, proxyName } = crowdsaleStore
  const { abiEncoded } = contractStore[proxyName]

  return {
    common: {
      name: appName,
      content: [
        ...bigHeaderElements('TOKEN SETUP'),
        newLine,
        { field: 'name', value: 'Token name: ', parent: 'tokenStore' },
        { field: 'ticker', value: 'Token ticker: ', parent: 'tokenStore' },
        { field: 'decimals', value: 'Token decimals: ', parent: 'tokenStore' },
        tokenSupply(isDutchAuction),
        ...reservedTokensElements(hasReservedTokens),
        newLine,
        ...bigHeaderElements('CROWDSALE SETUP'),
        newLine,
        { field: 'walletAddress', value: 'Multisig wallet address: ', parent: 'tierStore' },
        burn(isDutchAuction),
        ...rates(isDutchAuction),
        minCapEl(isDutchAuction, hasWhitelist),
        { field: 'supply', value: 'Crowdsale hard cap: ', parent: 'crowdsaleStore' },
        { field: 'startTime', value: 'Crowdsale start time: ', parent: 'tierStore' },
        { field: 'endTime', value: 'Crowdsale end time: ', parent: 'crowdsaleStore' },
        crowdsaleIsModifiableEl(isDutchAuction),
        crowdsaleIsWhitelistedEl(isDutchAuction),
        ...crowdsaleWhitelistEl(isDutchAuction, hasWhitelist),
        newLine,
        ...bigHeaderElements('METADATA'),
        newLine,
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
        newLine,
        ...footerElements(),
        newLine
      ]
    },
    // prettier-ignore
    auth_os: {
      content: [
        ...bigHeaderElements('AUTH-OS METADATA'),
        newLine,
        smallHeader('REGISTRY'),
        newLine,
        { value: authOSContractString('abstract storage'), parent: 'none', fileValue: getAddr("ABSTRACT_STORAGE", networkID) },
        { value: authOSContractString('registry idx'), parent: 'none', fileValue: getAddr("REGISTRY_IDX", networkID) },
        { value: authOSContractString('script executor'), parent: 'none', fileValue: getAddr("REGISTRY_EXEC", networkID) },
        { value: authOSContractString('provider'), parent: 'none', fileValue: getAddr("PROVIDER", networkID) },
        newLine,
        smallHeader('CROWDSALE'),
        newLine,
        { value: 'Auth-os application name: ', parent: 'none', fileValue: appName },
        getCrowdsaleID(proxyName),
        ...getCrowdsaleENV(networkID, crowdsaleStore),
        ...getManagers(networkID, crowdsaleStore),
        newLine,
        ...footerElements(),
        newLine
      ]
    },
    tiers: {
      content: tierStore.tiers.map(tier => [
        ...bigHeaderElements('TIER SETUP'),
        newLine,
        { field: 'tier', value: 'Tier name: ', parent: 'tierStore' },
        { field: 'rate', value: 'Tier rate: ', parent: 'tierStore' },
        { field: 'supply', value: 'Tier max cap: ', parent: 'tierStore' },
        tierMinCap(tier.whitelistEnabled === 'yes'),
        { field: 'startTime', value: 'Tier start time: ', parent: 'tierStore' },
        { field: 'endTime', value: 'Tier end time: ', parent: 'tierStore' },
        { field: 'updatable', value: "Tier's duration is modifiable: ", parent: 'tierStore' },
        { field: 'whitelistEnabled', value: 'Tier is whitelisted: ', parent: 'tierStore' },
        ...tierWhitelistElements(tier.whitelistEnabled === 'yes'),
        newLine,
        ...footerElements(),
        newLine
      ])
    }
  }
}

function bigHeaderElements(headerName) {
  headerName = ` ${headerName} `
  return [
    { value: headerFrame, parent: 'none', fileValue: '' },
    { value: centerContent(headerName, headerFrame.length, '*'), parent: 'none', fileValue: '' },
    { value: headerFrame, parent: 'none', fileValue: '' }
  ]
}

function reservedTokensElements(hasReservedTokens) {
  if (!hasReservedTokens) return []
  else
    return [
      newLine,
      ...bigHeaderElements('RESERVED TOKENS'),
      newLine,
      ...reservedTokensHeaderTableElements(),
      { field: 'tokens', value: '', parent: 'reservedTokenStore' }
    ]
}

function reservedTokensHeaderTableElements() {
  // prettier-ignore
  return [
    { value: '┌────────────────────────────────────────────┬─────────────────────────────────────────────────────────┐', parent: 'none', fileValue: '' },
    { value: '│                                            │                                                         │', parent: 'none', fileValue: '' },
    { value: '│                  ADDRESS                   │                          VALUE                          │', parent: 'none', fileValue: '' },
    { value: '│                                            │                                                         │', parent: 'none', fileValue: '' },
    { value: '├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤', parent: 'none', fileValue: '' },
  ]
}

function tokenSupply(isDutchAuction) {
  if (isDutchAuction) {
    return { field: 'supply', value: 'Token total supply: ', parent: 'tokenStore' }
  }
}

function burn(isDutchAuction) {
  if (isDutchAuction) {
    return { field: 'burnExcess', value: 'Burn Excess: ', parent: 'tierStore' }
  }
}

function rates(isDutchAuction) {
  if (!isDutchAuction) return []
  else
    return [
      { field: 'minRate', value: 'Crowdsale min rate: ', parent: 'tierStore' },
      { field: 'maxRate', value: 'Crowdsale max rate: ', parent: 'tierStore' }
    ]
}

function minCapEl(isDutchAuction, hasWhitelist) {
  if (isDutchAuction && !hasWhitelist) {
    return { field: 'minCap', value: 'Crowdsale global min cap: ', parent: 'tierStore' }
  }
}

function crowdsaleIsModifiableEl(isDutchAuction) {
  if (isDutchAuction) {
    return { value: "Crowdsale's duration is modifiable: ", parent: 'none', fileValue: 'no' }
  }
}

function crowdsaleIsWhitelistedEl(isDutchAuction) {
  if (isDutchAuction) {
    return { field: 'whitelistEnabled', value: 'Crowdsale is whitelisted: ', parent: 'tierStore' }
  }
}

function crowdsaleWhitelistEl(isDutchAuction, hasWhitelist) {
  if (!isDutchAuction) return []
  else return tierWhitelistElements(hasWhitelist)
}

function tierWhitelistElements(hasWhitelist) {
  if (!hasWhitelist) return []
  else
    return [
      newLine,
      ...bigHeaderElements('WHITELIST'),
      newLine,
      ...whitelistHeaderTableElements(),
      { field: 'whitelist', value: '', parent: 'tierStore' }
    ]
}

function whitelistHeaderTableElements() {
  // prettier-ignore
  return [
    { value: '┌────────────────────────────────────────────┬────────────────────────────┬────────────────────────────┐', parent: 'none', fileValue: '' },
    { value: '│                                            │                            │                            │', parent: 'none', fileValue: '' },
    { value: '│                  ADDRESS                   │     MIN CAP IN TOKENS      │     MAX CAP IN TOKENS      │', parent: 'none', fileValue: '' },
    { value: '│                                            │                            │                            │', parent: 'none', fileValue: '' },
    { value: '├────────────────────────────────────────────┼────────────────────────────┼────────────────────────────┤', parent: 'none', fileValue: '' },
  ]
}

function tierMinCap(hasWhitelist) {
  if (!hasWhitelist) {
    return { field: 'minCap', value: 'Tier min cap: ', parent: 'tierStore' }
  }
}

function footerElements() {
  return [
    { value: headerFrame, parent: 'none', fileValue: '' },
    { value: headerFrame, parent: 'none', fileValue: '' },
    { value: headerFrame, parent: 'none', fileValue: '' }
  ]
}

function smallHeader(headerName) {
  headerName = ` ${headerName} `
  return { value: `${centerContent(headerName, headerFrame.length, '*')}`, parent: 'none', fileValue: '' }
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

function getManagers(networkID, crowdsaleStore) {
  const { isDutchAuction } = crowdsaleStore

  if (isDutchAuction) return []
  else
    return [
      {
        value: authOSContractString('SaleManager'),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'CROWDSALE_MANAGER', networkID)
      },
      {
        value: authOSContractString('TokenManager'),
        parent: 'none',
        fileValue: getCrowdsaleContractAddr(crowdsaleStore, 'TOKEN_MANAGER', networkID)
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
    return whitelist
      .map((item, index, list) => whitelistTableItem(item, index + 1 === list.length).join(newLine))
      .join(newLine)
  } else if (field === 'tokens' && parent === 'reservedTokenStore') {
    return tokens
      .map((item, index, list) => reservedTokensTableItem(item, index + 1 === list.length).join(newLine))
      .join(newLine)
  } else {
    const isTime = field === 'startTime' || field === 'endTime'
    return `${title}${isTime ? convertDateToUTCTimezoneToDisplay(value) : value}`
  }
}

function whitelistTableItem(whiteListItem, lastItem) {
  const valBoxLen = 28
  const address = centerContent(whiteListItem.addr, ADDR_BOX_LEN)
  const minCap = centerContent(whiteListItem.min, valBoxLen)
  const maxCap = centerContent(whiteListItem.max, valBoxLen)
  const separator = !lastItem
    ? '├────────────────────────────────────────────┼────────────────────────────┼────────────────────────────┤'
    : '└────────────────────────────────────────────┴────────────────────────────┴────────────────────────────┘'
  return [`│${address}│${minCap}│${maxCap}│`, separator]
}

function reservedTokensTableItem(reservedTokensItem, lastItem) {
  const valBoxLen = 57
  const dim = reservedTokensItem.dim === 'percentage' ? '%' : 'tokens'
  const address = centerContent(reservedTokensItem.addr, ADDR_BOX_LEN)
  const value = centerContent(`${reservedTokensItem.val} ${dim}`, valBoxLen)
  const separator = !lastItem
    ? '├────────────────────────────────────────────┼─────────────────────────────────────────────────────────┤'
    : '└────────────────────────────────────────────┴─────────────────────────────────────────────────────────┘'
  return [`|${address}|${value}|`, separator]
}

function centerContent(val, len, fillWith = ' ') {
  val = val.toString()
  if (val.length < len) {
    const spacerLen = len - val.length
    const prefixLen = Math.ceil(spacerLen / 2)
    const suffixLen = Number.isInteger(spacerLen / 2) ? prefixLen : prefixLen - 1
    const prefix = new Array(prefixLen).fill(fillWith).join('')
    const suffix = new Array(suffixLen).fill(fillWith).join('')
    return `${prefix}${val}${suffix}`
  } else {
    return val.substr(len)
  }
}

function handleContractsForFile({ field, value }, index, fields, tier) {
  const contractField = isObservableArray(fields) ? fields : fields[index]

  if (!['src', 'abi', 'addr'].includes(field)) {
    const multipleTiers = isObservableArray(fields) ? ` for ${tier}` : ''
    return `${value}${multipleTiers}:****${newLine * 2}${contractField}`
  } else {
    const content = field !== 'abi' ? ` for ${tier}: ${contractField}` : JSON.stringify(contractField)
    return `${value}${content}`
  }
}
