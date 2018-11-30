import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { Provider } from 'mobx-react'
import { configure } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { Manage } from '../../../src/components/Manage/index'
import {
  crowdsaleStore,
  web3Store,
  tierStore,
  contractStore,
  reservedTokenStore,
  stepTwoValidationStore,
  generalStore,
  tokenStore,
  gasPriceStore,
  deploymentStore
} from '../../../src/stores'

configure({ adapter: new Adapter() })

describe('Manage index', () => {
  const stores = {
    crowdsaleStore,
    web3Store,
    tierStore,
    contractStore,
    reservedTokenStore,
    stepTwoValidationStore,
    generalStore,
    tokenStore,
    gasPriceStore,
    deploymentStore
  }

  it(`should render Manage`, () => {
    // Given
    const data = {
      params: { crowdsalePointer: 'test' }
    }

    const component = renderer.create(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/manage']}>
          <Manage match={data} />
        </MemoryRouter>
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
