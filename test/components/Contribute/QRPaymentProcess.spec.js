import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import QRPaymentProcess from '../../../src/components/Contribute/QRPaymentProcess'

configure({ adapter: new Adapter() })

const crowdsaleProxyAddr = '0xcbf4eb5e9743c335631afe21e158bf1bb21b2864'
const registryExecAddr = '0xcbf4eb5e9743c335631afe21e158bf1bb21b2864'
const txData =
  '0x55f8650100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004a6f2ae3a00000000000000000000000000000000000000000000000000000000'

HTMLCanvasElement.prototype.getContext = () => {
  // return whatever getContext has to return
}

describe(`QRPaymentProcess`, () => {
  it(`should contain a canvas which draws the QR code`, () => {
    const wrapper = mount(<QRPaymentProcess crowdsaleProxyAddr={crowdsaleProxyAddr} txData={txData} />)
    const QRContainer = wrapper.find('.cnt-QRPaymentProcess_QR')
    const theCanvas = QRContainer.find('canvas')

    expect(theCanvas.exists()).toBeTruthy()
  })

  it(`should contain a copy button`, () => {
    const wrapper = mount(<QRPaymentProcess crowdsaleProxyAddr={crowdsaleProxyAddr} txData={txData} />)
    const copyButton = wrapper.find('.sw-ButtonCopyToClipboard')

    expect(copyButton.exists()).toBeTruthy()
  })

  it(`should render QRPaymentProcess component`, () => {
    // Given
    const component = render.create(<QRPaymentProcess registryExecAddr={registryExecAddr} txData={txData} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
