import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { getWeb3, attachToContract, checkNetWorkByID, getCrowdsaleData, initializeAccumulativeData, getAccumulativeCrowdsaleData, getCrowdsaleTargetDates, findCurrentContractRecursively } from '../utils/web3'
import { getQueryVariable, getURLParam, getStandardCrowdsaleAssets, getWhiteListWithCapCrowdsaleAssets } from '../utils/utils'
import { noMetaMaskAlert, noContractAlert, investmentDisabledAlert, investmentDisabledAlertInTime, successfulInvestmentAlert } from '../utils/alerts'
import { Loader } from './Common/Loader'
import { defaultState } from '../utils/constants'

export class Invest extends React.Component {
  constructor(props) {
      super(props);
      if (this.tokensToInvestOnChange.bind) this.tokensToInvestOnChange = this.tokensToInvestOnChange.bind(this);
      if (this.investToTokens.bind) this.investToTokens = this.investToTokens.bind(this);
      var state = defaultState;
      state.seconds = 0;
      state.loading = true;
      this.state = state;
  }

  componentDidMount () {
    let newState = { ...this.state }
    var $this = this;
    setTimeout(function() {
     getWeb3(function(web3) {
      if (!web3) return;

      const crowdsaleAddrs = getURLParam("addr");
      const networkID = getQueryVariable("networkID");
      const contractType = getQueryVariable("contractType");
      checkNetWorkByID(web3, networkID);
      let _crowdsaleAddrs;
      if ( typeof crowdsaleAddrs === 'string' ) {
          _crowdsaleAddrs = [ crowdsaleAddrs ];
      } else {
        _crowdsaleAddrs = crowdsaleAddrs;
      }
      newState.contracts.crowdsale.addr = _crowdsaleAddrs;
      newState.contracts.crowdsale.contractType = contractType;

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

    if (web3.eth.accounts.length === 0) return;

    state.curAddr = web3.eth.accounts[0];
    state.web3 = web3;
    $this.setState(state);

    if (!$this.state.contracts.crowdsale.addr) return;
    findCurrentContractRecursively(0, $this, web3, null, function(crowdsaleContract) {
      if (!crowdsaleContract) {
        state.loading = false;
        return $this.setState(state);
      }
      getCrowdsaleData(web3, $this, crowdsaleContract, function() { 
      });
      initializeAccumulativeData($this, function() {
        getAccumulativeCrowdsaleData(web3, $this, function() {
        });
      });
      getCrowdsaleTargetDates(web3, $this, function() {
        console.log($this.state.crowdsale);
        if ($this.state.crowdsale.endDate) {
          let state = $this.state;
          state.seconds = (state.crowdsale.endDate - new Date().getTime())/1000;
          $this.setState(state);
        }
      })
    })
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

    switch (this.state.contracts.crowdsale.contractType) {
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

    attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr[0], function(err, crowdsaleContract) {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();

      console.log(crowdsaleContract);
      console.log(web3.eth.defaultAccount);

      crowdsaleContract.buySampleTokens.sendTransaction(web3.eth.accounts[0], opts, function(err, txHash) {
        if (err) return console.log(err);
        
        console.log("tx hash: " + txHash);
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

    findCurrentContractRecursively(0, $this, web3, null, function(crowdsaleContract, tierNum) {
      if (!crowdsaleContract) {
        let state = $this;
        state.loading = false;
        return $this.setState(state);
      }
      $this.investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3, $this);
    })
  }

  investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3, $this) {
    let nextTiers = [];
    for (let i = tierNum + 1; i < $this.state.contracts.crowdsale.addr.length; i++) {
      nextTiers.push($this.state.contracts.crowdsale.addr[i]);
    }
    console.log("nextTiers: " + nextTiers);
    console.log(nextTiers.length);

    let decimals = parseInt($this.state.token.decimals, 10);
    console.log("decimals: " + decimals);
    let rate = parseInt($this.state.pricingStrategy.rate, 10); //it is from contract. It is already in wei. How much 1 token costs in wei.
    console.log("rate: " + rate);
    let tokensToInvest = parseFloat($this.state.tokensToInvest);
    console.log("tokensToInvest: " + tokensToInvest);

    console.log("tokensToInvest*rate/10**decimals: " + tokensToInvest*rate/10**decimals);

    //var weiToSend = web3.toWei($this.state.tokensToInvest*$this.state.pricingStrategy.rate/10**$this.state.token.decimals, "ether");
    //var weiToSend = $this.state.tokensToInvest*$this.state.pricingStrategy.rate;
    //var weiToSend = $this.state.tokensToInvest*$this.state.pricingStrategy.rate/10**$this.state.token.decimals;
    var weiToSend = parseInt(tokensToInvest*rate, 10);
    console.log("weiToSend: " + weiToSend);
    var opts = {
      from: web3.eth.accounts[0],
      value: weiToSend
    };
    console.log(opts);
    crowdsaleContract.buy.sendTransaction(nextTiers, opts, function(err, txHash) {
      if (err) return console.log(err);
      
      console.log("txHash: " + txHash);
      successfulInvestmentAlert($this.state.tokensToInvest);
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

    const tokenDecimals = !isNaN(this.state.token.decimals)?this.state.token.decimals:0;
    const tokenTicker = this.state.token.ticker?this.state.token.ticker.toString():"";
    const tokenName = this.state.token.name?this.state.token.name.toString():"";
    const rate = this.state.pricingStrategy.rate;
    const maxCapBeforeDecimals = this.state.crowdsale.maximumSellableTokens;
    const tokenAmountOf = this.state.crowdsale.tokenAmountOf;
    const weiRaised = this.state.crowdsale.weiRaised;
    const ethRaised = this.state.crowdsale.ethRaised;

    //balance: tiers, standard
    const investorBalanceTiers = (tokenAmountOf?((tokenAmountOf/10**tokenDecimals).toFixed(tokenDecimals)).toString():"0");
    const investorBalanceStandard = (ethRaised?(ethRaised.toFixed(tokenDecimals)/rate).toExponential().toString():"0");
    const investorBalance = (this.state.contracts.crowdsale.contractType==this.state.contractTypes.whitelistwithcap)?investorBalanceTiers:investorBalanceStandard;

    //total supply: tiers, standard
    const tierCap = !isNaN(maxCapBeforeDecimals)?(maxCapBeforeDecimals.toFixed(tokenDecimals)).toString():"0";
    const standardCrowdsaleSupply = !isNaN(this.state.crowdsale.supply)?(this.state.crowdsale.supply.toFixed(tokenDecimals)).toString():"0";
    const totalSupply = (this.state.contracts.crowdsale.contractType == this.state.contractTypes.whitelistwithcap)?tierCap:standardCrowdsaleSupply;

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
          <p className="invest-title">LOREM IPSUM</p>
          <p className="invest-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
          </p>
        </div>
        <div className="invest-table-cell invest-table-cell_right">
          <div className="balance">
            <p className="balance-title">{investorBalance} {tokenTicker}</p>
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
 

