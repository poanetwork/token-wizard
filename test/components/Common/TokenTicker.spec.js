import React from 'react'
import { TokenTicker } from '../../../src/components/Common/TokenTicker'
import { Form } from 'react-final-form'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { VALIDATION_MESSAGES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('TokenTicker', () => {
  it(`should render TokenTicker component`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenTicker} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render TokenTicker component and its children`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenTicker} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should give error if ticker name has other than alphanumeric characters`, () => {
    // Given
    const wrapper = mount(<Form onSubmit={jest.fn()} component={TokenTicker} />)

    // When
    const input = wrapper.find('input[name="ticker"]').at(0)
    input.simulate('change', { target: { value: 'AB@C8' } })

    // Then
    expect(wrapper.find('InputField2').prop('meta').error).toBe('Only alphanumeric characters')
  })

  it(`should give error if ticker name is empty`, () => {
    // Given
    const wrapper = mount(<Form onSubmit={jest.fn()} component={TokenTicker} />)
    const input = wrapper.find('input[name="ticker"]')

    // When
    input.simulate('change', { target: { value: 'VALID' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBeFalsy()
    input.simulate('change', { target: { value: '' } })

    // Then
    expect(wrapper.find('InputField2').prop('meta').error).toBe(VALIDATION_MESSAGES.REQUIRED)
  })

  it(`should give error if ticker name is longer than 5 characters`, () => {
    // Given
    const wrapper = mount(<Form onSubmit={jest.fn()} component={TokenTicker} />)
    const input = wrapper.find('input[name="ticker"]')

    // When
    input.simulate('change', { target: { value: '123456' } })

    // Then
    expect(wrapper.find('InputField2').prop('meta').error).toBe('Please enter a valid ticker between 1-5 characters')
  })
})
