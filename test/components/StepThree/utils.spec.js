import {
  defaultCompanyStartDate,
  defaultCompanyEndDate,
  getStep3Component
} from '../../../src/components/StepThree/utils'
import MockDate from 'mockdate'
import moment from 'moment'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'

beforeEach(() => {
  const currentTime = '2018-03-05T11:00:00'
  MockDate.set(currentTime)
})

describe('defaultCompanyStartDate', () => {
  it('Should return a day formatted as: YYYY-MM-DDTHH:mm', () => {
    const isFormatOk = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
    const startDate = defaultCompanyStartDate()

    expect(isFormatOk.test(startDate)).toBeTruthy()
  })

  it('Should return a day 5 minutes in the future', () => {
    const startDate = defaultCompanyStartDate()

    expect(
      moment()
        .add(5, 'minutes')
        .isSame(startDate)
    ).toBeTruthy()
  })
})

describe('defaultComanyEndDate', () => {
  it('Should return a day formatted as: YYYY-MM-DDTHH:mm', () => {
    const isFormatOk = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
    const startDate = defaultCompanyStartDate()
    const endDate = defaultCompanyEndDate(startDate)

    expect(isFormatOk.test(endDate)).toBeTruthy()
  })

  it('Should return a date 4 days in the future, at 00:00', () => {
    const startDate = defaultCompanyStartDate()
    const endDate = defaultCompanyEndDate(startDate)

    expect(
      moment()
        .add(4, 'days')
        .startOf('day')
        .isSame(endDate)
    ).toBeTruthy()
  })
})

describe('getStep3Component', () => {
  it(`should return Minted Capped Component if mintedCapped strategy is selected`, () => {
    // Given
    const strategy = CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE

    // When
    const component = getStep3Component(strategy)

    // Then
    expect(component.name).toBe('StepThreeFormMintedCapped')
  })

  it(`should return Dutch Auction Component if dutchAuction strategy is selected`, () => {
    // Given
    const strategy = CROWDSALE_STRATEGIES.DUTCH_AUCTION

    // When
    const component = getStep3Component(strategy)

    // Then
    expect(component.name).toBe('StepThreeFormDutchAuction')
  })

  it(`should return Minted Capped Component as default`, () => {
    // Given
    const strategy = 'none'

    // When
    const component = getStep3Component(strategy)

    // Then
    expect(component.name).toBe('StepThreeFormMintedCapped')
  })
})
