import React from 'react'
import { CrowdsaleStartTime } from '../../../src/components/Common/CrowdsaleStartTime'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { VALIDATION_MESSAGES, TEXT_FIELDS, DESCRIPTION } from '../../../src/utils/constants';
import MockDate from 'mockdate'
import { InputField2 } from '../../../src/components/Common/InputField2'

configure({ adapter: new Adapter() })
const DECRIPTION = DESCRIPTION.START_TIME
const LABEL = TEXT_FIELDS.START_TIME

describe('CrowdsaleStartTime ', () => {
  const crowdsale = { tiers: [{ endTime: Date().now }] }
  it(`should render CrowdsaleStartTime component`, () => {
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleStartTime}
        disabled={false}
        initialValues={crowdsale}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="name"
        index={0}
        disabled={false}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render MinCap component if field is disabled`, () => {
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleStartTime}
        disabled={true}
        initialValues={crowdsale}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="name"
        index={0}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should be  proper label and description`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleStartTime}
        initialValues={crowdsale}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="name"
        disabled={false}
        index={0}
      />
    )
    let label = wrapper.find('label')
    expect(label.text()).toBe(LABEL)
    let descript = wrapper.find('p[className="description"]')
    expect(descript.text()).toBe(DECRIPTION)
  })
})

describe('CrowdsaleStartTime ', () => {
  const TIMESTAMPS = {
    CURRENT_TIME: 1520852400000,
    PLUS_5_MINUTES: 1520852700000,
    PLUS_10_MINUTES: 1520853000000,
    PLUS_10_DAYS: 1521716400000,
    MINUS_5_MINUTES: 1520852100000,
    MINUS_10_DAYS: 1519988400000
  }
  beforeEach(() => {
    MockDate.set(TIMESTAMPS.CURRENT_TIME)
  })
  afterEach(() => {
    MockDate.reset()
  })
  const crowdsale = { tiers: [{ endTime: TIMESTAMPS.PLUS_10_MINUTES }] }
  const wrapper = mount(
    <Form
      onSubmit={jest.fn()}
      initialValues={crowdsale}
      component={CrowdsaleStartTime}
      errorStyle={{ color: 'red', fontWeight: 'bold' }}
      name="startTime"
      index={0}
      disabled={false}
    />
  )
  it(`shouldn't be errors if value is correct`, () => {
    const input = wrapper.find('input[name="startTime"]')
    input.simulate('change', { target: { value: TIMESTAMPS.PLUS_5_MINUTES } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error).toBeUndefined()
  })
  it(`should fail if value is empty`, () => {
    const input = wrapper.find('input[name="startTime"]')
    input.simulate('change', { target: { value: '' } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe(VALIDATION_MESSAGES.REQUIRED)
  })
  it(`should fail if startTime is previous than current time`, () => {
    const input = wrapper.find('input[name="startTime"]')
    input.simulate('change', { target: { value: TIMESTAMPS.MINUS_5_MINUTES } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe(VALIDATION_MESSAGES.DATE_IN_FUTURE)
  })

  it(`should fail if startTime is  later than end time`, () => {
    const input = wrapper.find('input[name="startTime"]')
    input.simulate('change', { target: { value: TIMESTAMPS.PLUS_10_DAYS } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe("Should be previous than same tier's End Time")
  })
  it(`should fail if startTime is same with end time`, () => {
    const input = wrapper.find('input[name="startTime"]')
    input.simulate('change', { target: { value: TIMESTAMPS.PLUS_10_MINUTES } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe("Should be previous than same tier's End Time")
  })

  it(`should fail if startTime is same or later than previous tier's endTime`, () => {
    const crowdsale = {
      tiers: [{ endTime: TIMESTAMPS.PLUS_10_MINUTES },
        { endTime: TIMESTAMPS.PLUS_10_DAYS }]
    }
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        initialValues={crowdsale}
        component={CrowdsaleStartTime}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="startTime"
        index={1}
        disabled={false}
      />
    )
    const input = wrapper.find('input[name="startTime"]')
    input.simulate('change', { target: { value: TIMESTAMPS.PLUS_5_MINUTES } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe("Should be same or later than previous tier's End Time")
  })
})
