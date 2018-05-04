import React from 'react'
import { StaticRouter } from 'react-router'
import { DistributeTokensStep } from './DistributeTokensStep'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import ReservedTokenStore from '../../stores/ReservedTokenStore'

configure({ adapter: new Adapter() })

const tokenList = [
  {
    addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
    dim: 'tokens',
    value: '120'
  },
  {
    addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
    dim: 'percentage',
    value: '105'
  },
  {
    addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    dim: 'percentage',
    value: '100'
  },
  {
    addr: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b',
    dim: 'tokens',
    value: '20'
  }
]


describe('DistributeTokensStep', () => {
  let reservedTokenStore

  beforeEach(() => {
    reservedTokenStore = new ReservedTokenStore()
  })

  afterEach(() => {
    reservedTokenStore.clearAll()
  })

  it(`should render reserved token addresses if it's the owner`, () => {
    tokenList.forEach(token => reservedTokenStore.addToken(token))

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
    tokenList.forEach(token => reservedTokenStore.addToken(token))

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

  it(`should not the component if there's no tokens in the reservedTokenStore`, () => {
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

    expect(wrapper.find('.steps-content.container')).toHaveLength(0)
  })
})
