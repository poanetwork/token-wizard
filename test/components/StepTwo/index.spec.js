import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { Provider } from 'mobx-react'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { StepTwo } from '../../../src/components/StepTwo/index'
import { tokenStore, crowdsaleStore, reservedTokenStore } from '../../../src/stores'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('StepTwo', () => {
  const stores = { tokenStore, crowdsaleStore, reservedTokenStore }
  const history = {
    push: jest.fn()
  }

  it(`should render StepTwo for Minted Capped strategy`, () => {
    // Given
    const component = renderer.create(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should render StepTwo for Dutch Auction strategy`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.DUTCH_AUCTION)
    const component = renderer.create(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should click go back button`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )
    const stepTwoComponent = wrapper.find('StepTwo')

    // When
    stepTwoComponent.find('button.sw-ButtonBack').simulate('click')

    // Then
    expect(stepTwoComponent.instance().state.backButtonTriggered).toBeTruthy()
  })

  it(`should click next button`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )
    const stepTwoComponent = wrapper.find('StepTwo')

    // When
    stepTwoComponent.find('button.sw-ButtonContinue').simulate('click')

    setTimeout(() => {
      // Then
      expect(stepTwoComponent.instance().state.nextButtonTriggered).toBeTruthy()
    }, 2000)
  })

  it(`should execute goBack`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )
    // Then
    const stepTwoComponent = wrapper.find('StepTwo')
    const stepTwoComponentInstance = stepTwoComponent.instance()
    stepTwoComponentInstance.goBack()

    // When
    expect(stepTwoComponentInstance.state.backButtonTriggered).toBeTruthy()
  })

  it(`should execute goNextStep`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )
    // Then
    const stepTwoComponent = wrapper.find('StepTwo')
    const stepTwoComponentInstance = stepTwoComponent.instance()
    stepTwoComponentInstance.goNextStep()

    // When
    expect(stepTwoComponentInstance.state.nextButtonTriggered).toBeTruthy()
  })

  it(`should execute goBackEnabled`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo history={history} />
        </MemoryRouter>
      </Provider>
    )
    // Then
    const stepTwoComponent = wrapper.find('StepTwo')
    const stepTwoComponentInstance = stepTwoComponent.instance()
    stepTwoComponentInstance.goBackEnabled()

    // When
    expect(stepTwoComponentInstance.state.goBackEnabledTriggered).toBeTruthy()
  })
})
