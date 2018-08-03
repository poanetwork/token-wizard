import React from 'react'
import { MinCap } from '../../../src/components/Common/MinCap'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'

configure({ adapter: new Adapter() })
const DECRIPTION = `Minimum amount of tokens to buy. Not the minimal amount for every transaction: if minCap is 1
               and a user already has 1 token from a previous transaction, they can buy any amount they want.`
const LABEL = `Contributor min cap`

describe('MinCap ', () => {
  it(`should render MinCap component`, () => {
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
  it(`should be label ${LABEL}`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={MinCap} validate={{}}
      />
    )
    let lab = wrapper.find('label')
    expect(lab.text()).toBe(LABEL)
  })
  it(`should be decription ${DECRIPTION}`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={MinCap} validate={{}}
      />
    )
    let lab = wrapper.find('p[className="description"]')
    expect(lab.text()).toBe(DECRIPTION)
  })
  it(`should give error if empty`, () => {})
  it(`should give error if negative`, () => {})
  it(`should give error if decimals place greater than given`, () => {})
  it(`should give error if greater tier's supply`, () => {})
  it(`should give error if not numberic`, () => {})
})
