import React from 'react'
import {DisplayField} from '../../../src/components/Common/DisplayField'
import {Form} from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import {configure, mount, shallow} from 'enzyme'

configure({adapter: new Adapter()})
describe('DisplayField ', () => {
  it(`should render DisplayField component with specified parameters`, () => {
    const description = 'DisplayField description'
    const title = 'DisplayField title'
    const value = 'DisplayField value'
    const side = 'DisplayField'
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={DisplayField}
        description={description}
        title={title}
        value={value}
        side={side}
      />
    )
    expect(wrapper.find('[className="label"]').text()).toBe(title)
    expect(wrapper.find('[className="value"]').text()).toBe(value)
    expect(wrapper.find('[className="description"]').text()).toBe(description)
    expect(wrapper.find(`[className="${side}"]`).text()).toBeDefined()
    expect(wrapper.find(`[data-clipboard-text="${value}"]`).text()).toBeDefined()
  })
})
