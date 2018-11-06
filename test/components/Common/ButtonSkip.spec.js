import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonSkip } from '../../../src/components/Common/ButtonSkip'

configure({ adapter: new Adapter() })

describe(`ButtonSkip`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonSkip />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonSkip />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should contain a span with the .sw-ButtonSkip_Text class`, () => {
    const theButtonText = 'The button text'
    const wrapper = shallow(<ButtonSkip buttonText={theButtonText} onClick={jest.fn()} />)
    const buttonChild = wrapper.find('span.sw-ButtonSkip_Text')

    expect(buttonChild.exists()).toBeTruthy()
  })

  it(`should render ButtonSkip component`, () => {
    // Given
    const component = render.create(<ButtonSkip onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
