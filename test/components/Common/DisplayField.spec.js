import React from 'react'
import { DisplayField } from '../../../src/components/Common/DisplayField'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

describe('DisplayField ', () => {
  it(`should render DisplayField component with specified parameters`, () => {
    const description = 'DisplayField description'
    const title = 'DisplayField title'
    const value = 'DisplayField value'
    const extraClass = 'anExtraClass'
    const mobileTextSize = 'large'
    const valueSize = {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      extralarge: 'ExtraLarge'
    }
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={DisplayField}
        description={description}
        title={title}
        value={value}
        extraClass={extraClass}
        mobileTextSize={mobileTextSize}
      />
    )
    expect(wrapper.find('.pb-DisplayField').props().title).toBe(description)
    expect(wrapper.find(`.${extraClass}`)).toHaveLength(1)
    expect(wrapper.find('.pb-DisplayField_Title').text()).toBe(title)
    expect(
      wrapper
        .find('.pb-DisplayField_Value')
        .text()
        .trim()
    ).toBe(value)
    expect(wrapper.find(`.pb-DisplayField_Value-MobileTextSize${valueSize[mobileTextSize]}`)).toHaveLength(1)
    expect(wrapper.find(`[data-clipboard-text="${value}"]`).text()).toBeDefined()
  })
})
