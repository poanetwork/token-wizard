import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import renderer from 'react-test-renderer'
import Web3Provider from '../../src/react-web3/Web3Provider'

configure({ adapter: new Adapter() })

describe('Web3Provider', () => {
  it(`should render web3Provider screen`, () => {
    // Given
    const component = renderer.create(<Web3Provider />)
    // When
    const tree = component.toJSON()
    // Then
    expect(tree).toMatchSnapshot()
  })
  it('renders without crashing', () => {
    // Given
    const wrapper = mount(<Web3Provider />)
    // Given
    const tree = wrapper.html()
    // Then
    expect(tree).toMatchSnapshot()
  })
  it('should render screen with render without throwing an error', () => {
    // When
    const wrapper = render(<Web3Provider />)
    // Given
    const tree = wrapper.html()
    // Then
    expect(tree).toMatchSnapshot()
  })
})
