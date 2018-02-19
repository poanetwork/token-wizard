import React from 'react'
import { NumericInput } from './NumericInput'
import { TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'

const COMPONENT_STATE = {
  VALUE: 'value',
  PRISTINE: 'pristine',
  VALID: 'valid'
}
const INPUT_EVENT = {
  KEYPRESS: 'keypress',
  CHANGE: 'change'
}

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

    input.simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper.state(COMPONENT_STATE.VALUE)).toBe(expectedInvalidValue)
    expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)

    mock.target.value = '8'
    const expectedValidValue = parseFloat(mock.target.value)

    input.simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper.state(COMPONENT_STATE.VALUE)).toBe(expectedValidValue)
    expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
  })

  it('Should validate max', () => {
    numericInputComponent.max = 15
    const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
    const input = wrapper.find('input').at(0)

    mock.target.value = '20'
    const expectedInvalidValue = parseFloat(mock.target.value)

    input.simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper.state(COMPONENT_STATE.VALUE)).toBe(expectedInvalidValue)
    expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)

    mock.target.value = '10'
    const expectedValidValue = parseFloat(mock.target.value)

    input.simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper.state(COMPONENT_STATE.VALUE)).toBe(expectedValidValue)
    expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
  })

  it('Should consider empty string as valid', () => {
    const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
    const input = wrapper.find('input').at(0)

    input.simulate(INPUT_EVENT.CHANGE, mock)
    expect(numericInputComponent.onValueUpdate).toHaveBeenCalled()
    expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
  })

  it('Should call onValueUpdate callback on successful update', () => {
    const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
    const input = wrapper.find('input').at(0)

    mock.target.value = '10'
    const expectedValue = parseFloat(mock.target.value)

    input.simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper.state(COMPONENT_STATE.VALUE)).toBe(expectedValue)
    expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)

    expect(numericInputComponent.onValueUpdate).toHaveBeenCalledTimes(1)
    expect(numericInputComponent.onValueUpdate).toHaveBeenCalledWith(expectedValue)
  })

  describe('float numbers', () => {
    it ('Should validate maxDecimals', () => {
      numericInputComponent.acceptFloat = true
      numericInputComponent.maxDecimals = '4'
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      mock.target.value = '1.12345'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)

      mock.target.value = '1.1234'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    })

    it ('Should validate minDecimals', () => {
      numericInputComponent.acceptFloat = true
      numericInputComponent.minDecimals = '2'
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      mock.target.value = '1.1'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)

      mock.target.value = '1.1234'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    })

    it ('Should validate minDecimals and maxDecimals', () => {
      numericInputComponent.acceptFloat = true
      numericInputComponent.maxDecimals = '4'
      numericInputComponent.minDecimals = '2'
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      mock.target.value = '1.1'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)

      mock.target.value = '1.12345'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)

      mock.target.value = '1.12'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)

      mock.target.value = '1.123'
      input.simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper.state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper.state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    })

    it('Should reject float with dot notation', () => {
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = '.'
      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalled()
    })

    it('Should accept float with dot notation', () => {
      numericInputComponent.acceptFloat = true
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = '.'
      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
    })

    it('Should reject float with scientific notation', () => {
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = 'e'
      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalled()
    })

    it('Should accept float with scientific notation', () => {
      numericInputComponent.acceptFloat = true
      const wrapper = mount(React.createElement(NumericInput, numericInputComponent))
      const input = wrapper.find('input').at(0)

      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = 'e'
      input.simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
    })

  })
})
