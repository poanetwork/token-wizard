import React from 'react'
import { CrowdsaleRate } from '../../../src/components/Common/CrowdsaleRate'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { DESCRIPTION, VALIDATION_MESSAGES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

const LABEL = `Rate`

describe('CrowdsaleRate', () => {
  it(`should render CrowdsaleRate component`, () => {
    const input = {
      name: 'CrowdsaleRate',
      disabled: false,
      value: '1234'
    }
    const wrapper = renderer.create(
      <Form onSubmit={jest.fn()} component={CrowdsaleRate} disabled={false} input={input} />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should be proper label and description`, () => {
    const wrapper = mount(<Form onSubmit={jest.fn()} component={CrowdsaleRate} disabled={false} name="rate" />)
    const labelNode = wrapper.find('label')
    const descriptionNode = wrapper.find('.sw-FormControlTitle_Tooltip')

    expect(labelNode.text()).toBe(LABEL)
    expect(descriptionNode.text()).toBe(DESCRIPTION.RATE)
  })

  describe('CrowdsaleRate form validation', () => {
    let wrapper
    let input

    beforeEach(() => {
      wrapper = mount(<Form onSubmit={jest.fn()} component={CrowdsaleRate} name="rate" />)
      input = wrapper.find('input[name="rate"]')
    })

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
      input.simulate('change', { target: { value: '1000000000000000001' } })
      expect(wrapper.find('InputField2').props().meta.error[0]).toBe('Should not be greater than 1 quintillion (10^18)')
    })

    it(`should give 3 errors if value is not numberic`, () => {
      input.simulate('change', { target: { value: 'asdfg' } })
      expect(wrapper.find('InputField2').props().meta.error.length).toBe(3)
    })

    it(`shouldn't give 3 errors if value is correct`, () => {
      input.simulate('change', { target: { value: 'asdfg' } })
      expect(wrapper.find('InputField2').props().meta.error.length).toBe(3)
    })
  })
})
