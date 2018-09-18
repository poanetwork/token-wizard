import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow, render } from 'enzyme'
import { Crowdsales } from '../../../src/components/Crowdsales'
import { CrowdsalesList } from '../../../src/components/Common/CrowdsalesList'
import { crowdsaleStore, contractStore, web3Store, generalStore } from '../../../src/stores'
import { Provider } from 'mobx-react'
import { CrowdsaleEmptyList } from '../../../src/components/Crowdsales/CrowdsaleEmptyList'

configure({ adapter: new Adapter() })

describe('Crowdsales', () => {
  const history = {
    push: jest.fn()
  }
  const stores = { crowdsaleStore, contractStore, web3Store, generalStore }

  it('should render screen with shallow without throwing an error', () => {
    // Given
    const wrapper = shallow(<Crowdsales {...stores} />)

    // When
    const crowdsaleEmptyList = wrapper.find(CrowdsaleEmptyList)

    // Then
    expect(crowdsaleEmptyList).toMatchSnapshot()
  })

  it('should render screen with mount without throwing an error', () => {
    // Given
    const wrapper = mount(
      <Provider {...stores}>
        <Crowdsales />
      </Provider>
    )

    // When
    const crowdsaleEmptyList = wrapper.find(CrowdsaleEmptyList)

    // Then
    expect(crowdsaleEmptyList).toMatchSnapshot()
  })

  it('should render screen with render without throwing an error', () => {
    // Given
    const wrapper = render(
      <Provider {...stores}>
        <Crowdsales />
      </Provider>
    )
    // When
    const crowdsaleEmptyList = wrapper.find(CrowdsaleEmptyList)

    // Then
    expect(crowdsaleEmptyList).toMatchSnapshot()
  })
})
