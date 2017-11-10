import React from 'react'
import '../../assets/stylesheets/application.css';
import { getWeb3, checkWeb3, checkNetWorkByID } from '../../utils/blockchainHelpers'
import { getCrowdsaleData, initializeAccumulativeData, getAccumulativeCrowdsaleData, findCurrentContractRecursively, getJoinedTiers } from './utils'
import { getQueryVariable, getURLParam, getWhiteListWithCapCrowdsaleAssets, toFixed } from '../../utils/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { invalidCrowdsaleAddrAlert } from '../../utils/alerts'
import { defaultState } from '../../utils/constants'
import { Loader } from '../Common/Loader'
import { ICOConfig } from '../Common/config'
const { CROWDSALE_PAGE } = NAVIGATION_STEPS

export class Crowdsale extends React.Component {
	constructor(props) {
	    super(props);
	    console.log(props);
	    this.state = defaultState;
	}

	componentDidMount () {
		checkWeb3(this.state.web3);
		let newState = { ...this.state }
	    newState.loading = true;
	    newState.tokenIsAlreadyCreated = true;
	    this.setState(newState);
		const networkID = ICOConfig.networkID?ICOConfig.networkID:getQueryVariable("networkID");
		const contractType = this.state.contractTypes.whitelistwithcap;//getQueryVariable("contractType");
		setTimeout(() => {
			getWeb3((web3) => this.getCrowdsale(web3, networkID, contractType));
		}, 500);
	}

	getCrowdsale (web3, networkID, contractType) {
		if (!web3) {
			let state = this.state;
			state.loading = false;
        	this.setState(state);
			return
		};
		var state = this.state;
		state.web3 = web3;
		checkNetWorkByID(web3, networkID);
		state.networkID = networkID;
		state.contractType = contractType;

	    getWhiteListWithCapCrowdsaleAssets(state, (_newState) => {
        	this.setState(_newState, () => {
        		this.extractContractsData(web3);
        	});
	    });
	}

	extractContractsData(web3) {
		const crowdsaleAddr = ICOConfig.crowdsaleContractURL?ICOConfig.crowdsaleContractURL:getURLParam("addr");
		if (!web3.utils.isAddress(crowdsaleAddr)) {
			let state = this.state;
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
			var state = this.state;
		    state.contracts.crowdsale.addr = _crowdsaleAddrs;

		    web3.eth.getAccounts().then((accounts) => {
			  	state.curAddr = accounts[0];
		      	state.web3 = web3;
		      	this.setState(state, () => {
			      	if (!this.state.contracts.crowdsale.addr) return;
			      	findCurrentContractRecursively(0, this, web3, null, (crowdsaleContract) => {
			      		if (!crowdsaleContract) {
			      			state.loading = false;
			        		return this.setState(state);
			      		}
			      		this.getFullCrowdsaleData(web3, crowdsaleContract)
				    })
		      	});
	      	});
		})
  	}

  	getFullCrowdsaleData(web3, crowdsaleContract) {
  		getCrowdsaleData(web3, this, crowdsaleContract, () => {
	    	initializeAccumulativeData(this, () => {
	    		getAccumulativeCrowdsaleData(web3, this, () => {
	        	});
	      	});
	    });
  	}

  	goToInvestPage = () => {
  		let queryStr = "";
  		if (!ICOConfig.crowdsaleContractURL || !ICOConfig.networkID) {
  			if (this.state.contracts.crowdsale.addr) {
	  			queryStr = "?addr=" + this.state.contracts.crowdsale.addr[0];
	  			if (this.state.networkID)
	  				queryStr += "&networkID=" + this.state.networkID;
	  		}
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

		//tokens claimed: tiers, standard
		const tokensClaimedStandard = rate?(this.state.crowdsale.ethRaised/rate):0;
		const tokensClaimedTiers = rate?(this.state.crowdsale.tokensSold/10**tokenDecimals):0;
	    const tokensClaimed = (this.state.contractType === this.state.contractTypes.whitelistwithcap)?tokensClaimedTiers:tokensClaimedStandard;


	    //price: tiers, standard
	    const tokensPerETHStandard = !isNaN(rate)?rate:0;
	    const tokensPerETHTiers = !isNaN(1/rate)?1/this.state.web3.utils.fromWei(toFixed(rate).toString(), "ether"):0;
	    const tokensPerETH = (this.state.contractType === this.state.contractTypes.whitelistwithcap)?tokensPerETHTiers:tokensPerETHStandard;

	    //total supply: tiers, standard
	    const tierCap = maxCapBeforeDecimals?(maxCapBeforeDecimals).toString():0;
	    const standardCrowdsaleSupply = !isNaN(this.state.crowdsale.supply)?(this.state.crowdsale.supply).toString():0;
    	const totalSupply = (this.state.contractType === this.state.contractTypes.whitelistwithcap)?tierCap:standardCrowdsaleSupply;

	    //goal in ETH
	    const goalInETHStandard = (totalSupply/rate).toExponential();
	    let goalInETHTiers = this.state.crowdsale.maximumSellableTokensInWei?(this.state.web3.utils.fromWei(toFixed(this.state.crowdsale.maximumSellableTokensInWei).toString(), "ether").toString()):0;
	    goalInETHTiers = 1.0 / 100 * Math.floor(100 * goalInETHTiers)
	    const goalInETH = (this.state.contractType === this.state.contractTypes.whitelistwithcap)?goalInETHTiers:goalInETHStandard;

	    const tokensClaimedRatio = goalInETH?(ethRaised/goalInETH)*100:"0";

	    return (
		<section className="steps steps_crowdsale-page">
			<StepNavigation activeStep={CROWDSALE_PAGE} />
			<div className="steps-content container">
				<div className="about-step">
					<div className="step-icons step-icons_crowdsale-page"></div>
					<p className="title">Crowdsale Page</p>
					<p className="description">
						Page with statistics of crowdsale. Statistics for all tiers combined on the page. Please press Ctrl-D to bookmark the page.
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
				<a onClick={this.goToInvestPage} className="button button_fill">Invest</a>
			</div>
			<Loader show={this.state.loading}></Loader>
		</section>
		)
	}
}
