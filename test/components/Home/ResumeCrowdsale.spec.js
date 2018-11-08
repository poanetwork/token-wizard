import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { ResumeCrowdsale } from '../../../src/components/Home/ResumeCrowdsale'

configure({ adapter: new Adapter() })

describe('ResumeCrowdsale', () => {
  const history = {
    push: jest.fn()
  }

  it('should render screen with shallow without throwing an error', () => {
    const wrapper = shallow(<ResumeCrowdsale />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <ResumeCrowdsale />
      </MemoryRouter>
    )

    // When
    const tree = wrapper.find('.hm-Home_BtnNew')

    // Then
    expect(tree).toHaveLength(1)
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <ResumeCrowdsale />
      </MemoryRouter>
    )
    // When
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should simulate click`, () => {
    // Given
    const wrapper = shallow(<ResumeCrowdsale history={history} />)
    const instance = wrapper.instance()
    const resumeHandler = jest.spyOn(instance, 'resume')
    instance.forceUpdate()
    // When
    const buttonResumeCrowdsale = wrapper.find('.hm-Home_BtnNew')
    buttonResumeCrowdsale.simulate('click')

    // Then
    expect(buttonResumeCrowdsale.length).toBe(1)
    expect(resumeHandler).toHaveBeenCalledTimes(1)
  })
})
