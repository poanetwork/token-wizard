import React from 'react'
import '../assets/stylesheets/application.css';
import { getWeb3, attachToContract, checkNetWorkByID, getCrowdsaleData } from '../utils/web3'
import { getQueryVariable, getStandardCrowdsaleAssets, getWhiteListWithCapCrowdsaleAssets } from '../utils/utils'
import { noContractAlert } from '../utils/alerts'
import { StepNavigation } from './Common/StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'
import { defaultState } from '../utils/constants'
import { Loader } from './Common/Loader'
const { CROWDSALE_PAGE } = NAVIGATION_STEPS

export class stepFive extends React.Component {
	constructor(props) {
	    super(props);
	    console.log(props);
	    this.state = defaultState;
	}

	componentDidMount () {
		let newState = { ...this.state }
	    newState.loading = true;
	    this.setState(newState);
		const crowdsaleAddr = getQueryVariable("addr");
		const networkID = getQueryVariable("networkID");
		const contractType = getQueryVariable("contractType");
		var $this = this;
		setTimeout(function() {
			getWeb3(function(web3) {
				var state = $this.state;
				state.web3 = web3;
      			checkNetWorkByID(web3, networkID);
			    state.contracts.crowdsale.addr = crowdsaleAddr;
			    state.contracts.crowdsale.networkID = networkID;
			    state.contracts.crowdsale.contractType = contractType;

			    switch (contractType) {
		          case $this.state.contractTypes.standard: {
		            getStandardCrowdsaleAssets(state, function(newState) {
				    	$this.extractContractsData($this, newState, web3);
				    });
		          } break;
		          case $this.state.contractTypes.whitelistwithcap: {
		            getWhiteListWithCapCrowdsaleAssets(state, function(newState) {
				    	$this.extractContractsData($this, newState, web3);
				    });
		          } break;
		          default:
		            break;
		        }
			});
		}, 500);
	}

	extractContractsData($this, state, web3) {
	  $this.setState(state);
      $this.state.curAddr = web3.eth.defaultAccount;

      if (!$this.state.contracts.crowdsale.addr) return;
      getCrowdsaleData(web3, $this);
  	}

  	goToInvestPage = () => {
  		let queryStr = "";
  		if (this.state.contracts.crowdsale.addr) {
  			queryStr = "?addr=" + this.state.contracts.crowdsale.addr;
  			if (this.state.contracts.crowdsale.networkID)
  				queryStr += "&networkID=" + this.state.contracts.crowdsale.networkID;
  			if (this.state.contracts.crowdsale.contractType)
  				queryStr += "&contractType=" + this.state.contracts.crowdsale.contractType;
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
							<p className="total-funds-title">{this.state.pricingStrategy.rate?isNaN(this.state.crowdsale.supply/this.state.pricingStrategy.rate)?0:(this.state.crowdsale.supply/this.state.pricingStrategy.rate):0} ETH</p>
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
									<p className="title">{this.state.crowdsale.weiRaised*this.state.pricingStrategy.rate}</p>
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
									<p className="title">{this.state.pricingStrategy.rate?this.state.pricingStrategy.rate:0}</p>
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
			<Loader show={this.state.loading}></Loader>
		</section>
		)
	}
}