import React from 'react'
import { LogoWhite } from '../LogoWhite/index'
import { StepItem } from './StepItem'

export const ManageNavigation = ({ activeStepTitle, navigationSteps }) => {
  const stepsTitlesArray = Object.values(navigationSteps)

  const isLastItem = index => {
    return index + 1 === stepsTitlesArray.length
  }

  const isStepActive = (stepsTextArray, stepText, activeStepText) => {
    const stepIndex = stepsTextArray.indexOf(stepText)
    const activeStepIndex = stepsTextArray.indexOf(activeStepText)

    return stepIndex <= activeStepIndex ? true : false
  }

  const stepItems = stepsTitlesArray.map((item, index) => (
    <StepItem
      active={isStepActive(stepsTitlesArray, item, activeStepTitle)}
      itemTitle={item}
      key={index}
      hideSeparator={isLastItem(index)}
    />
  ))

  return (
    <div className="mng-ManageNavigation">
      <LogoWhite />
      <div className="mng-ManageNavigation_Container">{stepItems}</div>
    </div>
  )
}
