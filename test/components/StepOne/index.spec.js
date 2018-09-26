import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { StepOne } from '../../../src/components/StepOne/index'
import { crowdsaleStore, contractStore, generalStore, web3Store } from '../../../src/stores'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('StepOne', () => {
  const history = { push: jest.fn() }
  const stores = { crowdsaleStore, generalStore, contractStore, web3Store }
  const { MINTED_CAPPED_CROWDSALE, DUTCH_AUCTION } = CROWDSALE_STRATEGIES

  it(`should render StepOne screen`, () => {
    // Given
    const component = renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <StepOne {...stores} />
      </MemoryRouter>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should navigate to StepTwo`, () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <StepOne {...stores} history={history} />
      </MemoryRouter>
    )
    const stepOneComponent = wrapper.find('StepOne')
    const navigateToHandler = jest.spyOn(stepOneComponent.instance(), 'goNextStep')
    wrapper.update()

    // When
    stepOneComponent.find('.sw-ButtonContinue').simulate('click')

    // Then
    expect(navigateToHandler).toHaveBeenCalledTimes(1)
    expect(navigateToHandler).toHaveBeenCalledWith()
  })

  it(`should switch to DutchAuction Strategy`, () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <StepOne {...stores} history={history} />
      </MemoryRouter>
    )
    const stepOneComponent = wrapper.find('StepOne')

    // When
    stepOneComponent
      .find('input[name="contract-type"]')
      .at(1)
      .simulate('change', { target: { value: DUTCH_AUCTION } })

    // Then
    expect(stepOneComponent.instance().state.strategy).toBe(DUTCH_AUCTION)
  })

  it(`should switch to MintedCapped Strategy`, () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <StepOne {...stores} history={history} />
      </MemoryRouter>
    )
    const stepOneComponent = wrapper.find('StepOne')

    // When
    const contractTypeInputs = stepOneComponent.find('input[name="contract-type"]')
    contractTypeInputs.at(1).simulate('change', { target: { value: DUTCH_AUCTION } })
    contractTypeInputs.at(0).simulate('change', { target: { value: MINTED_CAPPED_CROWDSALE } })

    // Then
    expect(stepOneComponent.instance().state.strategy).toBe(MINTED_CAPPED_CROWDSALE)
  })
})
