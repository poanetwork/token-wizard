import React from 'react'
import { StaticRouter } from 'react-router'
import { DistributeTokensStep } from './DistributeTokensStep'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import ReservedTokenStore from '../../stores/ReservedTokenStore'

configure({ adapter: new Adapter() })

describe('DistributeTokensStep', () => {
  let reservedTokenStore

  beforeEach(() => {
    reservedTokenStore = new ReservedTokenStore()
  })

  afterEach(() => {
    reservedTokenStore.clearAll()
  })

  it('should render the component with active button', () => {
    const distributeTokensStateParams = {
      disabled: false,
      handleClick: jest.fn(),
      reservedTokenStore,
      owner: true
    }

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('should render the component with disabled button', () => {
    const distributeTokensStateParams = {
      disabled: true,
      handleClick: jest.fn(),
      reservedTokenStore,
      owner: true
    }

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('should call handleClick', () => {
    const distributeTokensStateParams = {
      disabled: false,
      handleClick: jest.fn(),
      reservedTokenStore,
      owner: true
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    )

    const button = wrapper.find('Link').at(0)

    button.simulate('click')

    expect(distributeTokensStateParams.handleClick).toHaveBeenCalled()
  })

  it('should not call handleClick', () => {
    const distributeTokensStateParams = {
      disabled: true,
      handleClick: jest.fn(),
      reservedTokenStore,
      owner: true
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    )

    const button = wrapper.find('Link').at(0)

    button.simulate('click')

    expect(distributeTokensStateParams.handleClick).toHaveBeenCalledTimes(0)
  })

  it(`should render reserved token addresses if it's the owner`, () => {
    const distributeTokensStateParams = {
      disabled: false,
      handleClick: jest.fn(),
      reservedTokenStore,
      owner: true
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    )

    expect(wrapper.find('.read-only')).toHaveLength(1)
  })

  it(`should not render reserved token addresses if not the owner`, () => {
    const distributeTokensStateParams = {
      disabled: false,
      handleClick: jest.fn(),
      reservedTokenStore,
      owner: false
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <DistributeTokensStep {...distributeTokensStateParams} />
      </StaticRouter>
    )

    expect(wrapper.find('.read-only')).toHaveLength(0)
  })
})
