import React from 'react'
import { ReservedTokensInputBlock } from '../../../src/components/Common/ReservedTokensInputBlock'
import { VALIDATION_TYPES } from '../../../src/utils/constants'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { reservedTokenStore, tokenStore } from '../../../src/stores'

const { VALID, INVALID } = VALIDATION_TYPES
const stores = { reservedTokenStore, tokenStore }

configure({ adapter: new Adapter() })
jest.mock('react-dropzone', () => () => <span>Dropzone</span>)

describe('ReservedTokensInputBlock', () => {
  describe('render', () => {
    it(`should render the component for tokens`, () => {
      // Given
      const wrapper = mount(<ReservedTokensInputBlock {...stores} />)

      // When
      wrapper.find('#tokens').simulate('change')

      // Then
      expect(wrapper).toMatchSnapshot('tokens')
    })

    it(`should render the component for percentage`, () => {
      // Given
      const wrapper = mount(<ReservedTokensInputBlock {...stores} />)

      // When
      wrapper.find('#percentage').simulate('change')

      // Then
      expect(wrapper).toMatchSnapshot('percentage')
    })
  })

  describe('Address field', () => {
    const testCases = [
      { value: '0x123', expected: false },
      { value: '0x90F8bF6A479f320EAD074411A4B0E7944EA8C9C1', expected: false },
      { value: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', expected: true },
      { value: '0X90f8bf6a479f320ead074411a4b0e7944ea8c9c1', expected: true },
      { value: '0x90F8BF6A479F320EAD074411A4B0E7944EA8C9C1', expected: true },
      { value: '0X90F8BF6A479F320EAD074411A4B0E7944EA8C9C1', expected: true }
    ]
    testCases.forEach(testCase => {
      const action = testCase.expected ? 'pass' : 'fail'
      const validity = testCase.expected ? VALID : INVALID

      it(`Should ${action} for '${testCase.value}'`, () => {
        const wrapper = mount(<ReservedTokensInputBlock {...stores} />)
        const componentInstance = wrapper.find(ReservedTokensInputBlock).instance().wrappedInstance
        const handleAddressChange = jest.spyOn(componentInstance, 'handleAddressChange')

        wrapper.update()

        wrapper
          .find('input[type="text"]')
          .at(0)
          .simulate('change', { target: { value: testCase.value } })
        expect(handleAddressChange).toHaveBeenCalledTimes(1)
        expect(handleAddressChange).toHaveBeenCalledWith(testCase.value)
        expect(componentInstance.state.validation.address.pristine).toBeFalsy()
        expect(componentInstance.state.validation.address.valid).toBe(validity)
      })
    })
  })

  describe('Dimension selection', () => {
    it('Should set "tokens" as selected dimension', () => {
      const wrapper = mount(<ReservedTokensInputBlock {...stores} />)
      const componentInstance = wrapper.find(ReservedTokensInputBlock).instance().wrappedInstance
      const updateReservedTokenInput = jest.spyOn(componentInstance, 'updateReservedTokenInput')

      wrapper.update()

      wrapper.find('#tokens').simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('tokens', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(componentInstance.state.dim).toBe('tokens')
    })

    it('Should set "percentage" as selected dimension', () => {
      const wrapper = mount(<ReservedTokensInputBlock {...stores} />)
      const componentInstance = wrapper.find(ReservedTokensInputBlock).instance().wrappedInstance
      const updateReservedTokenInput = jest.spyOn(componentInstance, 'updateReservedTokenInput')

      wrapper.update()

      wrapper.find('#percentage').simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('percentage', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(componentInstance.state.dim).toBe('percentage')
    })

    it('Should set "tokens" as selected dimension after selecting percentage', () => {
      const wrapper = mount(<ReservedTokensInputBlock {...stores} />)
      const componentInstance = wrapper.find(ReservedTokensInputBlock).instance().wrappedInstance
      const updateReservedTokenInput = jest.spyOn(componentInstance, 'updateReservedTokenInput')

      wrapper.update()

      wrapper.find('#percentage').simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('percentage', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(componentInstance.state.dim).toBe('percentage')

      wrapper.find('#tokens').simulate('change')
      expect(updateReservedTokenInput).toHaveBeenCalledWith('tokens', 'dim')
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(2)
      expect(componentInstance.state.dim).toBe('tokens')
    })
  })

  describe('Value field', () => {
    describe('tokens', () => {
      const testCases = [
        { value: '0', expected: false },
        { value: '-10', expected: false },
        { value: -10, expected: false },
        { value: 123.1234, expected: false },
        { value: '10', expected: true },
        { value: 10, expected: true },
        { value: '0.1', expected: true },
        { value: '1e-3', expected: true },
        { value: '1.3', expected: true }
      ]

      testCases.forEach(testCase => {
        const action = testCase.expected ? 'pass' : 'fail'
        const validity = testCase.expected ? VALID : INVALID
        const calledWith = {
          value: testCase.value,
          pristine: false,
          valid: validity
        }

        it(`Should ${action} for '${testCase.value}' with ${tokenStore.decimals} decimals`, () => {
          const wrapper = mount(<ReservedTokensInputBlock {...stores} decimals={3} />)
          const componentInstance = wrapper.find(ReservedTokensInputBlock).instance().wrappedInstance
          const handleValueChange = jest.spyOn(componentInstance, 'handleValueChange')

          wrapper.update()
          wrapper.find('#tokens').simulate('change')
          wrapper
            .find('input[type="number"]')
            .at(0)
            .simulate('change', { target: { value: testCase.value } })

          expect(handleValueChange).toHaveBeenCalledTimes(1)
          expect(handleValueChange).toHaveBeenCalledWith(calledWith)
        })
      })
    })

    describe('percentage', () => {
      const testCases = [
        { value: '0', expected: false },
        { value: '-10', expected: false },
        { value: -10, expected: false },
        { value: '10', expected: true },
        { value: 10, expected: true },
        { value: '0.1', expected: true },
        { value: '1e-3', expected: true },
        { value: '1.3', expected: true },
        { value: 123.1234, expected: true }
      ]
      testCases.forEach(testCase => {
        const action = testCase.expected ? 'pass' : 'fail'
        const validity = testCase.expected ? VALID : INVALID
        const calledWith = {
          value: testCase.value,
          pristine: false,
          valid: validity
        }

        it(`Should ${action} for '${testCase.value}'`, () => {
          const wrapper = mount(<ReservedTokensInputBlock {...stores} />)
          const componentInstance = wrapper.find(ReservedTokensInputBlock).instance().wrappedInstance
          const handleValueChange = jest.spyOn(componentInstance, 'handleValueChange')

          wrapper.update()
          wrapper.find('#percentage').simulate('change')
          wrapper
            .find('input[type="number"]')
            .at(0)
            .simulate('change', { target: { value: testCase.value } })

          expect(handleValueChange).toHaveBeenCalledTimes(2)
          expect(handleValueChange).toHaveBeenCalledWith({ value: '', pristine: true, valid: VALID })
          expect(handleValueChange).toHaveBeenCalledWith(calledWith)
        })
      })
    })
  })

  describe('Callbacks', () => {
    describe('addReservedTokensItem', () => {
      const testCases = [
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
            addr: '0x0000000000000000000000000000000000000001',
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
            addr: '0x0000000000000000000000000000000000000012',
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
        }
      ]

      testCases.forEach(testCase => {
        const action = testCase.expected ? 'call' : 'not call'

        it(`Should ${action} addReservedTokensItem callback for: ${JSON.stringify(testCase.value)}`, () => {
          const { tokens } = reservedTokenStore
          const storedTokens = testCase.expected ? tokens.length + 1 : tokens.length
          const wrapper = mount(<ReservedTokensInputBlock {...stores} decimals={3} />)

          wrapper.find(`#${testCase.value.dim}`).simulate('change')
          wrapper
            .find('input[type="text"]')
            .at(0)
            .simulate('change', { target: { value: testCase.value.addr } })
          wrapper
            .find('input[type="number"]')
            .at(0)
            .simulate('change', { target: { value: testCase.value.val } })

          wrapper.find('ButtonPlus').simulate('click')

          const { value } = testCase
          value.val = testCase.value.val === '' ? '' : parseFloat(testCase.value.val)

          expect(reservedTokenStore.tokens.length).toBe(storedTokens)
        })
      })
    })

    describe('clearAll', () => {
      afterEach(() => {
        reservedTokenStore.clearAll()
      })

      it('Should show the "Clear all" button if there are tokens"', () => {
        const wrapper = mount(<ReservedTokensInputBlock {...stores} />)
        const testCase = {
          value: {
            addr: '0x0000000000000000000000000000000000000012',
            dim: 'percentage',
            val: '120.123'
          }
        }

        wrapper.find(`#${testCase.value.dim}`).simulate('change')
        wrapper
          .find('input[type="text"]')
          .at(0)
          .simulate('change', { target: { value: testCase.value.addr } })
        wrapper
          .find('input[type="number"]')
          .at(0)
          .simulate('change', { target: { value: testCase.value.val } })

        wrapper.find('ButtonPlus').simulate('click')

        const clearAllButton = wrapper.find('ButtonCSV').find('.sw-ButtonCSV-clearall')
        expect(clearAllButton).toHaveLength(1)
      })

      it('Should not show the "Clear all" button if there are no tokens"', () => {
        const wrapper = mount(<ReservedTokensInputBlock {...stores} />)

        const clearAllButton = wrapper.find('.sw-ReservedTokensListControls_Button-clearall')
        expect(clearAllButton).toHaveLength(0)
      })
    })
  })
})
