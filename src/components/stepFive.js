import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3, attachToContract } from './web3'
import { getQueryVariable, setFlatFileContentToState } from './utils'

export class stepFive extends React.Component {
	constructor(props) {
	    super(props);
	    console.log(props);
	    this.state = {};
	    this.state.contracts = {"crowdsale": {}, "token": {}};
		this.state.crowdsale = {};
      	this.state.token = {};
      	this.state.crowdsale.supply = 2700;
	}

	componentWillMount () {
	    var crowdsaleAddr = getQueryVariable("crowdsale");
	    //var tokenAddr = getQueryVariable("token");
	    this.state.contracts.crowdsale.addr = crowdsaleAddr;
	    //this.state.contracts.token.addr = tokenAddr;
	    
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
	      $this.state.curAddr = web3.eth.defaultAccount;

	      if (!$this.state.contracts.crowdsale.addr) return;
	      attachToContract(web3, $this.state.contracts.crowdsale.abi, $this.state.contracts.crowdsale.addr, function(err, crowdsaleContract) {
	        console.log("attach to crowdsale contract");
	        if (err) return console.log(err);
	        if (!crowdsaleContract) return console.log("There is no contract at this address");

	        console.log(crowdsaleContract);

	        crowdsaleContract.weiRaised.call(function(err, weiRaised) {
	          if (err) return console.log(err);
	          
	          console.log("weiRaised:");
	          console.log("result: " + web3.fromWei(parseInt(weiRaised), "ether"));
	          let state = $this.state;
	          state.crowdsale.weiRaised = web3.fromWei(parseInt(weiRaised), "ether");
	          $this.setState(state);
	        });

	        crowdsaleContract.rate.call(function(err, rate) {
	          if (err) return console.log(err);
	          
	          console.log("rate:");
	          console.log("result: " + web3.fromWei(parseInt(rate), "ether"));
	          let state = $this.state;
	          state.crowdsale.rate = web3.fromWei(parseInt(rate), "ether");
	          $this.setState(state);
	        });

	        crowdsaleContract.token.call(function(err, tokenAddr) {
	          if (err) return console.log(err);
	          
	          console.log("token:");
	          console.log("result: " + tokenAddr);
	          let state = $this.state;
	          state.contracts.token.addr = tokenAddr;
	          $this.setState(state);

	          if (!$this.state.contracts.token.addr || $this.state.contracts.token.addr == "0x") return;
	          attachToContract(web3, $this.state.contracts.token.abi, $this.state.contracts.token.addr, function(err, tokenContract) {
	            console.log("attach to token contract");
	            if (err) return console.log(err);
	            if (!tokenContract) return console.log("There is no contract at this address");

	            console.log(tokenContract);

	            tokenContract.name.call(function(err, name) {
	              if (err) return console.log(err);
	              
	              console.log("name:");
	              console.log("result: " + name);
	              $this.state.token.name = name;
	            });
	            tokenContract.symbol.call(function(err, ticker) {
	              if (err) console.log(err);
	              console.log("ticker:");
	              console.log("result: " + ticker);
	              $this.state.token.ticker = ticker;
	            });
	          });
	        });
	      });
	    });
  	}

	render() {
	    return (
		<section className="steps steps_crowdsale-page">
			<div className="steps-navigation">
				<div className="container">
					<div className="step-navigation">Crowdsale Contract</div>
					<div className="step-navigation">Token Setup</div>
					<div className="step-navigation">Crowdsale Setup</div>
					<div className="step-navigation">Publish</div>
					<div className="step-navigation step-navigation_active">Crowdsale Page</div>
				</div>
			</div>
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
							<p className="total-funds-title">{this.state.crowdsale.rate?(this.state.crowdsale.supply/this.state.crowdsale.rate):0} ETH</p>
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
									<p className="title">573</p>
									<p className="description">
										Contributors
									</p>
								</div>
							</div>
							<p className="hash">{this.state.contracts?this.state.contracts.token.addr:"0xc1253365dADE090649147Db89EE781d10f2b972f"}</p>
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
									<p className="title">{this.state.crowdsale.supply?this.state.crowdsale.supply:0}</p>
									<p className="description">
										Total Supply
									</p>
								</div>
							</div>
							<p className="hash">{this.state.contracts?this.state.contracts.crowdsale.addr:"0xc1253365dADE090649147Db89EE781d10f2b972f"}</p>
							<p className="description">
								Crowdsale Contract Address
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="button-container">
				<Link to={{ pathname: this.state.contracts.crowdsale.addr?('/invest' + ('?crowdsale=' + this.state.contracts.crowdsale.addr):""):'/invest' }}><a href="#" className="button button_fill">Invest</a></Link>
			</div>
		</section>
		)
	}
}