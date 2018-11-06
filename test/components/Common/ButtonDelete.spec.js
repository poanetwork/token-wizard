import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonDelete } from '../../../src/components/Common/ButtonDelete'

configure({ adapter: new Adapter() })

describe(`ButtonDelete`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonDelete />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonDelete />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should render ButtonDelete component`, () => {
    // Given
    const component = render.create(<ButtonDelete onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
