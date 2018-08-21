import React from 'react'
import renderer from 'react-test-renderer'
import CrowdsalesList from '../../../src/components/Common/CrowdsalesList'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import CrowdsaleStore from '../../../src/stores/CrowdsaleStore'
const Crowdsale = require('../../../src/components/crowdsale/index.js').Crowdsale;
import Web3Store from '../../../src/stores/Web3Store'
import Web3 from 'web3'
configure({ adapter: new Adapter() })
const accounts = ['0xcCca436070962a1A884b88E8506C2C750E342BEA', '0x9726cdb82358972b7a17260e7897C8de02d584e6']

describe('CrowdsaleList ', () => {
  const crowdsaleStore = new CrowdsaleStore()
  let crowdsales = []
  crowdsales.push(new Crowdsale())
  crowdsales.push(new Crowdsale())
  crowdsales[0].execID = accounts[0]
  crowdsales[1].execID = accounts[1]
  crowdsaleStore.setCrowdsales(crowdsales)

  const web3Store = new Web3Store()
  web3Store.web3 = new Web3(new Web3.providers.HttpProvider('https://sokol.poa.network'))

  const wrapper = mount(
    <CrowdsalesList
      web3Store={web3Store}
      crowdsaleStore={crowdsaleStore}
      onClick={jest.fn()}

    />
  )
  it(`should render CrowdsaleList component`, () => {
    expect(wrapper).toMatchSnapshot()
  })
  it(`should render correct number of crowdsales`, () => {
    expect(wrapper.find('[className="text"]').at(0).text()).toBe('Address')
    expect(wrapper.find('[className="text"]').at(1).text()).toBe(crowdsales[0].execID)
    expect(wrapper.find('[className="text"]').at(2).text()).toBe(crowdsales[1].execID)
  })
  it(`button'Continue' should be disabled if nothing selected `, () => {
    expect(wrapper.find('[className="button button_disabled"]')).toBeDefined()
  })

  it(`button'Continue' should be enabled if crowdsale selected `, () => {
    wrapper.find('[className="text"]').at(1).simulate('click')
    expect(wrapper.find('[className="button button_fill"]')).toBeDefined()
    let button = wrapper.find('[className="button button_fill"]')

  })
  it(`should render if list is empty  `, () => {
    const crowdsaleStore = new CrowdsaleStore()
    const wrapper = mount(
      <CrowdsalesList
        web3Store={web3Store}
        crowdsaleStore={crowdsaleStore}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
