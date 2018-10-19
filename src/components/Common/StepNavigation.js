import React from 'react'
import { isStepActive } from '../../utils/utils'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { LogoWhite } from '../LogoWhite/index'

const { CROWDSALE_STRATEGY, TOKEN_SETUP, CROWDSALE_SETUP, PUBLISH, CROWDSALE_PAGE } = NAVIGATION_STEPS
const stepsTextArray = Object.values(NAVIGATION_STEPS)

export const StepNavigation = ({ activeStep }) => (
  <div className="st-StepNavigation">
    <LogoWhite />
    <div className="st-StepNavigation_Container">
      <div
        className={`st-StepNavigation_StepContainer
        ${isStepActive(stepsTextArray, CROWDSALE_STRATEGY, activeStep)}`}
      >
        <div className="st-StepNavigation_StepCircle" />
        <div className="st-StepNavigation_StepLine" />
        <span className="st-StepNavigation_StepText">{CROWDSALE_STRATEGY}</span>
      </div>
      <div
        className={`st-StepNavigation_StepContainer
        ${isStepActive(stepsTextArray, TOKEN_SETUP, activeStep)}`}
      >
        <div className="st-StepNavigation_StepCircle" />
        <div className="st-StepNavigation_StepLine" />
        <span className="st-StepNavigation_StepText">{TOKEN_SETUP}</span>
      </div>
      <div
        className={`st-StepNavigation_StepContainer
        ${isStepActive(stepsTextArray, CROWDSALE_SETUP, activeStep)}`}
      >
        <div className="st-StepNavigation_StepCircle" />
        <div className="st-StepNavigation_StepLine" />
        <span className="st-StepNavigation_StepText">{CROWDSALE_SETUP}</span>
      </div>
      <div
        className={`st-StepNavigation_StepContainer
        ${isStepActive(stepsTextArray, PUBLISH, activeStep)}`}
      >
        <div className="st-StepNavigation_StepCircle" />
        <div className="st-StepNavigation_StepLine" />
        <span className="st-StepNavigation_StepText">{PUBLISH}</span>
      </div>
      <div
        className={`st-StepNavigation_StepContainer
        ${isStepActive(stepsTextArray, CROWDSALE_PAGE, activeStep)}`}
      >
        <div className="st-StepNavigation_StepCircle" />
        <span className="st-StepNavigation_StepText">{CROWDSALE_PAGE}</span>
      </div>
    </div>
  </div>
)
