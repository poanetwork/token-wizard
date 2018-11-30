import React from 'react'
import CrowdsalesList from '../../../src/components/Crowdsales/CrowdsalesList'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import CrowdsaleStore from '../../../src/stores/CrowdsaleStore'
import Web3Store from '../../../src/stores/Web3Store'
import Web3 from 'web3'
import { generalStore } from '../../../src/stores'
import { GAS_PRICE } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

const Crowdsale = require('../../../src/components/Crowdsale/index.js').Crowdsale
const accounts = ['0xcCca436070962a1A884b88E8506C2C750E342BEA', '0x9726cdb82358972b7a17260e7897C8de02d584e6']

describe('CrowdsaleList ', () => {
  const crowdsaleStore = new CrowdsaleStore()
  const web3Store = new Web3Store()

  let wrapper
  let crowdsales = []
  crowdsales.push(new Crowdsale())
  crowdsales.push(new Crowdsale())
  crowdsales[0].execID = accounts[0]
  crowdsales[1].execID = accounts[1]
  crowdsaleStore.setCrowdsales(crowdsales)

  beforeEach(() => {
    web3Store.web3 = new Web3(new Web3.providers.HttpProvider('https://sokol.poa.network'))

    wrapper = mount(
      <CrowdsalesList web3Store={web3Store} crowdsales={crowdsaleStore.crowdsales} crowdsaleStore={crowdsaleStore} />
    )
  })

  it(`should render CrowdsaleList component`, () => {
    expect(wrapper).toMatchSnapshot()
  })

  it(`should render correct number of crowdsales`, () => {
    const wrapper = shallow(
      <CrowdsalesList web3Store={web3Store} crowdsales={crowdsaleStore.crowdsales} crowdsaleStore={crowdsaleStore} />
    )

    expect(
      wrapper
        .find('[className="sw-FlexTable_Td"]')
        .at(0)
        .text()
    ).toBe('')
    expect(
      wrapper
        .find('[className="sw-FlexTable_Td"]')
        .at(1)
        .text()
    ).toBe('')
    expect(
      wrapper
        .find('[className="sw-FlexTable_Td"]')
        .at(2)
        .text()
    ).toBe('')
  })
  it(`button'Continue' should be disabled if nothing selected `, () => {
    expect(wrapper.find('[className="button button_disabled"]')).toBeDefined()
  })

  it(`should render if list is empty  `, () => {
    const crowdsaleStore = new CrowdsaleStore()
    const wrapper = mount(
      <CrowdsalesList web3Store={web3Store} crowdsales={crowdsaleStore.crowdsales} crowdsaleStore={crowdsaleStore} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
