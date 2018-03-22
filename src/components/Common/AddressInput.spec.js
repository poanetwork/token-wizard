import React from 'react'
import { AddressInput } from './AddressInput'
import { TEXT_FIELDS, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

describe('AddressInput', () => {
  it('Should render the component', () => {
    const state = {
      walletAddress: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
      pristine: true,
      valid: VALIDATION_TYPES.VALID,
    }
    const component = renderer.create(
      <AddressInput
        side="left"
        title={TEXT_FIELDS.WALLET_ADDRESS}
        address={state.walletAddress}
        valid={state.valid}
        pristine={state.pristine}
        errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
        onChange={jest.fn()}
        description="Where the money goes after investors transactions. Immediately after each transaction. We
             recommend to setup a multisig wallet with hardware based signers."
      />
    )

    expect(component.toJSON()).toMatchSnapshot()
  })

  it('Should fail if address is invalid', () => {
    const onChange = jest.fn()
    const state = {
      walletAddress: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
      pristine: true,
      valid: VALIDATION_TYPES.VALID,
    }
    const wrapper = mount(
      <AddressInput
        side="left"
        title={TEXT_FIELDS.WALLET_ADDRESS}
        address={state.walletAddress}
        valid={state.valid}
        pristine={state.pristine}
        errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
        onChange={onChange}
        description="Where the money goes after investors transactions. Immediately after each transaction. We
             recommend to setup a multisig wallet with hardware based signers."
      />
    )

    const newAddress = 'abc'
    wrapper.find('input[type="text"]').simulate('change', { target: { value: newAddress } })

    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith({
      address: newAddress,
      pristine: false,
      valid: VALIDATION_TYPES.INVALID,
    })
  })

  it('Should pass if the new address is valid', () => {
    const onChange = jest.fn()
    const state = {
      walletAddress: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
      pristine: true,
      valid: VALIDATION_TYPES.VALID,
    }
    const wrapper = mount(
      <AddressInput
        side="left"
        title={TEXT_FIELDS.WALLET_ADDRESS}
        address={state.walletAddress}
        valid={state.valid}
        pristine={state.pristine}
        errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
        onChange={onChange}
        description="Where the money goes after investors transactions. Immediately after each transaction. We
             recommend to setup a multisig wallet with hardware based signers."
      />
    )

    const newAddress = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    wrapper.find('input[type="text"]').simulate('change', { target: { value: newAddress } })

    expect(onChange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith({
      address: newAddress,
      pristine: false,
      valid: VALIDATION_TYPES.VALID,
    })
  })
})
