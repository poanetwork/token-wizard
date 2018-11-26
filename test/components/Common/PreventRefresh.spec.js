import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { PreventRefresh } from '../../../src/components/Common/PreventRefresh'

configure({ adapter: new Adapter() })

describe(`PreventRefresh`, () => {
  it(`should render PreventRefresh component`, () => {
    // Given
    const component = render.create(<PreventRefresh />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
