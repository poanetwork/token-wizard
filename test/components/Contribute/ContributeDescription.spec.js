import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure } from 'enzyme'
import { ContributeDescription } from '../../../src/components/Contribute/ContributeDescription'

configure({ adapter: new Adapter() })

describe(`ContributeDescription`, () => {
  it(`should render ContributeDescription component`, () => {
    // Given
    const component = render.create(<ContributeDescription />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
