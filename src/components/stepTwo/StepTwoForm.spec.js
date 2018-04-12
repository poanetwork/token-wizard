import React from 'react'
import { Form } from 'react-final-form'
import { StepTwoForm } from './StepTwoForm'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })
jest.mock('react-dropzone', () => () =><span>Dropzone</span>);

describe('StepTwoForm', () => {
  it('Should call onSubmit if all values are valid', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: 'This is a valid name',
          ticker: 'TTK',
          decimals: '14'
        }}
        component={StepTwoForm}
        disableDecimals={false}
        updateTokenStore={jest.fn()}
        id="tokenData"
        tokens={[]}
      />
    )

    wrapper.simulate('submit')

    expect(onSubmit).toHaveBeenCalled()
  })

  it('Should not call onSubmit if not all values are valid', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: 'This is a valid name',
          ticker: 'TTK',
          decimals: '24'
        }}
        component={StepTwoForm}
        disableDecimals={false}
        updateTokenStore={jest.fn()}
        id="tokenData"
        tokens={[]}
      />
    )

    wrapper.simulate('submit')

    expect(onSubmit).toHaveBeenCalledTimes(0)
  })

  it('Should call updateTokenStore after changing name value', () => {
    const updateTokenStore = jest.fn()
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        component={StepTwoForm}
        disableDecimals={false}
        updateTokenStore={updateTokenStore}
        id="tokenData"
        tokens={[]}
      />
    )

    const decimals = wrapper.find('input[name="name"]')
    decimals.simulate('change', { target: { value: 'MyToken' } })

    expect(updateTokenStore).toHaveBeenCalled()
  })

  it('Should call updateTokenStore after changing ticker value', () => {
    const updateTokenStore = jest.fn()
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        component={StepTwoForm}
        disableDecimals={false}
        updateTokenStore={updateTokenStore}
        id="tokenData"
        tokens={[]}
      />
    )

    const decimals = wrapper.find('input[name="ticker"]')
    decimals.simulate('change', { target: { value: 'MyToken' } })

    expect(updateTokenStore).toHaveBeenCalled()
  })

  it('Should call updateTokenStore after changing decimal value', () => {
    const updateTokenStore = jest.fn()
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={{}}
        component={StepTwoForm}
        disableDecimals={false}
        updateTokenStore={updateTokenStore}
        id="tokenData"
        tokens={[]}
      />
    )

    const decimals = wrapper.find('input[name="decimals"]')
    decimals.simulate('change', { target: { value: 'MTK' } })

    expect(updateTokenStore).toHaveBeenCalled()
  })
})
