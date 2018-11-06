import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { TxStatusIconClockActive } from '../../../src/components/Common/TxStatusIconClockActive'

configure({ adapter: new Adapter() })

describe(`TxStatusIconClockActive`, () => {
  it(`should be a <svg> tag`, () => {
    const wrapper = shallow(<TxStatusIconClockActive />)

    expect(wrapper.type()).toBe('svg')
  })

  it(`should render TxStatusIconClockActive component`, () => {
    // Given
    const component = render.create(<TxStatusIconClockActive />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
