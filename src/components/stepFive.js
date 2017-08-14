import React from 'react'
import '../assets/stylesheets/application.css';
import { getWeb3, attachToContract, checkNetWorkByID } from '../utils/web3'
import { getQueryVariable, setFlatFileContentToState } from '../utils/utils'
import { noContractAlert } from '../utils/alerts'
import { StepNavigation } from './Common/StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'
import { defaultState } from '../utils/constants'
const { CROWDSALE_PAGE } = NAVIGATION_STEPS

export class stepFive extends React.Component {
	constructor(props) {
	    super(props);
	    console.log(props);
	    this.state = defaultState;
	}

	componentDidMount () {
		const crowdsaleAddr = getQueryVariable("addr");
		const networkID = getQueryVariable("networkID");
		var $this = this;
		setTimeout(function() {
			getWeb3(function(web3) {
				var state = $this.state;
				state.web3 = web3;
      			checkNetWorkByID(web3, networkID);
			    state.contracts.crowdsale.addr = crowdsaleAddr;
			    state.contracts.crowdsale.networkID = networkID;
			    
			    var derivativesLength = 4;
			    var derivativesIterator = 0;
			    setFlatFileContentToState("./contracts/SampleCrowdsale_flat.bin", function(_bin) {
			      derivativesIterator++;
			      state.contracts.crowdsale.bin = _bin;

			      if (derivativesIterator === derivativesLength) {
			        $this.extractContractsData($this, state, web3);
			      }
			    });
			    setFlatFileContentToState("./contracts/SampleCrowdsale_flat.abi", function(_abi) {
			      derivativesIterator++;
			      state.contracts.crowdsale.abi = JSON.parse(_abi);

			      if (derivativesIterator === derivativesLength) {
			        $this.extractContractsData($this, state, web3);
			      }
			    });
			    setFlatFileContentToState("./contracts/SampleCrowdsaleToken_flat.bin", function(_bin) {
			      derivativesIterator++;
			      state.contracts.token.bin = _bin;

			      if (derivativesIterator === derivativesLength) {
			        $this.extractContractsData($this, state, web3);
			      }
			    });
			    setFlatFileContentToState("./contracts/SampleCrowdsaleToken_flat.abi", function(_abi) {
			      derivativesIterator++;
			      state.contracts.token.abi = JSON.parse(_abi);

			      if (derivativesIterator === derivativesLength) {
			        $this.extractContractsData($this, state, web3);
			      }
			    });
			});
		}, 500);
	}

