import sweetAlert from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

export function noMetaMaskAlert() {
    sweetAlert({
      title: "Warning",
      text: "Download <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ru'>MetaMask</a> or <a href='https://chrome.google.com/webstore/detail/oracles/jbdaocneiiinmjbjlgalhcelgbejmnid?hl=ru'>Oracles</a> Google Chrome plugins and setup your account.",
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

export function successfulInvestmentAlert(tokensToInvest) {
    sweetAlert({
        title: "Success",
        text: "Congrats! You are successfully buy " + tokensToInvest + " tokens!",
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

export function incorrectNetworkAlert(correctNetworkName, incorrectNetworkName) {
    sweetAlert({
      title: "Warning",
      text: "Crowdsale contract is from <b>" + correctNetworkName + " network</b>. But you are connected to <b>" + incorrectNetworkName + " network</b>. Please, change connection in MetaMask/Oracles plugin.",
      html: true,
      type: "warning"
    });
}