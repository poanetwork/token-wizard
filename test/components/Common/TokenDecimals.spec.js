import React from 'react'
import { TokenDecimals } from '../../../src/components/Common/TokenDecimals'
import { Form } from 'react-final-form'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { VALIDATION_MESSAGES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('TokenDecimals', () => {
  it(`should render TokenDecimals component`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenDecimals} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render TokenDecimals component and its children`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenDecimals} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render TokenDecimals component and its children, with input field disabled`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={TokenDecimals}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        disabled={true}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should give error if decimals is empty`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenDecimals} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )

    const input = wrapper.find('input[name="decimals"]')

    input.simulate('change', { target: { value: '10' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBeFalsy()

    input.simulate('change', { target: { value: '' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBe(VALIDATION_MESSAGES.REQUIRED)
  })

  it(`should give error if decimals is greater than 18`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenDecimals} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    const input = wrapper.find('input[name="decimals"]')
    input.simulate('change', { target: { value: '21' } })

    expect(wrapper.find('InputField2').prop('meta').error).toBe('Should not be greater than 18')
  })
})
