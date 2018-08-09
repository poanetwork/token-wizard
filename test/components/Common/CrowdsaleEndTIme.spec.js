import React from 'react'
import { CrowdsaleEndTime } from '../../../src/components/Common/CrowdsaleEndTime'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { VALIDATION_MESSAGES, TEXT_FIELDS, DESCRIPTION } from '../../../src/utils/constants';
import MockDate from 'mockdate'

configure({ adapter: new Adapter() })
const DECRIPTION = DESCRIPTION.END_TIME
const LABEL = TEXT_FIELDS.END_TIME

describe('CrowdsaleEndTime ', () => {
  const crowdsale = { tiers: [{ startTime: Date().now }] }
  it(`should render CrowdsaleEndTime component`, () => {
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleEndTime}
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

  it(`should render CrowdsaleEndTime component if field is disabled`, () => {
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={CrowdsaleEndTime}
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
        component={CrowdsaleEndTime}
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

describe('CrowdsaleEndTime ', () => {
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
  const crowdsale = { tiers: [{ startTime: TIMESTAMPS.PLUS_10_MINUTES }] }
  const wrapper = mount(
    <Form
      onSubmit={jest.fn()}
      initialValues={crowdsale}
      component={CrowdsaleEndTime}
      errorStyle={{ color: 'red', fontWeight: 'bold' }}
      name="name"
      index={0}
      disabled={false}
    />
  )
  it(`shouldn't be errors if value is correct`, () => {
    const input = wrapper.find('input[name="name"]')
    input.simulate('change', { target: { value: TIMESTAMPS.PLUS_10_DAYS } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error).toBeUndefined()
  })
  it(`should fail if value is empty`, () => {
    const input = wrapper.find('input[name="name"]')
    input.simulate('change', { target: { value: '' } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe(VALIDATION_MESSAGES.REQUIRED)
  })
  it(`should fail if endTime is previous than current time`, () => {
    const input = wrapper.find('input[name="name"]')
    input.simulate('change', { target: { value: TIMESTAMPS.MINUS_5_MINUTES } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe(VALIDATION_MESSAGES.DATE_IN_FUTURE)
  })

  it(`should fail if endTime is  earlier than startTime`, () => {
    const input = wrapper.find('input[name="name"]')
    input.simulate('change', { target: { value: TIMESTAMPS.PLUS_5_MINUTES } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe("Should be later than same tier's Start Time")
  })
  it(`should fail if endTime is same with startTime`, () => {
    const input = wrapper.find('input[name="name"]')
    input.simulate('change', { target: { value: TIMESTAMPS.PLUS_10_MINUTES } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error[0]).toBe("Should be later than same tier's Start Time")
  })
})
