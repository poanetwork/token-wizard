import React from 'react'
import { Error } from '../../../src/components/Common/Errors'
import { Form } from 'react-final-form'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { FORM_ERROR } from 'final-form'
import {validateTierMinCap} from "../../../src/utils/validations";

configure({ adapter: new Adapter() })

describe('Error ', () => {

  const errorStyle = {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: '24px',
    width: '50%',
    height: '10px'
  }


  it(`should render Error component`, () => {
    const getErrors = () =>{
      return FORM_ERROR
    }
    const wrapper = mount (
      <Form
        onSubmit={jest.fn()}
        component={Error}
        name='errorName'
        validate={getErrors}
        errorStyle={errorStyle}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
