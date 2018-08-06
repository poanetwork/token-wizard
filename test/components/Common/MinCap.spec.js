import React from 'react'
import { MinCap } from '../../../src/components/Common/MinCap'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { VALIDATION_MESSAGES } from "../../../src/utils/constants";

configure({ adapter: new Adapter() })
const DECRIPTION = `Minimum amount of tokens to buy. Not the minimal amount for every transaction: if minCap is 1
               and a user already has 1 token from a previous transaction, they can buy any amount they want.`
const LABEL = `Contributor min cap`

describe('MinCap ', () => {
  it.skip(`should render MinCap component`, () => {
    let input = {
      name: 'MinCap',
      disabled: false,
      value: '1234'
    }
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={MinCap}
        disabled={false}
        validate={{}}
        input={input}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
  it.skip(`should be label ${LABEL}`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={MinCap} validate={{}}
      />
    )
    let lab = wrapper.find('label')
    expect(lab.text()).toBe(LABEL)
  })
  it.skip(`should be decription ${DECRIPTION}`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={MinCap} validate={{}}
      />
    )
    let lab = wrapper.find('p[className="description"]')
    expect(lab.text()).toBe(DECRIPTION)
  })
  it(`should give error if empty`, () => {
    const val = {
      tiers: [
        {
          supply: '150'
        }
      ]
    }

    const wrapper = mount(
      <Form
        onSubmit={ jest.fn() }
        component={MinCap}
        errorStyle={{ color: 'red', fontWeight: 'bold' }}
        name="mincap"
        values={val}
        decimals={18}
        index={0}
        disabled={false}
      />
    )
    const input = wrapper.find('input[name="mincap"]')
    input.simulate('change', { target: { value: '10' } })
    console.log(wrapper.find('InputField2').props())
    //console.log(wrapper.find('InputField2').props().meta.error);
    expect(wrapper.find('InputField2').props().meta.error).toBe('Please enter a valid number greater or equal than 0')



  })
  it(`should give error if negative`, () => {})
  it(`should give error if decimals place greater than given`, () => {})
  it(`should give error if greater tier's supply`, () => {})
  it(`should give error if not numberic`, () => {})
})
