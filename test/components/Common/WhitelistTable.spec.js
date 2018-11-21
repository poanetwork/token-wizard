import Adapter from 'enzyme-adapter-react-15'
import React from 'react'
import TierStore from '../../../src/stores/TierStore'
import render from 'react-test-renderer'
import { Provider } from 'mobx-react'
import { WhitelistTable } from '../../../src/components/Common/WhitelistTable'
import { configure, mount, shallow } from 'enzyme'

configure({ adapter: new Adapter() })

describe(`WhitelistTable`, () => {
  let tierStore
  let crowdsaleNum
  let whitelist

  beforeEach(() => {
    tierStore = new TierStore()
    crowdsaleNum = 1
    whitelist = [
      {
        addr: '0x2bD96eA633e8BcB468732c68B2CD632BfF4D79Db',
        max: '5',
        min: '1'
      },
      {
        addr: '0x665772109Eb2dc9F5B7c28F987Ec58949d4Eeb87',
        max: '5',
        min: '1',
        stored: true
      },
      {
        addr: '0x66f537cCD03f21c58172602B919884A442A3c313',
        max: '5',
        min: '1',
        stored: true
      },
      {
        addr: '0x693d436da2c3C11341149522E5F6d0390B363197',
        max: '5',
        min: '1',
        stored: true
      }
    ]
  })

  it(`should delete a row`, () => {
    // Given
    const wrapper = mount(
      <Provider tierStore={tierStore}>
        <WhitelistTable list={whitelist} crowdsaleNum={crowdsaleNum} />
      </Provider>
    )
    const deleteButton = wrapper.find('ButtonDelete')
    const table = wrapper.find('WhitelistTable')

    table.instance().removeItem = jest.fn()

    // When
    deleteButton.simulate('click')

    // Then
    expect(table.instance().removeItem).toHaveBeenCalled()
  })

  it(`should render WhitelistTable component`, () => {
    // Given
    const component = render.create(
      <Provider tierStore={tierStore}>
        <WhitelistTable list={whitelist} crowdsaleNum={crowdsaleNum} />
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
