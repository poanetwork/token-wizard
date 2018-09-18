import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { CreateCrowdsale } from '../../../src/components/Home/CreateCrowdsale'

configure({ adapter: new Adapter() })

describe('CreateCrowdsale', () => {
  const history = {
    push: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    // Given
    const wrapper = shallow(<CreateCrowdsale />)

    // When
    const tree = wrapper.find('button.hm-Home_BtnNew')

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <CreateCrowdsale />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('button.hm-Home_BtnNew')

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <CreateCrowdsale />
      </MemoryRouter>
    )
    // When
    const tree = wrapper.find('button.hm-Home_BtnNew')

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should simulate click`, () => {
    // Given
    const wrapper = shallow(<CreateCrowdsale history={history} />)
    const instance = wrapper.instance()
    const goToStepOneHandler = jest.spyOn(instance, 'goToStepOne')
    instance.forceUpdate()
    // When
    const buttonCreateCrowdsale = wrapper.find('.hm-Home_BtnNew')
    buttonCreateCrowdsale.simulate('click')

    // Then
    expect(buttonCreateCrowdsale.length).toBe(1)
    expect(goToStepOneHandler).toHaveBeenCalledTimes(1)
  })
})
