import React from 'react'
import { Provider } from 'mobx-react'
import { Form } from 'react-final-form'
import ContributeStore from '../../../src/stores/ContributeStore'
import TokenStore from '../../../src/stores/TokenStore'
import { ContributeForm } from '../../../src/components/contribute/ContributeForm'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { CONTRIBUTION_OPTIONS } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('ContributeForm', () => {
  let contributeStore
  let tokenStore

  beforeEach(() => {
    contributeStore = new ContributeStore()
    tokenStore = new TokenStore()
  })

  it(`should render ContributeForm component`, () => {
    const wrapper = renderer.create(
      <Provider contributeStore={contributeStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={ContributeForm}
          contributeThrough={CONTRIBUTION_OPTIONS.METAMASK}
          updateContributeThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it(`should render ContributeForm component and its children`, () => {
    const wrapper = renderer.create(
      <Provider contributeStore={contributeStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={ContributeForm}
          contributeThrough={CONTRIBUTION_OPTIONS.METAMASK}
          updateContributeThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it(`should update tokensToContribute in contributeStore`, () => {
    const value = 55

    const wrapper = mount(
      <Provider contributeStore={contributeStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={ContributeForm}
          contributeThrough={CONTRIBUTION_OPTIONS.METAMASK}
          updateContributeThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    expect(contributeStore.tokensToContribute).toBeUndefined()

    wrapper.find('input').simulate('change', { target: { value } })

    expect(contributeStore.tokensToContribute).toBe(value)
  })

  it(`should call onSubmit`, () => {
    const onSubmit = jest.fn()

    tokenStore.setProperty('decimals', 18)

    const wrapper = mount(
      <Provider contributeStore={contributeStore} tokenStore={tokenStore}>
        <Form
          onSubmit={onSubmit}
          component={ContributeForm}
          contributeThrough={CONTRIBUTION_OPTIONS.METAMASK}
          updateContributeThrough={jest.fn()}
          web3Available={true}
        />
      </Provider>
    )

    wrapper.find('input').simulate('change', { target: { value: 55 } })
    wrapper.find('.button_fill').simulate('click')

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it(`should set contributeThrough to QR`, () => {
    const updateContributeThrough = jest.fn()

    const wrapper = mount(
      <Provider contributeStore={contributeStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={ContributeForm}
          contributeThrough={CONTRIBUTION_OPTIONS.METAMASK}
          updateContributeThrough={updateContributeThrough}
          web3Available={true}
        />
      </Provider>
    )

    wrapper.find('select').simulate('change', { target: { value: CONTRIBUTION_OPTIONS.QR } })

    expect(updateContributeThrough).toHaveBeenCalledTimes(1)
    expect(updateContributeThrough).toHaveBeenCalledWith(CONTRIBUTION_OPTIONS.QR)
  })

  it(`Should set as disabled the contribute button if isTierSoldOut === true`, () => {
    const wrapper = mount(
      <Provider contributeStore={contributeStore} tokenStore={tokenStore}>
        <Form
          onSubmit={jest.fn()}
          component={ContributeForm}
          contributeThrough={CONTRIBUTION_OPTIONS.METAMASK}
          updateContributeThrough={jest.fn()}
          isTierSoldOut={true}
          web3Available={true}
        />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()

    const contributeButton = wrapper.find('.button.button_fill.button_no_border.button_disabled')
    expect(contributeButton.is('[disabled]')).toBeTruthy()
  })
})
