import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { ManageForm } from './ManageForm'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import MockDate from 'mockdate'
import CrowdsaleStore from '../../stores/CrowdsaleStore'
import GeneralStore from '../../stores/GeneralStore'
import TokenStore from '../../stores/TokenStore'
import TierStore from '../../stores/TierStore'
import { Provider } from 'mobx-react'
import { CROWDSALE_STRATEGIES, VALIDATION_TYPES } from '../../utils/constants'

const { VALID } = VALIDATION_TYPES

const DATE = {
  TIER_0: {
    BEFORE_START: "2018-04-13T16:00",
    BEFORE_START_5_SEC_AFTER: "2018-04-13T16:05",
    ACTIVE: "2018-04-16T21:00",
    FINISHED: "2018-04-18T00:00"
  },
  TIER_1: {
    BEFORE_START: "2018-04-16T21:00",
    ACTIVE: "2018-04-20T00:00",
    FINISHED: "2018-04-22T00:00"
  }
}

const tiers = [{
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
  rate: "123",
  minCap: "0"
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
  whitelistEnabled: "yes",
  supply: "156",
  rate: "55",
  minCap: "0"
}]

const initialTiers = [{
  whitelist: [
    { addr: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b", min: 1234, max: 50505, stored: true },
    { addr: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", min: 1234, max: 50505, stored: true },
    { addr: "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d", min: 1234, max: 50505, stored: true },
    { addr: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", min: 1234, max: 50505, stored: true }
  ],
  startTime: "2018-04-13T16:07",
  endTime: "2018-04-17T00:00",
  duration: "1528827423500",
  updatable: true,
  tier: "Tier 1",
  isWhitelisted: "yes",
  supply: "132",
  rate: "123",
  index: "0",
  addresses: {
    crowdsaleAddress: "0x42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae"
  },
  minCap: "0"
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
  startTime: "2018-04-17T00:00",
  endTime: "2018-04-21T00:00",
  duration: "1528827423500",
  updatable: false,
  tier: "Tier 2",
  isWhitelisted: "yes",
  supply: "156",
  rate: "55",
  index: "1",
  addresses: {
    crowdsaleAddress: "0x42a7b7dd785cd69714a189dffb3fd7d7174edc9ece837694ce50f7078f7c31ae"
  },
  minCap: "0"
}]

const validations = {
  tier: VALID,
  walletAddress: VALID,
  rate: VALID,
  supply: VALID,
  startTime: VALID,
  endTime: VALID,
  updatable: VALID
}

configure({ adapter: new Adapter() })

describe('ManageForm', () => {
  let generalStore
  let crowdsaleStore
  let tokenStore
  let tierStore
  let stores = {}

  beforeEach(() => {
    generalStore = new GeneralStore()
    tokenStore = new TokenStore()
    crowdsaleStore = new CrowdsaleStore()
    tierStore = new TierStore()
    stores = { generalStore, crowdsaleStore, tokenStore, tierStore }
    crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE)
    tierStore.addTier(tiers[0], validations)
    tierStore.addTier(tiers[1], validations)
    MockDate.set(DATE.TIER_0.BEFORE_START)
  })

  it('should render the component without tiers', () => {
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      canEditTiers: true,
      displaySave: true
    }

    tierStore.reset()

    expect(mount(
      <Provider {...stores}>
        <BrowserRouter>
          <Form
            onSubmit={jest.fn()}
            mutators={{ ...arrayMutators }}
            decorators={[jest.fn()]}
            initialValues={{
              tiers: []
            }}
            component={ManageForm}
            {...manageFormProps}
          />
        </BrowserRouter>
      </Provider>)).toMatchSnapshot()
  })

  it('should render the component with tiers', () => {
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      canEditTiers: true,
      displaySave: true
    }

    expect(mount(
      <Provider {...stores}>
        <BrowserRouter>
          <Form
            onSubmit={jest.fn()}
            mutators={{ ...arrayMutators }}
            decorators={[jest.fn()]}
            initialValues={{
              tiers: initialTiers
            }}
            component={ManageForm}
            {...manageFormProps}
          />
        </BrowserRouter>
      </Provider>)).toMatchSnapshot()
  })

  it('should render for Dutch Auction', () => {
    crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.DUTCH_AUCTION)

    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      canEditTiers: true,
      displaySave: true
    }

    tierStore.reset()

    expect(mount(
      <Provider {...stores}>
        <BrowserRouter>
          <Form
            onSubmit={jest.fn()}
            mutators={{ ...arrayMutators }}
            decorators={[jest.fn()]}
            initialValues={{
              tiers: []
            }}
            component={ManageForm}
            {...manageFormProps}
          />
        </BrowserRouter>
      </Provider>)).toMatchSnapshot()
  })

  it('should call handleChange if a field is modified', () => {
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      canEditTiers: true,
      displaySave: true
    }

    const wrapper = mount(
      <Provider {...stores}>
        <BrowserRouter>
          <Form
            onSubmit={jest.fn()}
            mutators={{ ...arrayMutators }}
            decorators={[jest.fn()]}
            initialValues={{
              tiers: initialTiers
            }}
            component={ManageForm}
            {...manageFormProps}
          />
        </BrowserRouter>
      </Provider>
    )
    expect(manageFormProps.handleChange).toHaveBeenCalledTimes(1)

    const rateInput = wrapper.find("input[name='tiers[0].rate']").at(0)

    rateInput.simulate('change', { target: { value: '1234' } })

    expect(manageFormProps.handleChange).toHaveBeenCalledTimes(2)
  })

  it('should start without "Save" button', () => {
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      canEditTiers: true,
      displaySave: false
    }

    const wrapper = mount(
      <Provider {...stores}>
        <BrowserRouter>
          <Form
            onSubmit={jest.fn()}
            mutators={{ ...arrayMutators }}
            decorators={[jest.fn()]}
            initialValues={{
              tiers: initialTiers
            }}
            component={ManageForm}
            {...manageFormProps}
          />
        </BrowserRouter>
      </Provider>
    )

    const disabledSaveButton = wrapper.find("button").at(0)

    expect(disabledSaveButton.exists()).toBeFalsy()
  })

  it('should show "Save" button', () => {
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      canEditTiers: true,
      displaySave: true
    }

    const wrapper = mount(
      <Provider {...stores}>
        <BrowserRouter>
          <Form
            onSubmit={jest.fn()}
            mutators={{ ...arrayMutators }}
            decorators={[jest.fn()]}
            initialValues={{
              tiers: initialTiers
            }}
            component={ManageForm}
            {...manageFormProps}
          />
        </BrowserRouter>
      </Provider>
    )

    const enabledSaveButton = wrapper.find("button").at(0)

    expect(enabledSaveButton.exists()).toBeTruthy()
  })

  it('should enable "Save" button', () => {
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      canEditTiers: true,
      displaySave: true
    }

    const wrapper = mount(
      <Provider {...stores}>
        <BrowserRouter>
          <Form
            onSubmit={jest.fn()}
            mutators={{ ...arrayMutators }}
            decorators={[jest.fn()]}
            initialValues={{
              tiers: initialTiers
            }}
            component={ManageForm}
            {...manageFormProps}
          />
        </BrowserRouter>
      </Provider>
    )

    const enabledSaveButton = wrapper.find('button_disabled').at(0)

    expect(enabledSaveButton.exists()).toBeFalsy()
  })

  //todo: test doesn't work
  /*it('should call onSubmit', () => {
    MockDate.set(DATE.TIER_0.BEFORE_START_5_SEC_AFTER)

    const onSubmit = jest.fn()
    const manageFormProps = {
      handleChange: jest.fn(),
      canSave: true,
      crowdsaleStore: crowdsaleStore
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
  })*/
})
