import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { ButtonCreateCrowdsale } from '../../../src/components/Home/ButtonCreateCrowdsale'

configure({ adapter: new Adapter() })

describe('ButtonCreateCrowdsale', () => {
  const history = {
    push: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    const wrapper = shallow(<ButtonCreateCrowdsale />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <ButtonCreateCrowdsale />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.hm-ButtonCreateCrowdsale')

    // Then
    expect(tree).toHaveLength(1)
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <ButtonCreateCrowdsale />
      </MemoryRouter>
    )
    // When
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should simulate click`, () => {
    // Given
    const wrapper = shallow(<ButtonCreateCrowdsale history={history} />)
    const instance = wrapper.instance()
    const goToStepOneHandler = jest.spyOn(instance, 'goToStepOne')
    instance.forceUpdate()
    // When
    const buttonCreateCrowdsale = wrapper.find('.hm-ButtonCreateCrowdsale')
    buttonCreateCrowdsale.simulate('click')

    // Then
    expect(buttonCreateCrowdsale.length).toBe(1)
    expect(goToStepOneHandler).toHaveBeenCalledTimes(1)
  })
})
