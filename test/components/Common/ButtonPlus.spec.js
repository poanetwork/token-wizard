import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonPlus } from '../../../src/components/Common/ButtonPlus'

configure({ adapter: new Adapter() })

describe(`ButtonPlus`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonPlus />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonPlus />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should render ButtonPlus component`, () => {
    // Given
    const component = render.create(<ButtonPlus onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
