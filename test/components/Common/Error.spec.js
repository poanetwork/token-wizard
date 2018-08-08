import React from 'react'
import { Error } from '../../../src/components/Common/Error'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { VALIDATION_MESSAGES } from "../../../src/utils/constants";
import {getIn} from 'final-form'

configure({ adapter: new Adapter() })

describe('Error ', () => {
  it(`should render Error component`, () => {
    const wrapper = renderer.create(
      <Form
        onSubmit={jest.fn()}
        component={Error}
        name='errorName'


      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
