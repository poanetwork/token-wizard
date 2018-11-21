import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import ContractStore from '../../../src/stores/ContractStore'
import ContributeStore from '../../../src/stores/ContributeStore'
import CrowdsaleStore from '../../../src/stores/CrowdsaleStore'
import CrowdsalePageStore from '../../../src/stores/CrowdsalePageStore'
import GasPriceStore from '../../../src/stores/GasPriceStore'
import GeneralStore from '../../../src/stores/GeneralStore'
import TierStore from '../../../src/stores/TierStore'
import TokenStore from '../../../src/stores/TokenStore'
import Web3Store from '../../../src/stores/Web3Store'
import render from 'react-test-renderer'
import { Contribute } from '../../../src/components/Contribute/index'
import { Provider } from 'mobx-react'
import { configure } from 'enzyme'

configure({ adapter: new Adapter() })

describe(`Contribute`, () => {
  let contractStore
  let contributeStore
  let crowdsalePageStore
  let crowdsaleStore
  let gasPriceStore
  let generalStore
  let tierStore
  let tokenStore
  let web3Store

  beforeEach(() => {
    contractStore = new ContractStore()
    contributeStore = new ContributeStore()
    crowdsalePageStore = new CrowdsalePageStore()
    crowdsaleStore = new CrowdsaleStore()
    gasPriceStore = new GasPriceStore()
    generalStore = new GeneralStore()
    tierStore = new TierStore()
    tokenStore = new TokenStore()
    web3Store = new Web3Store()
  })

  it(`should render Contribute component`, () => {
    // Given
    const component = render.create(
      <Provider
        contractStore={contractStore}
        contributeStore={contributeStore}
        crowdsaleStore={crowdsaleStore}
        crowdsalePageStore={crowdsalePageStore}
        gasPriceStore={gasPriceStore}
        generalStore={generalStore}
        tierStore={tierStore}
        tokenStore={tokenStore}
        web3Store={web3Store}
      >
        <Contribute />
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
