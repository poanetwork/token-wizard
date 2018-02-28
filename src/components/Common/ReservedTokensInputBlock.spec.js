import React from 'react'
import { ReservedTokensInputBlock } from './ReservedTokensInputBlock'
import { VALIDATION_TYPES } from '../../utils/constants'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

const { VALID, INVALID } = VALIDATION_TYPES

configure({ adapter: new Adapter() })

describe('ReservedTokensInputBlock', () => {
  let tokenList
  let addCallback
  let removeCallback
  let decimals
  let wrapperMemo, wrapper
  let addressInputMemo, addressInput
  let valueInputMemo, valueInput
  let addressStateMemo, addressState
  let valueStateMemo, valueState

  beforeEach(() => {
    tokenList = [
      {
        addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
        dim: 'tokens',
        value: '120'
      },
      {
        addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
        dim: 'percentage',
        value: '105'
      },
      {
        addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
        dim: 'percentage',
        value: '100'
      },
      {
        addr: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b',
        dim: 'tokens',
        value: '20'
      }
    ]
    addCallback = jest.fn()
    removeCallback = jest.fn()
    decimals = 3

    wrapperMemo = undefined
    wrapper = () => wrapperMemo || (wrapperMemo = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        decimals={decimals}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    ))

    addressInputMemo = undefined
    addressInput = () => addressInputMemo || (addressInputMemo = wrapper().find('input[type="text"]').at(0))

    valueInputMemo = undefined
    valueInput = () => valueInputMemo || (valueInputMemo = wrapper().find('input[type="number"]').at(0))

    addressStateMemo = undefined
    addressState = () => addressStateMemo || (addressStateMemo = wrapper().state('validation').address)

    valueStateMemo = undefined
    valueState = () => valueStateMemo || (valueStateMemo = wrapper().state('validation').value)
  })

  describe('render', () => {
    let componentMemo, component
    beforeEach(() => {
      componentMemo = undefined
      component = () => componentMemo || (componentMemo = renderer.create(
        <ReservedTokensInputBlock
          tokens={tokenList}
          decimals={decimals}
          addReservedTokensItem={addCallback}
          removeReservedToken={removeCallback}
        />
      ))
    })

    it('Should render the component for tokens', () => {
      expect(component().toJSON()).toMatchSnapshot('tokens')
    })

    it('Should render the component for percentage', () => {
      wrapper().find('input[type="radio"]').at(1).simulate('change')
      expect(component().toJSON()).toMatchSnapshot('percentage')
    })

    it('Should render all the tokens passed', () => {
      expect(wrapper().find('.reserved-tokens-item-container')).toHaveLength(tokenList.length)
    })
  })

  describe('Address field', () => {
    [
      { value: '0x123', expected: false },
      { value: '0x90F8bF6A479f320EAD074411A4B0E7944EA8C9C1', expected: false },
      { value: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', expected: true },
      { value: '0X90f8bf6a479f320ead074411a4b0e7944ea8c9c1', expected: true },
      { value: '0x90F8BF6A479F320EAD074411A4B0E7944EA8C9C1', expected: true },
      { value: '0X90F8BF6A479F320EAD074411A4B0E7944EA8C9C1', expected: true },
    ].forEach(testCase => {
      const action = testCase.expected ? 'pass' : 'fail'
      const validity = testCase.expected ? VALID : INVALID

      it(`Should ${action} for '${testCase.value}'`, () => {
        const handleAddressChange = jest.spyOn(wrapper().instance(), 'handleAddressChange')

        wrapper().update()

        addressInput().simulate('change', { target: { value: testCase.value } })
        expect(handleAddressChange).toHaveBeenCalledTimes(1)
        expect(handleAddressChange).toHaveBeenCalledWith(testCase.value)
        expect(addressState().pristine).toBeFalsy()
        expect(addressState().valid).toBe(validity)
      })
    })
  })

  describe('Dimension selection', () => {
    it('Should set "tokens" as selected dimension', () => {
      const updateReservedTokenInput = jest.spyOn(wrapper().instance(), 'updateReservedTokenInput')

      wrapper().update()

      wrapper().find('input[type="radio"]').at(0).simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('tokens', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(wrapper().state('dim')).toBe('tokens')
    })
    it('Should set "percentage" as selected dimension', () => {
      const updateReservedTokenInput = jest.spyOn(wrapper().instance(), 'updateReservedTokenInput')

      wrapper().update()

      wrapper().find('input[type="radio"]').at(1).simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('percentage', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(wrapper().state('dim')).toBe('percentage')
    })
    it('Should set "tokens" as selected dimension after selecting percentage', () => {
      const updateReservedTokenInput = jest.spyOn(wrapper().instance(), 'updateReservedTokenInput')

      wrapper().update()

      wrapper().find('input[type="radio"]').at(1).simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('percentage', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(wrapper().state('dim')).toBe('percentage')

      wrapper().find('input[type="radio"]').at(0).simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('tokens', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(2)
      expect(wrapper().state('dim')).toBe('tokens')
    })
    it('Should fail if state.dim is not "percentage" or "tokens"', () => {
      wrapper().setState({dim: 'height'})
      const radio = wrapper().find('input[type="radio"]')
      const tokens = radio.at(0)
      const percentage = radio.at(1)

      expect(tokens.props().checked).toBeFalsy()
      expect(percentage.props().checked).toBeFalsy()
    })
  })

  describe('Value field', () => {
    describe('tokens', () => {
      [
        { value: '0', expected: false },
        { value: '-10', expected: false },
        { value: -10, expected: false },
        { value: 123.1234, expected: false },
        { value: '10', expected: true },
        { value: 10, expected: true },
        { value: '0.1', expected: true },
        { value: '1e-3', expected: true },
        { value: '1.3', expected: true },
      ].forEach(testCase => {
        const action = testCase.expected ? 'pass' : 'fail'
        const validity = testCase.expected ? VALID : INVALID
        const calledWith = {
          value: testCase.value === '' ? '' : parseFloat(testCase.value),
          pristine: false,
          valid: validity
        }

        it(`Should ${action} for '${testCase.value}' with ${decimals} decimals`, () => {
          const handleValueChange = jest.spyOn(wrapper().instance(), 'handleValueChange')

          wrapper().update()
          wrapper().find('input[type="radio"]').at(0).simulate('change')
          valueInput().simulate('change', { target: { value: testCase.value } })

          expect(handleValueChange).toHaveBeenCalledTimes(1)
          expect(handleValueChange).toHaveBeenCalledWith(calledWith)
        })
      })
    })

    describe('percentage', () => {
      [
        { value: '0', expected: false },
        { value: '-10', expected: false },
        { value: -10, expected: false },
        { value: '10', expected: true },
        { value: 10, expected: true },
        { value: '0.1', expected: true },
        { value: '1e-3', expected: true },
        { value: '1.3', expected: true },
        { value: 123.1234, expected: true },
      ].forEach(testCase => {
        const action = testCase.expected ? 'pass' : 'fail'
        const validity = testCase.expected ? VALID : INVALID
        const calledWith = {
          value: testCase.value === '' ? '' : parseFloat(testCase.value),
          pristine: false,
          valid: validity
        }

        it(`Should ${action} for '${testCase.value}'`, () => {
          const handleValueChange = jest.spyOn(wrapper().instance(), 'handleValueChange')

          wrapper().update()
          wrapper().find('input[type="radio"]').at(1).simulate('change')
          valueInput().simulate('change', { target: { value: testCase.value } })

          expect(handleValueChange).toHaveBeenCalledTimes(2)
          expect(handleValueChange).toHaveBeenCalledWith({
            value: '',
            pristine: true,
            valid: INVALID
          })
          expect(handleValueChange).toHaveBeenCalledWith(calledWith)
        })
      })
    })
  })

  describe('Callbacks', () => {
    describe('addReservedTokensItem', () => {
      [
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'tokens',
            val: '120'
          },
          expected: true
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'tokens',
            val: '0.001'
          },
          expected: true
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'tokens',
            val: ''
          },
          expected: false
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'tokens',
            val: '0'
          },
          expected: false
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'tokens',
            val: '120.1234'
          },
          expected: false
        },
        {
          value: {
            addr: '',
            dim: 'tokens',
            val: '120'
          },
          expected: false
        },
        {
          value: {
            addr: '0x90f8bf6a4',
            dim: 'tokens',
            val: '120'
          },
          expected: false
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c10x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'tokens',
            val: '120'
          },
          expected: false
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'percentage',
            val: '120'
          },
          expected: true
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'percentage',
            val: '120.123'
          },
          expected: true
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'percentage',
            val: ''
          },
          expected: false
        },
        {
          value: {
            addr: '',
            dim: 'percentage',
            val: '120.123'
          },
          expected: false
        },
        {
          value: {
            addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
            dim: 'percentage',
            val: '0'
          },
          expected: false
        },
      ].forEach(testCase => {
        const radioIndex = testCase.value.dim === 'tokens' ? 0 : 1
        const action = testCase.expected ? 'call' : 'not call'
        const callTimes = testCase.expected ? 1 : 0

        it(`Should ${action} addReservedTokensItem callback for: ${JSON.stringify(testCase.value)}`, () => {
          wrapper().find('input[type="radio"]').at(radioIndex).simulate('change')

          addressInput().simulate('change', { target: { value: testCase.value.addr } })
          valueInput().simulate('change', { target: { value: testCase.value.val } })

          wrapper().find('.plus-button-container').childAt(0).simulate('click')

          const { value } = testCase
          value.val = testCase.value.val === '' ? '' : parseFloat(testCase.value.val)

          if (testCase.expect) {
            expect(addCallback).toHaveBeenCalledWith(value)
          }
          expect(addCallback).toHaveBeenCalledTimes(callTimes)
        })

      })
    })

    describe('removeReservedToken', () => {
      it('Should call removeReservedToken callback', () => {
        wrapper().find('.reserved-tokens-item-empty').children('a').at(0).simulate('click')
        expect(removeCallback).toHaveBeenCalledTimes(1)
      })
    })
  })
})
