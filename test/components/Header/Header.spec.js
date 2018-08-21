import React from 'react'
import { Header } from '../../../src/components/Header/index'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
const displayHeaderAndFooterInIframe = require('../../../src/utils/utils').displayHeaderAndFooterInIframe
const mockTrue = { displayHeaderAndFooterInIframe: true }
const mockFalse = { displayHeaderAndFooterInIframe: false }

configure({ adapter: new Adapter() })

describe('Header ', () => {

  it(`should render Footer component`, () => {
    jest.mock('../../../src/utils/utils', () => mockTrue)
    const wrapper = shallow(
      <Header

      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should return null`, () => {
    jest.mock('../../../src/utils/utils', () => mockFalse)

    const wrapper = shallow(
      <Header

      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
