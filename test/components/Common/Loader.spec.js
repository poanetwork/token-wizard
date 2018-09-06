import React from 'react'
import renderer from 'react-test-renderer'
import { Loader } from '../../../src/components/Common/Loader'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'

configure({ adapter: new Adapter() })

describe('Loader ', () => {
  it(`should render Loader`, () => {
    // Given
    const component = renderer.create(<Loader show={true} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should render Loader component with class name 'loading container'`, () => {
    const wrapper = shallow(<Loader show={true} />)
    expect(wrapper.type()).toBe('div')
  })

  it(`should render Loader component with class name 'loading container'`, () => {
    const wrapper = shallow(<Loader show={false} />)
    expect(wrapper.type()).toBeNull()
  })
})
