import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonNiftyWallet } from '../../../src/components/Common/ButtonNiftyWallet'

configure({ adapter: new Adapter() })

describe(`ButtonNiftyWallet`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonNiftyWallet />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonNiftyWallet />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should render ButtonNiftyWallet component`, () => {
    // Given
    const component = render.create(<ButtonNiftyWallet onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
