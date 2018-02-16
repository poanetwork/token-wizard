import sweetAlert2 from 'sweetalert2';
import { weiToGwei } from './utils'
import { DEPLOYMENT_VALUES } from './constants'

export function noMetaMaskAlert() {
  sweetAlert2({
    title: "Warning",
    html: "You don't have Metamask installed. Check Token Wizard GitHub for <a href='https://github.com/poanetwork/token-wizard' target='blank'>the instruction</a>.",
    type: "warning"
  });
}

export function noContractDataAlert() {
  sweetAlert2({
    title: "Warning",
    html: "The crowdsale data is empty. There is nothing to deploy. Please, start Token Wizard from the beginning.",
    type: "warning"
  });
}

export function noContractAlert() {
  sweetAlert2({
    title: "Warning",
    html: "There is no contract at this address",
    type: "warning"
  });
}

export function invalidCrowdsaleAddrAlert() {
  sweetAlert2({
    title: "Warning",
    html: "Invalid crowdsale address is indicated in config and/or in query string.",
    type: "warning"
  });
}

export function invalidNetworkIDAlert() {
  sweetAlert2({
    title: "Warning",
    html: "Invalid network ID is indicated in config and/or in query string.",
    type: "warning"
  });
}

export function successfulInvestmentAlert(tokensToInvest) {
  sweetAlert2({
    title: "Success",
    html: "Congrats! You've successfully bought " + tokensToInvest + " tokens!",
    type: "success"
  }).then(function(result) {
    if (result.value) {
      window.location.reload();
    }
  });
}

export function investmentDisabledAlert(startBlock, curBlock) {
  sweetAlert2({
    title: "Warning",
    html: "Wait, please. Crowdsale company hasn't started yet. It'll start from <b>" + startBlock + "</b> block. Current block is <b>" + curBlock + "</b>.",
    type: "warning"
  });
}

export function investmentDisabledAlertInTime(startTime) {
  sweetAlert2({
    title: "Warning",
    html: "Wait, please. Crowdsale company hasn't started yet. It'll start from <b>" + new Date(startTime) + "</b>.",
    type: "warning"
  });
}

export function incorrectNetworkAlert(correctNetworkName, incorrectNetworkName) {
  sweetAlert2({
    title: "Warning",
    html: "Crowdsale contract is from <b>" + correctNetworkName + " network</b>. But you are connected to <b>" + incorrectNetworkName + " network</b>. Please, change connection in MetaMask plugin.",
    type: "warning"
  });
}

export function noDeploymentOnMainnetAlert() {
  sweetAlert2({
    title: "Warning",
    html: "Wizard is under maintenance on Ethereum Mainnet. Please come back later or use Kovan/Rinkeby/POA. Follow <a href='https://twitter.com/poanetwork'>https://twitter.com/poanetwork</a> for status.",
    type: "warning"
  });
}

export function warningOnMainnetAlert(tiersCount, priceSelected, reservedCount, whitelistCount, cb) {
  const { GAS_REQUIRED, TX_REQUIRED } = DEPLOYMENT_VALUES

  let gasRequired = GAS_REQUIRED.DEFAULT + GAS_REQUIRED.WHITELIST * whitelistCount + GAS_REQUIRED.RESERVED_TOKEN * reservedCount

  let txRequired  = TX_REQUIRED.DEFAULT
  if (whitelistCount) txRequired += TX_REQUIRED.WHITELIST
  if (reservedCount) txRequired += TX_REQUIRED.RESERVED_TOKEN

  const n = 100 //fraction to round
  const deployCostInEth = weiToGwei(gasRequired * weiToGwei(priceSelected))
  const estimatedCost = 1.0 / n * Math.ceil(n * tiersCount * deployCostInEth)
  const estimatedTxsCount = tiersCount * txRequired

  sweetAlert2({
    title: "Warning",
    html: `You are about to sign ${estimatedTxsCount} TXs. You will see an individual Metamask windows for each of it.
     Please don't open two or more instances of Wizard in one browser. Token Wizard will create ${tiersCount}-tier(s)
     crowdsale for you. The total cost will be around ${estimatedCost.toFixed(2)} ETH. Are you sure you want to
     proceed?`,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: 'Yes, I am sure!',
    cancelButtonText: "No, cancel it!",
  }).then(function(result) {
    if (result.value) {
      cb()
    }
  });
}

export function warningOnFinalizeCrowdsale() {
  return sweetAlert2({
    title: "Finalize Crowdsale",
    html: "Are you sure to finalize the crowdsale? After finalization, it's not possible to buy tokens, all tokens will be movable, reserved tokens will be issued. Press <strong>Yes</strong> to finalize, and <strong>NO</strong> to close this dialog.",
    type: "warning",
    showCancelButton: true,
    cancelButtonText: "NO",
    confirmButtonText: "Yes",
    reverseButtons: true
  })
}

export function successfulFinalizeAlert() {
  sweetAlert2({
    title: "Success",
    html: "Congrats! You've successfully finalized the Crowdsale!",
    type: "success"
  })
}

export function successfulDistributeAlert() {
  sweetAlert2({
    title: "Success",
    html: "Congrats! You've successfully distributed reserved tokens!",
    type: "success"
  })
}

export function noGasPriceAvailable() {
  sweetAlert2({
    title: "No Gas Price Available",
    html: "Token Wizard wasn't able to request current Gas Prices from the blockchain, custom values will be used",
    type: "warning"
  })
}

export function successfulUpdateCrowdsaleAlert() {
  sweetAlert2({
    title: "Success",
    html: "Congrats! You've successfully updated the Crowdsale!",
    type: "success"
  }).then(function(result) {
    if (result.value) {
      window.location.reload();
    }
  });
}

export function successfulDeployment() {
  sweetAlert2({
    title: "Success",
    html: "Transactions signed successfully!",
    type: "success"
  })
}

export function mainnetIsOnMaintenance() {
  sweetAlert2({
    title: "Warning",
    html: "Token Wizard on Mainnet is down for maintenance. For updates, please check <a href='https://gitter.im/poanetwork/token-wizard'>our gitter</a>",
    type: "warning"
  });
}


export function notTheOwner() {
  sweetAlert2({
    title: "Not The Owner",
    html: "Current user is not the owner of the Crowdsale, thus you won't be able to modify it",
    type: "warning"
  })
}

export function cancellingIncompleteDeploy() {
  return sweetAlert2({
    title: "Cancel crowdsale deploy",
    html: "Are you sure you want to cancel the deployment of the crowdsale? This action cannot be undone.",
    type: "warning",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes",
    reverseButtons: true
  })
}

export function skippingTransaction() {
  return sweetAlert2({
    title: "Skip transaction",
    html: "Are you sure you want to skip the transaction? This can leave the whole crowdsale in an invalid state, only do this if you are sure of what you are doing.",
    type: "warning",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes",
    reverseButtons: true
  })
}
