import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'
import { TokenSetupBlock } from '../../../src/components/StepFour/TokenSetupBlock'

configure({ adapter: new Adapter() })

describe('TokenSetupBlock', () => {
  it(`should render the component `, () => {
    const data = {
      tokenStore: {
        name: 'This is a valid name',
        ticker: 'TTK',
        decimals: '14',
        supply: '0'
      }
    }
    const wrapper = shallow(<TokenSetupBlock {...data} />)

    expect(wrapper).toMatchSnapshot()
  })
})
