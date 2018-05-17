import React from 'react'
import '../../assets/stylesheets/application.css';
import { getStepClass } from '../../utils/utils'
import { NAVIGATION_STEPS } from '../../utils/constants'
const { CROWDSALE_STRATEGY, TOKEN_SETUP, CROWDSALE_SETUP, PUBLISH, CROWDSALE_PAGE } = NAVIGATION_STEPS

export const StepNavigation = ({activeStep}) => (
	<div className="steps-navigation">
		<div className="container">
			<div className={getStepClass(CROWDSALE_STRATEGY, activeStep)}>{CROWDSALE_STRATEGY}</div>
			<div className={getStepClass(TOKEN_SETUP, activeStep)}>{TOKEN_SETUP}</div>
			<div className={getStepClass(CROWDSALE_SETUP, activeStep)}>{CROWDSALE_SETUP}</div>
			<div className={getStepClass(PUBLISH, activeStep)}>{PUBLISH}</div>
			<div className={getStepClass(CROWDSALE_PAGE, activeStep)}>{CROWDSALE_PAGE}</div>
		</div>
	</div>
)