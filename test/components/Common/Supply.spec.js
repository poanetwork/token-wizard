import React from 'react'
import { Supply } from '../../../src/components/Common/Supply'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'

configure({ adapter: new Adapter() })
const DECRIPTION = `How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`
const LABEL = `Supply`
describe('Supply ', () => {
  it(`should render Supply component`, () => {
    let input = {
      name: 'Supply',
      disabled: false,
      value: '1234'
    }
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={Supply}
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
        onSubmit={jest.fn()} component={Supply} validate={{}}
      />
    )
    let lab = wrapper.find('label')
    expect(lab.text()).toBe(LABEL)
  })
  it(`should be decription ${DECRIPTION}`, () => {
    const wrapper = mount(
      <Form
        onSubmit={jest.fn()} component={Supply} validate={{}}
      />
    )
    let lab = wrapper.find('p[className="description"]')
    expect(lab.text()).toBe(DECRIPTION)
  })
  it(`should give error if empty`, () => {})
  it(`should give error if not positive`, () => {})
  it(`should give error if not integer`, () => {})
  it(`should give error if greater than 1e18`, () => {})
  it(`should give error if not numberic`, () => {})
})
