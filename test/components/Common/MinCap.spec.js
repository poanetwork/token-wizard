import React from 'react'
import { MinCap } from '../../../src/components/Common/MinCap'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { DESCRIPTION, TEXT_FIELDS, VALIDATION_MESSAGES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })
const MIN_CAP_DESCRIPTION = DESCRIPTION.MIN_CAP
const MIN_CAP_LABEL = TEXT_FIELDS.MIN_CAP

describe('MinCap ', () => {
  const crowdsale = { tiers: [{ supply: '150' }] }
  it(`should render MinCap component`, () => {
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={MinCap}
        initialValues={crowdsale}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="mincap"
        decimals={18}
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
        component={MinCap}
        disabled={true}
        initialValues={crowdsale}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="mincap"
        decimals={18}
        index={0}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should be label proper label and description`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()}
        component={MinCap}
        initialValues={crowdsale}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="mincap"
        decimals={18}
        index={0}
        disabled={false}
      />
    )
    const label = wrapper.find('label')
    expect(label.text()).toBe(MIN_CAP_LABEL)
    const description = wrapper.find('.sw-FormControlTitle_Tooltip')
    expect(description.text()).toBe(MIN_CAP_DESCRIPTION)
  })
})
describe('MinCap ', () => {
  const crowdsale = { tiers: [{ supply: 150 }] }
  const decimals18Exceed = '1.01234567890123456789'
  const decimals = 18
  const wrapper = mount(
    <Form
      onSubmit={jest.fn()}
      initialValues={crowdsale}
      component={MinCap}
      errorStyle={{ color: 'red', fontWeight: 'bold' }}
      name="mincap"
      decimals={decimals}
      index={0}
      disabled={false}
    />
  )

  it(`shouldn't be errors if value is correct`, () => {
    const input = wrapper.find('input[name="mincap"]')
    input.simulate('change', { target: { value: crowdsale.tiers[0].supply } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error).toBeUndefined()
  })

  it(`should give error if empty`, () => {
    const input = wrapper.find('input[name="mincap"]')
    input.simulate('change', { target: { value: '' } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error.length).toBe(2)
    expect(inputProps.meta.error[0]).toBe(VALIDATION_MESSAGES.NON_NEGATIVE)
    expect(inputProps.meta.error[1]).toBe(`Should be less or equal than tier's supply (${crowdsale.tiers[0].supply})`)
  })

  it(`should give error if negative`, () => {
    const input = wrapper.find('input[name="mincap"]')
    input.simulate('change', { target: { value: '-10' } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error.length).toBe(1)
    expect(inputProps.meta.error[0]).toBe(VALIDATION_MESSAGES.NON_NEGATIVE)
  })

  it(`should give error if decimals place exceed specified`, () => {
    const input = wrapper.find('input[name="mincap"]')
    input.simulate('change', { target: { value: decimals18Exceed } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error.length).toBe(1)
    expect(inputProps.meta.error[0]).toBe(`Decimals should not exceed ${decimals} places`)
  })

  it(`should give error if value is greater than tier's supply`, () => {
    const input = wrapper.find('input[name="mincap"]')
    input.simulate('change', { target: { value: crowdsale.tiers[0].supply + 1 } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error.length).toBe(1)
    expect(inputProps.meta.error[0]).toBe(`Should be less or equal than tier's supply (${crowdsale.tiers[0].supply})`)
  })

  it(`should give error if not numberic`, () => {
    const input = wrapper.find('input[name="mincap"]')
    input.simulate('change', { target: { value: 'abcde' } })
    const inputProps = wrapper.find('InputField2').props()
    expect(inputProps.meta.error.length).toBe(2)
  })
})
