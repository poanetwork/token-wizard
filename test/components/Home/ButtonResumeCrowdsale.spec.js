import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { ButtonResumeCrowdsale } from '../../../src/components/Home/ButtonResumeCrowdsale'

configure({ adapter: new Adapter() })

describe('ButtonResumeCrowdsale', () => {
  const history = {
    push: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    const wrapper = shallow(<ButtonResumeCrowdsale />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <ButtonResumeCrowdsale />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.hm-ButtonResumeCrowdsale')

    // Then
    expect(tree).toHaveLength(1)
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <ButtonResumeCrowdsale />
      </MemoryRouter>
    )
    // When
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should simulate click`, () => {
    // Given
    const wrapper = shallow(<ButtonResumeCrowdsale history={history} />)
    const instance = wrapper.instance()
    const resumeHandler = jest.spyOn(instance, 'resume')
    instance.forceUpdate()
    // When
    const buttonResumeCrowdsale = wrapper.find('.hm-ButtonResumeCrowdsale')
    buttonResumeCrowdsale.simulate('click')

    // Then
    expect(buttonResumeCrowdsale.length).toBe(1)
    expect(resumeHandler).toHaveBeenCalledTimes(1)
  })
})
