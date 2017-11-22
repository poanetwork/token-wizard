import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { checkTxMined, checkNetWorkByID, sendTXToContract } from '../../utils/blockchainHelpers'
import { getCrowdsaleData, getCurrentRate, initializeAccumulativeData, getAccumulativeCrowdsaleData, getCrowdsaleTargetDates, findCurrentContractRecursively, getJoinedTiers, getContractStoreProperty } from '../crowdsale/utils'
import { getQueryVariable, getURLParam, getWhiteListWithCapCrowdsaleAssets, toast } from '../../utils/utils'
import { noMetaMaskAlert, investmentDisabledAlertInTime, successfulInvestmentAlert, invalidCrowdsaleAddrAlert } from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { ICOConfig } from '../Common/config'
import { CONTRACT_TYPES, TOAST, GAS_PRICE, INVESTMENT_OPTIONS } from '../../utils/constants'
import { observer, inject } from 'mobx-react'
import QRPaymentProcess from './QRPaymentProcess'

@inject('contractStore', 'crowdsalePageStore', 'web3Store', 'tierStore', 'tokenStore', 'generalStore', 'investStore')
@observer export class Invest extends React.Component {
  constructor(props) {
      super(props);
      window.scrollTo(0, 0);
      if (this.tokensToInvestOnChange.bind) this.tokensToInvestOnChange = this.tokensToInvestOnChange.bind(this);
      if (this.investToTokens.bind) this.investToTokens = this.investToTokens.bind(this);
      var state = {};
      state.seconds = 0;
      state.loading = true;
      state.pristineTokenInput = true;
      state.web3Available = false;
      state.investThrough = INVESTMENT_OPTIONS.QR
      state.crowdsaleAddress = ICOConfig.crowdsaleContractURL || getURLParam("addr")
      this.state = state;
  }

  componentDidMount () {
    const { web3Store, contractStore } = this.props
    const web3 = web3Store.web3

    if (!web3) {
      this.setState({
        loading: false
      });
      return
    };

    const networkID = ICOConfig.networkID?ICOConfig.networkID:getQueryVariable("networkID");
    const contractType = CONTRACT_TYPES.whitelistwithcap;
    checkNetWorkByID(web3, networkID);
    contractStore.setContractType(contractType);

    const timeInterval = setInterval(() => this.setState({ seconds: this.state.seconds - 1}), 1000);
    this.setState({
      timeInterval,
      web3Available: true,
      investThrough: INVESTMENT_OPTIONS.METAMASK
    });

    getWhiteListWithCapCrowdsaleAssets((_newState) => {
      this.setState(_newState);
      this.extractContractsData(web3);
    });
  }

