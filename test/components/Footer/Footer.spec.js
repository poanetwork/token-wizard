import React from 'react'
import { Footer } from '../../../src/components/Footer/index'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { displayHeaderAndFooterInIframe } from '../../../src/utils/utils'

const mockTrue = { displayHeaderAndFooterInIframe: true }
const mockFalse = { displayHeaderAndFooterInIframe: false }

//const displayHeaderAndFooterInIframe = require('../../../src/utils/utils').displayHeaderAndFooterInIframe
configure({ adapter: new Adapter() })

describe('Footer ', () => {

  it(`should render Footer component`, () => {
    jest.mock('../../../src/utils/utils', () => mockTrue)
    const wrapper = shallow(
      <Footer

      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it(`should return null`, () => {
    let a = jest.mock('../../../src/utils/utils', () => mockFalse)

    const wrapper = shallow(
      <Footer

      />
    )
    expect(wrapper).toMatchSnapshot()
   })
})
