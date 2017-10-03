import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { getWeb3, checkTxMined, attachToContract, checkNetWorkByID } from '../../utils/blockchainHelpers'
import { getCrowdsaleData, getCurrentRate, initializeAccumulativeData, getAccumulativeCrowdsaleData, getCrowdsaleTargetDates, findCurrentContractRecursively, getJoinedTiers } from '../crowdsale/utils'
import { getQueryVariable, getURLParam, getStandardCrowdsaleAssets, getWhiteListWithCapCrowdsaleAssets } from '../../utils/utils'
import { noMetaMaskAlert, noContractAlert, investmentDisabledAlert, investmentDisabledAlertInTime, successfulInvestmentAlert, invalidCrowdsaleAddrAlert } from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { ICOConfig } from '../Common/config'
import { defaultState } from '../../utils/constants'

export class Invest extends React.Component {
  constructor(props) {
      super(props);
      window.scrollTo(0, 0);
      if (this.tokensToInvestOnChange.bind) this.tokensToInvestOnChange = this.tokensToInvestOnChange.bind(this);
      if (this.investToTokens.bind) this.investToTokens = this.investToTokens.bind(this);
      var state = defaultState;
      state.seconds = 0;
      state.loading = true;
      this.state = state;
  }

  componentDidMount () {
    let newState = { ...this.state }
    setTimeout(() => {
     getWeb3((web3) => {
      if (!web3) {
        let state = this.state;
        state.loading = false;
        this.setState(state);
        return
      };

      const networkID = ICOConfig.networkID?ICOConfig.networkID:getQueryVariable("networkID");
      const contractType = this.state.contractTypes.whitelistwithcap;// getQueryVariable("contractType");
      checkNetWorkByID(web3, networkID);
      newState.contractType = contractType;

      const timeInterval = setInterval(() => this.setState({ seconds: this.state.seconds - 1}), 1000);
      this.setState({ timeInterval });

      switch (contractType) {
        case this.state.contractTypes.standard: {
          getStandardCrowdsaleAssets(newState, (_newState) => {
            this.setState(_newState);
            this.extractContractsData(web3);
          });
        } break;
        case this.state.contractTypes.whitelistwithcap: {
          getWhiteListWithCapCrowdsaleAssets(newState, (_newState) => {
            this.setState(_newState);
            this.extractContractsData(web3);
          });
        } break;
        default:
          break;
      }
    });
   }, 500);
  }

