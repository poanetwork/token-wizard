import React from 'react'
import { Loader } from '../../../src/components/Common/Loader'
import Adapter from 'enzyme-adapter-react-15'
import { configure, shallow } from 'enzyme'

configure({ adapter: new Adapter() })

describe('Loader ', () => {
  it(`should render Loader component with class name 'loading container'`, () => {
    const wrapper = shallow(
      <Loader
        show={true}
      />
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('[className="loading-container"]')).toBeDefined()
  })

  it(`should render Loader component with class name 'loading container'`, () => {
    const wrapper = shallow(
      <Loader
        show={false}
      />
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('[className="loading-container notdisplayed"]')).toBeDefined()
  })
})
