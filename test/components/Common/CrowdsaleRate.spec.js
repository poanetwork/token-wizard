import React from 'react'
import { CrowdsaleRate } from '../../../src/components/Common/CrowdsaleRate'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { VALIDATION_MESSAGES,DESCRIPTION } from '../../../src/utils/constants'
import {Supply} from "../../../src/components/Common/Supply";

configure({ adapter: new Adapter() })

const LABEL = `Rate`
describe('CrowdsaleRate ', () => {
  it(`should render CrowdsaleRate component`, () => {
    let input = {
      name: 'CrowdsaleRate',
      disabled: false,
      value: '1234'
    }
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleRate}
        disabled={false}
        input={input}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
  it(`should be proper label and description`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={CrowdsaleRate}
        disabled={false} name="rate"
      />
    )
    let node = wrapper.find('label')
    expect(node.text()).toBe(LABEL)
    node = wrapper.find('p[className="description"]')
    expect(node.text()).toBe(DESCRIPTION.RATE)
  })
})
describe('CrowdsaleRate ', () => {
  const wrapper = mount(
    <Form
      onSubmit={jest.fn()} component={CrowdsaleRate} name='rate'
    />
  )
  const input = wrapper.find('input[name="rate"]')
  it(`should give 3 errors if value is empty`, () => {
    input.simulate('change', { target: { value: '' } })
    expect(wrapper.find('InputField2').props().meta.error.length).toBe(3)
  })
  it(`should give error if value is not positive`, () => {
    input.simulate('change', { target: { value: '-10' } })
    expect(wrapper.find('InputField2').props().meta.error[0]).toBe(VALIDATION_MESSAGES.POSITIVE)
  })
  it(`should give error if value is not integer`, () => {
    input.simulate('change', { target: { value: '1.0001' } })
    expect(wrapper.find('InputField2').props().meta.error[0]).toBe(VALIDATION_MESSAGES.INTEGER)
  })
  it(`should give error if value is greater than 1e18`, () => {
    input.simulate('change', { target: { value: '1000000000000000001'} })
    expect(wrapper.find('InputField2').props().meta.error[0]).toBe('Should not be greater than 1 quintillion (10^18)')
  })
  it(`should give 3 errors if value is not numberic`, () => {
    input.simulate('change', { target: { value: 'asdfg'} })
    expect(wrapper.find('InputField2').props().meta.error.length).toBe(3)
  })
  it(`shouldn't give 3 errors if value is correct`, () => {
    input.simulate('change', { target: { value: 'asdfg'} })
    expect(wrapper.find('InputField2').props().meta.error.length).toBe(3)
  })
})
