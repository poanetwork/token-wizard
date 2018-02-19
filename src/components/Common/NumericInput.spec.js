import React from 'react'
import { NumericInput } from './NumericInput'
import { TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'

const { VALID, INVALID } = VALIDATION_TYPES

let mock
let keypressMock
let numericInputComponent

configure({ adapter: new Adapter() })

beforeEach(() => {
  mock = { target: { value: '' } }

  keypressMock = { key: '1', preventDefault: jest.fn() }

  numericInputComponent = {
    side: 'left',
    title: TEXT_FIELDS.DECIMALS,
    description:
      'Refers to how divisible a token can be, from 0 (not at all divisible) to 18 (pretty much continuous).',
    errorMessage: VALIDATION_MESSAGES.DECIMALS,
    onValueUpdate: jest.fn()
  }
})

describe('NumericInput', () => {
  it('Should render the component', () => {
    numericInputComponent.min = '0'
    numericInputComponent.max = '18'
    numericInputComponent.acceptFloat = true
    numericInputComponent.minDecimals = '0'
    numericInputComponent.maxDecimals = '4'

    const component = renderer.create(React.createElement(NumericInput, numericInputComponent))
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('Should validate min', () => {
    numericInputComponent.min = 5
    const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
    const input = wrapper.find('input').at(0)

    mock.target.value = '4'
    const expectedInvalidValue = parseFloat(mock.target.value)

    input.simulate('change', mock)
    expect(wrapper.state('value')).toBe(expectedInvalidValue)
    expect(wrapper.state('validation').value.pristine).toBeFalsy()
    expect(wrapper.state('validation').value.valid).toBe(INVALID)

    mock.target.value = '8'
    const expectedValidValue = parseFloat(mock.target.value)

    input.simulate('change', mock)
    expect(wrapper.state('value')).toBe(expectedValidValue)
    expect(wrapper.state('validation').value.pristine).toBeFalsy()
    expect(wrapper.state('validation').value.valid).toBe(VALID)
  })

  it('Should validate max', () => {
    numericInputComponent.max = 15
    const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
    const input = wrapper.find('input').at(0)

    mock.target.value = '20'
    const expectedInvalidValue = parseFloat(mock.target.value)

    input.simulate('change', mock)
    expect(wrapper.state('value')).toBe(expectedInvalidValue)
    expect(wrapper.state('validation').value.pristine).toBeFalsy()
    expect(wrapper.state('validation').value.valid).toBe(INVALID)

    mock.target.value = '10'
    const expectedValidValue = parseFloat(mock.target.value)

    input.simulate('change', mock)
    expect(wrapper.state('value')).toBe(expectedValidValue)
    expect(wrapper.state('validation').value.pristine).toBeFalsy()
    expect(wrapper.state('validation').value.valid).toBe(VALID)
  })

  it('Should call onValueUpdate callback on successful update', () => {
    const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
    const input = wrapper.find('input').at(0)

    mock.target.value = '10'
    const expectedValue = parseFloat(mock.target.value)

    input.simulate('change', mock)
    expect(wrapper.state('value')).toBe(expectedValue)
    expect(wrapper.state('validation').value.pristine).toBeFalsy()
    expect(wrapper.state('validation').value.valid).toBe(VALID)

    expect(numericInputComponent.onValueUpdate).toHaveBeenCalledTimes(1)
    expect(numericInputComponent.onValueUpdate).toHaveBeenCalledWith(expectedValue)
  })

  describe('float numbers', () => {
    it('Should reject float with dot notation', () => {
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = '.'
      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalled()
    })

    it('Should accept float with dot notation', () => {
      numericInputComponent.acceptFloat = true
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = '.'
      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
    })

    it('Should reject float with scientific notation', () => {
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = 'e'
      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalled()
    })

    it('Should accept float with scientific notation', () => {
      numericInputComponent.acceptFloat = true
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = 'e'
      input.simulate('keypress', keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
    })

  })
})
