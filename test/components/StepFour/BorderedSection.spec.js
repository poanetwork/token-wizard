import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { BorderedSection } from '../../../src/components/StepFour/BorderedSection'
import renderer from 'react-test-renderer'
import { NAVIGATION_STEPS } from '../../../src/utils/constants'

configure({ adapter: new Adapter() })

describe('BorderedSection', () => {
  it(`should render the component `, () => {
    const { CROWDSALE_STRATEGY } = NAVIGATION_STEPS

    const wrapper = shallow(<BorderedSection dataStep="1" title={CROWDSALE_STRATEGY} text="Minted Capped" />)

    expect(wrapper).toMatchSnapshot()
  })
})
