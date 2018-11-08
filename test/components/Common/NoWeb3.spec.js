import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import NoWeb3 from '../../../src/components/Common/NoWeb3'

configure({ adapter: new Adapter() })

describe('NoWeb3', () => {
  it('has a title, description and button container', () => {
    const wrapper = mount(<NoWeb3 />)

    expect(wrapper.find('.sw-NoWeb3_Title').exists()).toBeTruthy()
    expect(wrapper.find('.sw-NoWeb3_Description').exists()).toBeTruthy()
    expect(wrapper.find('.sw-NoWeb3_ButtonsContainer').exists()).toBeTruthy()
  })

  it('should go to URL', () => {
    const wrapper = shallow(<NoWeb3 />)

    global.open = jest.fn()
    wrapper.instance().goToURL('https://google.com')

    expect(global.open).toHaveBeenCalled()
  })

  it('should click the MetaMask button', () => {
    const wrapper = mount(<NoWeb3 />)
    const button = wrapper.find('.btn-ButtonMetamask')

    wrapper.instance().goToURL = jest.fn()
    button.simulate('click')

    expect(wrapper.instance().goToURL).toHaveBeenCalledTimes(1)
  })

  it('should click the NiftyWallet button', () => {
    const wrapper = mount(<NoWeb3 />)
    const button = wrapper.find('.btn-ButtonNiftyWallet')

    wrapper.instance().goToURL = jest.fn()
    button.simulate('click')

    expect(wrapper.instance().goToURL).toHaveBeenCalledTimes(1)
  })

  it(`should render ButtonNiftyWallet component`, () => {
    // Given
    const component = render.create(<NoWeb3 />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
