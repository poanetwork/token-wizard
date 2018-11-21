import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import { ContributeDataColumns } from '../../../src/components/Contribute/ContributeDataColumns'

configure({ adapter: new Adapter() })

const data = [
  {
    description: 'Token Name',
    title: 'Name'
  },
  {
    description: 'TKN',
    title: 'Ticker'
  },
  {
    description: '100 TKN',
    title: 'Total Supply'
  },
  {
    description: 10,
    title: 'Minimum Contribution'
  },
  {
    description: 100,
    title: 'Maximum Contribution'
  }
]

describe(`ContributeDataColumns`, () => {
  it(`should contain a data.length amount of '.cnt-ContributeDataColumns_Item' items`, () => {
    const wrapper = mount(<ContributeDataColumns data={data} />)
    const dataItems = wrapper.find('.cnt-ContributeDataColumns_Item')

    expect(dataItems.length).toBe(data.length)
  })

  it(`should render ContributeDataColumns component`, () => {
    // Given
    const component = render.create(<ContributeDataColumns data={data} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
