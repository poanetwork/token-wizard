import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow, mount } from 'enzyme'
import { Crowdsales } from '../../../src/components/Crowdsales'
import { CrowdsalesList } from '../../../src/components/Common/CrowdsalesList'
import { crowdsaleStore, contractStore, web3Store, generalStore } from '../../../src/stores'
import { Provider } from 'mobx-react'
import renderer from 'react-test-renderer'

configure({ adapter: new Adapter() })

describe('Crowdsales', () => {
  const stores = { crowdsaleStore, web3Store, generalStore, contractStore }

  it('should render screen ', () => {
    // Given
    const tree = renderer.create(
      <Provider {...stores}>
        <Crowdsales />
      </Provider>
    )

    // When
    const treeJson = tree.toJSON()

    // Then
    expect(treeJson).toMatchSnapshot()
  })

  it('should render screen with shallow without throwing an error', () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <Crowdsales />
      </Provider>
    )

    // When
    const componentCrowdsales = wrapper.find('div').at(0)

    // Then
    expect(componentCrowdsales.exists()).toBeTruthy()
  })

  it('should render screen with shallow and check functions', () => {
    // Given
    const wrapper = shallow(<Crowdsales {...stores} />)

    setTimeout(() => {
      wrapper.update()
      const instance = wrapper.instance()
      const spy = jest.spyOn(instance, 'load')

      expect(spy).toHaveBeenCalledTimes(1)
    }, 2000)
  })

  it('should render screen with shallow and check load functions', () => {
    // Given
    const restore = Crowdsales.prototype.load
    const mock = (Crowdsales.prototype.load = jest.fn())

    mount(
      <Provider {...stores}>
        <Crowdsales />
      </Provider>
    )

    setTimeout(() => {
      expect(mock).toHaveBeenCalled()
      expect(mock).toHaveBeenCalledTimes(1)
    }, 10)

    Crowdsales.prototype.load = restore
  })
})
