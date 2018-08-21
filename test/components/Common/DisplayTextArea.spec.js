import React from 'react'
import { DisplayTextArea } from '../../../src/components/Common/DisplayTextArea'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'

configure({ adapter: new Adapter() })

describe('DisplayTextArea ', () => {
  const label = 'Label'
  const description = 'Description'
  const key = false
  const value = 'Value'
  it(`should render DisplayTextArea component`, () => {
    const wrapper = shallow(
      <DisplayTextArea
        label={label}
        description={description}
        value={value}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
