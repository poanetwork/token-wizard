import React from 'react'
import '../../assets/stylesheets/application.css';
import { getStepClass } from '../../utils/utils'
import { NAVIGATION_STEPS } from '../../utils/constants'
const { CROWDSALE_CONTRACT, TOKEN_SETUP, CROWDSALE_SETUP, PUBLISH, CROWDSALE_PAGE } = NAVIGATION_STEPS

export const StepNavigation = ({activeStep}) => (
	<div className="steps-navigation">
		<div className="container">
			<div className={getStepClass(CROWDSALE_CONTRACT, activeStep)}>Crowdsale Contract</div>
			<div className={getStepClass(TOKEN_SETUP, activeStep)}>Token Setup</div>
			<div className={getStepClass(CROWDSALE_SETUP, activeStep)}>Crowdsale Setup</div>
			<div className={getStepClass(PUBLISH, activeStep)}>Publish</div>
			<div className={getStepClass(CROWDSALE_PAGE, activeStep)}>Crowdsale Page</div>
		</div>
	</div>
)