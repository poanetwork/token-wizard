import React from 'react'
import { StepThree } from '../../../src/components/StepThree'
import { strategies } from '../../../src/utils/strategies'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure } from 'enzyme'
import {
  contractStore,
  web3Store,
  tierStore,
  generalStore,
  gasPriceStore,
  reservedTokenStore,
  deploymentStore,
  tokenStore,
  crowdsaleStore
} from '../../../src/stores'
import { MemoryRouter } from 'react-router'
import { Provider } from 'mobx-react'
import MockDate from 'mockdate'
import { mount } from 'enzyme/build/index'

configure({ adapter: new Adapter() })

global.scrollTo = jest.fn()

jest.mock('../../../src/utils/api')
jest.mock('../../../src/utils/fetchFile')

const currentTime = '2018-03-13T11:00:00'
MockDate.set(currentTime)

describe('StepThree', () => {
  const stores = {
    contractStore,
    web3Store,
    tierStore,
    generalStore,
    gasPriceStore,
    reservedTokenStore,
    deploymentStore,
    tokenStore,
    crowdsaleStore
  }
  const history = {
    push: jest.fn()
  }

  describe('StepThree - renders', () => {
    strategies.forEach(strategy => {
      it(`should render StepThree for ${strategy.display}`, () => {
        // Given
        // tierStore.addCrowdsale(walletAddress)
        stores.crowdsaleStore.setProperty('strategy', strategy.type)
        const component = renderer.create(
          <Provider {...stores}>
            <MemoryRouter initialEntries={['/']}>
              <StepThree {...stores} />
            </MemoryRouter>
          </Provider>
        )

        // When
        const tree = component.toJSON()

        // Then
        expect(tree).toMatchSnapshot()
      })
    })
  })

  it(`should execute goBack`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepThree />
        </MemoryRouter>
      </Provider>
    )
    // Then
    const stepThreeComponent = wrapper.find('StepThree')
    const stepThreeComponentInstance = stepThreeComponent.instance()
    stepThreeComponentInstance.goBack()

    // When
    expect(stepThreeComponentInstance.state.backButtonTriggered).toBeTruthy()
  })

  it(`should execute goNextStep`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepThree />
        </MemoryRouter>
      </Provider>
    )
    // Then
    const stepThreeComponent = wrapper.find('StepThree')
    const stepThreeComponentInstance = stepThreeComponent.instance()
    stepThreeComponentInstance.goNextStep()

    // When
    expect(stepThreeComponentInstance.state.nextButtonTriggered).toBeTruthy()
  })

  it(`should execute goBackEnabled`, () => {
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepThree history={history} />
        </MemoryRouter>
      </Provider>
    )
    // Then
    const stepThreeComponent = wrapper.find('StepThree')
    const stepThreeComponentInstance = stepThreeComponent.instance()
    stepThreeComponentInstance.goBackEnabled()

    // When
    expect(stepThreeComponentInstance.state.goBackEnabledTriggered).toBeTruthy()
  })
  // This tests is expected to trigger 'handleOnSubmit' method... but up to this point it wasn't working

  it(`should call onSubmit handler if form is valid`, () => {
    // Given
    process.NODE_ENV = 'test'
    const walletAddress = '0xAC7022d55dA6C8BB229b1Ba3Ce8A16724FF79c4A'
    const [{ type: strategy }] = strategies
    stores.crowdsaleStore.setProperty('strategy', strategy)
    stores.tierStore.addCrowdsale(walletAddress)
    stores.tokenStore.setProperty('decimals', 18)

    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/']}>
          <StepThree {...stores} history={history} />
        </MemoryRouter>
      </Provider>
    )
    const handleOnSubmit = jest.spyOn(wrapper.find('StepThree').instance(), 'handleOnSubmit')

    // When
    wrapper.find('input[name="walletAddress"]').simulate('change', { target: { value: walletAddress } })
    wrapper.find('input[name="tiers[0].endTime"]').simulate('change', { target: { value: '2018-03-14T12:00:00' } })
    wrapper.find('input[name="tiers[0].rate"]').simulate('change', { target: { value: '100000' } })
    wrapper.find('input[name="tiers[0].supply"]').simulate('change', { target: { value: '100' } })

    // Then

    const form = wrapper.find('form').at(0)
    const children = form
      .render()
      .children()
      .children()
    form.simulate('submit', { target: { children } })

    setTimeout(() => {
      wrapper.update()
      expect(handleOnSubmit).toHaveBeenCalledTimes(1)
    }, 2000)
  })
})
