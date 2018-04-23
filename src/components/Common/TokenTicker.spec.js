import React from 'react'
import { TokenTicker } from './TokenTicker'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { VALIDATION_MESSAGES } from '../../utils/constants'

configure({ adapter: new Adapter() })

describe('TokenTicker', () => {
  it(`should render TokenTicker component`, () => {
    const wrapper = shallow(
      <Form onSubmit={jest.fn()} component={TokenTicker} errorStyle={{ color: 'red', fontWeight: 'bold', }}/>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render TokenTicker component and its children`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenTicker} errorStyle={{ color: 'red', fontWeight: 'bold', }}/>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should give error if ticker name has other than alphanumeric characters`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenTicker} errorStyle={{ color: 'red', fontWeight: 'bold', }}/>
    )
    const input = wrapper.find('input[name="ticker"]')
    input.simulate('change', { target: { value: 'AB@C8' } })

    expect(wrapper.find('.error').text()).toBe('Only alphanumeric characters')
  })

  it(`should give error if ticker name is empty`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenTicker} errorStyle={{ color: 'red', fontWeight: 'bold', }}/>
    )

    const input = wrapper.find('input[name="ticker"]')

    input.simulate('change', { target: { value: 'VALID' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBeFalsy()

    input.simulate('change', { target: { value: '' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBe(VALIDATION_MESSAGES.REQUIRED)
  })

  it(`should give error if ticker name is longer than 5 characters`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenTicker} errorStyle={{ color: 'red', fontWeight: 'bold', }}/>
    )
    const input = wrapper.find('input[name="ticker"]')
    input.simulate('change', { target: { value: '123456' } })

    expect(wrapper.find('.error').text()).toBe('Please enter a valid ticker between 1-5 characters')
  })
})
