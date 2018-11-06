import React from 'react'
import { InputField2 } from '../../../src/components/Common/InputField2'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })
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
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        placeholder={placeholder}
        input={input}
        disabled={false}
      />
    )
    expect(wrapper.find('input').props().placeholder).toBe(placeholder)
    expect(wrapper.find('input').props().disabled).toBeFalsy()
    expect(wrapper.find('input').props().id).toBe(input.name)
    expect(wrapper.find('Errors').props().name).toBe(input.name)
  })
})
