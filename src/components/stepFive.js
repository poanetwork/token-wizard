import React from 'react'
import '../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'

export class stepFive extends React.Component {
	constructor(props) {
	    super(props);
	    console.log(props);
	    this.state = props?props.location?props.location.query?props.location.query.state?props.location.query.state:{}:{}:{}:{};
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
							<p className="total-funds-title">105,000 ETH</p>
							<p className="total-funds-description">
								Total Raised Funds
							</p>
						</div>
						<div className="right">
							<p className="total-funds-title">175,000 ETH</p>
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
						<div className="total-funds-chart-active" style={{width : "44%"}}></div>
					</div>
				</div>
				<div className="total-funds-statistics">
					<div className="hidden">
						<div className="left">
							<div className="hidden">
								<div className="left">
									<p className="title">603,750,000</p>
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
							<p className="hash">{this.state.contracts?this.state.contracts.crowdsale.addr:"0xc1253365dADE090649147Db89EE781d10f2b972f"}</p>
							<p className="description">
								Token Address
							</p>
						</div>
						<div className="right">
							<div className="hidden">
								<div className="left">
									<p className="title">5,750</p>
									<p className="description">
										Price (Tokens/ETH)
									</p>
								</div>
								<div className="right">
									<p className="title">9,250</p>
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
				<Link to='/invest'><a href="#" className="button button_fill">Invest</a></Link>
			</div>
		</section>
		)
	}
}