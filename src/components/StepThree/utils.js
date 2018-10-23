import moment from 'moment'
import { StepThreeFormMintedCapped } from './StepThreeFormMintedCapped'
import { StepThreeFormDutchAuction } from './StepThreeFormDutchAuction'
import { CROWDSALE_STRATEGIES } from '../../utils/constants'

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
