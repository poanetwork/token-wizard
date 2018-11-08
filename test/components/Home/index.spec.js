import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'mobx-react'
import { Home } from '../../../src/components/Home/index'
import { ChooseCrowdsale } from '../../../src/components/Home/ChooseCrowdsale'
import { CreateCrowdsale } from '../../../src/components/Home/CreateCrowdsale'
import storage from 'store2'
import { deploymentStore } from '../../../src/stores'

configure({ adapter: new Adapter() })

describe('Home', () => {
  const history = {
    push: jest.fn()
  }
  const stores = { deploymentStore }

  it('should render screen with shallow without throwing an error', () => {
    // Given
    const wrapper = shallow(
      <Provider {...stores}>
        <Home />
      </Provider>
    )

    // When
    const tree = wrapper.find('div.hm-Home_MainInfo')

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/']}>
          <Home />
        </MemoryRouter>
      </Provider>
    )

    // Given
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with render without throwing an error', () => {
    // When
    const wrapper = render(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/']}>
          <Home />
        </MemoryRouter>
      </Provider>
    )

    // Given
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should navigate to StepOne`, async () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/']}>
          <Home history={history} />
        </MemoryRouter>
      </Provider>
    )
    const createCrowdsaleComponentWrapper = wrapper.find(CreateCrowdsale)
    const instance = createCrowdsaleComponentWrapper.instance()
    const goToStepOneHandler = jest.spyOn(instance, 'goToStepOne')
    instance.forceUpdate()
    storage.clearAll()

    // When
    const buttonCreateCrowdsale = createCrowdsaleComponentWrapper.find('.hm-Home_BtnNew')
    buttonCreateCrowdsale.simulate('click')

    // Then
    expect(buttonCreateCrowdsale.length).toBe(1)
    expect(goToStepOneHandler).toHaveBeenCalledTimes(1)
    expect(goToStepOneHandler).toHaveBeenCalledWith()
  })

  it(`should navigate to Crowdsales List`, async () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/']}>
          <Home history={history} />
        </MemoryRouter>
      </Provider>
    )
    const chooseCrowdsaleComponentWrapper = wrapper.find(ChooseCrowdsale)
    const instance = chooseCrowdsaleComponentWrapper.instance()
    const goToCrowdsalesHandler = jest.spyOn(instance, 'goToCrowdsales')
    instance.forceUpdate()
    storage.clearAll()

    // When
    const chooseCrowdsale = chooseCrowdsaleComponentWrapper.find('.hm-Home_BtnChoose')
    chooseCrowdsale.simulate('click')

    // Then
    expect(chooseCrowdsale.length).toBe(1)
    expect(goToCrowdsalesHandler).toHaveBeenCalledTimes(1)
    expect(goToCrowdsalesHandler).toHaveBeenCalledWith()
  })
})
