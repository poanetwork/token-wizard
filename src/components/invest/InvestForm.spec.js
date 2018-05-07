import React from 'react'
import { Provider } from 'mobx-react'
import { Form } from 'react-final-form'
import InvestStore from '../../stores/InvestStore'
import TokenStore from '../../stores/TokenStore'
import { InvestForm } from './InvestForm'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { INVESTMENT_OPTIONS } from '../../utils/constants'

configure({ adapter: new Adapter() })

describe('InvestForm', () => {
  let investStore
  let tokenStore

  beforeEach(() => {
    investStore = new InvestStore()
    tokenStore = new TokenStore()
  })

  it(`should render InvestForm component`, () => {
    const wrapper = renderer.create(
      <Provider investStore={investStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={InvestForm}
          investThrough={INVESTMENT_OPTIONS.METAMASK}
          updateInvestThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it(`should render InvestForm component and its children`, () => {
    const wrapper = renderer.create(
      <Provider investStore={investStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={InvestForm}
          investThrough={INVESTMENT_OPTIONS.METAMASK}
          updateInvestThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it(`should update tokensToInvest in investStore`, () => {
    const value = 55

    const wrapper = mount(
      <Provider investStore={investStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={InvestForm}
          investThrough={INVESTMENT_OPTIONS.METAMASK}
          updateInvestThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    expect(investStore.tokensToInvest).toBeUndefined()

    wrapper.find('input').simulate('change', { target: { value } })

    expect(investStore.tokensToInvest).toBe(value)
  })

  it(`should call onSubmit`, () => {
    const onSubmit = jest.fn()

    tokenStore.setProperty('decimals', 18)

    const wrapper = mount(
      <Provider investStore={investStore} tokenStore={tokenStore}>
        <Form
          onSubmit={onSubmit}
          component={InvestForm}
          investThrough={INVESTMENT_OPTIONS.METAMASK}
          updateInvestThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    wrapper.find('input').simulate('change', { target: { value: 55 } })
    wrapper.find('.button_fill').simulate('click')

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it(`should set investThrough to QR`, () => {
    const updateInvestThrough = jest.fn()

    const wrapper = mount(
      <Provider investStore={investStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={InvestForm}
          investThrough={INVESTMENT_OPTIONS.METAMASK}
          updateInvestThrough={updateInvestThrough}
          web3Available={true}
        />
      </Provider>
    )

    wrapper.find('select').simulate('change', { target: { value: INVESTMENT_OPTIONS.QR } })

    expect(updateInvestThrough).toHaveBeenCalledTimes(1)
    expect(updateInvestThrough).toHaveBeenCalledWith(INVESTMENT_OPTIONS.QR)
  })
})
