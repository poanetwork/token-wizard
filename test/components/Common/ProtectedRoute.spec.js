import React from 'react'
import render from 'react-test-renderer'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount, shallow } from 'enzyme'
import { ProtectedRoute } from '../../../src/components/Common/ProtectedRoute'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { deploymentStore } from '../../../src/stores'
import { Home } from '../../../src/components/Home'
import { Provider } from 'mobx-react'

configure({ adapter: new Adapter() })

describe(`ProtectedRoute`, () => {
  it(`should render ProtectedRoute component`, () => {
    const stores = { deploymentStore }

    const wrapper = mount(
      <Provider {...stores}>
        <Router>
          <ProtectedRoute {...stores} component={Home} />
        </Router>
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })
})
