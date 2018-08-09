import React from 'react'
import { DisplayTextArea } from '../../../src/components/Common/DisplayTextArea'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { FORM_ERROR } from 'final-form'

configure({ adapter: new Adapter() })

describe('Error ', () => {
  const label = 'Label'
  const description = 'Description'
  const key = 'Key'
  const value='Value'
  it(`should render Error component`, () => {

    const wrapper = mount(
      <DisplayTextArea
        key={key}
        label={label}
        description={description}
        value={value}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
