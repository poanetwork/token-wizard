import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { ContributeDataList } from '../../../src/components/Contribute/ContributeDataList'

configure({ adapter: new Adapter() })

const currentAccount = '0x1237612212322c1237Cc7c8bBC123cE4D0Cb4123'
const crowdsaleAddress = '0x1234eb123743c123631a1231e158123bb21b2864'

describe(`ContributeDataList`, () => {
  it(`should contain the current account address, crowdsale address and a copy button`, () => {
    const wrapper = mount(<ContributeDataList currentAccount={currentAccount} crowdsaleAddress={crowdsaleAddress} />)
    const dataItems = wrapper.find('.cnt-ContributeDataList_Item')
    const copyButton = wrapper.find('.sw-ButtonCopyToClipboard')

    expect(dataItems.length).toBe(2)
    expect(copyButton.length).toBe(1)
  })

  it(`should contain only one children`, () => {
    const wrapper = mount(<ContributeDataList currentAccount={currentAccount} />)
    const dataItems = wrapper.find('.cnt-ContributeDataList_Item')

    expect(dataItems.length).toBe(1)
  })

  it(`should render ContributeDataList component`, () => {
    // Given
    const component = render.create(
      <ContributeDataList currentAccount={currentAccount} crowdsaleAddress={crowdsaleAddress} />
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
