import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {
  Home,
  Manage,
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  Crowdsale,
  Contribute,
  Stats,
  Crowdsales
} from './components/index'
import NoWeb3 from './components/Common/NoWeb3'
import { ProtectedRoute } from './components/Common/ProtectedRoute'
import { getAddrFromQuery, toast } from './utils/utils'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AlertContainer from 'react-alert'
import { TOAST } from './utils/constants'
import { Web3Provider } from './react-web3'
import { getQueryVariable } from './utils/utils'

@inject('deploymentStore')
@observer
class App extends Component {
  componentWillMount() {
    // temporary code to switch ui styling versions
    // obviously delete this when we get the v2.0 up and running
    const uiversion = getQueryVariable('uiversion')

    if (uiversion === '12') {
      require('./assets/stylesheets/application_styles.css')
      require('./assets/stylesheets/styles.css')
    } else if (uiversion === '1') {
      require('./assets/stylesheets/application_styles.css')
    } else if (uiversion === '2') {
      require('./assets/stylesheets/styles.css')
    } else {
      require('./assets/stylesheets/styles.css')
    }
  }

  render() {
    const { deploymentStore } = this.props
    let crowdsaleAddr = getAddrFromQuery()

    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={crowdsaleAddr ? Crowdsale : Home} />
            <Web3Provider onChangeAccount={deploymentStore.handleAccountChange} web3UnavailableScreen={NoWeb3}>
              <Switch>
                <ProtectedRoute path="/1" component={StepOne} />
                <ProtectedRoute path="/2" component={StepTwo} />
                <ProtectedRoute path="/3" component={StepThree} />
                <Route path="/4" component={StepFour} />
                <ProtectedRoute exact path="/manage/:crowdsalePointer" component={Manage} />
                <ProtectedRoute exact path="/crowdsale" component={Crowdsale} />
                <ProtectedRoute exact path="/stats" component={Stats} />
                <ProtectedRoute exact path="/crowdsales" component={Crowdsales} />
                <Route exact path="/contribute" component={Contribute} />
              </Switch>
            </Web3Provider>
          </Switch>
          <div className="MainAlertContainer">
            <AlertContainer ref={a => (toast.msg = a)} {...TOAST.DEFAULT_OPTIONS} />
          </div>
        </div>
      </Router>
    )
  }
}

export default App
