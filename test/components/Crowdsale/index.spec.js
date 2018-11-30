import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { Provider } from 'mobx-react'
import { configure } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import {
  contractStore,
  crowdsaleStore,
  crowdsalePageStore,
  web3Store,
  tierStore,
  tokenStore,
  generalStore
} from '../../../src/stores'
import { Crowdsale } from '../../../src/components/Crowdsale'

configure({ adapter: new Adapter() })

describe('Crowdsale index', () => {
  const stores = { contractStore, crowdsaleStore, crowdsalePageStore, web3Store, tierStore, tokenStore, generalStore }

  it(`should render Crowdsale`, () => {
    // Given
    const component = renderer.create(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/crowdsale']}>
          <Crowdsale />
        </MemoryRouter>
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