  extractContractsData(web3) {
    const { contractStore, crowdsalePageStore } = this.props
    let state = { ...this.state };

    const crowdsaleAddr = ICOConfig.crowdsaleContractURL?ICOConfig.crowdsaleContractURL:getURLParam("addr");
    if (!web3.utils.isAddress(crowdsaleAddr)) {
      state.loading = false;
      this.setState(state);
      return invalidCrowdsaleAddrAlert();
    }
    getJoinedTiers(web3, contractStore.crowdsale.abi, crowdsaleAddr, [], (joinedCrowdsales) => {
      console.log("joinedCrowdsales: ");
      console.log(joinedCrowdsales);

      let _crowdsaleAddrs;
      if ( typeof joinedCrowdsales === 'string' ) {
          _crowdsaleAddrs = [ joinedCrowdsales ];
      } else {
        _crowdsaleAddrs = joinedCrowdsales;
      }
      contractStore.setContractProperty('crowdsale', 'addr', _crowdsaleAddrs)

      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length === 0) {
          let state = this.state;
          state.loading = false;
          this.setState(state);
          return
        };

        state.curAddr = accounts[0];
        state.web3 = web3;
        this.setState(state);

        if (!contractStore.crowdsale.addr) {
          let state = this.state;
          state.loading = false;
          this.setState(state);
          return
        };
        findCurrentContractRecursively(0, this, web3, null, (crowdsaleContract) => {
          if (!crowdsaleContract) {
            state.loading = false;
            return this.setState(state);
          }
          getCrowdsaleData(web3, this, crowdsaleContract, () => {
            initializeAccumulativeData(() => {
              getAccumulativeCrowdsaleData(web3, this, () => {
              });
            });
          });
          getCrowdsaleTargetDates(web3, this, () => {
            if (crowdsalePageStore.endDate) {
              let state = this.state;
              state.seconds = (crowdsalePageStore.endDate - new Date().getTime())/1000;
              this.setState(state);
            }
          })
        })
      });
    });
  }

  investToTokens(event) {
    const { investStore } = this.props
    event.preventDefault();

    if (!this.isValidToken(investStore.tokensToInvest)) {
      this.setState({ pristineTokenInput: false });
      return;
    }

    const { crowdsalePageStore, web3Store } = this.props
    const web3 = web3Store.web3
    let state = { ...this.state };
    state.loading = true;
    this.setState(state);

    let startBlock = parseInt(crowdsalePageStore.startBlock, 10);
    let startDate = crowdsalePageStore.startDate;
    if ((isNaN(startBlock) || startBlock === 0) && !startDate) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return;
    }

    if (web3.eth.accounts.length === 0) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return noMetaMaskAlert();
    }

    this.investToTokensForWhitelistedCrowdsale(web3, web3.eth.accounts)
  }

  investToTokensForWhitelistedCrowdsale(web3) {
    const { crowdsalePageStore } = this.props

    if (crowdsalePageStore.startDate > (new Date()).getTime()) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return investmentDisabledAlertInTime(crowdsalePageStore.startDate);
    }

    findCurrentContractRecursively(0, this, web3, null, (crowdsaleContract, tierNum) => {
      if (!crowdsaleContract) {
        let state = this;
        state.loading = false;
        return this.setState(state);
      }
      console.log(web3)
      getCurrentRate(web3, this, crowdsaleContract, () => {
        console.log(web3)
        this.investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3, web3.eth.accounts);
      });
    })
  }

  investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3, accounts) {
    const { contractStore, tokenStore, crowdsalePageStore, investStore } = this.props

    let nextTiers = [];
    for (let i = tierNum + 1; i < contractStore.crowdsale.addr.length; i++) {
      nextTiers.push(contractStore.crowdsale.addr[i]);
    }
    console.log("nextTiers: " + nextTiers);
    console.log(nextTiers.length);

    let decimals = parseInt(tokenStore.decimals, 10);
    console.log("decimals: " + decimals);
    let rate = parseInt(crowdsalePageStore.rate, 10); //it is from contract. It is already in wei. How much 1 token costs in wei.
    console.log("rate: " + rate);
    let tokensToInvest = parseFloat(investStore.tokensToInvest);
    console.log("tokensToInvest: " + tokensToInvest);

    let weiToSend = parseInt(tokensToInvest*rate, 10);
    console.log("weiToSend: " + weiToSend);

    let opts = {
      from: accounts[0],
      value: weiToSend,
      gasPrice: GAS_PRICE
    };
    console.log(opts);

    sendTXToContract(web3, crowdsaleContract.methods.buy().send(opts), err => {
      this.setState({ loading: false });

      if (!err) {
        successfulInvestmentAlert(investStore.tokensToInvest)
      } else {
        toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
      }
    });
  }

  txMinedCallback(web3, txHash, receipt) {
    const { investStore } = this.props
    console.log(web3);
    if (receipt) {
      if (receipt.blockNumber) {
        let state = this.state;
        state.loading = false;
        this.setState(state);
        successfulInvestmentAlert(investStore.tokensToInvest);
      }
    } else {
      console.log(web3)
      setTimeout(() => {
        checkTxMined(web3, txHash, (receipt) => this.txMinedCallback(web3, txHash, receipt))
      }, 500);
    }
  }

  tokensToInvestOnChange(event) {
    this.setState({ pristineTokenInput: false });
    this.props.investStore.setProperty('tokensToInvest', event.target.value)
  }

  isValidToken(token) {
    return +token > 0;
  }

  renderPieTracker () {
    return <div style={{marginLeft: '-20px', marginTop: '-20px'}}>
      <ReactCountdownClock
        seconds={this.state.seconds}
        color="#733EAB"
        alpha={0.9}
        size={270}
        />
    </div>
  }

  shouldStopCountDown () {
    const { seconds } = this.state
    if(seconds < 0) {
      var state = this.state;
      state.seconds = 0;
      this.setState(state);
      clearInterval(this.state.timeInterval)
    }
  }

  getTimeStamps (seconds) {
    this.shouldStopCountDown()
    var days        = Math.floor(seconds/24/60/60);
    var hoursLeft   = Math.floor((seconds) - (days*86400));
    var hours       = Math.floor(hoursLeft/3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
    var minutes     = Math.floor(minutesLeft/60);
    return { days, hours, minutes}
  }

  render(state){
    const { crowdsalePageStore, tokenStore, contractStore, investStore } = this.props

    const { seconds } = this.state
    const { days, hours, minutes } = this.getTimeStamps(seconds)

    const tokenDecimals = !isNaN(tokenStore.decimals)?tokenStore.decimals:0;
    const tokenTicker = tokenStore.ticker?tokenStore.ticker.toString():"";
    const tokenName = tokenStore.name?tokenStore.name.toString():"";
    const rate = crowdsalePageStore.rate;
    const maxCapBeforeDecimals = crowdsalePageStore.maximumSellableTokens/10**tokenDecimals;
    const tokenAmountOf = crowdsalePageStore.tokenAmountOf;
    const ethRaised = crowdsalePageStore.ethRaised;
    const tokenAddress = getContractStoreProperty('token', 'addr')
    const crowdsaleAddress = getContractStoreProperty('crowdsale', 'addr') && getContractStoreProperty('crowdsale', 'addr')[0]

    //balance: tiers, standard
    const investorBalanceTiers = (tokenAmountOf?((tokenAmountOf/10**tokenDecimals)).toString():"0");
    const investorBalanceStandard = (ethRaised?(ethRaised/rate).toString():"0");
    const investorBalance = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?investorBalanceTiers:investorBalanceStandard;

    //total supply: tiers, standard
    const tierCap = !isNaN(maxCapBeforeDecimals)?(maxCapBeforeDecimals).toString():"0";
    const standardCrowdsaleSupply = !isNaN(crowdsalePageStore.supply)?(crowdsalePageStore.supply).toString():"0";
    const totalSupply = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?tierCap:standardCrowdsaleSupply;

    let invalidTokenDescription = null;
    if (!this.state.pristineTokenInput && !this.isValidToken(investStore.tokensToInvest)) {
      invalidTokenDescription = <p className="error">Number of tokens to buy should be positive</p>;
    }

    const QRPaymentProcessElement = this.state.investThrough === INVESTMENT_OPTIONS.QR ?
      <QRPaymentProcess crowdsaleAddress={this.state.crowdsaleAddress} /> :
      null;

    return <div className="invest container">
      <div className="invest-table">
        <div className="invest-table-cell invest-table-cell_left">
          <div className="timer-container">
            <div className="timer">
              <div className="timer-inner">
                <div className="timer-i">
                  <div className="timer-count">{days}</div>
                  <div className="timer-interval">Days</div>
                </div>
                <div className="timer-i">
                  <div className="timer-count">{hours}</div>
                  <div className="timer-interval">Hours</div>
                </div>
                <div className="timer-i">
                  <div className="timer-count">{minutes}</div>
                  <div className="timer-interval">Mins</div>
                </div>
              </div>
            </div>
            {this.renderPieTracker()}
          </div>
          <div className="hashes">
            <div className="hashes-i">
              <p className="hashes-title">{tokenAddress}</p>
              <p className="hashes-description">Current Account</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{crowdsaleAddress}</p>
              <p className="hashes-description">Token Address</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{contractStore.crowdsale && contractStore.crowdsale.addr && contractStore.crowdsale.addr[0]}</p>
              <p className="hashes-description">Crowdsale Contract Address</p>
            </div>
            <div className="hashes-i hidden">
              <div className="left">
                <p className="hashes-title">{tokenName}</p>
                <p className="hashes-description">Name</p>
              </div>
              <div className="left">
                <p className="hashes-title">{tokenTicker}</p>
                <p className="hashes-description">Ticker</p>
              </div>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{totalSupply} {tokenTicker}</p>
              <p className="hashes-description">Total Supply</p>
            </div>
          </div>
          <p className="invest-title">Invest page</p>
          <p className="invest-description">
            {"Here you can invest in the crowdsale campaign. At the momemnt, you need Metamask client to invest into the crowdsale. If you don't have Metamask, you can send ethers to the crowdsale address with a MethodID: 0xa6f2ae3a. Sample "}
            <a href="https://kovan.etherscan.io/tx/0x42073576a160206e61b4d9b70b436359b8d220f8b88c7c272c77023513c62c3d">transaction</a>.
          </p>
        </div>
        <div className="invest-table-cell invest-table-cell_right">
          <div className="balance">
            <p className="balance-title">{investorBalance} {tokenTicker}</p>
            <p className="balance-description">Balance</p>
            <p className="description">
              Your balance in tokens.
            </p>
          </div>
          <form className="invest-form" onSubmit={this.investToTokens}>
            <label className="invest-form-label">Choose amount to invest</label>
            <div className="invest-form-input-container">
              <input type="text" className="invest-form-input" value={investStore.tokensToInvest} onChange={this.tokensToInvestOnChange} placeholder="0"/>
              <div className="invest-form-label">TOKENS</div>
              {invalidTokenDescription}
            </div>
            <div className="invest-through-container">
              <select value={this.state.investThrough} className="invest-through" onChange={(e) => this.setState({ investThrough: e.target.value })}>
                <option disabled={!this.state.web3Available} value={INVESTMENT_OPTIONS.METAMASK}>Metamask {!this.state.web3Available ? ' (not available)' : null}</option>
                <option value={INVESTMENT_OPTIONS.QR}>QR</option>
              </select>
              {
                this.state.investThrough === INVESTMENT_OPTIONS.METAMASK
                  ? <a className="button button_fill" onClick={this.investToTokens}>Contribute</a>
                  : null
              }
            </div>
            <p className="description">
              Think twice before investment in ICOs. Tokens will be deposited on a wallet you used to buy tokens.
            </p>
          </form>
          { QRPaymentProcessElement }
        </div>
      </div>
      <Loader show={this.state.loading}></Loader>
    </div>
  }
}
