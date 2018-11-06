import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonDownload } from '../../../src/components/Common/ButtonDownload'

configure({ adapter: new Adapter() })

describe(`ButtonDownload`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonDownload />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonDownload />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should render ButtonDownload component`, () => {
    // Given
    const component = render.create(<ButtonDownload onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
