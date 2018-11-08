import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { CancelCrowdsale } from '../../../src/components/Home/CancelCrowdsale'

configure({ adapter: new Adapter() })

describe('CancelCrowdsale', () => {
  const history = {
    push: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    const wrapper = shallow(<CancelCrowdsale />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <CancelCrowdsale />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.hm-Home_BtnChoose')

    // Then
    expect(tree).toHaveLength(1)
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <CancelCrowdsale />
      </MemoryRouter>
    )
    // When
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should simulate click`, () => {
    // Given
    const wrapper = shallow(<CancelCrowdsale history={history} />)
    const instance = wrapper.instance()
    const cancelHandler = jest.spyOn(instance, 'cancel')
    instance.forceUpdate()
    // When
    const buttonCancelCrowdsale = wrapper.find('.hm-Home_BtnChoose')
    buttonCancelCrowdsale.simulate('click')

    // Then
    expect(buttonCancelCrowdsale.length).toBe(1)
    expect(cancelHandler).toHaveBeenCalledTimes(1)
  })
})
