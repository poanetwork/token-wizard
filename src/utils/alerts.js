import sweetAlert2 from 'sweetalert2'
import { DEPLOYMENT_VALUES, LIMIT_RESERVED_ADDRESSES, LIMIT_WHITELISTED_ADDRESSES } from './constants'

export const noMetaMaskAlert = cb => {
  sweetAlert2({
    title: 'Warning',
    html:
      "You don't have  <a href='https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid'>" +
      "a Wallet </a> installed. Check Token Wizard GitHub for <a href='https://github.com/poanetwork/token-wizard' target='blank'>the instruction</a>.",
    type: 'warning'
  }).then(cb)
}

export const MetaMaskIsLockedAlert = cb => {
  sweetAlert2({
    title: 'Warning',
    html: 'You signed out from your Wallet. Open your Wallet extension and sign in.',
    type: 'warning'
  }).then(cb)
}

export const noContractDataAlert = () => {
  sweetAlert2({
    title: 'Warning',
    html: 'The crowdsale data is empty. There is nothing to deploy. Please, start Token Wizard from the beginning.',
    type: 'warning'
  })
}

export const noContractAlert = () => {
  sweetAlert2({
    title: 'Warning',
    html: 'There is no contract at this address',
    type: 'warning'
  })
}

export const invalidCrowdsaleExecIDAlert = () => {
  sweetAlert2({
    title: 'Warning',
    html: 'Invalid crowdsale exec-id is indicated in config and/or in query string.',
    type: 'warning'
  })
}

export const invalidCrowdsaleExecIDProxyAlert = () => {
  sweetAlert2({
    title: 'Warning',
    html: 'Invalid crowdsale exec-id or proxy address indicated in config and/or in query string.',
    type: 'warning'
  })
}

export const invalidCrowdsaleProxyAlert = () => {
  sweetAlert2({
    title: 'Warning',
    html: 'Invalid crowdsale proxy address is indicated in config and/or in query string.',
    type: 'warning'
  })
}

export const invalidCrowdsaleAddrAlert = () => {
  sweetAlert2({
    title: 'Warning',
    html: 'Invalid crowdsale address is indicated in config and/or in query string.',
    type: 'warning'
  })
}

export const invalidNetworkIDAlert = () => {
  sweetAlert2({
    title: 'Warning',
    html: 'Invalid network ID is indicated in config and/or in query string.',
    type: 'warning'
  })
}

export const successfulContributionAlert = tokensToContribute => {
  sweetAlert2({
    title: 'Success',
    html: "Congrats! You've successfully bought " + tokensToContribute + ' tokens!',
    type: 'success'
  }).then(result => {
    if (result.value) {
      window.location.reload()
    }
  })
}

export const contributionDisabledAlertInTime = startTime => {
  sweetAlert2({
    title: 'Warning',
    html: "Wait, please. Crowdsale company hasn't started yet. It'll start from <b>" + new Date(startTime) + '</b>.',
    type: 'warning'
  })
}

export const incorrectNetworkAlert = (correctNetworkName, incorrectNetworkName) => {
  sweetAlert2({
    title: 'Warning',
    html:
      'Crowdsale is from <b>' +
      correctNetworkName +
      ' network</b>. But you are connected to <b>' +
      incorrectNetworkName +
      ' network</b>. Please, change connection in your Wallet extension.',
    type: 'warning'
  })
}

export const warningOnMainnetAlert = (tiersCount, priceSelected, reservedCount, whitelistCount, cb) => {
  const { GAS_REQUIRED, TX_REQUIRED } = DEPLOYMENT_VALUES

  let gasRequired =
    GAS_REQUIRED.DEFAULT + GAS_REQUIRED.WHITELIST * whitelistCount + GAS_REQUIRED.RESERVED_TOKEN * reservedCount

  let txRequired = TX_REQUIRED.DEFAULT
  if (whitelistCount) txRequired += TX_REQUIRED.WHITELIST
  if (reservedCount) txRequired += TX_REQUIRED.RESERVED_TOKEN

  const weiToGwei = x => x / 1000000000
  const n = 100 //fraction to round
  const deployCostInEth = weiToGwei(gasRequired * weiToGwei(priceSelected))
  const estimatedCost = (1.0 / n) * Math.ceil(n * tiersCount * deployCostInEth)
  const estimatedTxsCount = tiersCount * txRequired

  sweetAlert2({
    title: 'Warning',
    html: `You are about to sign ${estimatedTxsCount} TXs. You will see an individual Wallet windows for each of it.
     Please don't open two or more instances of Wizard in one browser. Token Wizard will create ${tiersCount}-tier(s)
     crowdsale for you. The total cost will be around ${estimatedCost.toFixed(2)} ETH. Are you sure you want to
     proceed?`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, I am sure!',
    cancelButtonText: 'No, cancel it!'
  }).then(result => {
    if (result.value) {
      cb()
    }
  })
}

