import React from 'react'
import '../assets/stylesheets/application.css';
import { getWeb3, checkNetWorkByID, getCrowdsaleData, initializeAccumulativeData, getAccumulativeCrowdsaleData, findCurrentContractRecursively, getJoinedTiers } from '../utils/web3'
import { getQueryVariable, getURLParam, getStandardCrowdsaleAssets, getWhiteListWithCapCrowdsaleAssets } from '../utils/utils'
import { StepNavigation } from './Common/StepNavigation'
import { NAVIGATION_STEPS } from '../utils/constants'
import { defaultState } from '../utils/constants'
import { Loader } from './Common/Loader'
import { Link } from 'react-router-dom'
const { CROWDSALE_PAGE } = NAVIGATION_STEPS

export class Crowdsale extends React.Component {
	constructor(props) {
	    super(props);
	    console.log(props);
	    this.state = defaultState;
	}

	componentDidMount () {
		let newState = { ...this.state }
	    newState.loading = true;
	    newState.tokenIsAlreadyCreated = true;
	    this.setState(newState);
		const networkID = getQueryVariable("networkID");
		const contractType = getQueryVariable("contractType");
		var $this = this;
		setTimeout(function() {
			getWeb3(function(web3) {
				var state = $this.state;
				state.web3 = web3;
      			checkNetWorkByID(web3, networkID);
      			state.networkID = networkID;
	    		state.contractType = contractType;

			    switch (contractType) {
		          case $this.state.contractTypes.standard: {
		            getStandardCrowdsaleAssets(state, function(_newState) {
		            	$this.setState(_newState, () => {
		            		$this.extractContractsData($this, web3);
		            	});
				    });
		          } break;
		          case $this.state.contractTypes.whitelistwithcap: {
		            getWhiteListWithCapCrowdsaleAssets(state, function(_newState) {
		            	$this.setState(_newState, () => {
		            		$this.extractContractsData($this, web3);
		            	});
				    });
		          } break;
		          default:
		            break;
		        }
			});
		}, 500);
	}

