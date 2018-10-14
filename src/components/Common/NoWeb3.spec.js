import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import NoWeb3 from './NoWeb3'

configure({ adapter: new Adapter() })

describe('NoWeb3', () => {

  it('provides information if no wallet found', () => {
    const wrapper = mount(<NoWeb3/>)
    expect(wrapper.find('.title').text()).toEqual('Wallet not found, or access to Ethereum account not granted')
  })

})
