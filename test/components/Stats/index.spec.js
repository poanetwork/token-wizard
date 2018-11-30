import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { Provider } from 'mobx-react'
import { configure } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { Stats } from '../../../src/components/Stats/index'
import { web3Store, statsStore } from '../../../src/stores'

configure({ adapter: new Adapter() })

describe('Stats index', () => {
  const stores = {
    web3Store,
    statsStore
  }

  it(`should render Stats`, () => {
    // Given
    const component = renderer.create(
      <Provider {...stores}>
        <MemoryRouter initialEntries={['/stat']}>
          <Stats />
        </MemoryRouter>
      </Provider>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
