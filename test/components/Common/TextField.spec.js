import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { TextField } from '../../../src/components/Common/TextField'

configure({ adapter: new Adapter() })

describe(`TextField`, () => {
  it(`should be a <input> HTML tag`, () => {
    const wrapper = shallow(<TextField />)

    expect(wrapper.type()).toBe('input')
  })

  it(`its type attribute should be defined`, () => {
    const wrapper = shallow(<TextField type="text" />)

    expect(wrapper.props().type).toBeDefined()
  })

  it(`should render TextField component`, () => {
    // Given
    const component = render.create(<TextField />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
