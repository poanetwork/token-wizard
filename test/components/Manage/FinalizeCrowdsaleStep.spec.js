import React from 'react'
import { StaticRouter } from 'react-router'
import { FinalizeCrowdsaleStep } from '../../../src/components/Manage/FinalizeCrowdsaleStep'
import renderer from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'

configure({ adapter: new Adapter() })

describe('FinalizeCrowdsaleStep', () => {
  it('should render the component with active button', () => {
    const finalizeCrowdsaleStateParams = {
      disabled: false,
      handleClick: jest.fn()
    }

    expect(
      renderer
        .create(
          <StaticRouter location="testLocation" context={{}}>
            <FinalizeCrowdsaleStep {...finalizeCrowdsaleStateParams} />
          </StaticRouter>
        )
        .toJSON()
    ).toMatchSnapshot()
  })

  it('should render the component with disabled button', () => {
    const finalizeCrowdsaleStateParams = {
      disabled: true,
      handleClick: jest.fn()
    }

    expect(
      renderer
        .create(
          <StaticRouter location="testLocation" context={{}}>
            <FinalizeCrowdsaleStep {...finalizeCrowdsaleStateParams} />
          </StaticRouter>
        )
        .toJSON()
    ).toMatchSnapshot()
  })
})
