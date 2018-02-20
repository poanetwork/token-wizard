import React from 'react'
import { ReservedTokensInputBlock } from './ReservedTokensInputBlock'
import { VALIDATION_TYPES } from '../../utils/constants'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

const { VALID, INVALID } = VALIDATION_TYPES
let tokenList
let addCallback
let removeCallback

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
})

configure({ adapter: new Adapter() })

describe('ReservedTokensInputBlock', () => {
  test('Should render the component', () => {
    const component = renderer.create(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('Should render all the tokens passed', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )

    expect(wrapper.find('.reserved-tokens-item-container')).toHaveLength(tokenList.length)
  })

  test('Should validate the address', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const wrongAddressEvent = { target: { value: '0x123' } }
    const validAddressEvent = { target: { value: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1' } }

    const handleAddressChange = jest.spyOn(wrapper.instance(), 'handleAddressChange')

    wrapper.update()

    wrapper.find('input[type="text"]').at(0).simulate('change', wrongAddressEvent)
    setTimeout(() => {
      expect(handleAddressChange).toHaveBeenCalledTimes(1)
      expect(handleAddressChange).toHaveBeenCalledWith(wrongAddressEvent.target.value)
      expect(wrapper.state('validation').address.pristine).toBeFalsy()
      expect(wrapper.state('validation').address.valid).toBe(INVALID)

      wrapper.find('input[type="text"]').at(0).simulate('change', validAddressEvent)
      setTimeout(() => {
        expect(handleAddressChange).toHaveBeenCalledTimes(1)
        expect(handleAddressChange).toHaveBeenCalledWith(validAddressEvent.target.value)
        expect(wrapper.state('validation').address.pristine).toBeFalsy()
        expect(wrapper.state('validation').address.valid).toBe(VALID)
      }, 10)
    }, 10)

  })

  test('Should fail if tokens value is invalid (zero or less)', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const valueEventZero = { target: { value: '0' } }
    const valueEventNegative = { target: { value: '-10' } }

    const handleValueChange = jest.spyOn(wrapper.instance(), 'handleValueChange')
    const updateReservedTokenInput = jest.spyOn(wrapper.instance(), 'updateReservedTokenInput')

    wrapper.update()

    wrapper.find('input[type="radio"]').at(0).simulate('change')
    setTimeout(() => {
      expect(updateReservedTokenInput).toHaveBeenCalledWith(['tokens', 'dim'])
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(wrapper.state('dim')).toBe('tokens')

      wrapper.find('input[type="number"]').at(0).simulate('change', valueEventZero)
      setTimeout(() => {
        expect(handleValueChange).toHaveBeenCalledWith(valueEventZero.target.value)
        expect(handleValueChange).toHaveBeenCalledTimes(1)
        expect(wrapper.state('validation').value.pristine).toBeFalsy()
        expect(wrapper.state('validation').value.valid).toBe(INVALID)

        wrapper.find('input[type="number"]').at(0).simulate('change', valueEventNegative)
        setTimeout(() => {
          expect(handleValueChange).toHaveBeenCalledWith(valueEventNegative.target.value)
          expect(handleValueChange).toHaveBeenCalledTimes(1)
          expect(wrapper.state('validation').value.pristine).toBeFalsy()
          expect(wrapper.state('validation').value.valid).toBe(INVALID)
        }, 10)
      }, 10)
    }, 10)
  })

  test('Should fail if percentage value is invalid (zero or less)', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const valueEventZero = { target: { value: '0' } }
    const valueEventNegative = { target: { value: '-10' } }

    const handleValueChange = jest.spyOn(wrapper.instance(), 'handleValueChange')
    const updateReservedTokenInput = jest.spyOn(wrapper.instance(), 'updateReservedTokenInput')

    wrapper.update()

    wrapper.find('input[type="radio"]').at(1).simulate('change')
    setTimeout(() => {
      expect(updateReservedTokenInput).toHaveBeenCalledWith(['percentage', 'dim'])
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(wrapper.state('dim')).toBe('percentage')

      wrapper.find('input[type="number"]').at(0).simulate('change', valueEventZero)
      setTimeout(() => {
        expect(handleValueChange).toHaveBeenCalledWith(valueEventZero.target.value)
        expect(handleValueChange).toHaveBeenCalledTimes(1)
        expect(wrapper.state('validation').value.pristine).toBeFalsy()
        expect(wrapper.state('validation').value.valid).toBe(INVALID)

        wrapper.find('input[type="number"]').at(0).simulate('change', valueEventNegative)
        setTimeout(() => {
          expect(handleValueChange).toHaveBeenCalledWith(valueEventNegative.target.value)
          expect(handleValueChange).toHaveBeenCalledTimes(1)
          expect(wrapper.state('validation').value.pristine).toBeFalsy()
          expect(wrapper.state('validation').value.valid).toBe(INVALID)
        }, 10)
      }, 10)
    }, 10)
  })

  test('Should mark as valid if tokens value is valid (greater than zero)', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const valueEvent = { target: { value: '150' } }

    const handleValueChange = jest.spyOn(wrapper.instance(), 'handleValueChange')
    const updateReservedTokenInput = jest.spyOn(wrapper.instance(), 'updateReservedTokenInput')

    wrapper.update()

    wrapper.find('input[type="radio"]').at(0).simulate('change')
    setTimeout(() => {
      expect(updateReservedTokenInput).toHaveBeenCalledWith(['tokens', 'dim'])
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(wrapper.state('dim')).toBe('tokens')

      wrapper.find('input[type="number"]').at(0).simulate('change', valueEvent)
      setTimeout(() => {
        expect(handleValueChange).toHaveBeenCalledWith(valueEvent.target.value)
        expect(handleValueChange).toHaveBeenCalledTimes(1)
        expect(wrapper.state('validation').value.pristine).toBeFalsy()
        expect(wrapper.state('validation').value.valid).toBe(VALID)
      }, 10)
    }, 10)
  })

  test('Should mark as valid if percentage value is valid (greater than zero)', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const valueEventSmall = { target: { value: '75' } }
    const valueEventBig = { target: { value: '180' } }

    const handleValueChange = jest.spyOn(wrapper.instance(), 'handleValueChange')
    const updateReservedTokenInput = jest.spyOn(wrapper.instance(), 'updateReservedTokenInput')

    wrapper.update()

    wrapper.find('input[type="radio"]').at(1).simulate('change')
    setTimeout(() => {
      expect(updateReservedTokenInput).toHaveBeenCalledWith(['percentage', 'dim'])
      expect(updateReservedTokenInput).toHaveBeenCalledTimes(1)
      expect(wrapper.state('dim')).toBe('percentage')

      wrapper.find('input[type="number"]').at(0).simulate('change', valueEventSmall)
      setTimeout(() => {
        expect(handleValueChange).toHaveBeenCalledWith(valueEventSmall.target.value)
        expect(handleValueChange).toHaveBeenCalledTimes(1)
        expect(wrapper.state('validation').value.pristine).toBeFalsy()
        expect(wrapper.state('validation').value.valid).toBe(VALID)

        wrapper.find('input[type="number"]').at(0).simulate('change', valueEventBig)
        setTimeout(() => {
          expect(handleValueChange).toHaveBeenCalledWith(valueEventBig.target.value)
          expect(handleValueChange).toHaveBeenCalledTimes(1)
          expect(wrapper.state('validation').value.pristine).toBeFalsy()
          expect(wrapper.state('validation').value.valid).toBe(VALID)
        }, 10)
      }, 10)
    }, 10)
  })

  test('Should call method to add address', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const newToken = {
      addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
      dim: 'tokens',
      val: '120'
    }
    const addressEvent = { target: { value: newToken.addr } }
    const valueEvent = { target: { value: newToken.val } }

    const handleAddressChange = jest.spyOn(wrapper.instance(), 'handleAddressChange')
    const handleValueChange = jest.spyOn(wrapper.instance(), 'handleValueChange')

    wrapper.update()

    wrapper.find('input[type="text"]').at(0).simulate('change', addressEvent)
    wrapper.find('input[type="number"]').at(0).simulate('change', valueEvent)
    wrapper.find('.plus-button-container').childAt(0).simulate('click')

    setTimeout(() => {
      expect(wrapper.state('validation').address.pristine).toBeFalsy()
      expect(wrapper.state('validation').address.valid).toBe(VALID)
      expect(wrapper.state('addr')).toBe(newToken.addr)
      expect(handleAddressChange).toHaveBeenCalledTimes(1)
      expect(handleAddressChange).toHaveBeenCalledWith(newToken.addr)

      expect(wrapper.state('validation').value.pristine).toBeFalsy()
      expect(wrapper.state('validation').value.valid).toBe(VALID)
      expect(wrapper.state('val')).toBe(newToken.val)
      expect(handleValueChange).toHaveBeenCalledTimes(1)
      expect(handleValueChange).toHaveBeenCalledWith(newToken.val)

      expect(wrapper.state('dim')).toBe(newToken.dim)

      expect(addCallback).toHaveBeenCalledWith(newToken)
      expect(addCallback).toHaveBeenCalledTimes(1)
    }, 10)
  })

  test('Should call method to remove address', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )

    wrapper.find('.reserved-tokens-item-empty').children('a').at(0).simulate('click')
    expect(removeCallback).toHaveBeenCalledTimes(1)
  })

  test('Should reset state after adding a new address', () => {
    const wrapper = mount(
      <ReservedTokensInputBlock
        tokens={tokenList}
        addReservedTokensItem={addCallback}
        removeReservedToken={removeCallback}
      />
    )
    const newToken = {
      addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
      dim: 'percentage',
      val: '120'
    }
    const addressEvent = { target: { value: newToken.addr } }
    const valueEvent = { target: { value: newToken.val } }

    const handleAddressChange = jest.spyOn(wrapper.instance(), 'handleAddressChange')
    const handleValueChange = jest.spyOn(wrapper.instance(), 'handleValueChange')

    wrapper.update()

    expect(wrapper.state('validation').address.pristine).toBeTruthy()
    expect(wrapper.state('validation').address.valid).toBe(INVALID)
    expect(wrapper.state('validation').value.pristine).toBeTruthy()
    expect(wrapper.state('validation').value.valid).toBe(INVALID)
    expect(wrapper.state('addr')).toBe('')
    expect(wrapper.state('dim')).toBe('tokens')
    expect(wrapper.state('val')).toBe('')

    wrapper.find('input[type="text"]').at(0).simulate('change', addressEvent)
    wrapper.find('input[type="number"]').at(0).simulate('change', valueEvent)
    wrapper.find('input[type="radio"]').at(1).simulate('change')

    setTimeout(() => {
      expect(wrapper.state('validation').address.pristine).toBeFalsy()
      expect(wrapper.state('validation').address.valid).toBe(VALID)
      expect(wrapper.state('addr')).toBe(newToken.addr)
      expect(handleAddressChange).toHaveBeenCalledTimes(1)
      expect(handleAddressChange).toHaveBeenCalledWith(newToken.addr)

      expect(wrapper.state('validation').value.pristine).toBeFalsy()
      expect(wrapper.state('validation').value.valid).toBe(VALID)
      expect(wrapper.state('val')).toBe(newToken.val)
      expect(handleValueChange).toHaveBeenCalledTimes(1)
      expect(handleValueChange).toHaveBeenCalledWith(newToken.val)

      expect(wrapper.state('dim')).toBe(newToken.dim)

      wrapper.find('.plus-button-container').childAt(0).simulate('click')
      setTimeout(() => {
        expect(wrapper.state('validation').address.pristine).toBeTruthy()
        expect(wrapper.state('validation').address.valid).toBe(INVALID)
        expect(wrapper.state('validation').value.pristine).toBeTruthy()
        expect(wrapper.state('validation').value.valid).toBe(INVALID)
        expect(wrapper.state('addr')).toBe('')
        expect(wrapper.state('dim')).toBe('tokens')
        expect(wrapper.state('val')).toBe('')
      }, 10)
    }, 10)
  })
})