  extractContractsData(web3) {
    let state = this.state;

    const crowdsaleAddr = ICOConfig.crowdsaleContractURL?ICOConfig.crowdsaleContractURL:getURLParam("addr");
    if (!web3.isAddress(crowdsaleAddr)) {
      state.loading = false;
      this.setState(state);
      return invalidCrowdsaleAddrAlert();
    }
    getJoinedTiers(web3, this.state.contracts.crowdsale.abi, crowdsaleAddr, [], (joinedCrowdsales) => {
      console.log("joinedCrowdsales: ");
      console.log(joinedCrowdsales);

      let _crowdsaleAddrs;
      if ( typeof joinedCrowdsales === 'string' ) {
          _crowdsaleAddrs = [ joinedCrowdsales ];
      } else {
        _crowdsaleAddrs = joinedCrowdsales;
      }
      state.contracts.crowdsale.addr = _crowdsaleAddrs;

      if (web3.eth.accounts.length === 0) {
        let state = this.state;
        state.loading = false;
        this.setState(state);
        return
      };

      state.curAddr = web3.eth.accounts[0];
      state.web3 = web3;
      this.setState(state);

      if (!this.state.contracts.crowdsale.addr) {
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
          initializeAccumulativeData(this, () => {
            getAccumulativeCrowdsaleData(web3, this, () => {
            });
          });
        });
        getCrowdsaleTargetDates(web3, this, () => {
          console.log(this.state.crowdsale);
          if (this.state.crowdsale.endDate) {
            let state = this.state;
            state.seconds = (state.crowdsale.endDate - new Date().getTime())/1000;
            this.setState(state);
          }
        })
      })
    });
  }

  investToTokens() {
    let state = this.state;
    state.loading = true;
    this.setState(state);
    let startBlock = parseInt(this.state.crowdsale.startBlock, 10);
    let startDate = this.state.crowdsale.startDate;
    if ((isNaN(startBlock) || startBlock === 0) && !startDate) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return;
    }
    let web3 = this.state.web3;
    if (web3.eth.accounts.length === 0) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return noMetaMaskAlert();
    }

    switch (this.state.contractType) {
      case this.state.contractTypes.standard: {
        web3.eth.getBlockNumber((err, curBlock) => {
          if (err) return console.log(err);
          this.investToTokensForStandardCrowdsale(web3, curBlock)
        });
      } break;
      case this.state.contractTypes.whitelistwithcap: {
        this.investToTokensForWhitelistedCrowdsale(web3)
      } break;
      default:
        break;
    }
  }

  investToTokensForStandardCrowdsale(web3, curBlock) {
    if (parseInt(this.state.crowdsale.startBlock, 10) > parseInt(curBlock, 10)) {
      return investmentDisabledAlert(parseInt(this.state.crowdsale.startBlock, 10), curBlock);
    }

    let weiToSend = web3.toWei(this.state.tokensToInvest/this.state.pricingStrategy.rate, "ether");
    let opts = {
      from: web3.eth.accounts[0],
      value: weiToSend
    };

    attachToContract(web3, this.state.contracts.crowdsale.abi, this.state.contracts.crowdsale.addr[0], (err, crowdsaleContract) => {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();

      console.log(crowdsaleContract);
      console.log(web3.eth.defaultAccount);

      crowdsaleContract.buySampleTokens.sendTransaction(web3.eth.accounts[0], opts, (err, txHash) => {
        if (err) return console.log(err);
        
        console.log("tx hash: " + txHash);
        successfulInvestmentAlert(this.state.tokensToInvest);
      });
    });
  }

  investToTokensForWhitelistedCrowdsale(web3) {
    console.log("startDate: " + this.state.crowdsale.startDate);
    console.log("(new Date()).getTime(): " + (new Date()).getTime());
    if (this.state.crowdsale.startDate > (new Date()).getTime()) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return investmentDisabledAlertInTime(this.state.crowdsale.startDate);
    }

    findCurrentContractRecursively(0, this, web3, null, (crowdsaleContract, tierNum) => {
      if (!crowdsaleContract) {
        let state = this;
        state.loading = false;
        return this.setState(state);
      }
      getCurrentRate(web3, this, crowdsaleContract, () => { 
        this.investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3);
      });
    })
  }

  investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3) {
    let nextTiers = [];
    console.log(this.state.contracts.crowdsale);
    for (let i = tierNum + 1; i < this.state.contracts.crowdsale.addr.length; i++) {
      nextTiers.push(this.state.contracts.crowdsale.addr[i]);
    }
    console.log("nextTiers: " + nextTiers);
    console.log(nextTiers.length);

    let decimals = parseInt(this.state.token.decimals, 10);
    console.log("decimals: " + decimals);
    let rate = parseInt(this.state.pricingStrategy.rate, 10); //it is from contract. It is already in wei. How much 1 token costs in wei.
    console.log("rate: " + rate);
    let tokensToInvest = parseFloat(this.state.tokensToInvest);
    console.log("tokensToInvest: " + tokensToInvest);

    let weiToSend = parseInt(tokensToInvest*rate, 10);
    console.log("weiToSend: " + weiToSend);
    let opts = {
      from: web3.eth.accounts[0],
      value: weiToSend,
      gasPrice: 21000000000
    };
    console.log(opts);
    crowdsaleContract.buy.sendTransaction(opts, (err, txHash) => {
      if (err) {
        let state = this.state;
        state.loading = false;
        this.setState(state);
        return console.log(err);
      }
      
      console.log("txHash: " + txHash);
      let $this = this;
      checkTxMined(web3, txHash, function txMinedCallback(receipt) {
        if (receipt) {
          if (receipt.blockNumber) {
            let state = $this.state;
            state.loading = false;
            $this.setState(state);
            successfulInvestmentAlert($this.state.tokensToInvest);
          }
        } else {
          setTimeout(() => {
            checkTxMined(web3, txHash, txMinedCallback);
          }, 500);
        }
      })
    });
  }

  tokensToInvestOnChange(event) {
    let state = this.state;
    state["tokensToInvest"] = event.target.value;
    this.setState(state);
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
    const { seconds } = this.state
    const { days, hours, minutes } = this.getTimeStamps(seconds)

    const tokenDecimals = !isNaN(this.state.token.decimals)?this.state.token.decimals:0;
    const tokenTicker = this.state.token.ticker?this.state.token.ticker.toString():"";
    const tokenName = this.state.token.name?this.state.token.name.toString():"";
    const rate = this.state.pricingStrategy.rate;
    const maxCapBeforeDecimals = this.state.crowdsale.maximumSellableTokens/10**tokenDecimals;
    const tokenAmountOf = this.state.crowdsale.tokenAmountOf;
    const ethRaised = this.state.crowdsale.ethRaised;

    //balance: tiers, standard
    const investorBalanceTiers = (tokenAmountOf?((tokenAmountOf/10**tokenDecimals)/*.toFixed(tokenDecimals)*/).toString():"0");
    const investorBalanceStandard = (ethRaised?(ethRaised/*.toFixed(tokenDecimals)*//rate).toString():"0");
    const investorBalance = (this.state.contractType === this.state.contractTypes.whitelistwithcap)?investorBalanceTiers:investorBalanceStandard;

    //total supply: tiers, standard
    const tierCap = !isNaN(maxCapBeforeDecimals)?(maxCapBeforeDecimals/*.toFixed(tokenDecimals)*/).toString():"0";
    const standardCrowdsaleSupply = !isNaN(this.state.crowdsale.supply)?(this.state.crowdsale.supply/*.toFixed(tokenDecimals)*/).toString():"0";
    const totalSupply = (this.state.contractType === this.state.contractTypes.whitelistwithcap)?tierCap:standardCrowdsaleSupply;

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
              <p className="hashes-title">{this.state.curAddr}</p>
              <p className="hashes-description">Current Account</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{this.state.contracts.token.addr}</p>
              <p className="hashes-description">Token Address</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{this.state.contracts.crowdsale.addr[0]}</p>
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
            Here you can invest in the crowdsale campaign. At the moment, you need MetaMask client to invest into the crowdsale. If you don't have MetaMask, you can send ethers to the crowdsale address with a MethodID: 0xa6f2ae3a. Sample <a href="https://kovan.etherscan.io/tx/0x42073576a160206e61b4d9b70b436359b8d220f8b88c7c272c77023513c62c3d">transaction</a>.
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
          <form className="invest-form">
            <label className="invest-form-label">Choose amount to invest</label>
            <div className="invest-form-input-container">
              <input type="text" className="invest-form-input" value={this.tokensToInvest} onChange={this.tokensToInvestOnChange} placeholder="0"/>
              <div className="invest-form-label">TOKENS</div>
            </div>
            <a className="button button_fill" onClick={this.investToTokens}>Invest now</a>
            <p className="description">
            Think twice before investment in ICOs. Tokens will be deposited on a wallet you used to buy tokens.
            </p>
          </form>
        </div>
      </div>
      <Loader show={this.state.loading}></Loader>
    </div>
  }
}
 

