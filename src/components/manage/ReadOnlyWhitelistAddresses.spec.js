import React from 'react'
import { ReadOnlyWhitelistAddresses } from './ReadOnlyWhitelistAddresses'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

const noAddressMessage = 'no addresses loaded'

const whitelistsAddresses = [
  { addr: "0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e", min: 1234, max: 50505, stored: true },
  { addr: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b", min: 1234, max: 50505, stored: true },
  { addr: "0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9", min: 1234, max: 50505, stored: true },
  { addr: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", min: 1234, max: 50505, stored: true },
  { addr: "0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC", min: 1234, max: 50505, stored: true },
  { addr: "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E", min: 1234, max: 50505, stored: true },
  { addr: "0xd03ea8624C8C5987235048901fB614fDcA89b117", min: 1234, max: 50505, stored: true },
  { addr: "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d", min: 1234, max: 50505, stored: true },
  { addr: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", min: 1234, max: 50505, stored: true }
]

configure({ adapter: new Adapter() })

describe('ManageForm', () => {
  it('should render the whitelist addresses', () => {
    expect(renderer.create(
      <ReadOnlyWhitelistAddresses tier={{ whitelist: whitelistsAddresses }}/>
    ).toJSON()).toMatchSnapshot()
  })

  it(`should render "${noAddressMessage}" message if no whitelist available`, () => {
    const wrapper = mount(<ReadOnlyWhitelistAddresses tier={{ whitelist: [] }}/>)

    const message = wrapper.find('span')

    expect(message.text()).toBe(noAddressMessage)
  })
})
