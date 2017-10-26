import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { getWeb3, checkTxMined, attachToContract, checkNetWorkByID } from '../../utils/blockchainHelpers'
import { getCrowdsaleData, getCurrentRate, initializeAccumulativeData, getAccumulativeCrowdsaleData, getCrowdsaleTargetDates, findCurrentContractRecursively, getJoinedTiers } from '../crowdsale/utils'
import { getQueryVariable, getURLParam, getStandardCrowdsaleAssets, getWhiteListWithCapCrowdsaleAssets } from '../../utils/utils'
import { noMetaMaskAlert, noContractAlert, investmentDisabledAlert, investmentDisabledAlertInTime, successfulInvestmentAlert, invalidCrowdsaleAddrAlert } from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { ICOConfig } from '../Common/config'
import { CONTRACT_TYPES } from '../../utils/constants'
import { observer, inject } from 'mobx-react' 

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
      this.state = state;
  }

  componentDidMount () {
    let newState = { ...this.state }
    const { web3Store, contractStore } = this.props
    const web3 = web3Store.web3
    if (!web3) {
      let state = this.state;
      state.loading = false;
      this.setState(state);
      return
    };

    const networkID = ICOConfig.networkID?ICOConfig.networkID:getQueryVariable("networkID");
    const contractType = CONTRACT_TYPES.whitelistwithcap;// getQueryVariable("contractType");
    checkNetWorkByID(web3, networkID);
    contractStore.setContractType(contractType);

    const timeInterval = setInterval(() => this.setState({ seconds: this.state.seconds - 1}), 1000);
    this.setState({ timeInterval });

    switch (contractType) {
      case CONTRACT_TYPES.standard: {
        getStandardCrowdsaleAssets((_newState) => {
          this.setState(_newState);
          this.extractContractsData(web3);
        });
      } break;
      case CONTRACT_TYPES.whitelistwithcap: {
        getWhiteListWithCapCrowdsaleAssets((_newState) => {
          this.setState(_newState);
          this.extractContractsData(web3);
        });
      } break;
      default:
        break;
    }
  }

  extractContractsData(web3) {
    const { contractStore, crowdsalePageStore } = this.props
    let state = this.state;

    const crowdsaleAddr = ICOConfig.crowdsaleContractURL?ICOConfig.crowdsaleContractURL:getURLParam("addr");
    if (!web3.isAddress(crowdsaleAddr)) {
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
      contractStore.setContractProperty('crowdsale', 'addr', _crowdsaleAddrs);

      if (web3.eth.accounts.length === 0) {
        let state = this.state;
        state.loading = false;
        this.setState(state);
        return
      };

      state.curAddr = web3.eth.accounts[0];
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
          console.log(crowdsalePageStore);
          if (crowdsalePageStore.endDate) {
            let state = this.state;
            state.seconds = (crowdsalePageStore.endDate - new Date().getTime())/1000;
            this.setState(state);
          }
        })
      })
    });
  }

  investToTokens() {
    const { crowdsalePageStore, web3Store, contractStore } = this.props
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
    console.log('contractStore.contractType', contractStore.contractType)
    
    switch (contractStore.contractType) {
      case CONTRACT_TYPES.standard: {
        web3.eth.getBlockNumber((err, curBlock) => {
          if (err) return console.log(err);
          this.investToTokensForStandardCrowdsale(web3, curBlock)
        });
      } break;
      case CONTRACT_TYPES.whitelistwithcap: {
        console.log('CONTRACT_TYPES.whitelistwithcap', CONTRACT_TYPES.whitelistwithcap)
        this.investToTokensForWhitelistedCrowdsale(web3)
      } break;
      default:
        break;
    }
  }

  investToTokensForStandardCrowdsale(web3, curBlock) {
    const { crowdsalePageStore, investStore, contractStore } = this.props
    if (parseInt(crowdsalePageStore.startBlock, 10) > parseInt(curBlock, 10)) {
      return investmentDisabledAlert(parseInt(crowdsalePageStore.startBlock, 10), curBlock);
    }

    let weiToSend = web3.toWei(investStore.tokensToInvest/crowdsalePageStore.rate, "ether");
    let opts = {
      from: web3.eth.accounts[0],
      value: weiToSend
    };

    attachToContract(web3, contractStore.crowdsale.abi, contractStore.crowdsale.addr[0], (err, crowdsaleContract) => {
      console.log("attach to crowdsale contract");
      if (err) return console.log(err);
      if (!crowdsaleContract) return noContractAlert();

      console.log(crowdsaleContract);
      console.log(web3.eth.defaultAccount);

      crowdsaleContract.buySampleTokens.sendTransaction(web3.eth.accounts[0], opts, (err, txHash) => {
        if (err) return console.log(err);
        
        console.log("tx hash: " + txHash);
        successfulInvestmentAlert(investStore.tokensToInvest);
      });
    });
  }

  investToTokensForWhitelistedCrowdsale(web3) {
    const { crowdsalePageStore } = this.props 
    console.log("startDate: " +  crowdsalePageStore.startDate);
    console.log("(new Date()).getTime(): " + (new Date()).getTime());
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
      getCurrentRate(web3, this, crowdsaleContract, () => { 
        this.investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3);
      });
    })
  }

  investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, web3) {
    const { contractStore, tokenStore, crowdsalePageStore, investStore } = this.props 
    let nextTiers = [];
    console.log(contractStore.crowdsale);
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
            successfulInvestmentAlert(investStore.tokensToInvest);
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
    this.props.investStore.setProperty('tokensToInvest', event.target.value)
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
    const { crowdsalePageStore, tokenStore, contractStore, investStore } = this.props
    const { days, hours, minutes } = this.getTimeStamps(seconds)

    const tokenDecimals = !isNaN(tokenStore.decimals)?tokenStore.decimals:0;
    const tokenTicker = tokenStore.ticker?tokenStore.ticker.toString():"";
    const tokenName = tokenStore.name?tokenStore.name.toString():"";
    const rate = crowdsalePageStore.rate;
    const maxCapBeforeDecimals = crowdsalePageStore.maximumSellableTokens/10**tokenDecimals;
    const tokenAmountOf = crowdsalePageStore.tokenAmountOf;
    const ethRaised = crowdsalePageStore.ethRaised;

    //balance: tiers, standard
    const investorBalanceTiers = (tokenAmountOf?((tokenAmountOf/10**tokenDecimals)/*.toFixed(tokenDecimals)*/).toString():"0");
    const investorBalanceStandard = (ethRaised?(ethRaised/*.toFixed(tokenDecimals)*//rate).toString():"0");
    const investorBalance = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?investorBalanceTiers:investorBalanceStandard;

    //total supply: tiers, standard
    const tierCap = !isNaN(maxCapBeforeDecimals)?(maxCapBeforeDecimals/*.toFixed(tokenDecimals)*/).toString():"0";
    const standardCrowdsaleSupply = !isNaN(crowdsalePageStore.supply)?(crowdsalePageStore.supply/*.toFixed(tokenDecimals)*/).toString():"0";
    const totalSupply = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap)?tierCap:standardCrowdsaleSupply;

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
              <p className="hashes-title">{contractStore.token.addr}</p>
              <p className="hashes-description">Token Address</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{contractStore.crowdsale.addr[0]}</p>
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
              <input type="text" className="invest-form-input" value={investStore.tokensToInvest} onChange={this.tokensToInvestOnChange} placeholder="0"/>
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
 

