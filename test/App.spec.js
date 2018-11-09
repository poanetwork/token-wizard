import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, render } from 'enzyme'
import { Provider } from 'mobx-react'
import renderer from 'react-test-renderer'
import { Web3Provider } from '../src/react-web3'
import { deploymentStore } from '../src/stores'
import App from '../src/App'

configure({ adapter: new Adapter() })

describe('App Index', () => {
  const stores = { deploymentStore }

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  it(`should render app screen`, () => {
    // Given
    const component = renderer.create(
      <Provider {...stores}>
        <App />
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('renders without crashing', () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <App />
      </Provider>
    )

    // Given
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it('should render screen with render without throwing an error', () => {
    // When
    const wrapper = render(
      <Provider {...stores}>
        <App />
      </Provider>
    )

    // Given
    const tree = wrapper.html()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should not find web3Provider at home`, () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <App />
      </Provider>
    )
    jest.runTimersToTime(2000)

    // When
    const web3ProviderWrapper = wrapper.find(Web3Provider)

    // Then
    expect(web3ProviderWrapper).toHaveLength(0)
  })
})
