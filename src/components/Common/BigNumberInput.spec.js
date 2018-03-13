import React from 'react'
import { BigNumberInput } from './BigNumberInput'
import { BigNumber } from 'bignumber.js'
import { DESCRIPTION, TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

describe('BigNumberInput', () => {
  const { INVALID, VALID } = VALIDATION_TYPES

  const INPUT_EVENT = {
    KEYPRESS: 'keypress',
    CHANGE: 'change',
    PASTE: 'paste'
  }

  let changeMock
  let keypressMock
  let pasteMock
  let bigNumberInputComponent
  let wrapperMemo, wrapper
  let inputMemo, input

  beforeEach(() => {
    changeMock = { target: { value: '' } }

    keypressMock = { key: '1', preventDefault: jest.fn() }

    pasteMock = {
      preventDefault: jest.fn(),
      clipboardData: {
        getData: () => 'e123e123'
      }
    }

    bigNumberInputComponent = {
      side: 'left',
      title: TEXT_FIELDS.RATE,
      description: DESCRIPTION.RATE,
      errorMessage: VALIDATION_MESSAGES.RATE,
      onChange: jest.fn()
    }

    wrapperMemo = undefined
    wrapper = () => wrapperMemo || (wrapperMemo = mount(React.createElement(BigNumberInput, bigNumberInputComponent)))

    inputMemo = undefined
    input = () => inputMemo || (inputMemo = wrapper().find('input').at(0))
  })

  it('Should render the component', () => {
    bigNumberInputComponent.min = 1
    bigNumberInputComponent.max = 1e18
    bigNumberInputComponent.acceptEmpty = false
    bigNumberInputComponent.acceptFloat = true
    bigNumberInputComponent.minDecimals = 0
    bigNumberInputComponent.maxDecimals = 4
    bigNumberInputComponent.pristine = true

    const reactElement = React.createElement(BigNumberInput, bigNumberInputComponent)
    const element = renderer.create(reactElement)

    expect(element.toJSON()).toMatchSnapshot()
  })

  describe('paste event', () => {
    [
      { value: '123', expected: 0 },
      { value: '0', expected: 0 },
      { value: '1e10', expected: 0 },
      { value: '1e+10', expected: 0 },
      { value: '1e-10', expected: 0 },
      { value: '1.23', expected: 0 },
      { value: '.123', expected: 0 },
      { value: '-123', expected: 0 },
      { value: '123e', expected: 1 },
      { value: '123e123123e12', expected: 1 },
      { value: '12345678901234567890abcd123', expected: 1 },
      { value: '123abc123', expected: 1 },
    ].forEach(testCase => {
      const action = testCase.expected ? 'fail' : 'pass'

      it(`Should ${action} for '${testCase.value}'`, () => {
        pasteMock.clipboardData.getData = () => testCase.value
        input().simulate(INPUT_EVENT.PASTE, pasteMock)

        expect(pasteMock.preventDefault).toHaveBeenCalledTimes(testCase.expected)
      })
    })
  })

  describe('key press event', () => {
    [
      {
        value: '+',
        expected: 1,
        props: { min: 0, max: 1e18 }
      },
      {
        value: '.',
        expected: 1,
        props: { min: 0, max: 1e18 }
      },
      {
        value: 'e',
        expected: 1,
        props: { min: 0, max: 1e18 }
      },
      {
        value: '-',
        expected: 1,
        props: { min: 0, max: 1e18 }
      },
      {
        value: '1',
        expected: 0,
        props: { min: 0, max: 1e18 }
      },
      {
        value: '-',
        expected: 0,
        props: { min: -10, max: 1e18 }
      },
      {
        value: '-',
        expected: 0,
        props: { max: -5 }
      },
      {
        value: '1',
        expected: 0,
        props: { min: 0, max: 1e18 }
      },
      {
        value: '.',
        expected: 0,
        props: { acceptFloat: true }
      },
      {
        value: '-',
        expected: 0,
        props: { acceptFloat: true }
      },
      {
        value: '+',
        expected: 0,
        props: { acceptFloat: true }
      },
      {
        value: 'e',
        expected: 0,
        props: { acceptFloat: true }
      },
      {
        value: 'j',
        expected: 1,
        props: { acceptFloat: true }
      },
    ].forEach(testCase => {
      const action = testCase.expected ? 'pass' : 'fail'

      it(`Should ${action} for '${testCase.value}'`, () => {
        bigNumberInputComponent.acceptFloat = testCase.props.acceptFloat
        bigNumberInputComponent.minDecimals = testCase.props.minDecimals
        bigNumberInputComponent.maxDecimals = testCase.props.maxDecimals
        bigNumberInputComponent.min = testCase.props.min
        bigNumberInputComponent.max = testCase.props.max

        keypressMock.key = testCase.value
        input().simulate(INPUT_EVENT.KEYPRESS, keypressMock)

        expect(keypressMock.preventDefault).toHaveBeenCalledTimes(testCase.expected)
      })
    })
  })

  describe('change event', () => {
    describe('special characters', () => {
      [
        { value: 'abc', expected: INVALID },
        { value: '#@', expected: INVALID },
        { value: '~', expected: INVALID },
        { value: 'e', expected: INVALID },
        { value: '123e', expected: INVALID },
        { value: '', expected: VALID },
      ].forEach(testCase => {
        const action = testCase.expected === VALID ? 'pass' : 'fail'

        it(`Should ${action} for '${testCase.value}'`, () => {
          bigNumberInputComponent.acceptEmpty = testCase.expected === VALID
          changeMock.target.value = testCase.value
          input().simulate(INPUT_EVENT.CHANGE, changeMock)

          expect(bigNumberInputComponent.onChange).toHaveBeenCalledTimes(1)
          expect(bigNumberInputComponent.onChange).toHaveBeenCalledWith({
            value: '',
            pristine: false,
            valid: testCase.expected
          })
        })
      })
    })

    describe('with float', () => {
      [
        { value: '123', expected: VALID },
        { value: '123e3', expected: VALID },
        { value: '123e-3', expected: VALID },
        { value: '.123', expected: VALID },
        { value: '0.123', expected: VALID },
        { value: '1.123', expected: VALID },
        { value: '1.12e12', expected: VALID },
        { value: '1e-18', expected: VALID },
        { value: '1e-19', expected: INVALID },
      ].forEach(testCase => {
        const action = testCase.expected === VALID ? 'pass' : 'fail'

        it(`Should ${action} for '${testCase.value}'`, () => {
          bigNumberInputComponent.acceptFloat = true
          bigNumberInputComponent.min = 1e-18

          changeMock.target.value = testCase.value
          input().simulate(INPUT_EVENT.CHANGE, changeMock)

          expect(bigNumberInputComponent.onChange).toHaveBeenCalledTimes(1)
          expect(bigNumberInputComponent.onChange).toHaveBeenCalledWith({
            value: new BigNumber(testCase.value).toFixed(),
            pristine: false,
            valid: testCase.expected
          })
        })
      })
    })

    describe('without float', () => {
      [
        { value: '123', expected: VALID },
        { value: '123e-3', expected: INVALID },
        { value: '.123', expected: INVALID },
        { value: '0.123', expected: INVALID },
        { value: '1.123', expected: INVALID },
        { value: '10000000000000000000', expected: INVALID },
        { value: '1000000000000000000', expected: VALID },
        { value: '1000000000000000001', expected: INVALID },
        { value: '999999999999999999', expected: VALID },
      ].forEach(testCase => {
        const action = testCase.expected === VALID ? 'pass' : 'fail'

        it(`Should ${action} for '${testCase.value}'`, () => {
          bigNumberInputComponent.max = 1e18
          changeMock.target.value = testCase.value
          input().simulate(INPUT_EVENT.CHANGE, changeMock)

          expect(bigNumberInputComponent.onChange).toHaveBeenCalledTimes(1)
          expect(bigNumberInputComponent.onChange).toHaveBeenCalledWith({
            value: new BigNumber(testCase.value).toFixed(),
            pristine: false,
            valid: testCase.expected
          })
        })
      })
    })

    describe('with negative', () => {
      [
        { value: '-123', expected: VALID },
        { value: '-123e3', expected: INVALID },
        { value: '-.123', expected: VALID },
        { value: '-0.123', expected: VALID },
        { value: '-1.123', expected: VALID },
        { value: '-10000000000000000000', expected: INVALID },
        { value: '-99999', expected: VALID },
      ].forEach(testCase => {
        const action = testCase.expected === VALID ? 'pass' : 'fail'

        it(`Should ${action} for '${testCase.value}'`, () => {
          bigNumberInputComponent.acceptFloat = true
          bigNumberInputComponent.min = -1e5
          changeMock.target.value = testCase.value
          input().simulate(INPUT_EVENT.CHANGE, changeMock)

          expect(bigNumberInputComponent.onChange).toHaveBeenCalledTimes(1)
          expect(bigNumberInputComponent.onChange).toHaveBeenCalledWith({
            value: new BigNumber(testCase.value).toFixed(),
            pristine: false,
            valid: testCase.expected
          })
        })
      })
    })

    describe('without negative', () => {
      [
        { value: '-1', expected: INVALID },
        { value: '0', expected: VALID },
        { value: '15', expected: VALID },
      ].forEach(testCase => {
        const action = testCase.expected === VALID ? 'pass' : 'fail'

        it(`Should ${action} for '${testCase.value}'`, () => {
          bigNumberInputComponent.min = 0
          changeMock.target.value = testCase.value
          input().simulate(INPUT_EVENT.CHANGE, changeMock)

          expect(bigNumberInputComponent.onChange).toHaveBeenCalledTimes(1)
          expect(bigNumberInputComponent.onChange).toHaveBeenCalledWith({
            value: new BigNumber(testCase.value).toFixed(),
            pristine: false,
            valid: testCase.expected
          })
        })
      })
    })

    describe('max and min decimals', () => {
      [
        {
          value: '1e-5',
          expected: VALID,
          props: { minDecimals: 0, maxDecimals: 10}
        },
        {
          value: '1e-5',
          expected: INVALID,
          props: { minDecimals: 10, maxDecimals: 10}
        },
        {
          value: '0.0000157',
          expected: VALID,
          props: { minDecimals: 0, maxDecimals: 10}
        },
        {
          value: '0.00000000000000001544',
          expected: INVALID,
          props: { minDecimals: 0, maxDecimals: 10}
        },
        {
          value: '.6546465464654654',
          expected: VALID,
          props: { minDecimals: 15, maxDecimals: 16}
        },
        {
          value: '.654657674646546778',
          expected: INVALID,
          props: { minDecimals: 15, maxDecimals: 16}
        },
      ].forEach(testCase => {
        const action = testCase.expected === VALID ? 'pass' : 'fail'

        it(`Should ${action} for '${testCase.value}'`, () => {
          bigNumberInputComponent.acceptFloat = true
          bigNumberInputComponent.maxDecimals = testCase.props.maxDecimals
          bigNumberInputComponent.minDecimals = testCase.props.minDecimals

          changeMock.target.value = testCase.value
          input().simulate(INPUT_EVENT.CHANGE, changeMock)
          expect(bigNumberInputComponent.onChange).toHaveBeenCalledTimes(1)
          expect(bigNumberInputComponent.onChange).toHaveBeenCalledWith({
            value: new BigNumber(testCase.value).toFixed(),
            pristine: false,
            valid: testCase.expected
          })
        })
      })
    })
  })
})
