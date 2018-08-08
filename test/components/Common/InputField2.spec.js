import React from 'react'
import {InputField2} from '../../../src/components/Common/InputField2'
import {Form} from 'react-final-form'
import {Field} from 'react-final-form'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import {configure, mount, shallow} from 'enzyme'

configure({adapter: new Adapter()})
describe('InputField2 ', () => {
  it(`should render InputField2 component with specified parameters`, () => {
    const input = {
      name: 'CustomName',
      type: 'text'
    }
    const placeholder = 0
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={InputField2}
        errorStyle={{color: 'red', fontWeight: 'bold'}}
        placeholder={placeholder}
        input={input}
        disabled={false}
      />
    )
    expect(wrapper.find('input').props().placeholder).toBe(placeholder)
    expect(wrapper.find('input').props().disabled).toBeFalsy()
    expect(wrapper.find('label').props().htmlFor).toBe(input.name)
    expect(wrapper.find('input').props().id).toBe(input.name)
    expect(wrapper.find('Error').props().name).toBe(input.name)
  })

  it(`should be able to set value `, () => {
    const val = 13
    let input = {
      name: 'CustomName',
      type: 'text',
    }
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={InputField2}
        errorStyle={{color: 'red', fontWeight: 'bold'}}
        input={input}
        disabled={false}
        val={val}
      />
    )
    expect(wrapper.find('input').props().value).toBe(val)
  })
})
