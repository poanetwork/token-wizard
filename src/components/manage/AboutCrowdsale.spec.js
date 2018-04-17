import React from 'react'
import { StaticRouter } from 'react-router'
import { AboutCrowdsale } from './AboutCrowdsale'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure } from 'enzyme'

configure({ adapter: new Adapter() })

describe('AboutCrowdsale', () => {
  it('should render the component', () => {
    const aboutCrowdsaleParams = {
      name: 'MyToken',
      ticker: 'MTK',
      address: '0x0000000000000000000000000000000000000001',
      networkId: '12648430',
    }

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <AboutCrowdsale {...aboutCrowdsaleParams} />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })
})