export const warningOnFinalizeCrowdsale = () => {
  return sweetAlert2({
    title: 'Finalize Crowdsale',
    html:
      "Are you sure to finalize the crowdsale? After finalization, it's not possible to buy tokens, all tokens will be movable, reserved tokens will be issued. Press <strong>Yes</strong> to finalize, and <strong>NO</strong> to close this dialog.",
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'NO',
    confirmButtonText: 'Yes',
    reverseButtons: true
  })
}

export const successfulFinalizeAlert = () => {
  return sweetAlert2({
    title: 'Success',
    html: "Congrats! You've successfully finalized the Crowdsale!",
    type: 'success'
  })
}

export const successfulDistributeAlert = () => {
  sweetAlert2({
    title: 'Success',
    html: "Congrats! You've successfully distributed reserved tokens!",
    type: 'success'
  })
}

export const noGasPriceAvailable = () => {
  sweetAlert2({
    title: 'No Gas Price Available',
    html: "Token Wizard wasn't able to request current Gas Prices from the blockchain, custom values will be used",
    type: 'warning'
  })
}

export const successfulUpdateCrowdsaleAlert = () => {
  sweetAlert2({
    title: 'Success',
    html: "Congrats! You've successfully updated the Crowdsale!",
    type: 'success'
  }).then(result => {
    if (result.value) {
      window.location.reload()
    }
  })
}

export const successfulDeployment = () => {
  sweetAlert2({
    title: 'Success',
    html: 'Transactions signed successfully!',
    type: 'success'
  })
}

export const mainnetIsOnMaintenance = () => {
  sweetAlert2({
    title: 'Warning',
    html:
      "Token Wizard on Mainnet is down for maintenance. For updates, please check <a href='https://gitter.im/poanetwork/token-wizard'>our gitter</a>",
    type: 'warning'
  })
}

export const notTheOwner = () => {
  sweetAlert2({
    title: 'Not The Owner',
    html: "Current user is not the owner of the Crowdsale, thus you won't be able to modify it",
    type: 'warning'
  })
}

export const cancellingIncompleteDeploy = () => {
  return sweetAlert2({
    title: 'Cancel crowdsale deploy',
    html: 'Are you sure you want to cancel the deployment of the crowdsale? This action cannot be undone.',
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    reverseButtons: true
  })
}

export const skippingTransaction = () => {
  return sweetAlert2({
    title: 'Skip transaction',
    html:
      'Are you sure you want to skip the transaction? This can leave the whole crowdsale in an invalid state, only do this if you are sure of what you are doing.',
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    reverseButtons: true
  })
}

export const clearingReservedTokens = () => {
  return sweetAlert2({
    title: 'Clear all reserved tokens',
    html: 'Are you sure you want to remove all reserved tokens?',
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    reverseButtons: true
  })
}

export const clearingWhitelist = () => {
  return sweetAlert2({
    title: 'Clear all whitelist addresses',
    html: 'Are you sure you want to remove all the whitelist addresses for this tier?',
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    reverseButtons: true
  })
}

export const whitelistImported = count => {
  return sweetAlert2({
    title: 'Addresses imported',
    html: `${count} addresses were added to the whitelist`,
    type: 'info'
  })
}

export const errorDimCSVAlert = dimensions => {
  let message = 'There was an error importing the file.'

  if (dimensions && dimensions.length > 0) {
    const messageHeader = `<div class="text-left">The following dimensions are wrong: </div>`

    let list = '<ul class="text-left">'
    for (let error of dimensions) {
      const { line, dim } = error
      let item = `<li>The line number ${line} has an incorrect dimension: ${dim}</li>`
      list = `${list}${item}`
    }
    list = `${list}</ul>`
    message = `${messageHeader} ${list}`
  }

  return sweetAlert2({
    title: 'Error importing the file',
    html: message,
    type: 'error'
  })
}

export const errorDimValueCSVAlert = dimensionsValues => {
  let message = 'There was an error importing the file.'

  if (dimensionsValues && dimensionsValues.length > 0) {
    const messageHeader = `<div class="text-left">The following value dimensions are wrong: </div>`

    let list = '<ul class="text-left">'
    for (let error of dimensionsValues) {
      const { line, value, validationType } = error
      let item = `<li>The line number ${line} has an incorrect value dimension: ${value}. The field must be ${validationType}.</li>`
      list = `${list}${item}`
    }
    list = `${list}</ul>`
    message = `${messageHeader} ${list}`
  }

  return sweetAlert2({
    title: 'Error importing the file',
    html: message,
    type: 'error'
  })
}

export const errorEmptyCSVAlert = () => {
  return sweetAlert2({
    title: 'Error importing the file',
    html: 'Empty CSV file. Nothing was imported',
    type: 'error'
  })
}

