import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonBack } from '../../../src/components/Common/ButtonBack'

configure({ adapter: new Adapter() })

describe(`ButtonBack`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonBack />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonBack />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should render ButtonBack component`, () => {
    // Given
    const component = render.create(<ButtonBack onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
