import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow, mount } from 'enzyme'
import { CrowdsaleID } from '../../../src/components/Crowdsale/CrowdsaleID'

configure({ adapter: new Adapter() })

describe(`CrowdsaleID`, () => {
  const crowdsaleIDData = {
    hash: '0xbb1c312312b14c5aaa0a1eefd46fc3965b2b936a',
    description: 'Text Proxy Address ID'
  }

  it(`should have a copy button`, () => {
    const wrapper = mount(<CrowdsaleID hash={crowdsaleIDData.hash} description={crowdsaleIDData.description} />)
    const children = wrapper.find('.sw-ButtonCopyToClipboard')

    expect(children.exists()).toBeTruthy()
  })

  it(`should contain a hash and a description text`, () => {
    const wrapper = shallow(<CrowdsaleID hash={crowdsaleIDData.hash} description={crowdsaleIDData.description} />)
    const hash = wrapper.find('.cs-CrowdsaleID_HashText')
    const description = wrapper.find('.cs-CrowdsaleID_Description')

    expect(hash.text()).toBe(crowdsaleIDData.hash)
    expect(description.text()).toBe(crowdsaleIDData.description)
  })

  it(`should render CrowdsaleID component`, () => {
    // Given
    const component = render.create(<CrowdsaleID />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
