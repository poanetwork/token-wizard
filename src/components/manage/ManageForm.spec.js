import React from 'react'
import { StaticRouter } from 'react-router'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { ManageForm } from './ManageForm'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import MockDate from 'mockdate'

const DATE = {
  TIER_0: {
    BEFORE_START: "2018-04-13T16:00",
    ACTIVE: "2018-04-16T21:00",
    FINISHED: "2018-04-18T00:00",
  },
  TIER_1: {
    BEFORE_START: "2018-04-16T21:00",
    ACTIVE: "2018-04-20T00:00",
    FINISHED: "2018-04-22T00:00",
  },
}

const initialTiers = [{
  whitelist: [
    { addr: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b", min: 1234, max: 50505, stored: true },
    { addr: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", min: 1234, max: 50505, stored: true },
    { addr: "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d", min: 1234, max: 50505, stored: true },
    { addr: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", min: 1234, max: 50505, stored: true }
  ],
  walletAddress: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  startTime: "2018-04-13T16:07",
  endTime: "2018-04-17T00:00",
  updatable: true,
  tier: "Tier 1",
  whitelistEnabled: "yes",
  supply: "132",
  rate: "123"
}, {
  whitelist: [
    { addr: "0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e", min: 1234, max: 50505, stored: true },
    { addr: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b", min: 1234, max: 50505, stored: true },
    { addr: "0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9", min: 1234, max: 50505, stored: true },
    { addr: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", min: 1234, max: 50505, stored: true },
    { addr: "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC", min: 1234, max: 50505, stored: true },
    { addr: "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E", min: 1234, max: 50505, stored: true },
    { addr: "0xd03ea8624C8C5987235048901fB614fDcA89b117", min: 1234, max: 50505, stored: true },
    { addr: "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d", min: 1234, max: 50505, stored: true },
    { addr: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", min: 1234, max: 50505, stored: true }
  ],
  walletAddress: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  startTime: "2018-04-17T00:00",
  endTime: "2018-04-21T00:00",
  updatable: false,
  tier: "Tier 2",
  supply: "156",
  rate: "55"
}]

configure({ adapter: new Adapter() })

describe('ManageForm', () => {
  it('should render the component without tiers', () => {
    const onSubmit = jest.fn()
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
    }

    MockDate.set(DATE.TIER_0.BEFORE_START)

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <Form
          onSubmit={onSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: [] }}
          component={ManageForm}
          {...manageFormProps}
        />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('should render the component with tiers', () => {
    const onSubmit = jest.fn()
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
    }
    MockDate.set(DATE.TIER_0.BEFORE_START)

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <Form
          onSubmit={onSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: initialTiers, }}
          component={ManageForm}
          {...manageFormProps}
        />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })

  it('should call handleChange if a field is modified', () => {
    MockDate.set(DATE.TIER_0.BEFORE_START)

    const onSubmit = jest.fn()
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <Form
          onSubmit={onSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: initialTiers, }}
          component={ManageForm}
          {...manageFormProps}
        />
      </StaticRouter>
    )
    expect(manageFormProps.handleChange).toHaveBeenCalledTimes(1)

    const rateInput = wrapper.find("input[name='tiers[0].rate']").at(0)

    rateInput.simulate('change', { target: { value: '1234' } })

    expect(manageFormProps.handleChange).toHaveBeenCalledTimes(2)
  })


  it('should start with "Save" button disabled', () => {
    MockDate.set(DATE.TIER_0.ACTIVE)

    const onSubmit = jest.fn()
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: false,
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <Form
          onSubmit={onSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: initialTiers, }}
          component={ManageForm}
          {...manageFormProps}
        />
      </StaticRouter>
    )

    const disabledSaveButton = wrapper.find("Link").find(".button_disabled").at(0)

    expect(disabledSaveButton.exists()).toBeTruthy()
  })

  it('should enable "Save" button', () => {
    MockDate.set(DATE.TIER_0.ACTIVE)

    const onSubmit = jest.fn()
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <Form
          onSubmit={onSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: initialTiers, }}
          component={ManageForm}
          {...manageFormProps}
        />
      </StaticRouter>
    )

    const enabledSaveButton = wrapper.find("Link").find(".button_disabled").at(0)

    expect(enabledSaveButton.exists()).toBeFalsy()
  })

  it('should call onSubmit', () => {
    MockDate.set(DATE.TIER_0.ACTIVE)

    const onSubmit = jest.fn()
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
    }

    const wrapper = mount(
      <StaticRouter location="testLocation" context={{}}>
        <Form
          onSubmit={onSubmit}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: initialTiers, }}
          component={ManageForm}
          {...manageFormProps}
        />
      </StaticRouter>
    )

    const saveButton = wrapper.find("Link").at(0)

    expect(onSubmit).toHaveBeenCalledTimes(0)
    saveButton.simulate('click')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
