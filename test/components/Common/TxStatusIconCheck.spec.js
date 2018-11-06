import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { TxStatusIconCheck } from '../../../src/components/Common/TxStatusIconCheck'

configure({ adapter: new Adapter() })

describe(`TxStatusIconCheck`, () => {
  it(`should be a <svg> tag`, () => {
    const wrapper = shallow(<TxStatusIconCheck />)

    expect(wrapper.type()).toBe('svg')
  })

  it(`should render TxStatusIconCheck component`, () => {
    // Given
    const component = render.create(<TxStatusIconCheck />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
