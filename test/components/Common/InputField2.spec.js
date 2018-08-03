import React from 'react'
import {InputField2} from '../../../src/components/Common/InputField2'
import { Form } from 'react-final-form'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'

configure({ adapter: new Adapter() })

describe('InputField2', () => {
  it(`should render InputField2 component`, () => {
    const wrapper = shallow(
      <InputField2
        input={{
          name: 'name',
          type: 'text'
        }}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render InputField2 component with given name`, () => {
    let input = {
      name: 'CustomName'
    }
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={InputField2}
        errorStyle={{ color: 'red', fontWeight: 'bold'}}
        input={input}
      />
    )
    expect(wrapper.find('label').props().htmlFor).toBe(input.name)
    expect(wrapper.find('input').props().id).toBe(input.name)
    expect(wrapper.find('Error').props().name).toBe(input.name)
  })

  it(`should be able to set value `, () => {
    const val = '22'
    let input = {
      name: 'CustomName',
      defaultValue: val,
      type: 'text'
    }
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={InputField2}
        errorStyle={{ color: 'red', fontWeight: 'bold'}}
        input={input}
      />
    )
    wrapper.find('input').simulate('change', { target: { defaultValue: val }})
    expect(wrapper.find('input').props().defaultValue).toBe(val)
  })
})
