import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure } from 'enzyme'
import { ButtonBack } from '../../../src/components/Common/ButtonBack'

configure({ adapter: new Adapter() })

describe(`ButtonBack`, () => {
  it(`should render ButtonBack component`, () => {
    // Given
    const component = render.create(<ButtonBack onClick={jest.fn()} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
