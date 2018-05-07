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
      execID: '0x461451505864e9dfe45bac39478a4ed689d74a737c0c3308cb0c8607ca0c14bd',
      networkID: '12648430',
    }

    expect(renderer.create(
      <StaticRouter location="testLocation" context={{}}>
        <AboutCrowdsale {...aboutCrowdsaleParams} />
      </StaticRouter>
    ).toJSON()).toMatchSnapshot()
  })
})
