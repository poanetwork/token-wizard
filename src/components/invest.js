import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { getWeb3, attachToContract } from './web3'
import { getQueryVariable, setFlatFileContentToState } from './utils'

const startEvent = new Date(2017, 6, 19)
const endEvent = new Date(2017, 6, 24)

export class Invest extends React.Component {
  constructor(props) {
      super(props);
      console.log(props);
      if (this.tokensToInvestOnChange.bind) this.tokensToInvestOnChange = this.tokensToInvestOnChange.bind(this);
      if (this.investToTokens.bind) this.investToTokens = this.investToTokens.bind(this);
      this.state = {
        seconds: (endEvent - startEvent)/2 ,
      };
      this.state.contracts = {"crowdsale": {}, "token": {}};
      this.state.crowdsale = {};
      this.state.token = {};
  }

  componentDidMount () {
    const timeInterval = setInterval(() => this.setState({ seconds: this.state.seconds - 1}), 1000);
    this.setState({ timeInterval });

    var crowdsaleAddr = getQueryVariable("addr");
    this.state.contracts.crowdsale.addr = crowdsaleAddr;

    var derivativesLength = 4;
    var derivativesIterator = 0;
    var $this = this;
    setFlatFileContentToState("./contracts/SampleCrowdsale_flat.bin", function(_bin) {
      derivativesIterator++;
      $this.state.contracts.crowdsale.bin = _bin;

      if (derivativesIterator == derivativesLength) {
        $this.extractContractsData($this);
      }
    });
    setFlatFileContentToState("./contracts/SampleCrowdsale_flat.abi", function(_abi) {
      derivativesIterator++;
      $this.state.contracts.crowdsale.abi = JSON.parse(_abi);

      if (derivativesIterator == derivativesLength) {
        $this.extractContractsData($this);
      }
    });
    setFlatFileContentToState("./contracts/SampleCrowdsaleToken_flat.bin", function(_bin) {
      derivativesIterator++;
      $this.state.contracts.token.bin = _bin;

      if (derivativesIterator == derivativesLength) {
        $this.extractContractsData($this);
      }
    });
    setFlatFileContentToState("./contracts/SampleCrowdsaleToken_flat.abi", function(_abi) {
      derivativesIterator++;
      $this.state.contracts.token.abi = JSON.parse(_abi);

      if (derivativesIterator == derivativesLength) {
        $this.extractContractsData($this);
      }
    });
  }

  extractContractsData($this) {
    console.log($this.state);
    getWeb3(function(web3, isOraclesNetwork) {
      console.log("getWeb3");
      var state = $this.state;
      state.curAddr = web3.eth.accounts[0];
      $this.setState(state);

      if (!$this.state.contracts.crowdsale.addr) return;
      attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr, function(err, crowdsaleContract) {
        console.log("attach to crowdsale contract");
        if (err) return console.log(err);
        if (!crowdsaleContract) return console.log("There is no contract at this address");

        console.log(crowdsaleContract);

        crowdsaleContract.weiRaised.call(function(err, weiRaised) {
          if (err) return console.log(err);
          
          console.log("weiRaised: " + web3.fromWei(parseInt(weiRaised), "ether"));
          let state = $this.state;
          state.crowdsale.weiRaised = web3.fromWei(parseInt(weiRaised), "ether");
          $this.setState(state);
        });

        crowdsaleContract.rate.call(function(err, rate) {
          if (err) return console.log(err);
          
          console.log("rate: " + web3.fromWei(parseInt(rate), "ether"));
          let state = $this.state;
          state.crowdsale.rate = web3.fromWei(parseInt(rate), "ether");
          $this.setState(state);
        });

        crowdsaleContract.supply.call(function(err, supply) {
          if (err) return console.log(err);
          
          console.log("supply: " + supply);
          let state = $this.state;
          state.crowdsale.supply = supply;
          $this.setState(state);
        });

        crowdsaleContract.token.call(function(err, tokenAddr) {
          if (err) return console.log(err);
          
          console.log("token: " + tokenAddr);
          let state = $this.state;
          state.contracts.token.addr = tokenAddr;
          $this.setState(state);

          if (!tokenAddr || tokenAddr == "0x") return;
          attachToContract(web3, $this.state.contracts.token.abi, $this.state.contracts.token.addr, function(err, tokenContract) {
            console.log("attach to token contract");
            if (err) return console.log(err);
            if (!tokenContract) return console.log("There is no contract at this address");

            console.log(tokenContract);

            tokenContract.name.call(function(err, name) {
              if (err) return console.log(err);
              
              console.log("token name: " + name);
              let state = $this.state;
              state.token.name = name;
              $this.setState(state);
            });
            tokenContract.symbol.call(function(err, ticker) {
              if (err) console.log(err);
              console.log("token ticker: " + ticker);
              let state = $this.state;
              state.token.ticker = ticker;
              $this.setState(state);
            });
            tokenContract.supply.call(function(err, supply) {
              if (err) console.log(err);
              let state = $this.state;
              console.log("token supply: " + supply);
              state.token.supply = supply;
              $this.setState(state);
            });
          });
        });
      });
    });
  }

  investToTokens() {
    var $this = this;
    getWeb3(function(web3, isOraclesNetwork) {
      console.log(web3);
      console.log(isOraclesNetwork);
      var weiToSend = web3.toWei($this.state.tokensToInvest/$this.state.crowdsale.rate, "ether");
      var opts = {
        from: web3.eth.defaultAccount,
        value: weiToSend
      };

      console.log(opts);

      attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr, function(err, crowdsaleContract) {
        console.log("attach to crowdsale contract");
        if (err) return console.log(err);
        if (!crowdsaleContract) return console.log("There is no contract at this address");

        console.log(crowdsaleContract);
        console.log(web3.eth.defaultAccount);
        console.log(opts);

        crowdsaleContract.buyTokens.sendTransaction(web3.eth.defaultAccount, opts, function(err, txHash) {
          if (err) return console.log(err);
          
          console.log("txHash: " + txHash);
          window.location.reload();
        });
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
      this.state({ seconds: 0 })
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
                <p className="hashes-title">{this.state.token.name?this.state.token.name.toString():"Oracles network"}</p>
                <p className="hashes-description">Name</p>
              </div>
              <div className="left">
                <p className="hashes-title">{this.state.token.ticker?this.state.token.ticker.toString():"ORC"}</p>
                <p className="hashes-description">Ticker</p>
              </div>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{this.state.token.supply?this.state.token.supply.toString():"2,000,000,000"} {this.state.token.ticker?this.state.token.ticker.toString(): "ORC"}</p>
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
            <p className="balance-title">{this.state.crowdsale.weiRaised?this.state.crowdsale.weiRaised.toString():"0"} {this.state.token.ticker?this.state.token.ticker.toString(): "ORC"}</p>
            <p className="balance-description">Balance</p>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore.
            </p>
          </div>
          <form className="invest-form">
            <label for="" className="invest-form-label">Choose amount to invest</label>
            <div className="invest-form-input-container">
              <input type="text" className="invest-form-input" value={this.tokensToInvest} onChange={this.tokensToInvestOnChange} placeholder="0"/>
              <div className="invest-form-label">TOKENS</div>
            </div>
            <a href="#" className="button button_fill" onClick={this.investToTokens}>Invest now</a>
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
 

