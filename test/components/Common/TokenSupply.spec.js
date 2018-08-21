import React from 'react'
import { TokenSupply } from '../../../src/components/Common/TokenSupply'
import { Form } from 'react-final-form'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { VALIDATION_MESSAGES } from '../../../src/utils/constants'
import {Supply} from "../../../src/components/Common/Supply";

configure({ adapter: new Adapter() })

describe('TokenSupply', () => {
  it(`should render TokenDecimals component`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenSupply} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render TokenSupply component and its children`, () => {
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={TokenSupply} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render TokenSupply component and its children, with input field disabled`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={TokenSupply}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        disabled={true}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should give error if value is negative`, () => {
    const wrapper = mount(
      <Form onSubmit={jest.fn()} component={TokenSupply} errorStyle={{ color: 'red', fontWeight: 'bold' }} />
    )

    const input = wrapper.find('input[name="supply"]')

    input.simulate('change', { target: { value: '-10' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBe(VALIDATION_MESSAGES.POSITIVE)
    input.simulate('change', { target: { value: '' } })
    expect(wrapper.find('InputField2').prop('meta').error).toBe(VALIDATION_MESSAGES.POSITIVE)
  })
  it(`shouldn't give error if value is  correct`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={TokenSupply} name='supply'
      />
    )
    const input = wrapper.find('input[name="supply"]')
    input.simulate('change', { target: { value: '10' } })
    expect(wrapper.find('InputField2').props().meta.error).toBe(undefined);
  })


})
