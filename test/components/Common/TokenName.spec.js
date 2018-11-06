import React from 'react'
import { TokenName } from '../../../src/components/Common/TokenName'
import { Form } from 'react-final-form'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { VALIDATION_MESSAGES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('TokenName', () => {
  it(`should render TokenName component`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenName} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render TokenName component and its children`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenName} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should give error if name is only spaces`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenName} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    const input = wrapper.find('input[name="name"]')
    input.simulate('change', { target: { value: '               ' } })

    expect(wrapper.find('InputField2').prop('meta').error).toBe('Name should have at least one character')
  })

  it(`should give error if name is empty`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenName} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )

    const input = wrapper.find('input[name="name"]')

    input.simulate('change', { target: { value: 'valid name' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBeFalsy()

    input.simulate('change', { target: { value: '' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBe(VALIDATION_MESSAGES.REQUIRED)
  })

  it(`should give error if name is longer than 30 characters`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenName} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    const input = wrapper.find('input[name="name"]')
    input.simulate('change', { target: { value: '1234567890132546789012345678901' } })

    expect(wrapper.find('InputField2').prop('meta').error).toBe(VALIDATION_MESSAGES.NAME)
  })
})
