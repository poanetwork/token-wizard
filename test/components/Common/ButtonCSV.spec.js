import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonCSV } from '../../../src/components/Common/ButtonCSV'

configure({ adapter: new Adapter() })

describe(`ButtonCSV`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonCSV />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonCSV />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should contain the button's text`, () => {
    const theText = 'The button text'
    const wrapper = shallow(<ButtonCSV text={theText} onClick={jest.fn()} />)

    expect(wrapper.text()).toBe(theText)
  })

  it(`should render ButtonCSV component`, () => {
    // Given
    const component = render.create(<ButtonCSV onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
