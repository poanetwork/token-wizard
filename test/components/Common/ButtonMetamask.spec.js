import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { ButtonMetamask } from '../../../src/components/Common/ButtonMetamask'

configure({ adapter: new Adapter() })

describe(`ButtonMetamask`, () => {
  it(`should be a <button> HTML tag`, () => {
    const wrapper = shallow(<ButtonMetamask />)

    expect(wrapper.type()).toBe('button')
  })

  it(`its type attribute should be 'button'`, () => {
    const wrapper = shallow(<ButtonMetamask />)

    expect(wrapper.props().type).toBe('button')
  })

  it(`should render ButtonMetamask component`, () => {
    // Given
    const component = render.create(<ButtonMetamask onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
