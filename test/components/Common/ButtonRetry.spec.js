import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonRetry } from '../../../src/components/Common/ButtonRetry'

configure({ adapter: new Adapter() })

describe(`ButtonRetry`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonRetry />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonRetry />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should contain a span with the .sw-ButtonRetry_Text class`, () => {
    const theButtonText = 'The button text'
    const wrapper = shallow(<ButtonRetry buttonText={theButtonText} onClick={jest.fn()} />)
    const buttonChild = wrapper.find('span.sw-ButtonRetry_Text')

    expect(buttonChild.exists()).toBeTruthy()
  })

  it(`should render ButtonRetry component`, () => {
    // Given
    const component = render.create(<ButtonRetry onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
