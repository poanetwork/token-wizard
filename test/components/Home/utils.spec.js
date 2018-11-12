import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure } from 'enzyme'
import { reloadStorage } from '../../../src/components/Home/utils'
import { generalStore, contractStore } from '../../../src/stores/index'

configure({ adapter: new Adapter() })

describe('Home utils', () => {
  const data = {
    generalStore: generalStore,
    contractStore: contractStore
  }

  it('Test reloadStorage with data', async () => {
    const result = await reloadStorage(data)
    expect(result).toBeTruthy()
  })

  it('Test reloadStorage with empty data', async () => {
    expect(reloadStorage({})).rejects.toEqual(new Error('There is no stores to set'))
  })

  it('Test reloadStorage with only generalStore', async () => {
    expect(reloadStorage({ generalStore: generalStore })).rejects.toEqual(new Error('There is no stores to set'))
  })

  it('Test reloadStorage with only contractStore', async () => {
    expect(reloadStorage({ contractStore: contractStore })).rejects.toEqual(new Error('There is no stores to set'))
  })
})
