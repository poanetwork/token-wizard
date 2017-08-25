import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { getWeb3, attachToContract, checkNetWorkByID, getCrowdsaleData } from '../utils/web3'
import { getQueryVariable, getStandardCrowdsaleAssets, getWhiteListWithCapCrowdsaleAssets } from '../utils/utils'
import { noMetaMaskAlert, noContractAlert, investmentDisabledAlert, investmentDisabledAlertInTime, successfulInvestmentAlert } from '../utils/alerts'
import { Loader } from './Common/Loader'
import { defaultState } from '../utils/constants'

export class Invest extends React.Component {
  constructor(props) {
      super(props);
      if (this.tokensToInvestOnChange.bind) this.tokensToInvestOnChange = this.tokensToInvestOnChange.bind(this);
      if (this.investToTokens.bind) this.investToTokens = this.investToTokens.bind(this);
      this.state = defaultState
      var state = this.state;
      state.crowdsale = {};
      state.token = {};
      state.seconds = 0;
      state.loading = true;
      this.setState(state);
  }

  componentDidMount () {
    let newState = { ...this.state }
    var $this = this;
    setTimeout(function() {
     getWeb3(function(web3) {
      if (!web3) return;

      const crowdsaleAddr = getQueryVariable("addr");
      const networkID = getQueryVariable("networkID");
      const contractType = getQueryVariable("contractType");
      checkNetWorkByID(web3, networkID);
      newState.contracts.crowdsale.addr = crowdsaleAddr;
      newState.contractType = contractType;

      const timeInterval = setInterval(() => $this.setState({ seconds: $this.state.seconds - 1}), 1000);
      $this.setState({ timeInterval });

      switch (contractType) {
        case $this.state.contractTypes.standard: {
          getStandardCrowdsaleAssets(newState, function(_newState) {
            $this.setState(_newState);
            $this.extractContractsData($this, web3);
          });
        } break;
        case $this.state.contractTypes.whitelistwithcap: {
          getWhiteListWithCapCrowdsaleAssets(newState, function(_newState) {
            $this.setState(_newState);
            $this.extractContractsData($this, web3);
          });
        } break;
        default:
          break;
      }
    });
   }, 500);
  }

  extractContractsData($this, web3) {
    var state = $this.state;
    console.log(web3);
    console.log(web3.currentProvider);
    console.log(web3.providers);
    console.log(web3.eth.accounts);

    if (web3.eth.accounts.length === 0) return;

    state.curAddr = web3.eth.accounts[0];
    state.web3 = web3;
    $this.setState(state);

    if (!$this.state.contracts.crowdsale.addr) return;
    getCrowdsaleData(web3, $this);
  }

  investToTokens() {
    var $this = this;
    var startBlock = parseInt($this.state.crowdsale.startBlock, 10);
    var startDate = $this.state.crowdsale.startDate;
    if ((isNaN(startBlock) || startBlock === 0) && !startDate) return;
    let web3 = $this.state.web3;
    if (web3.eth.accounts.length === 0) {
      return noMetaMaskAlert();
    }

    switch (this.state.contractType) {
      case $this.state.contractTypes.standard: {
        web3.eth.getBlockNumber(function(err, curBlock) {
          if (err) return console.log(err);
          $this.investToTokensForStandardCrowdsale(web3, $this, curBlock)
        });
      } break;
      case $this.state.contractTypes.whitelistwithcap: {
        this.investToTokensForWhitelistedCrowdsale(web3, $this)
      } break;
      default:
        break;
    }
  }

  investToTokensForStandardCrowdsale(web3, $this, curBlock) {
    if (parseInt($this.state.crowdsale.startBlock, 10) > parseInt(curBlock, 10)) {
      return investmentDisabledAlert(parseInt($this.state.crowdsale.startBlock, 10), curBlock);
    }

    var weiToSend = web3.toWei($this.state.tokensToInvest/$this.state.pricingStrategy.rate, "ether");
    var opts = {
      from: web3.eth.accounts[0],
      value: weiToSend
    };

    attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr, function(err, crowdsaleContract) {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();

      console.log(crowdsaleContract);
      console.log(web3.eth.defaultAccount);

      crowdsaleContract.buySampleTokens.sendTransaction(web3.eth.accounts[0], opts, function(err, txHash) {
        if (err) return console.log(err);
        
        console.log("txHash: " + txHash);
        successfulInvestmentAlert($this.state.tokensToInvest);
      });
    });
  }

  investToTokensForWhitelistedCrowdsale(web3, $this) {
    console.log("startDate: " + $this.state.crowdsale.startDate);
    console.log("(new Date()).getTime(): " + (new Date()).getTime());
    if ($this.state.crowdsale.startDate > (new Date()).getTime()) {
      return investmentDisabledAlertInTime($this.state.crowdsale.startDate);
    }

    var weiToSend = web3.toWei($this.state.tokensToInvest*$this.state.pricingStrategy.rate, "ether");
    var opts = {
      from: web3.eth.accounts[0],
      value: weiToSend
    };

    attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr, function(err, crowdsaleContract) {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();

      console.log(crowdsaleContract);
      console.log(web3.eth.defaultAccount);

      crowdsaleContract.buy.sendTransaction(opts, function(err, txHash) {
        if (err) return console.log(err);
        
        console.log("txHash: " + txHash);
        successfulInvestmentAlert($this.state.tokensToInvest);
      });
    });
  }

  tokensToInvestOnChange(event) {
    var state = this.state;
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
              <p className="hashes-title">{this.state.contracts.crowdsale.addr}</p>
              <p className="hashes-description">Crowdsale Contract Address</p>
            </div>
            <div className="hashes-i hidden">
              <div className="left">
                <p className="hashes-title">{this.state.token.name?this.state.token.name.toString():""}</p>
                <p className="hashes-description">Name</p>
              </div>
              <div className="left">
                <p className="hashes-title">{this.state.token.ticker?this.state.token.ticker.toString():""}</p>
                <p className="hashes-description">Ticker</p>
              </div>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{this.state.crowdsale.supply?this.state.crowdsale.supply.toString():"0"} {this.state.token.ticker?this.state.token.ticker.toString(): ""}</p>
              <p className="hashes-description">Total Supply</p>
            </div>
          </div>
          <p className="invest-title">LOREM IPSUM</p>
          <p className="invest-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
          </p>
        </div>
        <div className="invest-table-cell invest-table-cell_right">
          <div className="balance">
            <p className="balance-title">{this.state.crowdsale.tokenAmountOf?this.state.crowdsale.tokenAmountOf.toString():this.state.crowdsale.weiRaised?this.state.crowdsale.weiRaised.toString():"0"} {this.state.token.ticker?this.state.token.ticker.toString(): ""}</p>
            <p className="balance-description">Balance</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore.
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
              Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod
            </p>
          </form>
        </div>
      </div>
      <Loader show={this.state.loading}></Loader>
    </div>
  }
}
 

