import React from 'react'
import { CrowdsaleEndTime } from '../../../src/components/Common/CrowdsaleEndTime'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { VALIDATION_MESSAGES } from '../../../src/utils/constants'
import renderer from "react-test-renderer";

configure({ adapter: new Adapter() })

describe('CrowdsaleEndTime', () => {
  it(`should render CrowdsaleEndTime component`, () => {
    let input = {
      name: 'CrowdsaleEndTime',
      disabled: false,
      value: '13'
    }
    const wrapper = renderer.create (
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleEndTime}
        validate={{}}
        input={input}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should give error if empty`, () => {})
  it(`should give error if data in the past`, () => {})
  it(`should give error if earlier than start time`, () => {})
})
