import React from 'react'
import { NumericInput } from './NumericInput'
import { TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

const COMPONENT_STATE = {
  VALUE: 'value',
  PRISTINE: 'pristine',
  VALID: 'valid'
}
const INPUT_EVENT = {
  KEYPRESS: 'keypress',
  CHANGE: 'change',
  PASTE: 'paste'
}

let mock
let keypressMock
let pasteMock
let numericInputComponent
let wrapperMemo
let wrapper
let inputMemo
let input

configure({ adapter: new Adapter() })

beforeEach(() => {
  mock = { target: { value: '' } }

  keypressMock = { key: '1', preventDefault: jest.fn() }

  pasteMock = {
    preventDefault: jest.fn(),
    clipboardData: {
      getData: () => 'e123e123'
    }
  }

  numericInputComponent = {
    side: 'left',
    title: TEXT_FIELDS.DECIMALS,
    description:
      'Refers to how divisible a token can be, from 0 (not at all divisible) to 18 (pretty much continuous).',
    errorMessage: VALIDATION_MESSAGES.DECIMALS,
    onValueUpdate: jest.fn()
  }

  wrapperMemo = undefined
  wrapper = () => wrapperMemo || (wrapperMemo = mount(React.createElement(NumericInput, numericInputComponent)))

  inputMemo = undefined
  input = () => inputMemo || (inputMemo = wrapper().find('input').at(0))
})

describe('NumericInput', () => {
  it('Should render the component', () => {
    numericInputComponent.min = 0
    numericInputComponent.max = 18
    numericInputComponent.acceptFloat = true
    numericInputComponent.minDecimals = 0
    numericInputComponent.maxDecimals = 4

    expect(renderer.create(React.createElement(NumericInput, numericInputComponent)).toJSON()).toMatchSnapshot()
  })

  it('Should fail if value is less than min', () => {
    numericInputComponent.min = 5
    mock.target.value = '4'

    input().simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper().state(COMPONENT_STATE.VALUE)).toBe(parseFloat(mock.target.value))
    expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)
  })

  it('Should pass if value is greater than min', () => {
    numericInputComponent.min = 5
    mock.target.value = '8'

    input().simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper().state(COMPONENT_STATE.VALUE)).toBe(parseFloat(mock.target.value))
    expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
  })

  it('Should validate max', () => {
    numericInputComponent.max = 15
    mock.target.value = '20'

    input().simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper().state(COMPONENT_STATE.VALUE)).toBe(parseFloat(mock.target.value))
    expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)
  })

  it('Should validate max', () => {
    numericInputComponent.max = 15
    mock.target.value = '10'

    input().simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper().state(COMPONENT_STATE.VALUE)).toBe(parseFloat(mock.target.value))
    expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
  })

  it('Should consider empty string as valid', () => {
    input().simulate(INPUT_EVENT.CHANGE, mock)
    expect(numericInputComponent.onValueUpdate).toHaveBeenCalled()
    expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
  })

  it('Should accept "-" symbol if min is negative', () => {
    numericInputComponent.min = -10
    keypressMock.key = '-'

    input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
    expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
  })

  it('Should accept "-" symbol if max is negative', () => {
    numericInputComponent.max = -10
    keypressMock.key = '-'

    input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
    expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
  })

  it('Should reject "-" symbol if min is not negative', () => {
    numericInputComponent.min = 0
    keypressMock.key = '-'

    input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
    expect(keypressMock.preventDefault).toHaveBeenCalled()
  })

  it('Should reject "-" symbol if max is not negative', () => {
    numericInputComponent.max = 10
    keypressMock.key = '-'

    input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
    expect(keypressMock.preventDefault).toHaveBeenCalled()
  })

  it('Should reject "-" symbol if it is not the first character', () => {
    numericInputComponent.min = -10
    mock.target.value = 5
    keypressMock.key = '-'

    input().simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper().state(COMPONENT_STATE.VALUE)).toBe(5)

    input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
    expect(keypressMock.preventDefault).toHaveBeenCalled()
  })

  it('Should prevent pasting invalid value', () => {
    input().simulate(INPUT_EVENT.PASTE, pasteMock)
    expect(pasteMock.preventDefault).toHaveBeenCalled()
  })

  it('Should allow pasting valid value', () => {
    pasteMock.clipboardData.getData = () => '12'

    input().simulate(INPUT_EVENT.PASTE, pasteMock)
    expect(pasteMock.preventDefault).toHaveBeenCalledTimes(0)
  })

  it('Should call onValueUpdate callback on successful update', () => {
    mock.target.value = '10'
    const expectedValue = parseFloat(mock.target.value)

    input().simulate(INPUT_EVENT.CHANGE, mock)
    expect(wrapper().state(COMPONENT_STATE.VALUE)).toBe(expectedValue)
    expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
    expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    expect(numericInputComponent.onValueUpdate).toHaveBeenCalledTimes(1)
    expect(numericInputComponent.onValueUpdate).toHaveBeenCalledWith(expectedValue)
  })

  describe('float numbers', () => {
    beforeEach(() => {
      numericInputComponent.acceptFloat = true
      numericInputComponent.minDecimals = 2
      numericInputComponent.maxDecimals = 4
    })

    it('Should fail if value has more decimals than maxDecimals', () => {
      mock.target.value = '1.12345'

      input().simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)
    })

    it('Should pass if value has less decimals than maxDecimals', () => {
      mock.target.value = '1.123'

      input().simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    })

    it('Should pass if value has same decimals than maxDecimals', () => {
      mock.target.value = '1.1234'

      input().simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    })

    it('Should fail if value has less decimals than minDecimals', () => {
      mock.target.value = '1.1'

      input().simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)
    })

    it('Should pass if value has more decimals than minDecimals', () => {
      mock.target.value = '1.1234'

      input().simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    })

    it('Should pass if value has same decimals than minDecimals', () => {
      mock.target.value = '1.12'

      input().simulate(INPUT_EVENT.CHANGE, mock)
      expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
      expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
    })

    describe('range of [minDecimals, maxDecimals]', () => {
      it('Should fail for: 1.1, if it is outside the range', () => {
        mock.target.value = '1.1'

        input().simulate(INPUT_EVENT.CHANGE, mock)
        expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
        expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)
      })

      it('Should fail for: 1.12345, if it is outside the range', () => {
        mock.target.value = '1.12345'

        input().simulate(INPUT_EVENT.CHANGE, mock)
        expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
        expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.INVALID)
      })

      it('Should pass for: 1.12, if it is inside the range', () => {
        mock.target.value = '1.12'

        input().simulate(INPUT_EVENT.CHANGE, mock)
        expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
        expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
      })

      it('Should pass for: 1.123, if it is inside the range', () => {
        mock.target.value = '1.123'

        input().simulate(INPUT_EVENT.CHANGE, mock)
        expect(wrapper().state(COMPONENT_STATE.PRISTINE)).toBeFalsy()
        expect(wrapper().state(COMPONENT_STATE.VALID)).toBe(VALIDATION_TYPES.VALID)
      })
    })

    it('Should reject float with dot notation', () => {
      numericInputComponent.acceptFloat = false

      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = '.'

      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalled()
    })

    it('Should accept float with dot notation', () => {
      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = '.'

      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
    })

    it('Should reject float with scientific notation', () => {
      numericInputComponent.acceptFloat = false

      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = 'e'

      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalled()
    })

    it('Should accept float with scientific notation', () => {
      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)

      keypressMock.key = 'e'

      input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)
      expect(keypressMock.preventDefault).toHaveBeenCalledTimes(0)
    })
  })
})
