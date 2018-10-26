import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, render } from 'enzyme'
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer'

import { Home } from './index'

configure({ adapter: new Adapter() })

describe('Home Index', () => {

  it(`should render home screen`, () => {
    // Given
    const component = renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <Home/>
      </MemoryRouter>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('renders without crashing', () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>
    )

    // Given
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with render without throwing an error', () => {
    // When
    const wrapper = render(
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>
    )

    // Given
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

})
