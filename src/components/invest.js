import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { getWeb3, attachToContract, checkNetWorkByID, getCrowdsaleData } from '../utils/web3'
import { getQueryVariable, setFlatFileContentToState } from '../utils/utils'
import { noMetaMaskAlert, noContractAlert, investmentDisabledAlert, successfulInvestmentAlert } from '../utils/alerts'
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
      this.setState(state);
  }

  componentDidMount () {
    const contractName = "Crowdsale";
    var $this = this;
    setTimeout(function() {
     getWeb3(function(web3) {
      if (!web3) return;
      var state = $this.state;
      state.web3 = web3;
      $this.setState(state);
      const timeInterval = setInterval(() => $this.setState({ seconds: $this.state.seconds - 1}), 1000);
      $this.setState({ timeInterval });

      var crowdsaleAddr = getQueryVariable("addr");
      var networkID = getQueryVariable("networkID");
      checkNetWorkByID(web3, networkID);
      $this.state.contracts.crowdsale.addr = crowdsaleAddr;

      var derivativesLength = 6;
      var derivativesIterator = 0;
      setFlatFileContentToState("./contracts/" + contractName + "_flat.bin", function(_bin) {
        derivativesIterator++;
        state.contracts.crowdsale.bin = _bin;

        if (derivativesIterator === derivativesLength) {
          $this.extractContractsData($this, web3);
        }
      });
      setFlatFileContentToState("./contracts/" + contractName + "_flat.abi", function(_abi) {
        derivativesIterator++;
        state.contracts.crowdsale.abi = JSON.parse(_abi);

        if (derivativesIterator === derivativesLength) {
          $this.extractContractsData($this, web3);
        }
      });
      setFlatFileContentToState("./contracts/" + contractName + "Token_flat.bin", function(_bin) {
        derivativesIterator++;
        state.contracts.token.bin = _bin;

        if (derivativesIterator === derivativesLength) {
          $this.extractContractsData($this, web3);
        }
      });
      setFlatFileContentToState("./contracts/" + contractName + "Token_flat.abi", function(_abi) {
        derivativesIterator++;
        state.contracts.token.abi = JSON.parse(_abi);

        if (derivativesIterator === derivativesLength) {
          $this.extractContractsData($this, web3);
        }
      });
      setFlatFileContentToState("./contracts/" + contractName + "PricingStrategy_flat.bin", function(_bin) {
        derivativesIterator++;
        state.contracts.pricingStrategy.bin = _bin;

        if (derivativesIterator === derivativesLength) {
          $this.extractContractsData($this, web3);
        }
      });
      setFlatFileContentToState("./contracts/" + contractName + "PricingStrategy_flat.abi", function(_abi) {
        derivativesIterator++;
        state.contracts.pricingStrategy.abi = JSON.parse(_abi);

        if (derivativesIterator === derivativesLength) {
          $this.extractContractsData($this, web3);
        }
      });
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
    //web3.eth.getBlockNumber(function(err, curBlock) {
      //if (err) return console.log(err);

      //if (startBlock > parseInt(curBlock, 10)) {
      console.log("startDate: " + startDate);
      console.log("(new Date()).getTime(): " + (new Date()).getTime());
      if (startDate > (new Date()).getTime()) {
        return investmentDisabledAlert(startDate, (new Date()).getTime());
        //return investmentDisabledAlert(startBlock, curBlock);
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

        crowdsaleContract.invest.sendTransaction(web3.eth.accounts[0], opts, function(err, txHash) {
          if (err) return console.log(err);
          
          console.log("txHash: " + txHash);
          successfulInvestmentAlert($this.state.tokensToInvest);
        });
      });
    //});
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
            <p className="balance-title">{this.state.crowdsale.weiRaised?this.state.crowdsale.weiRaised.toString():"0"} {this.state.token.ticker?this.state.token.ticker.toString(): ""}</p>
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
    </div>
  }
}
 

