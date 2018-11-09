import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { ButtonChooseCrowdsale } from '../../../src/components/Home/ButtonChooseCrowdsale'

configure({ adapter: new Adapter() })

describe('ButtonChooseCrowdsale', () => {
  const history = {
    push: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    const wrapper = shallow(<ButtonChooseCrowdsale />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <ButtonChooseCrowdsale />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.hm-ButtonChooseCrowdsale')

    // Then
    expect(tree).toHaveLength(1)
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <ButtonChooseCrowdsale />
      </MemoryRouter>
    )
    // When
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should simulate click`, () => {
    // Given
    const wrapper = shallow(<ButtonChooseCrowdsale history={history} />)
    const instance = wrapper.instance()
    const goToCrowdsalesHandler = jest.spyOn(instance, 'goToCrowdsales')
    instance.forceUpdate()
    // When
    const buttonChooseCrowdsale = wrapper.find('.hm-ButtonChooseCrowdsale')
    buttonChooseCrowdsale.simulate('click')

    // Then
    expect(buttonChooseCrowdsale.length).toBe(1)
    expect(goToCrowdsalesHandler).toHaveBeenCalledTimes(1)
  })
})
