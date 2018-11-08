import React from 'react'
import { NAVIGATION_STEPS } from '../../utils/constants'
import { LogoWhite } from '../LogoWhite/index'
import { StepItem } from './StepItem'

export const StepNavigation = ({ activeStepTitle }) => {
  const { CONTRIBUTE_PAGE } = NAVIGATION_STEPS
  const stepsTitlesArray = Object.values(NAVIGATION_STEPS)
  const stepsTextArrayWithContributePage = stepsTitlesArray.slice(0, stepsTitlesArray.length - 1)

  const showContributePageItem = () => {
    return CONTRIBUTE_PAGE === activeStepTitle
  }

  const isLastItem = index => {
    return index + 1 === stepsTextArrayWithContributePage.length
  }

  const isStepActive = (stepsTextArray, stepText, activeStepText) => {
    const stepIndex = stepsTextArray.indexOf(stepText)
    const activeStepIndex = stepsTextArray.indexOf(activeStepText)

    return stepIndex <= activeStepIndex ? true : false
  }

  const stepItems = stepsTextArrayWithContributePage.map((item, index) => (
    <StepItem
      active={isStepActive(stepsTextArrayWithContributePage, item, activeStepTitle) || showContributePageItem()}
      itemTitle={item}
      key={index}
      hideSeparator={isLastItem(index) && !showContributePageItem()}
    />
  ))

  const contributePageStepItem = showContributePageItem() ? (
    <StepItem active={true} itemTitle={CONTRIBUTE_PAGE} showSeparator={false} size={'sm'} />
  ) : null

  return (
    <div className="st-StepNavigation">
      <LogoWhite />
      <div className="st-StepNavigation_Container">
        {stepItems}
        {contributePageStepItem}
      </div>
    </div>
  )
}
