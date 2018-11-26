import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { ConfigurationBlock } from '../../../src/components/StepFour/ConfigurationBlock'
import { crowdsaleStore } from '../../../src/stores'
import { CROWDSALE_STRATEGIES } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('Configuration block', () => {
  it(`should render the component `, () => {
    crowdsaleStore.strategy = CROWDSALE_STRATEGIES.MINTED_CAPPED_CROWDSALE

    const stores = {
      store: { crowdsaleStore: crowdsaleStore }
    }
    const wrapper = shallow(<ConfigurationBlock {...stores} />)

    expect(wrapper).toMatchSnapshot()
  })
})
