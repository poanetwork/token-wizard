import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { ButtonCancelCrowdsale } from '../../../src/components/Home/ButtonCancelCrowdsale'

configure({ adapter: new Adapter() })

describe('ButtonCancelCrowdsale', () => {
  const history = {
    push: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    const wrapper = shallow(<ButtonCancelCrowdsale />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <ButtonCancelCrowdsale />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.hm-ButtonCancelCrowdsale')

    // Then
    expect(tree).toHaveLength(1)
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <ButtonCancelCrowdsale />
      </MemoryRouter>
    )
    // When
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should simulate click`, () => {
    // Given
    const wrapper = shallow(<ButtonCancelCrowdsale history={history} />)
    const instance = wrapper.instance()
    const cancelHandler = jest.spyOn(instance, 'cancel')
    instance.forceUpdate()
    // When
    const buttonCancelCrowdsale = wrapper.find('.hm-ButtonCancelCrowdsale')
    buttonCancelCrowdsale.simulate('click')

    // Then
    expect(buttonCancelCrowdsale.length).toBe(1)
    expect(cancelHandler).toHaveBeenCalledTimes(1)
  })
})
