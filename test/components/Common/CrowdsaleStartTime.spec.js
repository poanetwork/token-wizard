import React from 'react'
import { CrowdsaleStartTime } from '../../../src/components/Common/CrowdsaleStartTime'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { VALIDATION_MESSAGES } from '../../../src/utils/constants'
import renderer from 'react-test-renderer'

configure({ adapter: new Adapter() })
const DECRIPTION_START_TIME = `Date and time when the tier starts. Can't be in the past from the current moment.`
const LABEL = `Start Time`;
describe('CrowdsaleStartTime', () => {
  it(`should render CrowdsaleStartTime component`, () => {
    let input = {
      name: 'CrowdsaleStartTime',
      disabled: false,
      value: '08/02/2018'
    }
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleStartTime}
        validate={{}}
        input={input}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
  it(`should be label ${LABEL}`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={CrowdsaleStartTime} validate={{}}
      />
    )
    let lab = wrapper.find('label')
    expect(lab.text()).toBe(LABEL)
  })
  it(`should be decription ${DECRIPTION_START_TIME}`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={CrowdsaleStartTime} validate={{}}
      />
    )
    let lab = wrapper.find('p[className="description"]')
    expect(lab.text()).toBe(DECRIPTION_START_TIME)
  })
  it(`should give error if empty`, () => {})
  it(`should give error if data in the past`, () => {})
  it(`should give error if later than end time`, () => {})
})