	extractContractsData($this, state, web3) {
	  $this.setState(state);
      $this.state.curAddr = web3.eth.defaultAccount;

      if (!$this.state.contracts.crowdsale.addr) return;
      attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr, function(err, crowdsaleContract) {
        console.log("attach to crowdsale contract");
        if (err) return console.log(err);
        if (!crowdsaleContract) return noContractAlert();

        crowdsaleContract.weiRaised.call(function(err, weiRaised) {
          if (err) return console.log(err);
          
          console.log("weiRaised: " + web3.fromWei(parseInt(weiRaised, 10), "ether"));
          let state = $this.state;
          state.crowdsale.weiRaised = web3.fromWei(parseInt(weiRaised, 10), "ether");
          $this.setState(state);
        });

        crowdsaleContract.rate.call(function(err, rate) {
          if (err) return console.log(err);
          
          console.log("rate: " + web3.fromWei(parseInt(rate, 10), "ether"));
          let state = $this.state;
          state.crowdsale.rate = web3.fromWei(parseInt(rate, 10), "ether");
          $this.setState(state);
        });

        crowdsaleContract.supply.call(function(err, supply) {
          if (err) return console.log(err);
          
          console.log("supply: " + supply);
          let state = $this.state;
          state.crowdsale.supply = supply;
          $this.setState(state);
        });

        crowdsaleContract.investors.call(function(err, investors) {
          if (err) return console.log(err);
          
          console.log("investors: " + investors);
          let state = $this.state;
          state.crowdsale.investors = investors;
          $this.setState(state);
        });

        crowdsaleContract.token.call(function(err, tokenAddr) {
          if (err) return console.log(err);
          
          console.log("token: " + tokenAddr);
          let state = $this.state;
          state.contracts.token.addr = tokenAddr;
          $this.setState(state);

          if (!tokenAddr || tokenAddr === "0x") return;
          attachToContract(web3, $this.state.contracts.token.abi, $this.state.contracts.token.addr, function(err, tokenContract) {
            console.log("attach to token contract");
            if (err) return console.log(err);
            if (!tokenContract) return console.log("There is no contract at this address");

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
  	}

  	goToInvestPage = () => {
  		let queryStr = "";
  		if (this.state.contracts.crowdsale.addr) {
  			queryStr = "?addr=" + this.state.contracts.crowdsale.addr;
  			if (this.state.contracts.crowdsale.networkID)
  				queryStr += "&networkID=" + this.state.contracts.crowdsale.networkID;
  		}
        this.props.history.push('/invest' + queryStr);
  	}

	render() {
	    return (
		<section className="steps steps_crowdsale-page">
			<StepNavigation activeStep={CROWDSALE_PAGE} />
			<div className="steps-content container">
				<div className="about-step">
					<div className="step-icons step-icons_crowdsale-page"></div>
					<p className="title">Crowdsale Page</p>
					<p className="description">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
						enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
						in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
					</p>
				</div>
				<div className="total-funds">
					<div className="hidden">
						<div className="left">
							<p className="total-funds-title">{this.state.crowdsale.weiRaised} ETH</p>
							<p className="total-funds-description">
								Total Raised Funds
							</p>
						</div>
						<div className="right">
							<p className="total-funds-title">{this.state.crowdsale.rate?isNaN(this.state.crowdsale.supply/this.state.crowdsale.rate)?0:(this.state.crowdsale.supply/this.state.crowdsale.rate):0} ETH</p>
							<p className="total-funds-description">
								Goal
							</p>
						</div>
					</div>
				</div>
				<div className="total-funds-chart-container">
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart-division"></div>
					<div className="total-funds-chart">
						<div className="total-funds-chart-active" style={{width : (this.state.crowdsale.supply?this.state.crowdsale.weiRaised/this.state.crowdsale.supply:"0") + "%"}}></div>
					</div>
				</div>
				<div className="total-funds-statistics">
					<div className="hidden">
						<div className="left">
							<div className="hidden">
								<div className="left">
									<p className="title">{this.state.crowdsale.weiRaised*this.state.crowdsale.rate}</p>
									<p className="description">
										Tokens Claimed
									</p>
								</div>
								<div className="right">
									<p className="title">{this.state.crowdsale.investors?this.state.crowdsale.investors.toString():0}</p>
									<p className="description">
										Contributors
									</p>
								</div>
							</div>
							<p className="hash">{this.state.contracts?this.state.contracts.token.addr:""}</p>
							<p className="description">
								Token Address
							</p>
						</div>
						<div className="right">
							<div className="hidden">
								<div className="left">
									<p className="title">{this.state.crowdsale.rate?this.state.crowdsale.rate:0}</p>
									<p className="description">
										Price (Tokens/ETH)
									</p>
								</div>
								<div className="right">
									<p className="title">{this.state.crowdsale.supply?this.state.crowdsale.supply.toString():0}</p>
									<p className="description">
										Total Supply
									</p>
								</div>
							</div>
							<p className="hash">{this.state.contracts?this.state.contracts.crowdsale.addr:""}</p>
							<p className="description">
								Crowdsale Contract Address
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="button-container">
				{/*<Link to={{ pathname: this.state.contracts.crowdsale.addr?('/invest' + ('?crowdsale=' + this.state.contracts.crowdsale.addr):""):'/invest' }}><a href="#" className="button button_fill">Invest</a></Link>*/}
				<a onClick={this.goToInvestPage} className="button button_fill">Invest</a>
			</div>
		</section>
		)
	}
}