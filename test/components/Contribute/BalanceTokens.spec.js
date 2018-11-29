import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure } from 'enzyme'
import { BalanceTokens } from '../../../src/components/Contribute/BalanceTokens'

configure({ adapter: new Adapter() })

describe(`BalanceTokens`, () => {
  const balance = 29.200000000002818
  const ticker = 'TCK'

  it(`should render BalanceTokens component`, () => {
    // Given
    const component = render.create(<BalanceTokens balance={balance} ticker={ticker} />)

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })
})