	extractContractsData($this, web3) {
		const crowdsaleAddrs = getURLParam("addr");
		getJoinedTiers(web3, $this.state.contracts.crowdsale.abi, crowdsaleAddrs, [], function(joinedCrowdsales) {
			console.log("joinedCrowdsales: ");
			console.log(joinedCrowdsales);

			let _crowdsaleAddrs;
			if ( typeof joinedCrowdsales === 'string' ) {
			    _crowdsaleAddrs = [ joinedCrowdsales ];
			} else {
				_crowdsaleAddrs = joinedCrowdsales;
			}
			var state = $this.state;
		    state.contracts.crowdsale.addr = _crowdsaleAddrs;

		  	state.curAddr = web3.eth.accounts[0];
	      	state.web3 = web3;
	      	$this.setState(state, () => {
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
			    })
	      	});
		})
  	}

  	goToInvestPage = () => {
  		let queryStr = "";
  		if (this.state.contracts.crowdsale.addr) {
  			queryStr = "?addr=" + this.state.contracts.crowdsale.addr[0];
  			/*for (let i = 1; i < this.state.contracts.crowdsale.addr.length; i++) {
		      queryStr += `&addr=` + this.state.contracts.crowdsale.addr[i]
		    }*/
  			if (this.state.networkID)
  				queryStr += "&networkID=" + this.state.networkID;
  			if (this.state.contractType)
  				queryStr += "&contractType=" + this.state.contractType;
  		}
        this.props.history.push('/invest' + queryStr);
  	}

	render() {
		const tokenAddr = this.state.contracts?this.state.contracts.token.addr:"";
	    const crowdsaleAddr = this.state.contracts?(typeof this.state.contracts.crowdsale.addr === 'string')?this.state.contracts.crowdsale.addr:this.state.contracts.crowdsale.addr[0]:"";
	    const tokenDecimals = !isNaN(this.state.token.decimals)?this.state.token.decimals:0;
		const rate = this.state.pricingStrategy.rate; //for tiers: 1 token in wei, for standard: 1/? 1 token in eth
		const maxCapBeforeDecimals = this.state.crowdsale.maximumSellableTokens/10**tokenDecimals;
		const investorsCount = this.state.crowdsale.investors?this.state.crowdsale.investors.toString():0;
	    const ethRaised = this.state.crowdsale.ethRaised;
		const tokensClaimedRatio = goalInETH?(ethRaised/goalInETH)*100:"0";

		//tokens claimed: tiers, standard
		const tokensClaimedStandard = rate?(this.state.crowdsale.ethRaised/rate/*.toFixed(tokenDecimals)*/):0;
		const tokensClaimedTiers = rate?(this.state.crowdsale.tokensSold/10**tokenDecimals):0;
	    const tokensClaimed = (this.state.contractType == this.state.contractTypes.whitelistwithcap)?tokensClaimedTiers:tokensClaimedStandard;
	    	    

	    //price: tiers, standard
	    const tokensPerETHStandard = !isNaN(rate)?rate:0;
	    const tokensPerETHTiers = !isNaN(1/rate)?1/this.state.web3.fromWei(rate, "ether"):0;
	    const tokensPerETH = (this.state.contractType == this.state.contractTypes.whitelistwithcap)?tokensPerETHTiers:tokensPerETHStandard;
	    
	    //total supply: tiers, standard
	    const tierCap = maxCapBeforeDecimals?(maxCapBeforeDecimals/*.toFixed(tokenDecimals)*/).toString():0;
	    const standardCrowdsaleSupply = !isNaN(this.state.crowdsale.supply)?(this.state.crowdsale.supply/*.toFixed(tokenDecimals)*/).toString():0;
    	const totalSupply = (this.state.contractType == this.state.contractTypes.whitelistwithcap)?tierCap:standardCrowdsaleSupply;

	    //goal in ETH
	    const goalInETHStandard = (totalSupply/rate).toExponential();
	    const goalInETHTiers = rate?(this.state.web3.fromWei(maxCapBeforeDecimals*rate).toString()):0;
	    const goalInETH = (this.state.contractType == this.state.contractTypes.whitelistwithcap)?goalInETHTiers:goalInETHStandard;	    

	    
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
							<p className="total-funds-title">{ethRaised} ETH</p>
							<p className="total-funds-description">
								Total Raised Funds
							</p>
						</div>
						<div className="right">
							<p className="total-funds-title">{goalInETH} ETH</p>
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
						<div className="total-funds-chart-active" style={{width : tokensClaimedRatio + "%"}}></div>
					</div>
				</div>
				<div className="total-funds-statistics">
					<div className="hidden">
						<div className="left">
							<div className="hidden">
								<div className="left">
									<p className="title">{tokensClaimed}</p>
									<p className="description">
										Tokens Claimed
									</p>
								</div>
								<div className="right">
									<p className="title">{investorsCount}</p>
									<p className="description">
										Contributors
									</p>
								</div>
							</div>
							<p className="hash">{tokenAddr}</p>
							<p className="description">
								Token Address
							</p>
						</div>
						<div className="right">
							<div className="hidden">
								<div className="left">
									<p className="title">{tokensPerETH}</p>
									<p className="description">
										Price (Tokens/ETH)
									</p>
								</div>
								<div className="right">
									<p className="title">{totalSupply}</p>
									<p className="description">
										Total Supply
									</p>
								</div>
							</div>
							<p className="hash">{crowdsaleAddr}</p>
							<p className="description">
								Crowdsale Contract Address
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="button-container">
				{/*<Link to={{ pathname: this.state.contracts.crowdsale.addr?('/invest' + ('?crowdsale=' + this.state.contracts.crowdsale.addr):""):'/invest' }}><a href="#" className="button button_fill">Invest</a></Link>*/}
				{/*<Link className="button button_fill_secondary" to={{ pathname: '/3', query: { state: this.state, changeState: this.changeState } }}>Add crowdsale</Link>*/}
				<a onClick={this.goToInvestPage} className="button button_fill">Invest</a>
			</div>
			<Loader show={this.state.loading}></Loader>
		</section>
		)
	}
}