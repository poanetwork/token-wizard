import React from 'react'
import { Supply } from '../../../src/components/Common/Supply'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { VALIDATION_MESSAGES } from "../../../src/utils/constants";

configure({ adapter: new Adapter() })
const DECRIPTION = `How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`
const LABEL = `Supply`
describe('Supply ', () => {
  it(`should render Supply component`, () => {
    let input = {
      name: 'Supply',
      disabled: false,
      value: '1234'
    }
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={Supply}
        disabled={false}
        input={input}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
  it(`should be proper label `, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={Supply} name='supply'
      />
    )
    let lab = wrapper.find('label')
    expect(lab.text()).toBe(LABEL)
  })
  it(`should be proper decription`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={Supply} name='supply'
      />
    )
    let lab = wrapper.find('p[className="description"]')
    expect(lab.text()).toBe(DECRIPTION)
  })
  it(`should give error if field is empty`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={Supply} name='supply'
      />
    )
    const input = wrapper.find('input[name="supply"]')
    input.simulate('change', { target: { value: '' } })
    expect(wrapper.find('InputField2').props().meta.error).toBe(VALIDATION_MESSAGES.POSITIVE);
  })
  it(`should give error if value is not positive`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={Supply} name='supply'
      />
    )
    const input = wrapper.find('input[name="supply"]')
    input.simulate('change', { target: { value: '-10' } })
    expect(wrapper.find('InputField2').props().meta.error).toBe(VALIDATION_MESSAGES.POSITIVE);
  })
  it(`should give error if value is  not numberic`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={Supply} name='supply'
      />
    )
    const input = wrapper.find('input[name="supply"]')
    input.simulate('change', { target: { value: 'absde' } })
    expect(wrapper.find('InputField2').props().meta.error).toBe(VALIDATION_MESSAGES.POSITIVE);
  })
  it(`shouldn't give error if value is  correct`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={Supply} name='supply'
      />
    )
    const input = wrapper.find('input[name="supply"]')
    input.simulate('change', { target: { value: '10' } })
    expect(wrapper.find('InputField2').props().meta.error).toBe(undefined);
  })

})