export const errorWhitelistedCSVAlert = errors => {
  let message = 'There was an error importing the file. The file have an erroneous amount of columns'

  if (errors && errors.length > 0) {
    const plural1 = errors.length > 1 ? 'lines' : 'line'
    const plural2 = errors.length > 1 ? 'are' : 'is'
    const messageHeader = `<div class="text-left">The following ${plural1} ${plural2} wrong: </div>`

    let list = `<ul class="text-left"><li>${errors.join(`</li><li>`)}</ul>`
    message = `${messageHeader} ${list}`
  }

  return sweetAlert2({
    title: 'Error importing the file',
    html: message,
    type: 'error'
  })
}

export const errorRowLengthCSVAlert = errors => {
  let message = 'There was an error importing the file. The file have an erroneous amount of columns'

  if (errors && errors.length > 0) {
    const messageHeader = `<div class="text-left">The following lines have an erroneous amount of columns: </div>`

    let list = '<ul class="text-left">'
    for (let error of errors) {
      const { line, columns } = error
      const columnLabel = columns > 1 ? 'columns' : 'column'
      let item = `<li>The line number ${line} have ${columns} ${columnLabel}, must have 3 columns</li>`
      list = `${list}${item}`
    }
    list = `${list}</ul>`
    message = `${messageHeader} ${list}`
  }

  return sweetAlert2({
    title: 'Error importing the file',
    html: message,
    type: 'error'
  })
}

export const errorAddressCSVAlert = address => {
  let message = 'There was an error importing the file.'

  if (address && address.length > 0) {
    const messageHeader = `<div class="text-left">The following address are wrong: </div>`

    let list = '<ul class="text-left">'
    for (let error of address) {
      const { line, address } = error
      let item = `<li>The line number ${line} has an incorrect address: ${address}</li>`
      list = `${list}${item}`
    }
    list = `${list}</ul>`
    message = `${messageHeader} ${list}`
  }

  return sweetAlert2({
    title: 'Error importing the file',
    html: message,
    type: 'error'
  })
}

export const reservedTokensImported = count => {
  return sweetAlert2({
    title: 'Reserved tokens imported',
    html: `Tokens will be reserved for ${count} addresses`,
    type: 'info'
  })
}

export const noMoreTokensAvailable = () => {
  return sweetAlert2({
    title: 'No more tokens available',
    html: `You're not able to buy more tokens. You have bought your maximum allowed or tier has reached its hard cap`,
    type: 'info'
  })
}

export const notAllowedContributor = () => {
  return sweetAlert2({
    title: 'Not allowed',
    html: `You're not allowed to buy tokens during this tier.`,
    type: 'info'
  })
}

export const noMoreReservedSlotAvailable = () => {
  return sweetAlert2({
    title: 'No more reserved tokens available',
    html: `You're not able to reserve more tokens. The maximum allowed is ${LIMIT_RESERVED_ADDRESSES}`,
    type: 'info'
  })
}

export const noMoreReservedSlotAvailableCSV = count => {
  return sweetAlert2({
    title: 'You reach the limit of reserved tokens',
    html: `You're not able to reserve more tokens. Reserved tokens imported Tokens will be reserved for ${count} addresses. The maximum allowed is ${LIMIT_RESERVED_ADDRESSES}`,
    type: 'info'
  })
}

export const noMoreWhitelistedSlotAvailable = () => {
  return sweetAlert2({
    title: 'Maximum limit of addresses reached',
    html: `You're not able to add more addresses to the whitelist. The maximum allowed is ${LIMIT_WHITELISTED_ADDRESSES}`,
    type: 'info'
  })
}

export const noMoreWhitelistedSlotAvailableCSV = count => {
  return sweetAlert2({
    title: 'Maximum limit of addresses reached',
    html: `You're not able to add more addresses to the whitelist. Only ${count} addresses of the file could be added. The maximum allowed is ${LIMIT_WHITELISTED_ADDRESSES}`,
    type: 'info'
  })
}

export const maxCapExceedsSupply = count => {
  return sweetAlert2({
    title: `Max Cap exceeded tier's supply`,
    html: `<strong>${count}</strong> addresses where added. Addresses with <code>maxCap</code> greater than tier's supply where discarded.`,
    type: 'info'
  })
}

export const networkChanged = () => {
  return sweetAlert2({
    title: 'Network changed',
    html: 'The network id was modified, please set up nifty wallet with the network id which you started',
    type: 'warning'
  })
}

export const deployHasEnded = () => {
  return sweetAlert2({
    title: 'Deploy ended',
    html: 'The deploy is finished',
    type: 'info'
  })
}

export const transactionLost = () => {
  return sweetAlert2({
    title: 'Tx Lost',
    html: "Please cancel pending transaction, if there's any, in your wallet (Nifty Wallet or Metamask) and Continue",
    type: 'error',
    confirmButtonText: 'Continue'
  })
}
