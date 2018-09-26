import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { Provider } from 'mobx-react'
import { configure } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { StepTwo } from '../../../src/components/StepTwo/index'
import { tokenStore, crowdsaleStore, reservedTokenStore } from '../../../src/stores'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('StepTwo', () => {
  const stores = { tokenStore, crowdsaleStore, reservedTokenStore }

  it(`should render StepTwo for Minted Capped strategy`, () => {
    // Given
    const component = renderer.create(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should render StepTwo for Dutch Auction strategy`, () => {
    // Given
    crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.DUTCH_AUCTION)
    const component = renderer.create(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/', '1', '2']} initialIndex={2}>
          <StepTwo />
        </MemoryRouter>
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
