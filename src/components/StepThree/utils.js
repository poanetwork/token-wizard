import moment from 'moment'
import { StepThreeFormMintedCapped } from './StepThreeFormMintedCapped'
import { StepThreeFormDutchAuction } from './StepThreeFormDutchAuction'
import { CROWDSALE_STRATEGIES } from '../../utils/constants'
import createDecorator from 'final-form-calculate'

export function defaultCompanyStartDate() {
  return moment()
    .add(5, 'minutes')
    .format('YYYY-MM-DDTHH:mm')
}

export const defaultCompanyEndDate = startDate => {
  return moment(startDate)
    .add(4, 'days')
    .startOf('day')
    .format('YYYY-MM-DDTHH:mm')
}

export const getStep3Component = strategy => {
  switch (strategy) {
    case CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE:
      return StepThreeFormMintedCapped
    case CROWDSALE_STRATEGIES.DUTCH_AUCTION:
      return StepThreeFormDutchAuction
    default:
      return StepThreeFormMintedCapped
  }
}

export const tierDurationUpdater = tiers => {
  return createDecorator({
    field: /.+\.endTime/,
    updates: (value, name) => {
      const nextTierIndex = +name.match(/(\d+)/)[1] + 1
      const newValue = {}

      if (tiers[nextTierIndex]) {
        newValue[`tiers[${nextTierIndex}].startTime`] = value
      }

      return newValue
    }
  })
}
