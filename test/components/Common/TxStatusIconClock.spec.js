import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { TxStatusIconClock } from '../../../src/components/Common/TxStatusIconClock'

configure({ adapter: new Adapter() })

describe(`TxStatusIconClock`, () => {
  it(`should be a <svg> tag`, () => {
    const wrapper = shallow(<TxStatusIconClock />)

    expect(wrapper.type()).toBe('svg')
  })

  it(`should render TxStatusIconClock component`, () => {
    // Given
    const component = render.create(<TxStatusIconClock />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
