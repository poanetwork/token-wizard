import sweetAlert from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

export function noMetaMaskAlert() {
    sweetAlert({
      title: "Warning",
      text: "You don't have Metamask installed. Check ICO Wizard GitHub for <a href='https://github.com/oraclesorg/ico-wizard' target='blank'>the instruction</a>.",
      html: true,
      type: "warning"
    });
}

export function noContractAlert() {
    sweetAlert({
      title: "Warning",
      text: "There is no contract at this address",
      html: true,
      type: "warning"
    });
}

export function invalidCrowdsaleAddrAlert() {
    sweetAlert({
      title: "Warning",
      text: "Invalid crowdsale address is indicated in config and/or in query string.",
      html: true,
      type: "warning"
    });
}

export function invalidNetworkIDAlert() {
    sweetAlert({
      title: "Warning",
      text: "Invalid network ID is indicated in config and/or in query string.",
      html: true,
      type: "warning"
    });
}

export function successfulInvestmentAlert(tokensToInvest) {
    sweetAlert({
        title: "Success",
        text: "Congrats! You've successfully bought " + tokensToInvest + " tokens!",
        html: true,
        type: "success"
    }, function() {
        window.location.reload();
    });
}

export function investmentDisabledAlert(startBlock, curBlock) {
    sweetAlert({
      title: "Warning",
      text: "Wait, please. Crowdsale company hasn't started yet. It'll start from <b>" + startBlock + "</b> block. Current block is <b>" + curBlock + "</b>.",
      html: true,
      type: "warning"
    });
}

export function investmentDisabledAlertInTime(startTime) {
    sweetAlert({
      title: "Warning",
      text: "Wait, please. Crowdsale company hasn't started yet. It'll start from <b>" + new Date(startTime) + "</b>.",
      html: true,
      type: "warning"
    });
}

export function incorrectNetworkAlert(correctNetworkName, incorrectNetworkName) {
    sweetAlert({
      title: "Warning",
      text: "Crowdsale contract is from <b>" + correctNetworkName + " network</b>. But you are connected to <b>" + incorrectNetworkName + " network</b>. Please, change connection in MetaMask/Oracles plugin.",
      html: true,
      type: "warning"
    });
}